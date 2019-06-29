var AppHubConnect = {
    Hub: null,
    ready: [],
    Load: function () {
        var _this = AppHubConnect;
        _this.Hub = new HubObj.Create('ConnectionApp', {
            transport: 'longPolling',
            listeners: {
                'Listener_GetAllConnect': function (AllConnect) {
                    //console.log(AllConnect)
                },
                'Listener_MessageMail': function (data) {
                    if (data.Success || data.success) {
                        data = data.Data || data.data;
                        app.notification.mail.load();
                        if (ctrlMailApp != null && ctrlMailApp.Action.Current != null) {
                            ctrlMailApp.Action[ctrlMailApp.Action.Current].Load();
                            if (ctrlMailApp.Mail.Current == data.MessageRoomId) {
                                ctrlMailApp.Mail.Select(data.MessageRoomId);
                            }
                        }
                    }
                },
                'Listener_Chat': function (data) {
                    try {
                        data = data.Data || data.data;


                        var Message = data.Message.Message = JSON.parse(data.Message.Message);
                        if (Message.Type == 1) {
                            var box = ChatBox.GetByChatId(data.Room.Id);

                            if (box == null) {
                                box = new ChatBox.Create({
                                    Id: data.Room.Id,
                                    Title: data.Room.Title
                                });
                            }

                            box.addMessage(data.User[0], data.Message);
                        }
                        else if (Message.Type == 2) {
                            if (data.User[0].Id != app.User.UserId) {
                                var scriptTxt = Message.Data.format(data.Room.Id, data.User[0].Id);
                                eval();
                                var script = document.createElement('script');
                                script.text = scriptTxt;
                                document.getElementsByTagName('body')[0].appendChild(script);
                            }
                        }

                    } catch (e) {

                    }
                },
                'Listener_SystemMessage': function (obj) {
                }
            },
            methods: [
                'GetAllConnect',
                'Chat_GetHistory',
                'Chat_GetRoomUserByUser',
                'Chat_GetRoomInfoById',
                'Chat_SendMessage',
            ],
            errorHandler: function (error) {
                console.info(error);
            },
            stateChanged: function (state) {
                switch (state.newState) {
                    case $.signalR.connectionState.connecting:
                        //your code here
                        break;
                    case $.signalR.connectionState.connected:
                        for (var i = 0; i < _this.ready.length; i++) {
                            _this.ready[i]();
                        }
                        break;
                    case $.signalR.connectionState.reconnecting:
                        //your code here
                        break;
                    case $.signalR.connectionState.disconnected:
                        //your code here
                        break;
                }
            }
        });

        _this.Hub.promise.then(function () {
        });
    }
}

var app = {
    User: {

    },
    config: {
        Date: {
            Moment: "DD/MM/YYYY"
        },
        DateTime: {
            Moment: 'DD/MM/YYYY hh:mm:ss a'
        },
        Currency: {
            Suffix: " VNĐ",
            DecimalPlaces: 0,
            DecimalSeparator: ",",
            ThousandsSeparator: "."
        },
        NumberTDFormatter: function (value, row, index) {
            return '<span InputNumber>{0}</span>'.format(value);
        },
        AjaxOriginalContent: {
            beforeSend: function (request) {
                request.setRequestHeader("OriginalContent", true);
            },
        }
    },
    notification: {
        mail: {
            elm: $('#MailNotification'),
            load: function () {
                var _this = app.notification.mail;
                var countElm = $('.MailUnreadCount');

                _AjaxAPI.get('/MailApp/GetSummary',
                    {},
                    function (data) {
                        if (data.Success || data.success) {
                            data = data.data || data.Data;
                            countElm.text(data.totalUnread > 0 ? data.totalUnread : '');
                        } else {
                        }
                    }, false);
            }
        }
    },
    localStorage: {
        name: "",
        Data: null,
        init: function () {
            var _this = this;
            _this.name = window.location.host + app.User.UserId;
            _this.Data = $.extend(true,
                {
                    ChatBox: {
                        Current: []
                    },
                },
                JSON.parse(window.localStorage.getItem(_this.name) || "{}"));

            _this.Save();
        },
        Save: function () {
            var _this = this;
            window.localStorage.setItem(_this.name, JSON.stringify(_this.Data));
        }
    },
    documentReady: [],
    initFrontEnd: function () {
        var url = window.location.href;
        var pathName = window.location.pathname;
        var currentMenu = $('.header_menu li a[href="{0}"]'.format(pathName));
        var getMenu = function (index) {
            var _pathName = listPathName[index];
            currentMenu = $('.header_menu li a[href="{0}"]'.format(_pathName));

            if (currentMenu.length > 0) {
                currentMenu.parents('li').addClass("current");
            }
            else if (index < listPathName.length - 1) {
                getMenu(index + 1);
            }
        }

        var listPathName = [
            pathName,
            pathName + '/',
            pathName + '/Index',
            pathName + '/index',
            pathName.replace('Index', ''),
            pathName.replace('/Index', ''),
            pathName.replace('index', ''),
            pathName.replace('/index', ''),
            pathName.replace(/\/$/, ''),
        ];
        getMenu(0);

        this.component.initFrontend();
        for (var i = 0; i < this.documentReady.length; i++) {
            var temp = this.documentReady[i];
            if ($.isFunction(temp)) {
                temp();
            }
        }
    },
    init: function () {
        var _this = this;

        $(document)
            .ajaxStart(function () {
                //page_loading.show();
            })
            .ajaxSend(function (event, jqXHR, ajaxOptions) {
                var _ajaxOptions = $.extend(true,
                    {
                        ajaxShowBlock: true,
                    },
                    ajaxOptions);

                if (_ajaxOptions.ajaxShowBlock) {
                    page_loading.show();
                }
            })
            .ajaxStop(function () {
            })
            .ajaxError(function (event, jqxhr, settings, thrownError) {

                var _ajaxOptions = $.extend(true,
                    {
                        ajaxShowBlock: true,
                    },
                    settings);

                if (_ajaxOptions.ajaxShowBlock) {
                    page_loading.hide();
                }

                if (jqxhr.status == 403) {
                    modal.LoadAjax({
                        title: "Thông báo",
                        titleConfig: {
                            class: 'warning'
                        },
                        html: '<div class="text-center">\
                                <h1 class ="error-code text-xs-center mb-2" style="margin-top: 0px;">403</h1>\
                                <h3 class ="text-uppercase text-xs-center">Yêu cầu trái phép</h3>\
                                <h7 class ="text-xs-center">Bạn không có quyền truy cập tài nguyên được yêu cầu do hạn chế về bảo mật.<br>Để được truy cập, vui lòng liên hệ với quản trị viên hệ thống của bạn.</h7>\
                            </div>'
                    });
                }
            })
            .ajaxComplete(function (event, jqxhr, settings, thrownError) {
                var _ajaxOptions = $.extend(true,
                    {
                        ajaxShowBlock: true,
                    },
                    settings);

                if (_ajaxOptions.ajaxShowBlock) {
                    page_loading.hide();
                }
            });

        moment.lang("vi-VN");

        $.fn.editableform.template = '<form class="form-inline editableform form_validate"><div class="control-group"><div><div class="editable-input"></div><div class="editable-buttons"></div></div><div class="editable-error-block"></div></div></form>';

        this.component.init();
        for (var i = 0; i < this.documentReady.length; i++) {
            var temp = this.documentReady[i];
            if ($.isFunction(temp)) {
                temp();
            }
        }
    },
    component: {
        isInit: false,
        initFrontend: function () {
            this.ValidateForm.init();
            this.customCheckbox();
            this.ValidateForm.defaultRegistry();
        },
        init: function () {

            $.fn.datepicker.dates['vi'] = {
                days: ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'],
                daysShort: ['C.Nhật', 'T.Hai', 'T.Ba', 'T.Tư', 'T.Năm', 'T.Sáu', 'T.Bảy'],
                daysMin: ['CN', 'T.Hai', 'T.Ba', 'T.Tư', 'T.Năm', 'T.Sáu', 'T.Bảy'],
                months: [
                    'Tháng Một', 'Tháng Hai', 'Tháng Ba', 'Tháng Tư', 'Tháng Năm', 'Tháng Sáu', 'Tháng Bảy',
                    'Tháng Tám', 'Tháng Chín', 'Tháng Mười', 'Tháng Mười Một', 'Tháng Mười Hai'
                ],
                monthsShort: ['Một', 'Hai', 'Ba', 'Tư', 'Năm', 'Sáu', 'Bảy', 'Tám', 'Chín', 'Mười', 'M.Một', 'M.Hai'],
                today: "Hôm nay",
                clear: "Xóa",
                format: "dd/mm/yyyy",
                titleFormat: "MM yyyy", /* Leverages same syntax as 'format' */
                weekStart: 0
            };

            $.fn.select2.defaults.set('language', 'vi');

            this.FixOwlCarouselStopTab();
            this.DatePickerBTFixPosition();
            this.ValidateForm.init();
            this.BootstrapTable.init();
            this.load();
        },
        load: function () {

            //this.convertBootstrapToMaterialize(true);
            this.AutoCropIMG();
            this.extendAnimationCss();
            this.InputSuffix();
            this.InputSelectedBlur();
            this.selectSearch();
            this.select2Default();
            this.InputMask();
            this.InputCurrency();
            this.ValidateForm.defaultRegistry();
            this.DatePicker();
            this.UploadCopperImg();
            this.ImageView.Single();
            this.LoadImageAjax();
            this.ImgError();
            this.modalEvent();
            this.FE.Carousel();
            this.FE.owlCarousel();
            this.FE.fancybox.run();
            this.FE.commentBox();
        },
        customCheckbox: function () {
            //return
            $('input[type="checkbox"], input[type="radio"]').each(function (index, e) {
                e = $(e);

                var attr = e.attr('not-custom');
                if (typeof attr !== typeof undefined && attr !== false) {
                    return;
                }
                if ((!e.data('checkbox-radio-custom') && !e.hasClass('hidden') && !e.hasClass('hiden') && (function () {
                    var attr = (e.attr('style') || '').split(';').map(function (e1) { return e1.trim() });
                        for (var i = 0; i < attr.length; i++) {
                            var temp = attr[i].split(':');
                            if (temp.length <= 0) {
                                continue;
                }
                        if (temp[0].trim().toLowerCase() == "display".toLowerCase() && temp[1].trim().toLowerCase() == "none".toLowerCase()) {
                            return false;
                }
                }
                    e.data('checkbox-radio-custom', true);
                    return true;
                })())) {
                    e.data('checkbox-radio-custom', true);
                    if (e.data('uniformed')) {
                        $.uniform.restore(e)
                    }
                    var parent = e.parent();
                    var span = $('<span class="checkbox-radio-custom"><span class="view"></span></span>');
                    span.toggleClass('radio-custom', (e.attr('type') || '') == 'radio');
                    span.insertAfter(e);
                    span.prepend(e);
                    var label = e.closest('label');
                    if (label.length == 0) {
                        span.find('.view').click(function (event) {
                            event.stopPropagation();
                            event.preventDefault();
                            event.stopImmediatePropagation();
                            //e.prop("checked", !e.prop("checked"));
                            if (e.is(':disabled')) {
                                return;
                            }
                            e.click();
                        });
                    }
                }
            });
        },
        BootstrapTable: {
            init: function () {
                var BootstrapTable = $.fn.bootstrapTable.Constructor
                var _initPagination = BootstrapTable.prototype.initPagination;
                BootstrapTable.prototype.initPagination = function () {
                    var that = this;
                    if ((that.options.totalRows == 0 || (that.options.data || []).length == 0) && that.options.pageNumber > 1) {
                        that.options.pageNumber = 1;
                        that.refresh();
                    }
                    else {
                        _initPagination.apply(that);
                    }
                }

                var _resetView = BootstrapTable.prototype.resetView;
                BootstrapTable.prototype.resetView = function () {
                    var that = this;

                    _resetView.apply(that, arguments);
                    app.component.load();
                }
            }
        },
        extendAnimationCss: function () {
            $.fn.extend({
                animateCss: function (animationName, callback) {
                    var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
                    this.addClass('animated ' + animationName)
                        .one(animationEnd,
                            function () {
                                $(this).removeClass('animated ' + animationName);
                                if (callback) {
                                    callback();
                                }
                            });
                    return this;
                }
            });
        },
        LoadImageAjax: function () {
            $('[data-provider="image-choose-folder"]')
                .each(function (index, elm) {
                    elm = $(elm);
                    elm.css('cursor', 'pointer');
                    elm.off('click').on('click', function (event) {
                        event.stopPropagation();
                        event.preventDefault();

                        var options = $.extend(true, {
                            params: {},
                            folder: '',
                            url: '',
                            targetView: "",
                            hiddenFiled: "",
                            type: 'single',
                            maximum: 5,
                            onClose: function () { },
                            showWithThumb: false,
                            dismissDelete: true,
                        }, elm.data());

                        try {
                            options.params = eval(options.params);
                        } catch (e) {
                            options.params = {};
                        }
                        if (options.onClose.constructor == String) {
                            options.onClose = eval(options.onClose);
                        }
                        var params = $.extend(true, {
                            folder: options.folder,
                        }, options.params);

                        var modalPopup = modal.LoadAjax({
                            classname: "modal-lg",
                            title: "Chọn ảnh",
                            buttonClose: options.buttonClose || {
                                Text: "Hủy",
                                isShow: true,
                                isIconX: false
                            },
                            buttonOk: options.buttonOk || {
                                Text: "Đồng ý",
                                isShow: true,
                            },
                            html: '\
                                    <div class ="row">\
                                        <div class ="col-md-12">\
                                            <div class ="loading text-center">\
                                                <p style="display: inline-block;">\
                                                    <i class ="fa fa-spinner fa-pulse"></i>\
                                                </p>\
                                            </div>\
                                            <div class ="content modal-manage-images">\
                                                <ul class ="thumbnails image_picker_selector"></ul>\
                                            </div>\
                                        </div>\
                                    </div>\
                                ',
                            dismiss: function () {
                                if (options.dismissDelete) {
                                    modal.DeleteComfirm({
                                        message: "Bạn có muốn xóa ảnh.?",
                                        backdrop: true,
                                        buttonClose: {
                                            Text: "Đóng",
                                            isShow: true,
                                            isIconX: true
                                        },
                                        callback: function () {
                                            var return_obj = {
                                            };
                                            if (options.type == "single") {
                                                var img = new Image();
                                                img.src = app.config.ImgThumbnailDefault;
                                                return_obj.ImgTarget = $(img);
                                                options.onClose(return_obj);

                                                $(options.targetView).attr('src', return_obj.ImgTarget.attr('src'));
                                                $(options.hiddenFiled).val(return_obj.ImgTarget.attr('src'));
                                            }
                                            else {
                                                return_obj.ImgTarget = [];
                                                options.onClose(return_obj);
                                            }
                                        }
                                    });
                                }
                            },
                            callback: function () {
                                var return_obj = {
                                };
                                if (options.type == "single") {
                                    return_obj.ImgTarget = [];
                                    modalPopup.modal.find(".img_group.checked img").map(function (index, element) {
                                        return_obj.ImgTarget = $(element);
                                    });
                                    options.onClose(return_obj);

                                    var src = return_obj.ImgTarget.data('src');
                                    $(options.targetView).attr('src', src);
                                    $(options.hiddenFiled).val(src);
                                }
                                else {
                                    return_obj.ImgTarget = [];
                                    modalPopup.modal.find(".img_group.checked img").map(function (index, element) {
                                        element = $(element);
                                        element = element.clone();
                                        element.attr('src', element.data('src'))
                                        return_obj.ImgTarget.push(element);
                                    });
                                    options.onClose(return_obj);
                                }
                            },
                            onload: function (popup) {
                                var loadImage = function (links) {
                                    tool_ren_image_unstyle({
                                        col: 4,
                                        element: popup.modal.find(".modal-body .content"),
                                        links: links,
                                        isRender: true,
                                        showWithThumb: options.showWithThumb,
                                        //item_get: function (e) {
                                        //    return e.Url;
                                        //},
                                        done: function (data) {
                                            popup.modal.find('.modal-body .loading').hide();
                                            popup.modal.find('.img_group').bind('click', function (event) {
                                                var target = $(event.currentTarget);
                                                var icon = target.find(".choose_img");

                                                if (options.type == "single") {
                                                    popup.modal.find(".img_group.checked").removeClass("checked");
                                                    target.removeClass("uncheck").addClass("checked");
                                                }
                                                else {
                                                    if (popup.modal.find(".img_group.checked img").length >= options.maximum) {
                                                        return;
                                                    }
                                                    if (target.hasClass("uncheck")) {
                                                        target.removeClass("uncheck").addClass("checked");
                                                    }
                                                    else {
                                                        target.removeClass("checked").addClass("uncheck");
                                                    }
                                                }
                                            });
                                        }
                                    });
                                }


                                _AjaxAPI.post(options.url, params, function (data) {
                                    loadImage(data.map(function (e) {
                                        return {
                                            link: e.url,
                                            thumb: e.thumb,
                                        }
                                    }));
                                });
                            }
                        });

                    });
                });
        },
        AutoCropIMG: function () {
            var elements = $('img[AutoCrop]');
            for (var i = 0; i < elements.length; i++) {
                var elem = $(elements[i]);
                var src = elem.attr('src') || '';
                if (src.startsWith('data:') || src.startsWith('DATA:') || src == '') {
                    continue;
                }
                var options = $.extend(true, {
                    width: 100,
                    height: 100,
                    resizeMethod: 'crop'
                }, elem.data());

                try {
                    CreateThumbnailIMG.createThumbnailFromUrl({
                        dataURL: getThumbTemplate.thumbnailExtension(fileExtension(src), src)
                    }, options.width, options.height, options.resizeMethod, true, (function (elm) {
                        return function (dataUrl) {
                            elm.attr('src', dataUrl);
                        };
                    })(elem), '*', function () {
                        elem.attr('src', app.config.ImgThumbnailDefault);
                    });
                } catch (ex) {
                    elem.attr('src', app.config.ImgThumbnailDefault);
                }
            }
        },
        InputSuffix: function () {
            $('[inputSuffix]').off('blur').on('blur', function () {
                var elm = $(this);
                var inputSuffix = elm.attr('inputSuffix') || '';
                var value = elm.val() || '';
                if (inputSuffix != '' && value != '' && !value.endsWith(inputSuffix)) {
                    elm.val(value + inputSuffix);
                }
            });
        },
        InputSelectedBlur: function () {
            $(document)
                .on('blur',
                    '.input_blur',
                    function (event) {
                        this.value = this.value.trim();
                    });
            $(document)
                .on('click',
                    '.input_select',
                    function (event) {
                        this.select();
                    });
        },
        InputMask: function () {
            var elements = $('[InputMaskRouter]');
            for (var i = 0; i < elements.length; i++) {
                var elem = $(elements[i]);
                if (!elem.data('InputMaskRouter')) {
                    elem.InputMaskRouter($.extend(true,
                        {

                        },
                        elem.data()));
                }
            }
            var elements = $('[Inputmask]');
            for (var i = 0; i < elements.length; i++) {
                var elem = $(elements[i]);
                if (!elem.data('Inputmask')) {
                    elem.Inputmask($.extend(true,
                        {

                        },
                        elem.data()));
                }
            }
        },
        InputCurrency: function () {
            // number only
            var elements = $('[InputNumber]');
            for (var i = 0; i < elements.length; i++) {
                var elem = $(elements[i]);
                if (!elem.data('InputNumber')) {
                    elem.InputNumber($.extend(true,
                        {
                            decimal: 2,
                            decPoint: ',',
                            thousandsSep: '.',
                            isMask: false
                        },
                        elem.data()));
                }
            }
            //money format
            $('[currencyMask]').each(function (index, elm) {
                elm = $(elm);
                options = elm.data();
                options.currencyMaskMap = options.currencyMaskMap || "";
                if (!elm.data("numFormat")) {
                    var DecimalPlaces = 0;
                    var DecimalSeparator = ".";
                    var ThousandsSeparator = ",";
                    if ((elm.data("percent") || false) == true) {
                        DecimalPlaces = 0;
                        DecimalSeparator = ".";
                        ThousandsSeparator = "";
                    }
                    elm.number(true, DecimalPlaces, DecimalSeparator, ThousandsSeparator);
                    //elm.number(true, 0, ",", ".");
                    if (options.currencyMaskMap != "" &&
                        options.currencyMaskMap != null &&
                        options.currencyMaskMap == true) {
                        var name = elm.prop("name");
                        elm.attr("name", name + "Mask");
                        $('<input type="hidden" name="{0}" value="{1}"/>'.format(name, elm.val())).insertAfter(elm);
                        var _event = function () {
                            var elm = $(this);
                            var a = elm.val();
                            $('[name="' + name + '"]').val(a);
                        }
                        var _event1 = function () {
                            var elm = $(this);
                            var a = elm.val();
                            $('[name="' + name + "Mask" + '"]').val(a);
                        }
                        elm.on("keyup", _event).on("change", _event);
                        $('[name="' + name + '"]').on("keyup", _event1).on("change", _event1);
                    }
                }
            });

            $('input[type="number"]').each(function (index, elem) {
                elem = $(elem);
                if (!elem.data('InputNumber')) {
                    elem.attr('type', 'text');
                    var checkDecimal = elem.attr('step') != null;
                    elem.InputNumber($.extend(true,
                        {
                            decimal: checkDecimal ? 2 : 0,
                            decPoint: ',',
                            thousandsSep: '.',
                            isMask: true
                        },
                        elem.data()));
                }
            });

        },
        selectSearch: function () {
            var elements = $('[searchSelect]');
            for (var i = 0; i < elements.length; i++) {
                var elem = $(elements[i]);
                var target = $(elem.data('target'));
                if (target.length > 0) {
                    elem.off('keyup drop blur').on('keyup drop blur', function (event) {
                        var elem = $(this);
                        var options = $.extend(true, {
                            searchOnEnterKey: false,
                            searchTimeOut: 500,
                            timeoutId: null,
                            elmFind: 'option'
                        }, elem.data())
                        if (options.searchOnEnterKey && event.keyCode !== 13) {
                            return;
                        }

                        if ($.inArray(event.keyCode, [37, 38, 39, 40]) > -1) {
                            return;
                        }
                        clearTimeout(options.timeoutId);
                        options.timeoutId = setTimeout(function (elem) {
                            var target = $(elem.data('target'));
                            var _options = target.find(options.elmFind);

                            _options.removeClass('hidden');

                            var search = _options.filter(function (index, e) {
                                e = $(e);
                                var text = e.text().toLowerCase();
                                var value = (elem.val() || '').toLowerCase()
                                return text.indexOf(value) == -1;
                            });

                            search.addClass('hidden');

                        }, options.searchTimeOut, elem);
                        elem.data('timeoutId', options.timeoutId)
                    });
                }
            }
        },
        select2Default: function () {
            var elements = $('[select2Search]');
            for (var i = 0; i < elements.length; i++) {
                var elem = $(elements[i]);
                if (!elem.data('select2')) {
                    var options = $.extend(true, {
                        //theme: "bootstrap"
                    }, elem.data());
                    elem.select2(options);

                    //this.select2Materialize(elem);
                }
            }
            this.select2FixPosition();
        },
        select2FixPosition: function () {
            //select2 fix position
            $(".select2-hidden-accessible")
                .map(function (index, elm) {
                    var config = $(elm).data("select2");
                    if (config) {
                        config.on("results:message", function () {
                            this.dropdown._positionDropdown();
                        });
                    }
                });

            $("select").on("select2:close", function (e) {
                var _this = $(this);
                var form = _this.closest("form");
                if (form.length > 0 && form.data("validator"))
                    _this.valid();
            });
        },
        select2Materialize: function ($eventSelect) {
            $eventSelect.on("select2:opening", function () {
                //this.dropdown._positionDropdown();

                var formCtrlParent = $(this).closest('.form-line');
                if (formCtrlParent.length > 0) {
                    formCtrlParent.removeClass('focused').addClass('focused').removeClass('select2Line').addClass('select2Line');
                }
            });
            $("select").on("select2:close", function (e) {
                var _this = $(this);
                var form = _this.closest("form");
                if (form.length > 0 && form.data("validator"))
                    _this.valid();

                var formCtrlParent = $(this).closest('.form-line');
                if (formCtrlParent.length > 0) {
                    formCtrlParent.removeClass('focused');
                }
            });
        },
        modalEvent: function () {
            var modelCheck = function (show) {
                if ($('.modal').hasClass('in') && !$('body').hasClass('modal-open')) {
                    $('body').addClass('modal-open');
                }
            }
            $('.modal')
                .on('hidden.bs.modal',
                    function () {
                        modelCheck(false);
                    });
            $('.modal')
                .on('shown.bs.modal',
                    function () {
                        modelCheck(true);
                    });
            modelCheck(true);
        },
        ValidateForm: {
            isInit: false,
            ignoreDefault: 'table input, .ignoreValid, .hiddenCreate input, select',
            init: function () {
                var _this = this;
                if (_this.isInit) {
                    return;
                }
                _this.isInit = true;
                var getOptionForm = function (element) {
                    var form = $(element).closest("form");
                    var optionsData = form.data();
                    optionsData.tooltip = optionsData.tooltip == null ? false : optionsData.tooltip;
                    optionsData.tooltipPlacement = optionsData.tooltipPlacement == null
                        ? "top"
                        : optionsData.tooltipPlacement;
                    return optionsData;
                }
                $.validator.setDefaults({
                    focusInvalid: true,
                    //errorElement: "span", // contain the error msg in a small tag
                    errorClass: 'help-block',
                    errorPlacement: function (error, element) {// render error placement for each input type
                        //if (element.attr("type") == "radio" || element.attr("type") == "checkbox") {// for chosen elements, need to insert the error after the chosen container
                        //    error.insertAfter($(element).closest('.form-group').children('div').children().last());
                        //} else if (element.attr("name") == "card_expiry_mm" || element.attr("name") == "card_expiry_yyyy") {
                        //    error.appendTo($(element).closest('.form-group').children('div'));
                        //} else {
                        //    if (error.text() != "") {
                        //        error.insertAfter(element);
                        //    }
                        //    // for other inputs, just perform default behavior
                        //}

                        var form = $(element).closest("form");
                        var optionsData = getOptionForm(element);
                        if (optionsData.tooltip) {

                            var addTooltip = function (element) {
                                var mess = error.text();
                                var elm = $(element);
                                elm.data("message-error", mess);
                                elm.tooltip({
                                    placement: optionsData.tooltipPlacement,
                                    title: mess,
                                    trigger: "hover focus"
                                })
                                    .attr('data-original-title', mess)
                                    .tooltip('show');
                            }

                            if (element.parent('.input-group').length) {
                                addTooltip(element); // radio/checkbox?
                            } else if (element.hasClass('select2-hidden-accessible')) {
                                addTooltip(element.next('span'));
                            } else {
                                addTooltip(element);
                            }
                        }
                        else {
                            if (element.parent('.input-group, .form-inline').length) {
                                error.insertAfter(element.parent());      // radio/checkbox?
                            } else if (element.hasClass('select2-hidden-accessible')) {
                                error.insertAfter(element.next('span'));  // select2
                            } else {
                                error.insertAfter(element);//default
                            }
                        }

                        form.find("validation-summary-errors").hide();
                    },
                    //ignore: '',
                    ignore: _this.ignoreDefault,
                    success: function (label, element) {
                        var elm = $(element);
                        var optionsData = getOptionForm(element);
                        if (optionsData.tooltip) {
                            var element1 = elm;
                            if (elm.hasClass('select2-hidden-accessible')) {
                                element1 = $(elm.next('span'));
                            }
                            if (typeof ($(element1).tooltip) == "function" && $(element1).data("bs.tooltip") != null) {
                                $(element1).tooltip('destroy');
                            }
                        }

                        label.addClass('help-block valid');
                        $(element).closest('.form-group').removeClass('has-error');

                        _this.override.success(label, element);
                    },
                    highlight: function (element) {
                        var elm = $(element);
                        var optionsData = getOptionForm(element);
                        if (optionsData.tooltip) {
                            var mess = $(element).data("message-error") || "";
                            if (mess != "") {
                                if (typeof (elm.tooltip) == "function" && elm.data("bs.tooltip") != null) {
                                    elm.tooltip('show');
                                    //$(element).tooltip('destroy')
                                } else {
                                    elm.tooltip({
                                        placement: optionsData.tooltipPlacement,
                                        title: mess,
                                        trigger: "hover focus"
                                    })
                                        .attr('data-original-title', mess)
                                        .tooltip('show');
                                }

                                //elm.tooltip({
                                //    placement: "top",
                                //    title: mess,
                                //    trigger: "hover focus"
                                //});
                                //$(element).tooltip("show");
                            }
                        }

                        $(element).closest('.help-block').removeClass('valid');
                        $(element).closest('.form-group').removeClass('has-error');
                        $(element).closest('.form-group').addClass('has-error');

                        _this.override.highlight(element);
                    },
                    unhighlight: function (element) {
                        var elm = $(element);
                        var optionsData = getOptionForm(element);
                        if (optionsData.tooltip) {
                            var element1 = elm;
                            if (elm.hasClass('select2-hidden-accessible')) {
                                element1 = $(elm.next('span'));
                            }
                            if (typeof (element1.tooltip) == "function" && element1.data("bs.tooltip") != null) {
                                element1.tooltip('destroy')
                            }
                        }

                        $(element).closest('.form-group').removeClass('has-error');

                        _this.override.unhighlight(element);
                    }
                });
                // setDefaults jquery validate ==============================================================================
                $.validator.addMethod("textareaRequired", function (value, element) {
                    value = value || "";
                    value = (value + "").trim();
                    return value.length > 0;
                }, "Hãy nhập.");
                $.validator.addMethod("selectNotNull", function (value, element) {
                    value = value || "";
                    if (isNaN(value + "")) {
                        return (value + "").trim() != "";
                    }
                    if (typeof (value) == "object" && value.constructor == Array) {
                        return value.length > 0;
                    }
                    value = value.replace("number:", "");
                    return value > 0;
                }, "Hãy nhập.");
                //}, "This field is required.");

                $.validator.methods.date = function (value, element) {
                    return this.optional(element) || moment(value, 'DD/MM/YYYY').toDate() !== null;
                };

                $.validator.addMethod('minStrict', function (value, el, param) {
                    return value < param;
                }, "Hãy nhập lớn hơn {0} trở lên.");

                $.validator.addMethod('maxStrict', function (value, el, param) {
                    return value > param;
                }, "Hãy nhập nhỏ hơn {0} trở lên.");

                $.validator.addMethod("noSpace", function (value, element) {
                    return value.indexOf(" ") < 0 && value != "";
                }, "Không được nhập khoảng trắng.");
                //}, "No space please");

                $.validator.addMethod("phoneVN", function (value, element, param) {
                    value += "";
                    var isValid = value.match(/^(01[2689]|09)[0-9]{2}[0-9]{3}[0-9]{3}/) != null;
                    if (value.startsWith('09')) {
                        $.validator.messages['phoneVN'] = "Số điện thoại có 10 số.";
                        return value.length == 10;
                    }
                    else if (value.startsWith('01')) {
                        $.validator.messages['phoneVN'] = "Số điện thoại có 11 số.";
                        return value.length == 11;
                    }
                    else {
                        $.validator.messages['phoneVN'] = "Nhập số điện thoại từ 10-11 số.";
                        return false;
                    }
                }, "Số điện thoại có {0}.");

                $.validator.messages['alphanumeric'] = "Hãy nhập chữ và số, loại bỏ các ký tự đặc biệt.";
                //advand remote jquery validate
                var currentRemote = $.validator.methods.remote;
                $.validator.methods.remote = function (value, element, param, method) {
                    if (typeof param === "string") {
                        try {
                            param = eval(param);
                            if ($.isFunction(param)) {
                                param = param();
                                //param = param.apply(this);
                            }
                        } catch (e) {

                        }
                    }
                    return currentRemote.apply(this, arguments);
                }
            },
            defaultRegistry: function () {
                var _this = this;
                $("form.form_validate").each(function (index, elm) {
                    elm = $(elm);
                    if (!elm.data("validator")) {
                        var validOption = {
                            ignore: elm.data().ignore || _this.ignoreDefault,
                            invalidHandler: function (event, validator) {
                            },
                            validateOnInit: true
                        };

                        var dataOptions = $.extend(true, {
                            autoSubmit: true,
                            onSubmit: "",
                            validateExtend: function () { return true; },

                        }, elm.data());
                        //var dataOptions = elm.data();
                        //dataOptions.autoSubmit = dataOptions.autoSubmit == null ? (dataOptions.onSubmit == "" || dataOptions.onSubmit == null) : dataOptions.autoSubmit;
                        //dataOptions.validateExtend = dataOptions.validateExtend == null ? true : dataOptions.validateExtend;

                        if (!dataOptions.autoSubmit || true) {
                            validOption.submitHandler = function (form) {
                                if (event != null) {
                                    event.stopPropagation();
                                    event.preventDefault();
                                }
                                form = $(form);

                                var dataOptions = form.data();
                                dataOptions = $.extend(true, {
                                    autoSubmit: true,
                                    onSubmit: "",
                                    validateExtend: function () { return true; }
                                }, dataOptions);

                                var validateExtend = eval(dataOptions.validateExtend);
                                if (validateExtend == false || ($.isFunction(validateExtend) && !validateExtend())) {
                                    return;
                                }


                                var enctype = form.attr("enctype") || "";
                                var action = form.attr("action");

                                var data = form.serializeObject();

                                try {
                                    if (enctype.toLowerCase() == "multipart/form-data".toLowerCase()) {
                                        var data1 = new FormData(form[0]);
                                        form.find('input[type="file"]')
                                            .map(function (index, elm) {
                                                data1.append(elm.name, elm.files);
                                            });
                                        for (var i in data) {
                                            data1.append(i, data[i]);
                                        }
                                        data = data1;

                                        if (!dataOptions.autoSubmit || dataOptions.onSubmit != "") {
                                            if (dataOptions.onSubmit != "") {
                                                eval(dataOptions.onSubmit)(form, data);
                                            } else {
                                                _AjaxAPI.formData(action,
                                                    data,
                                                    function (data) {
                                                        console.log(data);
                                                    });
                                            }

                                        } else {
                                            var validator = form.validate();
                                            validator.destroy();
                                            form.submit();
                                        }
                                    } else {
                                        if (!dataOptions.autoSubmit || dataOptions.onSubmit != "") {
                                            if (dataOptions.onSubmit != "") {
                                                eval(dataOptions.onSubmit)(form, data);
                                            } else {
                                                _AjaxAPI.post(action,
                                                    data,
                                                    function (data) {
                                                        console.log(data);
                                                    });
                                            }
                                        } else {
                                            var validator = form.validate();
                                            validator.destroy();
                                            form.submit();
                                        }
                                    }
                                } catch (ex) {
                                    debugger
                                }
                            };
                        } else {

                        }

                        elm.validate(validOption);
                    }
                });
            },
            override: {
                success: function (label, element) {
                },
                highlight: function (element) {
                    var _element = $(element);

                    // show tab
                    var show_tab = function (e) {
                        var tab_content = e.closest(".tab-pane");
                        if (tab_content.length == 0) {
                            return;
                        }
                        var tab_content_id = tab_content.attr("id");
                        var find_btn_tab = $('[href="#' + tab_content_id + '"][data-toggle="tab"]');
                        find_btn_tab = find_btn_tab.length != 0
                            ? find_btn_tab
                            : $('[href="#' + tab_content_id + '"][data-toggle="pill"]');
                        if (find_btn_tab.length != 0) {
                            find_btn_tab.click();
                            //show_tab(find_btn_tab);
                        }
                    }
                    setTimeout(function () {
                        show_tab(_element);
                    }, 10);
                    // ==================================
                },
                unhighlight: function (element) {
                }
            }
        },
        DatePickerBTFixPosition: function () {
            return;
            $.fn.datepicker.Constructor.prototype.place = function () {
                if (this.isInline)
                    return this;
                var calendarWidth = this.picker.outerWidth(),
                    calendarHeight = this.picker.outerHeight(),
                    visualPadding = 10,
                    container = $(this.o.container),
                    windowWidth = container.width(),
                    scrollTop = this.o.container === 'body' ? $(document).scrollTop() : container.scrollTop(),
                    appendOffset = container.offset();

                var parentsZindex = [0];
                this.element.parents().each(function () {
                    var itemZIndex = $(this).css('z-index');
                    if (itemZIndex !== 'auto' && Number(itemZIndex) !== 0) parentsZindex.push(Number(itemZIndex));
                });
                var zIndex = Math.max.apply(Math, parentsZindex) + this.o.zIndexOffset;
                var offset = this.component ? this.component.parent().offset() : this.element.offset();
                var height = this.component ? this.component.outerHeight(true) : this.element.outerHeight(false);
                var width = this.component ? this.component.outerWidth(true) : this.element.outerWidth(false);
                var left = offset.left - appendOffset.left;
                //var top = offset.top - appendOffset.top;
                var top = offset.top + height + parseInt(this.element.css('padding-top')) + parseInt(this.element.css('padding-bottom'));

                if (this.o.container !== 'body') {
                    top += scrollTop;
                }

                this.picker.removeClass(
                    'datepicker-orient-top datepicker-orient-bottom ' +
                    'datepicker-orient-right datepicker-orient-left'
                );

                if (this.o.orientation.x !== 'auto') {
                    this.picker.addClass('datepicker-orient-' + this.o.orientation.x);
                    if (this.o.orientation.x === 'right')
                        left -= calendarWidth - width;
                }
                    // auto x orientation is best-placement: if it crosses a window
                    // edge, fudge it sideways
                else {
                    if (offset.left < 0) {
                        // component is outside the window on the left side. Move it into visible range
                        this.picker.addClass('datepicker-orient-left');
                        left -= offset.left - visualPadding;
                    } else if (left + calendarWidth > windowWidth) {
                        // the calendar passes the widow right edge. Align it to component right side
                        this.picker.addClass('datepicker-orient-right');
                        left += width - calendarWidth;
                    } else {
                        if (this.o.rtl) {
                            // Default to right
                            this.picker.addClass('datepicker-orient-right');
                        } else {
                            // Default to left
                            this.picker.addClass('datepicker-orient-left');
                        }
                    }
                }

                // auto y orientation is best-situation: top or bottom, no fudging,
                // decision based on which shows more of the calendar
                var yorient = this.o.orientation.y,
                    top_overflow;
                if (yorient === 'auto') {
                    top_overflow = -scrollTop + top - calendarHeight;
                    yorient = top_overflow < 0 ? 'bottom' : 'top';
                }

                this.picker.addClass('datepicker-orient-' + yorient);
                if (yorient === 'top')
                    top -= calendarHeight + parseInt(this.picker.css('padding-top'));
                else
                    top += height;

                if (this.o.rtl) {
                    var right = windowWidth - (left + width);
                    this.picker.css({
                        top: top,
                        right: right,
                        zIndex: zIndex
                    });
                } else {
                    this.picker.css({
                        top: top,
                        left: left,
                        zIndex: zIndex
                    });
                }
                return this;
            }
        },
        DatePicker: function () {
            //date picker
            //http://amsul.ca/pickadate.js/date/
            $('.datePicker')
                .each(function (index, elm) {
                    elm = $(elm);
                    if (!elm.data("pickadate")) {
                        var options = elm.data();
                        options = $.extend(true,
                            {
                                // Strings and translations
                                monthsFull: [
                                    'Tháng Một', 'Tháng Hai', 'Tháng Ba', 'Tháng Tư', 'Tháng Năm', 'Tháng Sáu',
                                    'Tháng Bảy',
                                    'Tháng Tám', 'Tháng Chín', 'Tháng Mười', 'Tháng Mười Một', 'Tháng Mười Hai'
                                ],
                                monthsShort: [
                                    'Một', 'Hai', 'Ba', 'Tư', 'Năm', 'Sáu', 'Bảy', 'Tám', 'Chín', 'Mười', 'Mười Một',
                                    'Mười Hai'
                                ],
                                weekdaysFull: [
                                    'Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'
                                ],
                                weekdaysShort: ['C.Nhật', 'T.Hai', 'T.Ba', 'T.Tư', 'T.Năm', 'T.Sáu', 'T.Bảy'],
                                showMonthsShort: undefined,
                                showWeekdaysFull: undefined,
                                // Buttons
                                today: 'Hôm nay',
                                clear: 'Xóa',
                                close: 'Đóng',
                                // Accessibility labels
                                labelMonthNext: 'Tháng sau',
                                labelMonthPrev: 'Tháng trước',
                                labelMonthSelect: 'Chọn tháng',
                                labelYearSelect: 'Chọn năm',
                                // Formats
                                format: 'd mmmm, yyyy',
                                formatSubmit: 'dd/mm/yyyy',
                                hiddenPrefix: undefined,
                                hiddenSuffix: '_submit',
                                hiddenName: true,
                                // Editable input
                                editable: undefined,

                                // Dropdown selectors
                                selectYears: 20,
                                selectMonths: true,
                                // First day of the week
                                firstDay: true,
                                // Date limits
                                min: '01/01/1790',
                                max: undefined,

                                // Disable dates
                                disable: undefined,

                                // Root picker container
                                container: undefined,

                                // Hidden input container
                                containerHidden: undefined,

                                // Close on a user action
                                closeOnSelect: true,
                                closeOnClear: true,
                            },
                            options);
                        elm.css('cursor', 'pointer');
                        var $input = elm.pickadate(options);

                        var picker = $input.pickadate('picker');

                        var date = elm.val() || "";
                        date = new Date(date);
                        if (!isNaN(date)) {
                            picker.set('select', date)
                        }
                    }
                });

            $('.datePickerBT')
                .each(function (index, elm) {
                    elm = $(elm);
                    if (!elm.data("datepicker")) {
                        var options = elm.data();

                        //http://bootstrap-datepicker.readthedocs.io/en/latest/options.html
                        options = $.extend(true, {
                            //container: "#pluginsAdd",
                            //zIndexOffset: 1031,
                            autoclose: true,
                            //clearBtn: true,
                            //todayBtn: true,
                            //inline: true,
                            todayHighlight: true,
                            weekStart: 1,
                            startDate: '01/01/1790',
                            format: 'dd/mm/yyyy',
                            //format: {
                            //    toDisplay: function (date, format, language) {
                            //        var d = new Date(date);
                            //        d.setDate(d.getDate() - 7);
                            //        return new Date().formatDateTime();
                            //    },
                            //    toValue: function (date, format, language) {
                            //        var d = new Date(date);
                            //        d.setDate(d.getDate() + 7);
                            //        return new Date(d);
                            //    }
                            //},
                            language: 'vi'
                        }, options);

                        if (options.startDate) {
                            options.startDate += "";
                        }
                        if (options.endDate) {
                            options.endDate += "";
                        }

                        //elm.attr('readonly', true);
                        elm.css('cursor', 'pointer');
                        elm.datepicker(options);

                        if (options.autoSetVal == null || options.autoSetVal == true) {
                            var date = elm.val() || "";
                            date = new Date(date);
                            if (!isNaN(date)) {
                                elm.datepicker('setDate', date)
                            }
                        }
                    }
                });

            $.fn.datetimepicker.defaults.locale = 'vi'
        },
        EventCalculate: function () {
            $('[data-oncalculate]')
                .each(function (index, elm) {
                    var run = function (elm) {
                        var func = elm.data("oncalculate") || ""
                        func = eval(func);
                        if ($.isFunction(func)) {
                            func();
                        }
                    }
                    elm = $(elm);
                    elm.on('keyup change blur',
                        function () {
                            var elm = $(this);
                            if (elm.data("numFormat")) {
                                setTimeout(function () {
                                    run(elm);
                                },
                                    100);
                            } else {
                                run(elm);
                            }
                        });
                    run(elm);
                });
        },
        TextAreaAutoFitContent: function () {
            $('textarea[auto-fitcontent]')
                .each(function (index, elm) {
                    elm = $(elm);
                    elm.height(elm[0].scrollHeight);
                    //elm.on('keyup change blur', function () {
                    //    elm.height( elm[0].scrollHeight );
                    //});
                });
        },
        ImgError: function () {
            $('img')
                .on('error',
                    function () {
                        $(this).prop('src', app.config.ImgThumbnailDefault).addClass('broken-image');
                        if (!$(this).hasClass('broken-image')) {
                        }
                    });
        },
        SingleUpload: function () {
            $('[data-upload-single]')
                .each(function (index, elm) {
                    elm = $(elm);
                    if (!elm.data("UploadSingle")) {
                        elm.UploadSingle(elm.data());
                    }
                });
        },
        UploadCopperImg: function () {
            $('[data-provider="UploadCopperImg"]')
                .each(function (index, elm) {
                    elm = $(elm);
                    if (!elm.data("UploadCopperImg")) {
                        elm.css('cursor', 'pointer');
                        elm.off('click').on('click', function (event) {
                            event.stopPropagation();
                            event.preventDefault();
                            if (!elm.data("UploadCopperImg")) {
                                elm.UploadCopperImg(elm.data());
                            } else {
                                elm.UploadCopperImg("Load");
                            }
                        });
                    }
                });
        },
        ImageView: {
            Single: function () {
                $('[data-provider="image-viewer-single"]')
                    .each(function (index, elm) {
                        elm = $(elm);
                        elm.css('cursor', 'pointer');
                        elm.click(function (event) {
                            event.stopPropagation();
                            event.preventDefault();
                            var options = elm.data();
                            options = $.extend(true,
                                {
                                    target: "",
                                },
                                options);

                            var url = "";
                            if (elm[0].nodeName == "IMG") {
                                url = elm.attr('src');
                            } else if (options.target != "") {
                                var target;
                                target = $(options.target);
                                url = target.attr('src');
                            } else {
                                url = elm.find("img").attr("src");
                            }
                            if (url == "") {
                                return;
                            }

                            target = target || elm;

                            var body = $("body");
                            body.css("overflow", "hidden");

                            var data_caption = target != null ? (target.data("caption") || "") : "";
                            var modal = $("#modal-images-viewer-single");
                            var img = modal.find("#img");
                            var caption = modal.find("#caption");
                            var close = modal.find("#close");
                            close[0].onclick = function () {
                                modal.hide();
                                body.css("overflow", "auto");
                            }
                            img.attr("src", url);
                            img.css("max-height", window.innerHeight - 40 + "px");
                            caption.text(data_caption);
                            modal.show();
                        });
                    });
            }
        },
        FixOwlCarouselStopTab: function () {
            $(window).on("blur focus", function (e) {
                var prevType = $(this).data("prevType");

                if (prevType != e.type) {   //  reduce double fire issues
                    switch (e.type) {
                        case "blur":
                            // do work
                            //owl.trigger('stop.owl.autoplay');
                            break;
                        case "focus":
                            // do work
                            //owl.trigger('play.owl.autoplay', [1000]);

                            $('.owl-carousel').each(function (index, elm) {
                                elm = $(elm);
                                var carousel = elm.data('owl.carousel');
                                if (carousel != null && carousel.options.autoplay) {
                                    carousel.next();
                                }
                            });
                            break;
                    }
                }

                $(this).data("prevType", e.type);
            });
        },
        FE: {
            commentBox: function () {
                $('[boxComment]').each(function (index, elm) {
                    //elm = $(elm).parent();
                    elm = $(elm);
                    if (!elm.data("boxCommentRun")) {
                        elm.data("boxCommentRun", true);

                        (new Promise(function (resolve, reject) {
                            var options = elm.data();
                            options = $.extend(true, {
                            }, options);
                            if (options.ObjectId == null) {
                                var url = window.location.pathname;
                                _AjaxAPI.post('/PageItem/GetPageItem', { url: url }, function (data) {
                                    if (data.Success) {
                                        data = data.Data;
                                        if (data == null) {
                                            return;
                                        }
                                        resolve({
                                            ParentId: 0,
                                            ObjectId: data.ObjectId,
                                            Type: data.Type
                                        });
                                    }
                                });
                            }
                            else {
                                resolve(options);
                            }
                        })).then(function (options) {
                            var pagination = elm.find('.navPagination');
                            var listComment = elm.find('.listComment');
                            var htmlAdd = elm.find('#_formAdd').html();
                            var htmlItemComment = elm.find('#_itemComment').html();

                            var pageSize = 5;

                            var openModal = function (options) {
                                var popupModal = modal.LoadAjax({
                                    title: options.ParentId == 0 ? 'Đánh giá và nhận xét' : 'Trả lời đánh giá và nhận xét',
                                    html: htmlAdd,
                                    backdrop: 'static',
                                    onload: function (popup) {
                                        popup.modal.find('.modal-header').hide();
                                        popup.modal.find('[name="btnCancel"]').click(function () {
                                            popup.closeCallback();
                                        });
                                        var form = popup.modal.find('form');
                                        var jqueryStar = form.find('.jqueryStar')

                                        if (jqueryStar.length > 0) {
                                            jqueryStar.find('[name="Star"]').attr('data-msg-required', 'Đánh giá sao.');
                                            jqueryStar.rating(function (vote, event) {
                                                //console.log(vote, event);
                                            });
                                        }

                                        if (options.ParentId != 0) {
                                            form.find('.inputStar').remove();
                                        }

                                        form.data('onSubmit', function (form, data) {
                                            data = $.extend(true, data, options);
                                            _AjaxAPI.post('/Comment/InsertFE', data, function (data) {
                                                popup.closeCallback();
                                                modal.DeleteComfirm({
                                                    message: 'Cảm ơn đánh giá của bạn. Vui lòng chờ duyệt.'
                                                });
                                                if (data.Success) {
                                                }
                                            });
                                        });
                                    }
                                });
                            }

                            var loadCM = function (page) {
                                listComment.empty();

                                _AjaxAPI.post('/Comment/PagingFE', {
                                    Type: options.Type,
                                    ObjectId: options.ObjectId,
                                    ObjSearch: {
                                        PageIndex: page || 1,
                                        PageSize: pageSize
                                    }
                                }, function (data) {
                                    if (data.Success) {
                                        data = data.Data;
                                        var html = '';

                                        var genTree = function (ParentId, level) {
                                            ParentId = ParentId == null ? 0 : ParentId;
                                            level = level == null ? 0 : level;

                                            var dataTemp = data.Lists.filter(function (e) {
                                                return e.ParentId == ParentId;
                                            });

                                            var htmlReturn = '';
                                            for (var i = 0; i < dataTemp.length; i++) {
                                                var e = dataTemp[i];
                                                var htmlChild = dataTemp[i].CommentChilds = genTree(dataTemp[i].Id);

                                                htmlReturn += htmlItemComment.format(
                                                /*0*/'/App_Assets/images/user.png',
                                                /*1*/e.Name,
                                                /*2*/moment(new Date(e.CreateDate)).fromNow(),
                                                /*3*/e.Content,
                                                /*4*/ParentId == 0 ? e.Id : ParentId,
                                                /*5*/htmlChild,
                                                /*5*/e.Star
                                               )
                                            }

                                            return htmlReturn;
                                        }

                                        //listComment.each(function (index, listComment) {
                                        var dataTemp = $(genTree());
                                        listComment = $(listComment);
                                        listComment.append(dataTemp);

                                        dataTemp.find('[showStar]').each(function (index, e) {
                                            e = $(e);

                                            var starCount = eval(e.attr('showStar')) || 0;
                                            var stars = e.find('a.star');

                                            for (var i = 0; i < starCount; i++) {
                                                var star = $(stars[i]);
                                                star.addClass('fullStar');
                                            }
                                            if (starCount <= 0) {
                                                e.remove();
                                            }
                                        });
                                        //});

                                        GenPaging.Gen({
                                            elm: pagination,
                                            Page: page,
                                            TotalPage: CalculatorPage(data.TotalRow, pageSize),
                                            //Url: '/tesla-90w',
                                            //query: 'a=325&fff=7654'
                                            isNext: true,
                                            isPrev: true,
                                            isLast: false,
                                            isFirst: false,
                                            callback: function (page) {
                                                loadCM(page);
                                            }
                                        });

                                        if (data.Lists.length <= 0) {
                                            pagination.parent().remove();
                                        }
                                    }
                                });

                                setTimeout(function () {
                                    listComment.find('.btnReply').click(function (event) {
                                        event.stopPropagation();
                                        event.preventDefault();

                                        var e = $(this);

                                        var data = e.data();
                                        data = $.extend(true, e.parents('[boxComment]').data(), data);
                                        data.action = 'Reply';

                                        openModal(data);
                                    });
                                }, 200);
                            }

                            loadCM();

                            var btnNew = elm.find('.btnNew');
                            btnNew.click(function (event) {
                                event.stopPropagation();
                                event.preventDefault();

                                options.action = 'New';
                                openModal(options);
                            });
                        });


                        elm.css('display', '');
                    }
                });
            },
            fancybox: {
                index: 0,
                run: function () {
                    var _this = this;
                    var allElm = $('[fancyboxCustom]');
                    for (var i = 0; i < allElm.length; i++) {
                        var elmFix = $(allElm[i]);

                        if (!elmFix.data('fix-fancybox')) {
                            elmFix.data('fix-fancybox', true);
                            elmFix.off('click').on('click', function (event) {
                                //event.stopPropagation();
                                //event.preventDefault();
                            });
                        }
                        else {
                            continue;
                        }

                        var options = $.extend(true, {
                            elmChildImg: 'img',
                            elmChild: 'li',
                            groupAttr: 'data-rel',
                            prevEffect: 'none',
                            nextEffect: 'none',
                            closeBtn: true,
                            //helpers: {
                            //    title: {
                            //        type: 'inside'
                            //    }
                            //},
                            openEffect: 'fade',
                            closeEffect: 'fade',
                            helpers: {
                                title: {
                                    type: 'outside'
                                },
                                thumbs: {
                                    width: 50,
                                    height: 50,
                                    autoStart: true,
                                    source: function (current) {
                                        return $(current.element).data('thumbnail');
                                    },
                                },
                                buttons: {}
                            }
                        }, elmFix.data());

                        if (options.fancyboxName == null) {
                            _this.index++;
                            options.fancyboxName = _this.index;
                        }

                        var imgs = elmFix.find(options.elmChildImg);
                        elmFix.find(options.elmChild).each(function (index, elm) {
                            elm = $(elm);

                            var img = $(imgs[index]);
                            if ((elm.attr('href') || "") == "") {
                                elm.attr('href', img.attr('src'));
                            }
                            elm.attr('data-rel', 'fancybox-' + options.fancyboxName);
                        });
                        //$(elmFix.find(options.elmChild)).fancybox(options);
                        $('[fancyboxCustom] ' + options.elmChild).fancybox(options);
                    };
                }
            },
            owlCarousel: function () {
                $('[owlCarousel]').each(function (index, elm) {
                    elm = $(elm);
                    if (!elm.data("owl.carousel")) {
                        var options = elm.data();
                        options = $.extend(true, {
                            pagination: false,
                            navigation: true,
                            items: elm.find('.owlCarouselItem').length,
                        }, options);
                        elm.owlCarousel(options);
                    }
                });
            },
            Carousel: function () {
                //Function to animate slider captions 
                function doAnimations(elems) {
                    //Cache the animationend event in a variable
                    var animEndEv = 'webkitAnimationEnd animationend';

                    elems.each(function () {
                        var $this = $(this),
                            $animationType = $this.data('animation');
                        $this.addClass($animationType).one(animEndEv, function () {
                            $this.removeClass($animationType);
                        });
                    });
                }

                //Variables on page load 
                var $myCarousel = $('[BsCarousel]');
                for (var i = 0; i < $myCarousel.length; i++) {
                    var elm = $($myCarousel[i]);
                    if (!elm.data('bs.carousel')) {
                        var $firstAnimatingElems = elm.find('.item:first').find("[data-animation ^= 'animated']");

                        var options = $.extend(true, {

                        }, elm.data());
                        elm.carousel(options);

                        elm.find('[data-slide-to]').click(function (event) {
                            event.stopPropagation();
                            event.preventDefault();

                            var e = $(this);
                            var method = e.data('slideTo');
                            var plugin = elm.data('bs.carousel');
                            plugin['to'](method);
                        });
                        elm.find('[data-slide]').click(function (event) {
                            event.stopPropagation();
                            event.preventDefault();

                            var e = $(this);
                            var method = e.data('slide');
                            var plugin = elm.data('bs.carousel');
                            plugin[method]();
                        });

                        doAnimations($firstAnimatingElems);
                        elm.on('slide.bs.carousel', function (e) {
                            var $animatingElems = $(e.relatedTarget).find("[data-animation ^= 'animated']");
                            doAnimations($animatingElems);
                        });
                    }
                }
            }
        }
    },
}

//app.documentReady.push(AppHubConnect.Load);
//app.documentReady.push(app.notification.mail.load);