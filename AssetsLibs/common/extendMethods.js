//#region functionExtend
var objectifyForm = function (formArray) {//serialize data function

    var returnArray = {};
    for (var i = 0; i < formArray.length; i++) {
        returnArray[formArray[i]['name']] = formArray[i]['value'];
    }
    return returnArray;
}
function previewImage(input, previewId) {
    readURL(input, function (e) {
        $(previewId).attr('src', e.target.result);
        $(previewId).removeClass('hide').next().removeClass('hide');
        //$('<input type="button" class="btn btn-default" value="X"/>')
        //    .on('click',
        //        function() {
        //            input.value = 'DELETE';
        //            $(previewId).addClass('hide');
        //            $(previewId).attr('src', '');
        //            $(this).remove();
        //        })
        //    .insertAfter($(previewId));
    }, function () {
        $(input).val(null);
        $(previewId).addClass('hide').next().addClass('hide');
    });
}
var fileTypes = ['jpg', 'jpeg', 'png', 'gif'];  //acceptable file types

function readURL(input, callbackShow, callbackHide) {
    if (input.files && input.files[0]) {
        var extension = input.files[0].name.split('.').pop().toLowerCase(),  //file extension from input file
            isSuccess = fileTypes.indexOf(extension) > -1;  //is extension in acceptable types

        if (isSuccess) { //yes
            var reader = new FileReader();
            reader.onload = function (e) {
                callbackShow(e);
            }

            reader.readAsDataURL(input.files[0]);
        }
        else { //no
            //warning
            callbackHide();
            alert('Invalid image file');
        }
    }
}

var newTabPrint = function (html) {
    var myWindow = window.open('', '');
    myWindow.document.write(html);
    myWindow.document.close();
    myWindow.focus();
    myWindow.print();
    myWindow.close();
}

var moneyToText = function (value) {
    var numToText = function (num) {
        if (num == 0) {
            return "không";
        }
        else if (num == 1) {
            return "một";
        }
        else if (num == 2) {
            return "hai";
        }
        else if (num == 3) {
            return "ba";
        }
        else if (num == 4) {
            return "bốn";
        }
        else if (num == 5) {
            return "năm";
        }
        else if (num == 6) {
            return "sáu";
        }
        else if (num == 7) {
            return "bảy";
        }
        else if (num == 8) {
            return "tám";
        }
        else if (num == 9) {
            return "chín";
        }
        else if (num == 10) {
            return "mười";
        }
    }
    var docdonvi = function (value) {
        if (value.length == 1) {
            return numToText(value);
        }
        else if (value.length == 2) {
            if (value == 10) {
                return numToText(value);
            }
            else {
                if (value[0] == 1) {
                    return "mười " + numToText(value[1]);
                }
                var txt = numToText(value[0]) + " mươi";
                if (value[1] != 0) {
                    if (value[1] == 1) {
                        return txt + " mốt";
                    }
                    return txt + " " + numToText(value[1]);
                }
                return txt;
            }
        }
        else {
            var txt = "";
            txt = numToText(value[0]) + " trăm";
            if (value[1] == 0) {
                if (value[2] != 0) {
                    txt += " linh " + numToText(value[2]);
                }
            }
            else {
                txt += " " + docdonvi(value[1] + value[2]);
            }
            return txt;
        }
    }

    var getDonvi = function (value, boi) {
        boi = boi || 3;
        var donvi = [];
        var temp = "";
        for (var i = value.length; i > 0; i--) {
            var e = value[i - 1];
            temp = e + temp;
            if ((value.length - i + 1) % boi == 0 || i == 1) {
                donvi.unshift(temp);
                temp = "";
            }
        }
        return donvi;
    }

    value = value || "0";
    value += "";
    var txt = "";

    var donvi = getDonvi(value);
    var hangTy = getDonvi(value, 9);

    for (var i = 0; i < donvi.length; i++) {
        var txt1 = docdonvi(donvi[i]);
        switch (donvi.length - i - 1) {
            case 0:
                break;
            case 1:
                txt1 += " nghìn";
                break;
            case 2:
                txt1 += " triệu";
                break;
            case 3:
                txt1 += " tỷ";
                break;
            case 4:
                txt1 += " nghìn tỷ";
                break;
            case 5:
                txt1 += " triệu tỷ";
                break;
            default:
                txt1 += " tỷ tỷ";
        }
        txt += " " + txt1;
        var conlai = donvi.slice(i + 1, donvi.length);
        var check = eval(conlai.join("")) > 0;
        if (!check) {
            break;
        }
        if (i != donvi.length - 1) {
            txt += ",";
        }
    }
    txt = txt.trim();
    return txt.substr(0, 1).toUpperCase() + txt.substr(1);
}

var page_loading = {
    count: 0,
    id_element: "page_loader_modal",
    elem: null,
    show: function () {
        this.count++;
        if (this.count > 1) {
            return;
        }

        $.blockUI({
            message: '<div class="ft-refresh-cw icon-spin font-medium-2"></div>',
            overlayCSS: {
                backgroundColor: '#FFF',
                opacity: 0.8,
                cursor: 'wait'
            },
            css: {
                color: '#333',
                border: 0,
                padding: 0,
                backgroundColor: 'transparent'
            }
        });

        return;

        this.elem = $("#" + this.id_element);
        if (this.elem.length == 0) {
            $("body").append('\
                <div class="text-center modal" id="{0}" style="z-index: 20001">\
                    <!--<div class="modal-body" style="background-color: white; opacity: 0.75; height: 100%">-->\
                    <div class="modal-body" style="">\
                        <div class="content-loading text-xs-center" style="margin-top: {1}px;">\
                            <i class="fa fa-spinner fa-pulse fa-3x fa-fw margin-bottom" style="color: #fffcfc;"></i>\
                            <!--<img src="/Assets/images/loading_1.gif"/>-->\
                        </div>\
                    </div>\
                </div>\
            '.format(this.id_element, (window.innerHeight - 50) / 2));
            this.elem = $("#" + this.id_element);
        }
        else {
            this.elem.find(".modal-body .content-loading").css("margin-top", ((window.innerHeight - 50) / 2) + "px");
        }
        this.elem.modal({
            backdrop: "static",
            show: true
        });

        var _obj = this.elem.data("bs.modal");
        if (_obj.$backdrop) {
            _obj.$backdrop.css("z-index", 2000);
        }

        app.component.load();
        //var loadertheme = "bg-black";
        //var loaderopacity = "80";
        //var loaderstyle = "light";
        //var loader = '<div id="' + this.id_element + '" class="ui-front loader ui-widget-overlay ' + loadertheme + ' opacity-' + loaderopacity + '"><img src="/Assets/images/spinner/loader-' + loaderstyle + '.gif" alt="" /></div>';

        //$('body').append(loader);
        //$('#' + this.id_element).fadeIn('fast');
    },
    destroy: function () {
        this.count = 1;
        this.hide();
    },
    hide: function () {
        this.count--;
        if (this.count > 0) {
            return;
        }
        if (this.count < 0) {
            this.count = 0;
        }

        $.unblockUI();
        return;
        if (this.elem != null) {
            this.elem.modal('hide')
        }
        app.component.modalEvent();
        //$('#' + this.id_element).fadeOut('fast');
    }
}

var _AjaxAPI = {
    showError: function (data) {
        Notification.Error(data.message || data.Message);
    },
    get: function (url, data, success, error, showBlock) {
        showBlock = showBlock == null ? true : showBlock;
        if (showBlock)
            page_loading.show();
        try {
            //data = $.extend(true, {
            //    ajaxShowBlock: false,
            //}, data);
            //$.get(
            //    url,
            //    data,
            //    function (results) {
            //        success(results);
            //        if (showBlock)
            //            page_loading.hide();
            //    }
            //);
            $.ajax({
                ajaxShowBlock: false,
                url: url,
                type: "GET",
                data: data,
                dataType: undefined,
                success: function (results, textStatus, jqXHR) {
                    success(results);
                    page_loading.hide();
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    page_loading.hide();
                    if (error) {
                        error(jqXHR);
                    }
                }
            });
        } catch (e) {
            if (showBlock)
                page_loading.hide();
            if (error) {
                error(e);
            }
        }

    },
    post: function (url, data, success, error, showBlock, options) {
        showBlock = showBlock == null ? true : showBlock;
        if (showBlock) {
            page_loading.show();
        }
        try {
            options = $.extend(true, {
                ajaxShowBlock: false,
                url: url,
                type: "POST",
                data: JSON.stringify(data),
                contentType: "application/json; charset=utf-8",
                //dataType: 'json',
                success: function (results, textStatus, jqXHR) {
                    success(results);
                    if (showBlock)
                        page_loading.hide();
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    page_loading.hide();
                    if (error) {
                        error(jqXHR);
                    }
                }
            }, options);
            $.ajax(options);
        } catch (e) {
            if (showBlock)
                page_loading.hide();
            if (error) {
                error(e);
            }
        }
    },
    all: function (api, options) {
        //_AjaxAPI.all({
        //    API1: {
        //        type: 'get',//get hoặc post
        //        url: '/User/GetAllUser',
        //        data: {}
        //    },
        //    API2: {
        //        type: 'function',// custom function
        //        func: function () {
        //            return new Promise(function (success, error) {
        //                AppHubConnect.Hub.GetAllConnect().then(function (data) {
        //                    success(data);
        //                }, function (error) {
        //                    error(error);
        //                });
        //            });
        //        }
        //    }
        //}, {
        //    success: function (data) {
        //    },
        //    error: function (data) {
        //    }
        //});

        //_AjaxAPI.all([
        //    {
        //        type: 'get',//get hoặc post
        //        url: '/User/GetAllUser',
        //        data: {}
        //    },
        //    {
        //        type: 'function',// custom function
        //        func: function () {
        //            return new Promise(function (success, error) {
        //                AppHubConnect.Hub.GetAllConnect().then(function (data) {
        //                    success(data);
        //                }, function (error) {
        //                    error(error);
        //                });
        //            });
        //        }
        //    }
        //], {
        //    success: function (data) {
        //    },
        //    error: function (data) {
        //    }
        //});
        api = api || {};
        options = $.extend(true, {
            showBlock: true,
            breakError: true,
            success: function () { },
            error: function () { }
        }, options);

        return new Promise(function (resolve, reject) {
            var index = -1;
            var isArray = api.constructor == Array;
            var keys = isArray ? [] : Object.keys(api);
            var _success = isArray ? [] : {};
            var _errors = isArray ? [] : {};
            var isBreakError = false;
            var run = function (callback) {
                index++;
                if ((isArray && index >= api.length) || (!isArray && index >= keys.length) || isBreakError) {
                    callback();
                    return;
                }
                var tempAPI;
                var key;
                if (isArray) {
                    tempAPI = api[index];
                    key = index;
                }
                else {
                    tempAPI = api[keys[index]];
                    key = keys[index];
                }

                _errors[key] = null;
                try {
                    tempAPI = $.extend(true, {
                        type: "GET",
                        url: "",
                        data: {}
                    }, tempAPI);
                    tempAPI.type = tempAPI.type.toUpperCase();

                    if (tempAPI.type == "GET") {
                        $.ajax($.extend(true, {
                            ajaxShowBlock: false,
                            url: tempAPI.url,
                            type: "GET",
                            data: tempAPI.data,
                            dataType: undefined,
                            success: function (results, textStatus, jqXHR) {
                                _success[key] = results;
                                run(callback);
                            },
                            error: function (jqXHR, textStatus, errorThrown) {
                                _errors[key] = jqXHR;
                                if (options.breakError) {
                                    options.error(jqXHR);
                                    reject(jqXHR);
                                    isBreakError = false;
                                    if (options.showBlock)
                                        page_loading.hide();
                                }
                                else {
                                    run(callback);
                                }
                            }
                        }, tempAPI));
                    }
                    else if (tempAPI.type == "POST") {
                        $.ajax($.extend(true, {
                            ajaxShowBlock: false,
                            url: tempAPI.url,
                            type: "POST",
                            data: JSON.stringify(tempAPI.data),
                            contentType: "application/json; charset=utf-8",
                            //dataType: 'json',
                            success: function (results, textStatus, jqXHR) {
                                _success[key] = results;
                                run(callback);
                            },
                            error: function (jqXHR, textStatus, errorThrown) {
                                _errors[key] = jqXHR;
                                if (options.breakError) {
                                    options.error(jqXHR);
                                    reject(jqXHR);
                                    isBreakError = true;
                                    if (options.showBlock)
                                        page_loading.hide();
                                }
                                else {
                                    run(callback);
                                }
                            }
                        }, tempAPI));
                    }
                    else if (tempAPI.type == "FUNCTION") {
                        var func = eval(tempAPI.func);
                        func().then(function () {
                            if (arguments.length == 1) {
                                _success[key] = arguments[0];
                            }
                            else {
                                _success[key] = arguments;
                            }
                            run(callback);
                        }, function () {
                            _errors[key] = arguments;
                            if (options.breakError) {
                                options.error(arguments);
                                reject(arguments);
                                isBreakError = true;
                                if (options.showBlock)
                                    page_loading.hide();
                            }
                            else {
                                run(callback);
                            }
                        });
                    }
                } catch (e) {
                    _errors[key] = e;
                    if (options.breakError) {
                        options.error(e);
                        reject(e);
                        isBreakError = true;
                        if (options.showBlock)
                            page_loading.hide();
                    }
                    else {
                        run(callback);
                    }
                }
                finally {
                }
            }
            if (options.showBlock) {
                page_loading.show();
            }
            run(function () {
                if (options.showBlock)
                    page_loading.hide();

                if (isBreakError) {
                    return;
                }
                if (((isArray && _errors.filter(function (e) { return e == null; }).length == _errors.length) || (!isArray && Object.values(_errors).filter(function (e) { return e == null; }).length == Object.values(_errors).length))) {
                    options.success(_success);
                    resolve(_success);
                }
                else {
                    options.error(_errors);
                    reject(_errors);
                }
            });
        });
    },
    get1: function (url, data, success, error) {
        //page_loading.show();
        try {
            //$.get(
            //    url,
            //    data,
            //    function (results) {
            //        success(results);
            //        //page_loading.hide();
            //    }
            //);
            $.ajax({
                ajaxShowBlock: false,
                url: url,
                type: "GET",
                data: data,
                dataType: undefined,
                success: function (results, textStatus, jqXHR) {
                    success(results);
                    page_loading.hide();
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    page_loading.hide();
                    if (error) {
                        error(jqXHR);
                    }
                }
            });
        } catch (e) {
            //page_loading.hide();
            if (error) {
                error(e);
            }
        }

    },
    post1: function (url, data, success, error) {
        //page_loading.show();
        try {
            $.ajax({
                ajaxShowBlock: false,
                url: url,
                type: "POST",
                data: JSON.stringify(data),
                contentType: "application/json; charset=utf-8",
                //dataType: 'json',
                success: function (results, textStatus, jqXHR) {
                    success(results);
                    //page_loading.hide();
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    //page_loading.hide();
                    if (error) {
                        error(jqXHR);
                    }
                }
            });
        } catch (e) {
            //page_loading.hide();
            if (error) {
                error(e);
            }
        }
    },
    formData: function (url, data, success, error, process) {
        page_loading.show();
        try {
            $.ajax(url, {
                method: "POST",
                data: data,
                processData: false,
                contentType: false,
                progress: function (data) {
                    if (process) {
                        process(data);
                    }
                },
                success: function (data) {
                    page_loading.hide();
                    success(data);
                },
                error: function (jqXHR) {
                    page_loading.hide();
                    if (error) {
                        error(jqXHR);
                    }
                }
            });
        } catch (e) {
            page_loading.hide();
            if (error) {
                error(e);
            }
        }
    }
}

var toVND = function (obj) {
    obj = obj || "";
    return obj.toVND();
}
var toPercent = function (obj) {
    obj = obj || "";
    return obj.toPercent();
}

var formatDateTime = function (obj) {
    obj = obj || "";
    if (obj != "") {
        return obj.formatDateTime();
    }
}


if ($("#ModalCustom").length == 0) {
    $("body").append('<div id="ModalCustom"></div>');
}
var modal = {
    CalculatorZIndex: true,
    //IndexStart: 1052,
    IndexStart: 10052,
    Html: "\
            <div class=\"modal fade\" id=\"{0}\"  role=\"dialog\" aria-labelledby=\"myModalLabel\" aria-hidden=\"true\" style=\"display: none;\">\
                <div class=\"modal-dialog\">\
                    <div class=\"modal-content\">\
                        <div class=\"modal-header {1}\">\
                            <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">×</button>\
                            <h4 class=\"modal-title\" id=\"title\">Modal title</h4>\
                        </div>\
                        <div class=\"modal-body\">\
                        </div>\
                        <div class=\"modal-footer\">\
                            <button type=\"button\" class=\"btn btn-default\" data-dismiss1=\"modal\" id=\"Close\">Close</button>\
                            <button type=\"button\" class=\"btn btn-primary\" id=\"Ok\">Ok</button>\
                        </div>\
                    </div>\
                </div>\
            </div>",
    Index: 0,
    DeleteComfirm: function (options) {
        modal.Index++;
        options = options || {};
        options = {
            idmodal: "ModalCustom" + modal.Index,
            title: options.title || "Thông báo",
            message: options.message || "Bạn có muốn xóa.?",
            classname: options.classname || "",
            onload: options.onload || function () {
            },
            onclose: options.onclose || function () {
                //console.log("onclose");
            },
            dismiss: options.dismiss || function () {
                //console.log("dismiss");
            },
            callback: options.callback || function () {
            },
            buttonClose: options.buttonClose || {
                Text: "Đóng",
                isShow: true,
                isIconX: false
            },
            buttonOk: options.buttonOk || {
                Text: "Đồng ý",
                isShow: true,
            },
            keyboard: options.keyboard != null ? options.keyboard : false,
            backdrop: options.backdrop != null ? options.backdrop : "static",
        }
        var html = modal.Html.format("ModalCustom" + modal.Index, options.buttonClose.Text, options.buttonOk.Text);
        $("#ModalCustom").append(html);

        options.modal = $('#' + options.idmodal);

        options.modal.find('.modal-header .modal-title').text(options.title);
        options.modal.find('.modal-body').html(options.message);
        var xClose = options.modal.find('.modal-header .close');
        if (!options.buttonClose.isIconX) {
            xClose.remove();
        }
        options.modal.find('.modal-footer #Close').text(options.buttonClose.Text).addClass(options.buttonClose.isShow ? "" : "hidden");
        options.modal.find('.modal-footer #Ok').text(options.buttonOk.Text).addClass(options.buttonOk.isShow ? "" : "hidden");

        options.modal.modal({
            backdrop: options.backdrop,
            //backdrop: true,
            keyboard: options.keyboard,
            show: true,
        });


        if (modal.CalculatorZIndex) {

            var _obj = options.modal.data("bs.modal");
            var zIndex = modal.IndexStart + (modal.Index * 2 - 1);
            if (_obj.$backdrop) {
                _obj.$backdrop.css("z-index", zIndex);
            }
            options.modal.css('z-index', zIndex + 1);
        }

        var checkDismiss = false;
        options.modal.find('#Close').bind('click', function () {
            if (options.dismiss) {
                options.dismiss();
            }
            checkDismiss = true;
            options.modal.modal('hide');
        });
        options.modal.find('#Ok').bind('click', function () {
            options.callback();
            checkDismiss = true;
            options.modal.modal('hide');
        });

        //options.modal.on('hide.bs.modal', function () {
        //    if (options.onclose) {
        //        options.onclose();
        //    }
        //    //options.modal.remove();
        //});
        options.modal.on('hidden.bs.modal', function () {
            if (options.onclose != null && !checkDismiss) {
                options.onclose();
            }
            options.modal.remove();
        });
        app.component.modalEvent();
        return options;
    },
    LoadAjax: function (options) {
        modal.Index++;
        options = options || {};
        options = $.extend(true, {
            idmodal: "ModalCustom" + modal.Index,
            title: "Title",
            titleConfig: {
                class: ''
            },
            isShowTitle: true,
            url: "",
            html: "",
            //classname: options.classname || "normalmodalsmall",
            classname: "",
            onload: function () {
                //console.log("onload");
            },
            onclose: function () {
                //console.log("onclose");
            },
            dismiss: function () {
                //console.log("dismiss");
            },
            callback: function () {
                //console.log("callback");
            },
            buttonClose: {
                Text: "Đóng",
                isShow: false,
                isIconX: true
            },
            buttonOk: {
                Text: "Đồng ý",
                isShow: false,
            },
            keyboard: true,
            backdrop: true,
        }, options)
        var html = modal.Html.format("ModalCustom" + modal.Index, options.titleConfig.class);
        $("#ModalCustom").append(html);


        options.modal = $('#' + options.idmodal);
        // remove content
        options.modal.find('#content').html("");

        options.modal.modal({
            backdrop: options.backdrop,
            keyboard: options.keyboard
        });

        if (modal.CalculatorZIndex) {
            var _obj = options.modal.data("bs.modal");
            var zIndex = modal.IndexStart + (modal.Index * 2 - 1);
            if (_obj.$backdrop) {
                _obj.$backdrop.css("z-index", zIndex);
            }
            options.modal.css('z-index', zIndex + 1);
        }

        if (options.title == false) {
            options.modal.find('.modal-header').hide();
        }
        options.modal.find('#title').text(options.title);

        options.modal.find('.modal-footer #Close').text(options.buttonClose.Text).addClass(options.buttonClose.isShow ? "" : "hidden");
        options.modal.find('.modal-footer #Ok').text(options.buttonOk.Text).addClass(options.buttonOk.isShow ? "" : "hidden");
        if (!options.buttonClose.isShow && !options.buttonOk.isShow) {
            options.modal.find('.modal-footer').hide();
        }
        var xClose = options.modal.find('.modal-header .close');
        options.buttonClose.isIconX = options.buttonClose.isIconX != null ? options.buttonClose.isIconX : true;
        if (!options.buttonClose.isIconX) {
            xClose.remove();
        }

        options.modal.find('.modal-body').append('\
            <div style="text-align: center">\
                <i class="fa fa-refresh fa-spin"></i>\
            </div>\
        ');

        options.modal.find(".modal-dialog").addClass(options.classname);
        if (options.url != "") {
            //options.modal.modal('hide');
            page_loading.show();
            options.modal.find('.modal-body').load(options.url, function (responseText, textStatus, jqXHR) {
                //console.log(jqXHR)
                page_loading.hide();
                if (jqXHR.status == 200) {
                    options.modal.modal('show');
                    app.component.load();
                    if (options.onload) {
                        options.onload(options);
                    }
                }
                else {
                    alert("Cannot load url: {0}".format(options.url));
                }
            });
        }
        else {
            options.modal.find('.modal-body').html(options.html);
            app.component.load();
            if (options.onload) {
                options.onload(options);
            }
        }

        var checkDismiss = false;
        options.modal.find('#Close').bind('click', function () {
            if (options.dismiss) {
                options.dismiss();
            }
            checkDismiss = true;
            options.modal.modal('hide');
        });
        options.modal.find('#Ok').bind('click', function () {
            options.callback();
            checkDismiss = true;
            if (options.calbackVerify != null) {
                options.calbackVerify(function () {
                    options.modal.modal('hide');
                });
            }
            else {
                options.modal.modal('hide');
            }
        });
        //options.modal.on('hide.bs.modal', function () {
        //    if (options.onclose) {
        //        options.onclose();
        //    }
        //    //options.modal.remove();
        //});
        options.modal.on('hidden.bs.modal', function () {
            if (options.onclose != null && !checkDismiss) {
                options.onclose();
            }
            options.modal.remove();
        });
        options.closeCallback = function (data) {
            $('#' + options.idmodal).modal('hide');
            options.callback(data);
        }
        options.remove = function () {
            $('#' + options.idmodal).modal('hide');
        }
        $(options.modal).bind('closeCallback', function (event, data) {
            $('#' + options.idmodal).modal('hide');
            options.callback(data);
        });
        return options;
    }
}

function dateFromJsonCSharp(jsonDate) {
    //var jsonDate = "/Date(1245398693390)/";  // returns "/Date(1245398693390)/"; 
    var re = /-?\d+/;
    var m = re.exec(jsonDate);
    var d = new Date(parseInt(m[0]));
    return d;
}

var Notification = {
    Success: function (mess) {
        mess = mess || "Thành công";
        this.Create({
            heading: "Thông báo",
            text: mess,
            icon: "success"
        });
    },
    Error: function (mess) {
        mess = mess || "Lỗi";
        this.Create({
            heading: "Thông báo",
            text: mess,
            icon: "error"
        });
    },
    Warning: function (mess) {
        mess = mess || "Cảnh báo";
        this.Create({
            heading: "Thông báo",
            text: mess,
            icon: "warning"
        });
    },
    Info: function (mess) {
        mess = mess || "Cảnh báo";
        this.Create({
            heading: "Thông báo",
            text: mess,
            icon: "info"
        });
    },
    Create: function (options) {
        //http://kamranahmed.info/toast
        $.toast($.extend(true, {
            text: "Don't forget to star the repository if you like it.", // Text that is to be shown in the toast
            heading: 'Note', // Optional heading to be shown on the toast
            icon: 'warning', // Type of toast icon
            showHideTransition: 'fade', // fade, slide or plain
            allowToastClose: true, // Boolean value true or false
            hideAfter: 2500, // false to make it sticky or number representing the miliseconds as time after which toast needs to be hidden
            stack: 5, // false if there should be only one toast at a time or a number representing the maximum number of toasts to be shown at a time
            position: 'bottom-right', // bottom-left or bottom-right or bottom-center or top-left or top-right or top-center or mid-center or an object representing the left, right, top, bottom values



            textAlign: 'left',  // Text alignment i.e. left, right or center
            loader: true,  // Whether to show loader or not. True by default
            loaderBg: '#9EC600',  // Background color of the toast loader
            beforeShow: function () { }, // will be triggered before the toast is shown
            afterShown: function () { }, // will be triggered after the toat has been shown
            beforeHide: function () { }, // will be triggered before the toast gets hidden
            afterHidden: function () { }  // will be triggered after the toast has been hidden
        }, options));

    }
}

function copy_clone(data) {
    if (data.constructor == Array) {
        return jQuery.extend(true, [], data);
    }
    else if (data.constructor == Object) {
        return jQuery.extend(true, {}, data);
    }
    return data;
}

//#region ObjectValid
ObjectValid = {
    defaultMessageValid: {
        required: 'This field({0}) is required.',
        number: 'Please enter({0}) a valid number.',
        digits: "Please enter({0}) only digits.",
        equalTo: "Please enter({0}) the same value({1}) again.",
        maxlength: "Please enter({0}) no more than {1} characters.",
        minlength: "Please enter({0}) at least {1} characters.",
        rangelength: "Please enter({0}) a value between {1} and {2} characters long.",
        min: "Please enter({0}) a value greater than or equal to {1}.",
        minStrict: "Please enter({0}) a value greater than or equal to {1}.",
        max: "Please enter({0}) a value less than or equal to {1}.",
        maxStrict: "Please enter({0}) a value less than or equal to {1}.",
        range: "Please enter({0}) a value between {1} and {2}.",
        email: "Please enter({0}) a valid email address.",
        url: "Please enter({0}) a valid URL.",
        date: "Please enter({0}) a valid date.",
        dateISO: "Please enter({0}) a valid date (ISO).",
    },
    defaultMessageValid_vi: {
        required: 'Hãy nhâp({0}).',
        number: 'Hãy nhập số({0}).',
        digits: "Hãy nhập chữ số({0}).",
        equalTo: "Hãy nhập({0}) thêm lần nữa({1}).",
        maxlength: "Hãy nhập({0}) từ {1} kí tự trở lên.",
        minlength: "Hãy nhập({0}) từ {1} kí tự trở xuống.",
        rangelength: "Hãy nhập({0}) từ {1} đến {2} kí tự.",
        min: "Hãy nhập({0}) từ {1} trở lên.",
        minStrict: "Hãy nhập({0}) từ {1} trở lên.",
        max: "Hãy nhập({0}) từ {1} trở xuống.",
        maxStrict: "Hãy nhập({0}) từ {1} trở xuống.",
        range: "Hãy nhập({0}) từ {1} đến {2}.",
        email: "Hãy nhập({0}) email.",
        url: "Hãy nhập({0}) URL.",
        date: "Hãy nhập({0}) ngày.",
        dateISO: "Hãy nhập({0}) ngày (ISO).",
    },
    lan: null,
    valid: function (object, rules) {
        var defaultMessage = this.lan == null ? this.defaultMessageValid : this["defaultMessageValid_" + this.lan];
        var pushMess = function (key, value, message, value1) {
            _return.push({
                field: key,
                value: value,
                message: message
            });
        }

        var _return = [];
        rules = rules || {};
        for (var key in rules) {
            var rule = rules[key];
            if (!object.hasOwnProperty(key)) {
                continue;
            }

            var displayName = rule.displayName || key;
            var value = object[key];
            if (rule.required != null) {
                var required;
                if (typeof (rule.required) === 'function') {
                    try {
                        required = eval(rule.required)();
                    }
                    catch (ex) {
                        required = eval(rule.required);
                    }
                }
                else if (typeof (rule.required) == "boolean") {
                    required = rule.required;
                }
                else if (typeof (rule.required) == "object" && rule.required.constructor == Object && rule.required.valid != null) {
                    if (typeof (rule.required.valid) == "function") {
                        try {
                            required = eval(rule.required.valid)();
                        }
                        catch (ex) {
                            required = eval(rule.required.valid);
                        }
                    }
                    else if (typeof (rule.required.valid) == "boolean") {
                        required = rule.required.valid;
                    }
                }
                if ((value == null || value == 'null' || value == '') == required) {
                    var message = rule.required.constructor == Object && rule.required.message != null ? rule.required.message : (rule.message || defaultMessage["required"].format(displayName));
                    pushMess(key, value, message);
                    continue;
                }
            }

            var getRuleObj = function (rule) {
                if (typeof (rule) == "object" && rule.constructor == Object && rule.valid != null) {
                    return {
                        valid: typeof (rule.valid) == "function" ? rule.valid(object, rule) : rule.valid,
                        message: function (ruleConfig) {
                            if (typeof (rule.message) == "string") {
                                return rule.message;
                            }
                            else if (typeof (rule.message) == "function") {
                                return rule.message(arguments);
                            }
                            return null;
                        }
                    }
                }
                return {
                    message: function () {
                        return null;
                    }
                };
            }

            if (rule.number != null) {
                var _rule = getRuleObj(rule.number);
                if (!/^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(value) == (_rule.valid || rule.number)) {
                    var message = _rule.message(rule, value) || rule.message || defaultMessage["number"].format(displayName);
                    pushMess(key, value, message);
                    continue;
                }
            }

            if (rule.digits != null) {
                var _rule = getRuleObj(rule.digits);
                if (!/^\d+$/.test(value) == (_rule.valid || rule.digits)) {
                    var message = _rule.message(rule, value) || rule.message || defaultMessage["digits"].format(displayName);
                    pushMess(key, value, message);
                    continue;
                }
            }

            if (rule.equalTo != null) {
                var _rule = getRuleObj(rule.equalTo);
                var value1 = this[(_rule.valid || rule.equalTo)];
                if (value1 != value) {
                    var message = _rule.message(rule, value) || rule.message || defaultMessage["equalTo"].format(displayName, (_rule.valid || rule.equalTo));
                    pushMess(key, value, message);
                    continue;
                }
            }

            if (rule.maxlength != null) {
                var _rule = getRuleObj(rule.maxlength);
                var length = $.isArray(value) ? value.length : typeof (value) == 'string' ? value.length : 0;
                if ((_rule.valid || rule.maxlength) < length && value != null) {
                    var message = _rule.message(rule, value) || rule.message || defaultMessage["maxlength"].format(displayName, (_rule.valid || rule.maxlength));
                    pushMess(key, value, message);
                    continue;
                }
            }

            if (rule.minlength != null) {
                var _rule = getRuleObj(rule.minlength);
                var length = $.isArray(value) ? value.length : typeof (value) == 'string' ? value.length : 0;
                if ((_rule.valid || rule.minlength) > length && value != null) {
                    var message = _rule.message(rule, value) || rule.message || defaultMessage["minlength"].format(displayName, (_rule.valid || rule.minlength));
                    pushMess(key, value, message);
                    continue;
                }
            }

            if (rule.rangelength != null) {
                var _rule = getRuleObj(rule.rangelength);
                var rangelength1 = _rule.valid != null ? rule.valid[0] : rule.rangelength[0];
                var rangelength2 = _rule.valid != null ? rule.valid[1] : rule.rangelength[1];
                var length = $.isArray(value) ? value.length : typeof (value) == 'string' ? value.length : 0;
                if ((rangelength1 > length || rangelength2 < length) && value != null) {
                    var message = _rule.message(rule, value) || rule.message || defaultMessage["rangelength"].format(displayName, rangelength1, rangelength2);
                    pushMess(key, value, message);
                    continue;
                }
            }

            if (rule.min != null) {
                var _rule = getRuleObj(rule.min);
                if ((_rule.valid || rule.min) > value && value != null) {
                    var message = _rule.message(rule, value) || rule.message || defaultMessage["min"].format(displayName, (_rule.valid || rule.min));
                    pushMess(key, value, message);
                    continue;
                }
            }

            if (rule.minStrict != null) {
                var _rule = getRuleObj(rule.minStrict);
                if ((_rule.valid || rule.minStrict) >= value && value != null) {
                    var message = _rule.message(rule, value) || rule.message || defaultMessage["minStrict"].format(displayName, (_rule.valid || rule.minStrict));
                    pushMess(key, value, message);
                    continue;
                }
            }

            if (rule.max != null) {
                var _rule = getRuleObj(rule.max);
                if ((_rule.valid || rule.max) < value && value != null) {
                    var message = _rule.message(rule, value) || rule.message || defaultMessage["max"].format(displayName, (_rule.valid || rule.max));
                    pushMess(key, value, message);
                    continue;
                }
            }

            if (rule.maxStrict != null) {
                var _rule = getRuleObj(rule.maxStrict);
                if ((_rule.valid || rule.maxStrict) < value && value != null) {
                    var message = _rule.message(rule, value) || rule.message || defaultMessage["maxStrict"].format(displayName, (_rule.valid || rule.maxStrict));
                    pushMess(key, value, message);
                    continue;
                }
            }

            if (rule.range != null) {
                var _rule = getRuleObj(rule.range);
                var range1 = _rule.valid != null ? rule.valid[0] : rule.range[0];
                var range2 = _rule.valid != null ? rule.valid[1] : rule.range[1];
                if ((range2 < value || range1 > value) && value != null) {
                    var message = _rule.message(rule, value) || rule.message || defaultMessage["range"].format(displayName, range1, range2);
                    pushMess(key, value, message);
                    continue;
                }
            }

            if (rule.email != null) {
                var _rule = getRuleObj(rule.email);
                if ((_rule.valid || rule.email) == !/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i.test(value)) {
                    var message = _rule.message(rule, value) || rule.message || defaultMessage["email"].format(displayName);
                    pushMess(key, value, message);
                    continue;
                }
            }

            if (rule.url != null) {
                var _rule = getRuleObj(rule.url);
                if ((_rule.valid || rule.url) == !/^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(value)) {
                    var message = _rule.message(rule, value) || rule.message || defaultMessage["url"].format(displayName);
                    pushMess(key, value, message);
                    continue;
                }
            }

            if (rule.date != null) {
                var _rule = getRuleObj(rule.date);
                if ((_rule.valid || rule.date) == /Invalid|NaN/.test(new Date('31/31/2017').toString())) {
                    var message = _rule.message(rule, value) || rule.message || defaultMessage["date"].format(displayName);
                    pushMess(key, value, message);
                    continue;
                }
            }

            if (rule.dateISO != null) {
                var _rule = getRuleObj(rule.dateISO);
                if ((_rule.valid || rule.dateISO) == !/^\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2}$/.test(value)) {
                    var message = _rule.message(rule, value) || rule.message || defaultMessage["dateISO"].format(displayName);
                    pushMess(key, value, message);
                    continue;
                }
            }
        }
        return _return;
    }
}
ObjectValid.lan = "vi";
var a = {
    Name1: "dasdas@adfas.fdsf",
    Name2: null
};
ObjectValid.lan = "vi"
ObjectValid.valid(a, {
    Name1: {
        url: true
    },
});
//#endregion ObjectValid

var select2Ctrl = {
    defaultAutoComplete: function (options) {
        options = options || {};
        options.Elem = $(options.Elem);

        options = jQuery.extend(true, {
            config: {},
            select2Current: "",
            GetViewSelect: 2,
            GetViewSelected: 2,
            GetParams: function (params) {
                return params;
            },
            SetDataView: options.SetDataView || function (data) {
                return data;
            }
        }, options);
        options.config = jQuery.extend(true, {
            ajax: {
                url: "",
                dataType: 'json',
                delay: 250,
                type: 'POST',
                data: function (params) {
                    var _this = this;
                    var select2Current = options.select2Current = _this.attr("id") || _this.attr("name");
                    var _return = {
                        TextSearch: params.term, // search term
                        Page: params.page,
                        Type: select2Current,
                    };
                    _return = options.GetParams(_return, options.Elem);
                    return _return;
                },
                processResults: function (data, params) {
                    var _this = this.$element;
                    var elementID = _this.attr("id") || _this.attr("name");
                    if (data.Success || data.success) {
                        data = data.Data || data.data;
                        var _data = data.Data || data.data;
                        var select2Current = options.select2Current = elementID;
                        results = _data.map(function (e) {
                            e.id = e.Id || e.id;
                            e.FullName = e.FullName || "";
                            e.Phone = e.Phone || "";
                            e.Email = e.Email || "";
                            e.Address = e.Address || "";

                            e = options.SetDataView(e, elementID);

                            return e;
                        });

                        var TotalRow = data.TotalRow || data.totalRow;
                        var Page = params.page || 1;
                        var PageSize = data.PageSize || data.pageSize;

                        return {
                            results: results,
                            pagination: {
                                more: (Page * PageSize) < TotalRow
                            }
                        };
                    }
                    else {
                        return {
                            results: [],
                            //pagination: {
                            //    more: (1 * PageSize) < TotalRow
                            //}
                        };
                    }
                },
                cache: true
            },
            escapeMarkup: function (markup) {
                //debugger
                return markup;
            },
            minimumInputLength: 1,
            templateResult: function (data) {
                if (data.loading)
                    return data.text;
                var _return = "<div class='select2_group_select clearfix'>\
                                            <div class='select2_group_select_img'>\
                                                <img src='" + (data.AvatarImage || "/Assets/images/no-thumbnail.jpg") + "'/>\
                                            </div>\
                                            <div class='select2_group_select_content'>\
                                                <div style='font-weight: bold;'>\
                                                    #"+ data.id + " " + data.name + "\
                                                </div>\
                                                <div style='font-style: italic; color: #a9a59e;'>\
                                                    <i class='fa fa-envelope-o'></i>" + data.FullName + "\
                                                </div>\
                                                <div style='font-style: italic; color: #a9a59e;'>\
                                                    <i class='fa fa-envelope-o'></i>" + data.Email + "\
                                                </div>\
                                                <div style='font-style: italic; color: #a9a59e;'>\
                                                    <i class='glyphicon glyphicon-earphone'></i>" + data.PhoneNumber + "\
                                                </div>\
                                                <div style='font-style: italic; color: #a9a59e;'>\
                                                    <i class='glyphicon glyphicon-home'></i>"+ data.Address + "\
                                                </div>\
                                            </div>\
                                        </div>\
                                        ";

                if (options.GetViewSelect == 1) {

                }
                else if (options.GetViewSelect == 2) {
                    _return = data.name;
                }
                else if (typeof (options.GetViewSelect) == "function") {
                    _return = options.GetViewSelect(data, options.select2Current);
                }
                else {
                    _return = data.name;
                }

                return _return;
            },
            templateSelection: function (data) {
                var _return = '';
                if (options.GetViewSelect == 1) {
                    return "#" + data.id + "-" + (data.name || data.text) + (data.FullName != null ? " - " + data.FullName : "");
                }
                else if (options.GetViewSelect == 2) {
                    _return = data.name;
                }
                else if (typeof (options.GetViewSelect) == "function") {
                    _return = options.GetViewSelect(data, options.select2Current);
                }
                else {
                    _return = data.name;
                }
                return _return;
            }
        }, options.config);

        options.Elem.select2(options.config);

        return options;
    },
    setData: function (elem, val, data) {
        var elem = $(elem);
        data = data || [];
        if (data.length > 0) {
            elem.empty();
            var option = "";
            data.map(function (e) {
                option += '<option value="' + e.id + '">' + e.label + '</option>';
            });
            elem.html(option);
        }
        elem.val(val).trigger("change");
    },
    getData: function (elem) {
        var elem = $(elem);
        return elem.select2('data');
    }
}

function CalculatorPage(total, pageSize) {
    if (pageSize <= 0) {
        return total;
    }
    if (total <= 0) {
        return 1;
    }
    var page = Math.round(total / pageSize);
    var percent = total % pageSize
    page += percent < pageSize / 2 && percent != 0 ? 1 : 0;
    return page;
}

var convertObject = function (object, UpperCase) {
    var keyWord = [
        {
            Name: 'id',
            UpperCase: 'Id',
            LowerCase: 'id',
        },
        {
            Name: 'sql',
            UpperCase: 'SQL',
            LowerCase: 'sql',
        },
    ];
    var checkUpperCase = function (value) {
        value = value || "";
        return value[0] == value[0].toUpperCase();
    }
    var checkLowerCase = function (value) {
        value = value || "";
        return value[0] == value[0].toLowerCase();
    }

    var toUpperCase = function (value) {
        value = value || "";
        var search = keyWord.filter(function (e) { return e.Name.toUpperCase() == value.toUpperCase(); })[0];
        if (search != null) {
            return search.UpperCase;
        }
        return value.substr(0, 1).toUpperCase() + value.substr(1);
    }

    var toLowerCase = function (value) {
        value = value || "";
        var search = keyWord.filter(function (e) { return e.Name.toUpperCase() == value.toUpperCase(); })[0];
        if (search != null) {
            return search.LowerCase;
        }
        return value.substr(0, 1).toLowerCase() + value.substr(1);
    }

    var obj = $.isArray(object) ? [] : {};
    for (var key in object) {
        var temp = object[key];

        if (UpperCase == null) {
            key = checkUpperCase(key) ? toLowerCase(key) : toUpperCase(key);
        }
        else if (UpperCase == true) {
            key = toUpperCase(key);
        }
        else {
            key = toLowerCase(key);
        }

        if (temp != null && typeof (temp) == 'object') {
            if (temp.constructor == Object) {
                temp = convertObject(temp, UpperCase);
            }
            else if (temp.constructor == Array) {
                for (var i in temp) {
                    temp[i] = convertObject(temp[i], UpperCase);
                }
            }
        }

        obj[key] = temp;
    }
    return obj;
}
//#endregion functionExtend

var BtDefault = {
    formatVND: function (value, row, elm) {
        return (value || "").toVND();
    },
    formatPercent: function (value, row, elm) {
        return (value || "").toPercent();
    },
    validateCell: function ($el, value, rule) {
        //var $el = $(this);
        $el = $($el);
        var _this = $el.closest("table");
        var index = $el.closest('[data-index]').data("index");
        var field = $el.data("name");
        var objTemp = {};
        objTemp[field] = value;
        var errors = ObjectValid.valid(objTemp, rule);

        if (errors.length > 0) {
            return errors[0].message;
        }
    }
}

var ChatBox = {
    init: function () {
        //for(var i in appSetting.localStorage.Data.ChatBox.Current){
        //    var item = appSetting.localStorage.Data.ChatBox.Current[i];
        //    ChatBox.Create({
        //        Title: item.Title,
        //        AvatarImg: item.AvatarImg,
        //        UserToId: item.UserToId,
        //        Id: item.Id
        //    });
        //}
    },
    Html: '\
        <div class="panel panel-chat" chat-id="{0}">\
            <div class="panel-heading">\
                <a href="#" class="chatMinimize" onclick="return false"><span>{1}</span></a>\
                <a href="#" class="chatClose" onclick="return false"><i class="glyphicon glyphicon-remove"></i></a>\
                <div class="clearFix"></div>\
            </div>\
            <div class="panel-body">\
                <div class="messageMe">\
                    <img src="http://www.bitrebels.com/wp-content/uploads/2011/02/Original-Facebook-Geek-Profile-Avatar-1.jpg" alt="" />\
                    <span>asdasdssadasdasdassssssssssssssssssssssssssssssssssssssssssdasdasd</span>\
                    <div class="clearFix"></div>\
                </div>\
                <div class="clearFix"></div>\
            </div>\
            <div class="panel-footer">\
                <textarea name="textMessage" cols="0" rows="0"></textarea>\
            </div>\
        </div>\
    ',
    List: [],
    ReloadPos: function () {
        //return
        //for (var i = 0; i < ChatBox.List.length; i++) {
        //    var item = ChatBox.List[i];
        //    var elm = $(item.elm);
        //    var left = (screen.width - 50) - ((i + 1) * (320));
        //    elm.css("left", left).css("display", "inline-table");
        //}
        for (var i = 0; i < ChatBox.List.length; i++) {
            var item = ChatBox.List[i];
            var elm = $(item.elm);
            var left = (screen.width - 50) - ((i + 1) * (320));
            elm.css("left", "calc(100% - " + (i + 1) * (320) + "px)").css("display", "inline-table");
        }
    },
    GetByChatId: function (Id) {
        return ChatBox.List.filter(function (e) {
            return e.Id == Id;
        })[0];
    },
    Create: function (options) {
        var _this = this;
        var html = ChatBox.Html.format(options.Id, options.Title);
        var root = $("#ChatBoxRoot");

        root.append(html);

        options.TypeChat = options.TypeChat || 1;
        options.elm = root.find('[chat-id="' + options.Id + '"]');
        var body = options.elm.find(".panel-body").html("");

        var imgDefault = app.config.ImgThumbnailDefault;

        var member = {};
        options.addMessage = function (User, Message) {
            if (Message.Message.Type != 1) {
                return;
            }
            var isMe = User.Id == app.User.UserId;
            var item = $('\
                <div class="message {2} start end" data-user-id="{3}">\
                    <img avatar AutoCrop src="{0}" alt="" />\
                    <span>{1}</span>\
                    <div class="clearFix"></div>\
                </div>\
            '.format(imgDefault, Message.Message.Data, isMe ? 'messageMe' : 'messageHer', User.Id));

            var last = body.find(".message:last");
            body.append(item);
            if (last.length > 0) {
                if (last.data('userId') == User.Id) {
                    item.removeClass("start");
                    last.removeClass("end");
                }
                else {
                    //body.find(".message:last").prev().removeClass("end");
                }
            }

            var temp = member[User.Id];
            if (temp == null) {
                member[User.Id] = temp = {
                    Img: '',
                    Load: function (elm) {
                        var _this = this;
                        if (_this.Img == '') {
                            try {
                                //CreateThumbnailIMG.createThumbnailFromUrl({
                                //    dataURL: getThumbTemplate.thumbnailExtension(fileExtension(User.AvatarImg), User.AvatarImg)
                                //}, options.width, options.height, options.resizeMethod, true, (function (elm) {
                                //    return function (dataUrl) {
                                //        _this.Img = dataUrl;
                                //        elm.find('img[avatar]').attr('src', dataUrl);
                                //    };
                                //})(elm), '*', function () {
                                //    this.Img = imgDefault;
                                //    elm.find('img[avatar]').attr('src', this.Img);
                                //});
                                var img = new Image();
                                img.onload = function () {
                                    _this.Img = User.AvatarImg;
                                    elm.find('img[avatar]').attr('src', _this.Img);
                                };
                                img.onerror = function () {
                                    _this.Img = imgDefault;
                                    elm.find('img[avatar]').attr('src', _this.Img);
                                }
                                img.src = User.AvatarImg;
                            } catch (e) {
                                _this.Img = imgDefault;
                            }
                        }
                        else {
                            //this.Img = imgDefault;
                            elm.find('img[avatar]').attr('src', _this.Img);
                        }
                    }
                }
            }
            temp.Load(item);

            body.animate({ scrollTop: body[0].scrollHeight }, 0);
        }

        options.elm.find('[name="textMessage"]').keyup(function (event) {
            var target = $(event.currentTarget);
            if (event.keyCode == 13 && event.shiftKey === false) {
                var message = target.val().trim();
                if (message != "") {
                    //options.addMessage({
                    //    Message: message,
                    //    isMe: true,
                    //    AvatarImg: options.AvatarImg || imgDefault
                    //});

                    AppHubConnect.Hub.Chat_SendMessage(options.Id, {
                        Message: JSON.stringify({
                            Type: options.TypeChat,
                            Data: message
                        })
                    }).then(function (data) {
                        //console.log(data)
                    });
                }
                target.val("");
                //root.find('.panel-body').animate({ height: "0" }, 500);
            }
        });

        options.elm.find(".panel-heading > .chatMinimize").click(function () {
            if ($(this).parent().parent().hasClass('mini')) {
                $(this).parent().parent().removeClass('mini').addClass('normal');

                options.elm.find('.panel-body').animate({ height: "250px" }, 500).show();

                options.elm.find('.panel-footer').animate({ height: "75px" }, 500).show();
            }
            else {
                $(this).parent().parent().removeClass('normal').addClass('mini');

                options.elm.find('.panel-body').animate({ height: "0" }, 500);

                options.elm.find('.panel-footer').animate({ height: "0" }, 500);

                setTimeout(function () {
                    options.elm.find('.panel-body').hide();
                    options.elm.find('.panel-footer').hide();
                }, 500);


            }

        });
        options.elm.find(".panel-heading > .chatClose").click(function () {
            $(this).parent().parent().remove();
            ChatBox.List = ChatBox.List.filter(function (e) { return e.Id != options.Id });

            ChatBox.ReloadPos();
            //appSetting.localStorage.Data.ChatBox.Current = appSetting.localStorage.Data.ChatBox.Current.filter(function (e) { return e.Id != options.Id });
            //appSetting.localStorage.Save();
        });

        ChatBox.List.push(options);

        ChatBox.ReloadPos();

        //appSetting.localStorage.Data.ChatBox.Current.push({
        //    Title: options.Title,
        //    AvatarImg: options.AvatarImg,
        //    UserToId: options.UserToId,
        //    Id: options.Id
        //});
        //appSetting.localStorage.Save();

        return options;
    }
}

var HubObj = {
    //https://github.com/JustMaier/angular-signalr-hub
    //This will allow same connection to be used for all Hubs
    //It also keeps connection as singleton.
    globalConnections: [],
    initNewConnection: function (options) {
        var connection = null;
        if (options && options.rootPath) {
            connection = $.hubConnection(options.rootPath, { useDefaultPath: false });
        } else {
            connection = $.hubConnection();
        }

        connection.logging = (options && options.logging ? true : false);
        return connection;
    },

    getConnection: function (options) {
        var _this = this;
        var useSharedConnection = !(options && options.useSharedConnection === false);
        if (useSharedConnection) {
            return typeof _this.globalConnections[options.rootPath] === 'undefined' ?
			_this.globalConnections[options.rootPath] = _this.initNewConnection(options) :
			_this.globalConnections[options.rootPath];
        }
        else {
            return _this.initNewConnection(options);
        }
    },

    Create: function (hubName, options) {
        var _this = this;
        var Hub = {};

        Hub.connection = HubObj.getConnection(options);
        Hub.proxy = Hub.connection.createHubProxy(hubName);

        Hub.on = function (event, fn) {
            Hub.proxy.on(event, fn);
        };
        Hub.invoke = function (method, args) {
            return Hub.proxy.invoke.apply(Hub.proxy, arguments)
        };
        Hub.disconnect = function () {
            Hub.connection.stop();
        };
        Hub.connect = function () {
            return Hub.connection.start(options.transport ? { transport: options.transport } : null);
        };

        if (options && options.listeners) {
            Object.getOwnPropertyNames(options.listeners)
			.filter(function (propName) {
			    return typeof options.listeners[propName] === 'function';
			})
		        .forEach(function (propName) {
		            Hub.on(propName, options.listeners[propName]);
		        });
        }
        if (options && options.methods) {
            //angular.forEach(, function (method) {
            //for (var i in options.methods) {
            $.each(options.methods, function (index, method) {
                //var method = options.methods[i];
                Hub[method] = function () {
                    var args = $.makeArray(arguments);
                    args.unshift(method);
                    return Hub.invoke.apply(Hub, args);
                };
            });
        }
        Hub.AddListener = function (listener, func) {
            Hub.on(listener, func);
        }
        Hub.AddMethod = function (method) {
            Hub[method] = function () {
                var args = $.makeArray(arguments);
                args.unshift(method);
                return Hub.invoke.apply(Hub, args);
            };
        }
        if (options && options.queryParams) {
            Hub.connection.qs = options.queryParams;
        }
        if (options && options.errorHandler) {
            Hub.connection.error(options.errorHandler);
        }
        //DEPRECATED
        //Allow for the user of the hub to easily implement actions upon disconnected.
        //e.g. : Laptop/PC sleep and reopen, one might want to automatically reconnect 
        //by using the disconnected event on the connection as the starting point.
        if (options && options.hubDisconnected) {
            Hub.connection.disconnected(options.hubDisconnected);
        }
        if (options && options.stateChanged) {
            Hub.connection.stateChanged(options.stateChanged);
        }

        //Adding additional property of promise allows to access it in rest of the application.
        Hub.promise = Hub.connect();
        return Hub;
    }
};

var ScrollByParams = function (elmScrollName, elmParent, elmName, animate_) {
    var elmScrollName = $(elmScrollName);
    var table = $(elmParent);
    var row = $(elmName);
    if (row.length > 1) {
        row = row.last();
    }
    var divScrollTop = elmScrollName.offset().top;
    var tableTop = table.offset().top;
    var rowTop = row.offset().top;
    var scroll = Math.abs(tableTop - rowTop);
    elmScrollName.scrollTop(scroll);
    elmScrollName.scrollLeft(0);
    var animate = "flash animated";
    if (animate_) {
        animate = animate_;
    }
    // var animate = "fadeIn animated"
    row.addClass(animate);
    setTimeout(function () {
        row.removeClass(animate);
    }, 1000);
}

var fileExtension = function (filename) {
    return "." + filename.substr((filename.lastIndexOf('.') + 1));
}
var fileName = function (filename) {
    return filename.replace(/^.*[\\\/]/, '');
}
var fileNameNotExtentsion = function (filename) {
    return filename.replace(/.[^.]+$/, '');
}

var SortArrayObject = {
    defaultCompare: function (row1, row2, field) {
        var x = row1[field]
        var y = row2[field]

        if (x === y) return 0;
        return x > y ? 1 : -1;
    }
}

var setFormData = function (data, form) {
    form = $(form);
    for (var key in data) {
        var value = data[key] != null ? data[key] : '';
        var elms = form.find('[name="' + key + '"]');
        elms.each(function (index, elm) {
            elm = $(elm);
            var tag = elm.prop("tagName");
            if (tag == "INPUT") {
                if (["checkbox", "radio"].indexOf(elm.attr("type")) != -1) {
                    elm.attr('checked', value);
                }
                else {
                    elm.val(value);
                }
            }
            else if (["TEXTAREA"].indexOf(tag) != -1) {
                elm.val(value);
            }
            else if (["SELECT", ].indexOf(tag) != -1) {
                if (value.constructor == Boolean) {
                    elm.find('[value="' + value + '"]').attr('selected', true);
                }
                else {
                    elm.val(value);
                }
                if (elm.data('select2') != null) {
                    elm.trigger('change');
                }
            }
            else if (["LABEL", "PRE"].indexOf(tag) != -1) {
                elm.text(value);
            }
        });
    }
}

var setObjectToAttributeData = function (elm, data) {
    elm = $(elm);
    for (var i in data) {
        elm.data(i, data[i]);
    }
}

var convertUTCDateToLocalDate = function (date) {
    date = new Date(date);
    //return date;
    var newDate = new Date(date.getTime() - date.getTimezoneOffset() * 60 * 1000);

    //var offset = date.getTimezoneOffset() / 60;
    //var hours = date.getHours();

    //newDate.setHours(hours - offset);

    return newDate;
}
var convertLocalDateToUTCDate = function (date) {
    date = new Date(date);
    //return date;
    var newDate = new Date(date.getTime() + date.getTimezoneOffset() * 60 * 1000);

    //var offset = date.getTimezoneOffset() / 60;
    //var hours = date.getHours();

    //newDate.setHours(hours - offset);

    return newDate;
}

var isHtml = function (str) {
    return /<[a-z][\s\S]*>/i.test(str);
}

var SaveFileAs = function (uri, filename) {
    var link = document.createElement('a');
    if (typeof link.download === 'string') {
        link.href = uri;
        link.download = filename;

        //Firefox requires the link to be in the body
        document.body.appendChild(link);

        //simulate click
        link.click();

        //remove the link when done
        document.body.removeChild(link);
    } else {
        window.open(uri);
    }
}

var convertByteShow = function (bytes) {
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes == 0) return '0 Byte';
    var i = parseFloat(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
};

var ArrayExtend_Index = function (_this, elm, isEqual, isIgnorecase) {
    isEqual = isEqual == null ? true : isEqual;
    isIgnorecase = isIgnorecase == null ? false : isIgnorecase;
    for (var i = 0; i < _this.length; i++) {
        if (elm === _this[i] || (elm == _this[i] && !isEqual) || (isIgnorecase && (_this[i] + "").toUpperCase() == (elm + "").toUpperCase())) {
            return i;
        }
    }
    return -1;
}
var dropZoneObj = function (options) {
    var countFileID = 0;
    //options = options || {};
    //options.UploadTo = options.UploadTo || "/froala/Upload2";
    //options.Delete = options.Delete || "/froala/DeleteResource";
    //options.maxSize = options.maxSize || 10;
    //options.forder = options.forder || "";
    //options.element = options.element || "#AttachFile #dZUpload";
    //options.elementView = options.elementView || "";
    //options.changeName = options.changeName || false;
    //options.changeTitle = options.changeTitle || false;
    //options.extensions = options.extensions || -1;
    //options.button = options.button || {};
    //options.button.view = options.button.view != null ? options.button.view : true;
    //options.button.download = options.button.download != null ? options.button.download : true;
    //options.button.remove = options.button.download != null ? options.button.remove : true;

    options = $.extend(true, {
        UploadTo: "Upload/Upload",
        Delete: "Upload/Delete",
        maxSize: 10,
        //forder: "",
        element: "#AttachFile #dZUpload",
        elementView: "",
        changeName: false,
        changeTitle: false,
        extensions: -1,
        //extensions: [
        //    {
        //        extension: ".jpg",
        //        maxSize: 1,
        //        maxCount: 2
        //    }
        //],
        autoUpload: {
            auto: true,
            uploadAll: true,
            //func: function () {
            //    _return.dropzone.processFiles();
            //}
        },
        dropZoneOption: {
            maxFiles: 50,
            uploadMultiple: false,
            //autoProcessQueue: false,
            //autoQueue: false,
            dictFileTooBig: "Tệp quá lớn ({{filesize}}MiB). Kích thước tệp tối đa: {{maxFilesize}}MiB."
        },
        button: {
            view: true,
            download: true,
            remove: true,
        },
        onUpload: function () {
        },
        onUploaded: function () {

        }
    }, options);

    var maxSize = options.maxSize;
    var forder = options.forder;
    var upload_extension = options.extensions;
    //var upload_extension = [
    //    {
    //        extension: ".jpg",
    //        maxSize: 1,
    //        maxCount: 2
    //    }
    //];

    var thumbnailDefault = options.thumbnailDefault;

    var processSuccessFile = function (file, data) {
        var _fileExtension = "." + file.name.substr((file.name.lastIndexOf('.') + 1));
        var elem = $(file.previewElement);
        if (options.button.download)
            elem.find(".button-group-custom").append($(genButtonDownload(data.FileLink + "", file.name)));
        if (options.button.view)
            elem.find(".button-group-custom").append($(genButtonView(data.FileLink)));
        if (!options.button.remove) {
            elem.find(".button-group-custom #bt-remove").hide();
        }

        if (options.changeName == true) {
            elem.find(".divFileName").removeClass("hidden");
        }
        chageNameProcess(elem, fileNameNotExtentsion(file.name));

        if (options.changeTitle == true) {
            elem.find(".divTitle").removeClass("hidden");
        }
        chageTitleProcess(elem, fileNameNotExtentsion(file.name));

        elem.find(".button-group-custom").append();
        file.element = elem;
        file.previewElement.classList.add("dz-success");
        file.link = data.FileLink;
        //file.name = fileNameNotExtentsion(data.file);
        countFileID++;
        file.add_at = countFileID;
        _return.files.push(file);

        options.onUploaded();
    }

    Dropzone.autoDiscover = false;
    var _return = {
        dropzone: null,
        uploadAllFile: function () { },
        allQueueComplete: function () { },
        files: [],
        loadFiles: function (files) {
            if (typeof (files) == "string") {
                try {
                    files = JSON.parse(files);
                }
                catch (ex) {
                    files = [];
                }
            }
            _return.files = files;
            //_return.dropzone.removeAllFiles(true);
            for (var i in _return.dropzone.files) {
                _return.dropzone.files[i].previewElement.remove();
            }
            for (var i in _return.files) {
                var item = _return.files[i];
                countFileID++;
                item.add_at = countFileID;
                var mockFile = {
                    name: item.name,
                    size: item.size,
                    // index: eval(item.index),
                    add_at: item.add_at,
                    link: item.link
                };
                _return.dropzone.options.addedfile.call(_return.dropzone, mockFile);
                //_return.dropzone.options.thumbnail.call(_return.dropzone, mockFile, item.link);
                //mockFile.dataURL = 'https://s2.postimg.org/l91omdlk7/MG_9726_FILEminimizer.jpg';

                _return.dropzone.createThumbnailFromUrl({
                    dataURL: getThumbTemplate.thumbnailExtension(fileExtension(item.link), item.thumb || item.link)
                }, _return.dropzone.options.thumbnailWidth, _return.dropzone.options.thumbnailHeight, 'crop', true, (function (_this) {
                    return function (dataUrl) {
                        _return.dropzone.options.thumbnail.call(_return.dropzone, _this, dataUrl);
                    };
                })(mockFile), '*');

                _return.dropzone.files.push(mockFile);


                mockFile.previewElement.classList.add("dz-success");
                mockFile.previewElement.classList.add("dz-complete");
                mockFile.previewElement.classList.add("dz-processing");

                var elem = $(mockFile.previewElement);
                item.element = elem;
                if (options.button.download)
                    elem.find(".button-group-custom").append($(genButtonDownload(item.link, item.name)));
                if (options.button.view)
                    elem.find(".button-group-custom").append($(genButtonView(item.link)));

                if (!options.button.remove) {
                    elem.find(".button-group-custom #bt-remove").hide();
                }

                if (options.changeName == true) {
                    elem.find(".divFileName").removeClass("hidden");
                }
                chageNameProcess(elem, fileNameNotExtentsion(mockFile.name));

                if (options.changeTitle == true) {
                    elem.find(".divTitle").removeClass("hidden");
                }
                chageTitleProcess(elem, item.title || fileNameNotExtentsion(mockFile.name));

                if (upload_extension != -1) {
                    var _fileExtension = "." + item.name.substr((item.name.lastIndexOf('.') + 1)).toLowerCase();
                    var option = upload_extension.filter(function (e) { return e.extension.toLowerCase() == _fileExtension.toLowerCase() })[0];
                    if (option != null) {
                        option.count = option.count || 0;
                        option.count++;
                    }
                }
            }
        },
        getFiles: function () {
            return (_return.files || []).map(function (item) {
                //return _return.dropzone.files.map(function (item) {
                var e = {
                    // index: i,
                    //nameChange: $(item.element).find(".fileName").val(),
                    title: $(item.element).find(".divTitle .title").val(),
                    name: item.name,
                    size: item.size,
                    link: item.link || (app.config.s3.remoteBucket + "/" + item.postData)
                };
                e.name = $(item.element).find(".fileName").val() + "" + fileExtension(e.link);
                return e;
            });
        }
    }
    var genButtonDownload = function (link, filename) {
        return '\
<a href="javascript:undefined;" class="btn" id="bt-down" style="margin:0px; padding: 5px; cursor:pointer;" onclick="event.stopPropagation(); SaveFileAs(\'' + link + '\', \'' + (filename || 'file') + '\');" title="Tải" data-dz-download>\
	<i class="fa fa-download"></i>\
</a>\
        ';
    }
    var genButtonView = function (link) {
        return '\
<a class="btn" id="bt-view" style="margin:0px; padding: 5px; cursor:pointer;" target="_blank" href="' + link + '" title="Xem" data-dz-view>\
	<i class="fa fa-eye"></i>\
</a>\
        ';
    }
    var genButtonRemove = function (link) {
        //<a class="dz-remove" href="javascript:undefined;" data-dz-remove="">Xóa</a>
        return /*Dropzone.createElement(*/'\
<a class="btn" id="bt-remove" style="margin:0px; padding: 5px; cursor:pointer;" class="dz-remove" href="javascript:undefined;" title="Xóa" data-dz-remove>\
	<i class="fa fa-trash"></i>\
</a>\
        '/*)*/;
    }
    var chageNameProcess = function (elem, name) {
        var textFileName = elem.find(".fileName");
        textFileName.val((name));
    }
    var chageTitleProcess = function (elem, name) {
        var textFileName = elem.find(".divTitle .title");
        textFileName.val((name));
    }
    var dropzoneOption = $.extend(true, {
        //addRemoveLinks: true,
        //acceptedFiles: upload_extension == -1 ? "*" : upload_extension.map(function (e) { return e.extension }).join(","),
        maxFilesize: maxSize, // unit mb
        addRemoveLinks: false,
        dictRemoveFileConfirmation: "remove",
        //previewsContainer: options.elementView,
        url: options.UploadTo,
        previewTemplate: '\
<div class="dz-preview dz-image-preview">\
	<div class="dz-image">\
		<img data-dz-thumbnail="" alt="" src="">\
	</div>\
	<div class="dz-details">\
		<div class="dz-size">\
			<span data-dz-size="">\
				<strong>0.1</strong> MB\
			</span>\
		</div>\
		<div class="dz-filename">\
			<span data-dz-name=""></span>\
		</div>\
	</div>\
	<div class="dz-progress">\
		<span class="dz-upload" data-dz-uploadprogress=""/>\
	</div>\
	<div class="dz-error-message">\
		<span data-dz-errormessage=""/>\
	</div>\
	<div class="dz-success-mark">\
		<svg width="54px" height="54px" viewBox="0 0 54 54" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns">\
			<title>Check</title>\
			<defs/>\
			<g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" sketch:type="MSPage">\
				<path d="M23.5,31.8431458 L17.5852419,25.9283877 C16.0248253,24.3679711 13.4910294,24.366835 11.9289322,25.9289322 C10.3700136,27.4878508 10.3665912,30.0234455 11.9283877,31.5852419 L20.4147581,40.0716123 C20.5133999,40.1702541 20.6159315,40.2626649 20.7218615,40.3488435 C22.2835669,41.8725651 24.794234,41.8626202 26.3461564,40.3106978 L43.3106978,23.3461564 C44.8771021,21.7797521 44.8758057,19.2483887 43.3137085,17.6862915 C41.7547899,16.1273729 39.2176035,16.1255422 37.6538436,17.6893022 L23.5,31.8431458 Z M27,53 C41.3594035,53 53,41.3594035 53,27 C53,12.6405965 41.3594035,1 27,1 C12.6405965,1 1,12.6405965 1,27 C1,41.3594035 12.6405965,53 27,53 Z" id="Oval-2" stroke-opacity="0.198794158" stroke="#747474" fill-opacity="0.816519475" fill="#FFFFFF" sketch:type="MSShapeGroup"/>\
			</g>\
		</svg>\
	</div>\
	<div class="dz-error-mark">\
		<svg width="54px" height="54px" viewBox="0 0 54 54" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns">\
			<title>Error</title>\
			<defs/>\
			<g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" sketch:type="MSPage">\
				<g id="Check-+-Oval-2" sketch:type="MSLayerGroup" stroke="#747474" stroke-opacity="0.198794158" fill="#FFFFFF" fill-opacity="0.816519475">\
					<path d="M32.6568542,29 L38.3106978,23.3461564 C39.8771021,21.7797521 39.8758057,19.2483887 38.3137085,17.6862915 C36.7547899,16.1273729 34.2176035,16.1255422 32.6538436,17.6893022 L27,23.3431458 L21.3461564,17.6893022 C19.7823965,16.1255422 17.2452101,16.1273729 15.6862915,17.6862915 C14.1241943,19.2483887 14.1228979,21.7797521 15.6893022,23.3461564 L21.3431458,29 L15.6893022,34.6538436 C14.1228979,36.2202479 14.1241943,38.7516113 15.6862915,40.3137085 C17.2452101,41.8726271 19.7823965,41.8744578 21.3461564,40.3106978 L27,34.6568542 L32.6538436,40.3106978 C34.2176035,41.8744578 36.7547899,41.8726271 38.3137085,40.3137085 C39.8758057,38.7516113 39.8771021,36.2202479 38.3106978,34.6538436 L32.6568542,29 Z M27,53 C41.3594035,53 53,41.3594035 53,27 C53,12.6405965 41.3594035,1 27,1 C12.6405965,1 1,12.6405965 1,27 C1,41.3594035 12.6405965,53 27,53 Z" id="Oval-2" sketch:type="MSShapeGroup"/>\
				</g>\
			</g>\
		</svg>\
	</div>\
    <div class="button-group-custom text-right">\
    	<a class="btn" id="bt-remove" style="margin:0px; padding: 5px; cursor:pointer;" class="dz-remove" href="javascript:undefined;" title="Xóa" data-dz-remove>\
	        <i class="fa fa-trash"></i>\
        </a>\
    </div>\
    <div class="divFileName hidden">\
        <div class="form-group">\
            <label>Tên file</label>\
            <input type="text" class="form-control fileName" onclick="this.select()"/>\
        </div>\
    </div>\
    <div class="divTitle hidden">\
        <div class="form-group">\
            <label>Tiêu đề</label>\
            <input type="text" class="form-control title" onclick="this.select()"/>\
        </div>\
    </div>\
</div>\
        ',
        accept: function (file, done) {
            var _fileExtension = "." + file.name.substr((file.name.lastIndexOf('.') + 1)).toLowerCase();
            if (upload_extension == -1) {
                done();
                return;
            }
            var option = upload_extension.filter(function (e) { return e.extension.toLowerCase() == _fileExtension.toLowerCase() })[0];
            if (option == null) {
                done("1");//extension not support
            }
            else {
                option.count = option.count || 0;
                option.maxCount = option.maxCount || 10000000000000;
                option.maxSize = option.maxSize || 1024;
                var maxSizeValue = (1024 * 1024 * option.maxSize);
                if (file.size > maxSizeValue) {
                    done("2");//max size
                }
                else if (option.count + 1 > option.maxCount) {
                    done("3");//max count
                }
                else {
                    option.count++;

                    done();
                }
            }

        },
        error: function (file, response) {
            var _fileExtension = "." + file.name.substr((file.name.lastIndexOf('.') + 1)).toLowerCase();
            if (upload_extension != -1) {
                var option = upload_extension.filter(function (e) { return e.extension.toLowerCase() == _fileExtension.toLowerCase() })[0];
                var mess = "Error";
                if (upload_extension == -1) {
                    mess = response;
                    return;
                }
                if (option == null) {
                    mess = "File không hỗ trợ."//extension not support
                }
                else {
                    option.count = option.count || 0;
                    option.maxCount = option.maxCount || 10000000000000;
                    option.maxSize = option.maxSize || 1024;
                    var maxSizeValue = (1024 * 1024 * option.maxSize);
                    if (file.size > maxSizeValue) {
                        mess = "Kích thước tối đa của file " + option.maxSize + "MiB.";
                    }
                    else if (option.count + 1 > option.maxCount) {
                        mess = "Upload tối đa " + option.maxCount + " file.";
                    }
                    else {
                        mess = response;
                    }
                }
            }
            else {
                mess = response;
            }

            $(file.previewElement).remove();
            file.previewElement.classList.add("dz-error");
            Notification.Error(mess);
        },
        sending: function (file, xhr, formData) {
            //formData.append("folder", forder);

            options.onUpload();
        },
        successmultiple: function (files, responseText, e) {
            console.log(arguments)
        },
        success: function (file, response) {
            if (!file.accepted && !options.autoUpload.uploadAll) {
                return
            }
            //response = convertObject(response, true);
            if (response.Success) {
                var data = response.Data[0];
                processSuccessFile(file, data);
            }
            else {
                var elem = $(file.previewElement);
                elem.find('div.dz-error-message [data-dz-errormessage]').text(response.Message);
                file.previewElement.classList.add("dz-error");
                elem.find(".button-group-custom #bt-remove").hide();

                if (upload_extension != -1) {
                    var option = upload_extension.filter(function (e) { return e.extension.toLowerCase() == _fileExtension.toLowerCase() })[0];
                    if (option != null) {
                        option.count--;
                    }
                }
            }
        },
        removedfile: function (file) {
            //debugger
            var _fileExtension = "." + file.name.substr((file.name.lastIndexOf('.') + 1));
            var option = null;
            if (upload_extension != -1) {
                option = upload_extension.filter(function (e) { return e.extension.toLowerCase() == _fileExtension.toLowerCase() })[0];
            }

            var link = file.link;
            _AjaxAPI.post(options.Delete, {
                src: link
            }, function () {
                //_return.files = _return.dropzone.files;
                _return.files = _return.files.filter(function (e) {
                    // return e.index != file.index
                    return e.add_at != file.add_at
                });

                //_return.dropzone.files = _return.files;
                //$(_return.dropzone.element).toggleClass("dz-started", _return.files.length > 0);

                if (option) {
                    option.count--;
                }
            }, function () {
            });
            var _ref;
            if ((_ref = file.previewElement) != null) {
                var temp = _ref.parentNode.removeChild(file.previewElement);
                return temp;
            }
            else {
                return void 0;
            }
        },
        //thumbnail: function (file, dataUrl) {
        //    console.log(file)
        //}
    }, options.dropZoneOption);
    if (upload_extension != -1) {
        dropzoneOption.acceptedFiles = upload_extension.map(function (e) { return e.extension }).join(",")
    }
    if (options.elementView != "") {
        dropzoneOption.previewsContainer = options.elementView;
    }

    if (!options.autoUpload.auto) {
        dropzoneOption.autoProcessQueue = false;
        dropzoneOption.autoQueue = false;
        //dropzoneOption.uploadMultiple = true;
    }

    _return.dropzone = new Dropzone(options.element, dropzoneOption);

    _return.dropzone.on('addedfile', function (file) {
        if (this.options.createImageThumbnails && !file.type.match(/image.*/)) {
            _return.dropzone.createThumbnailFromUrl({
                dataURL: getThumbTemplate.thumbnailExtension(fileExtension(file.name), "")
            }, _return.dropzone.options.thumbnailWidth, _return.dropzone.options.thumbnailHeight, 'crop', true, (function (_this) {
                return function (dataUrl) {
                    _return.dropzone.options.thumbnail.call(_return.dropzone, _this, dataUrl);
                };
            })(file), '*');

        }
    });
    if (!options.autoUpload.auto) {
        _return.uploadAllFile = function () {
            //_return.dropzone.enqueueFiles(_return.dropzone.getFilesWithStatus(Dropzone.ADDED));
            //_return.dropzone.processQueue();
            _return.dropzone.getFilesWithStatus(Dropzone.ADDED).map(function (e) {
                _return.dropzone.processFile(e);
            });
            //_return.dropzone.processFiles(_return.dropzone.getFilesWithStatus(Dropzone.ADDED))
        };
        _return.dropzone.on('queuecomplete', function () {
            _return.allQueueComplete();
        });
    }

    Dropzone.confirm = function (question, accepted, rejected) {
        modal.DeleteComfirm({
            callback: function () {
                accepted();
            }
        });
    };

    return _return;
}

var BlockUI = {
    element: {
        func: function (elm) {
            $(elm).block({
                message: '<div class="semibold"><span class="ft-refresh-cw icon-spin text-left"></span>&nbsp; Loading ...</div>',
                fadeIn: 1000,
                fadeOut: 1000,
                overlayCSS: {
                    backgroundColor: '#fff',
                    opacity: 0.8,
                    cursor: 'pointer',
                },
                css: {
                    border: 0,
                    padding: '10px 15px',
                    color: '#fff',
                    width: 'auto',
                    backgroundColor: '#333',
                },
            });
        },
        destroy: function (elm) {
            $(elm).unblock();
        }
    }
}

var getThumbTemplate = {
    thumbnailDefault: [
            {
                Ext: "7z",
                Img: '/Assets/images/icon/7zip.png'
            },
            {
                Ext: "avi",
                Img: '/Assets/images/icon/avi.png'
            },
            {
                Ext: "bmp",
                Img: '/Assets/images/icon/bmp.png'
            },
            {
                Ext: "cs",
                Img: '/Assets/images/icon/cShrp.png'
            },
            {
                Ext: "csv",
                Img: '/Assets/images/icon/csv.png'
            },
            {
                Ext: "dll",
                Img: '/Assets/images/icon/dll.png'
            },
            {
                Ext: ["doc", "docx"],
                Img: '/Assets/images/icon/doc.png'
            },
            {
                Ext: "exe",
                Img: '/Assets/images/icon/exe.png'
            },
            {
                Ext: "gif",
                Img: '/Assets/images/icon/gif.png'
            },
            {
                Ext: ["htm", "html"],
                Img: '/Assets/images/icon/html.png'
            },
            {
                Ext: ["jpg", "jpeg"],
                Img: '/Assets/images/icon/html.png'
            },
            {
                Ext: "js",
                Img: '/Assets/images/icon/js.png'
            },
            {
                Ext: "json",
                Img: '/Assets/images/icon/json.png'
            },
            {
                Ext: "mkv",
                Img: '/Assets/images/icon/mkv.png'
            },
            {
                Ext: "mov",
                Img: '/Assets/images/icon/mov.png'
            },
            {
                Ext: "mp3",
                Img: '/Assets/images/icon/mp3.png'
            },
            {
                Ext: "mp4",
                Img: '/Assets/images/icon/mp3.png'
            },
            {
                Ext: "pdf",
                Img: '/Assets/images/icon/pdf.png'
            },
            {
                Ext: "psd",
                Img: '/Assets/images/icon/psd.png'
            },
            {
                Ext: "png",
                Img: '/Assets/images/icon/png.png'
            },
            {
                Ext: "ppt",
                Img: '/Assets/images/icon/ppt.png'
            },
            {
                Ext: "rar",
                Img: '/Assets/images/icon/rar.png'
            },
            {
                Ext: "sql",
                Img: '/Assets/images/icon/sql.png'
            },
            {
                Ext: "svg",
                Img: '/Assets/images/icon/svg.png'
            },
            {
                Ext: "txt",
                Img: '/Assets/images/icon/txt.png'
            },
            {
                Ext: ["xls", "xlsx"],
                Img: '/Assets/images/icon/xls.png'
            },
            {
                Ext: "xml",
                Img: '/Assets/images/icon/xml.png'
            },
            {
                Ext: "config",
                Img: '/Assets/images/icon/config.png'
            },
            {
                Ext: "zip",
                Img: '/Assets/images/icon/zip.png'
            },
    ],
    thumbnailExtension: function (ext, fileLink) {

        var thumbnailDefault = this.thumbnailDefault.concat([{
            Ext: "*",
            Img: '/Assets/images/icon/file.png'
        }]);

        ext = ext.replace('.', '');
        var search = thumbnailDefault.filter(function (e) {
            e.Ext = !$.isArray(e.Ext) ? [e.Ext] : e.Ext;
            return ArrayExtend_Index(e.Ext, ext, false, true) != -1 || e.Ext[0] == "*";
        })[0];
        if (ArrayExtend_Index(['jpg', 'jpeg', 'png'], ext, false, true) != -1) {
            return fileLink;
        }
        else if (search != null) {
            return search.Img;
        }
    }
};

var CreateThumbnailIMG = {
    detectVerticalSquash: function (img) {
        var alpha, canvas, ctx, data, ey, ih, iw, py, ratio, sy;
        iw = img.naturalWidth;
        ih = img.naturalHeight;
        canvas = document.createElement("canvas");
        canvas.width = 1;
        canvas.height = ih;
        ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        data = ctx.getImageData(1, 0, 1, ih).data;
        sy = 0;
        ey = ih;
        py = ih;
        while (py > sy) {
            alpha = data[(py - 1) * 4 + 3];
            if (alpha === 0) {
                ey = py;
            } else {
                sy = py;
            }
            py = (ey + sy) >> 1;
        }
        ratio = py / ih;
        if (ratio === 0) {
            return 1;
        } else {
            return ratio;
        }
    },
    drawImageIOSFix: function (ctx, img, sx, sy, sw, sh, dx, dy, dw, dh) {
        var vertSquashRatio;
        vertSquashRatio = this.detectVerticalSquash(img);
        return ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh / vertSquashRatio);
    },
    resize: function (file, width, height, resizeMethod) {
        var info,
		srcRatio,
		trgRatio;
        info = {
            srcX: 0,
            srcY: 0,
            srcWidth: file.width,
            srcHeight: file.height
        };
        srcRatio = file.width / file.height;
        if ((width == null) && (height == null)) {
            width = info.srcWidth;
            height = info.srcHeight;
        } else if (width == null) {
            width = height * srcRatio;
        } else if (height == null) {
            height = width / srcRatio;
        }
        width = Math.min(width, info.srcWidth);
        height = Math.min(height, info.srcHeight);
        trgRatio = width / height;
        if (info.srcWidth > width || info.srcHeight > height) {
            if (resizeMethod === 'crop') {
                if (srcRatio > trgRatio) {
                    info.srcHeight = file.height;
                    info.srcWidth = info.srcHeight * trgRatio;
                } else {
                    info.srcWidth = file.width;
                    info.srcHeight = info.srcWidth / trgRatio;
                }
            } else if (resizeMethod === 'contain') {
                if (srcRatio > trgRatio) {
                    height = width / srcRatio;
                } else {
                    width = height * srcRatio;
                }
            } else {
                throw new Error("Unknown resizeMethod '" + resizeMethod + "'");
            }
        }
        info.srcX = (file.width - info.srcWidth) / 2;
        info.srcY = (file.height - info.srcHeight) / 2;
        info.trgWidth = width;
        info.trgHeight = height;
        return info;
    },
    createThumbnailFromUrl: function (file, width, height, resizeMethod, fixOrientation, callback, crossOrigin, error) {
        var img;
        img = document.createElement("img");
        if (crossOrigin) {
            img.crossOrigin = crossOrigin;
        }
        img.onload = (function (_this) {
            return function () {
                var loadExif;
                loadExif = function (callback) {
                    return callback(1);
                };
                if ((typeof EXIF !== "undefined" && EXIF !== null) && fixOrientation) {
                    loadExif = function (callback) {
                        return EXIF.getData(img, function () {
                            return callback(EXIF.getTag(this, 'Orientation'));
                        });
                    };
                }
                return loadExif(function (orientation) {
                    var canvas,
					ctx,
					ref,
					ref1,
					ref2,
					ref3,
					resizeInfo,
					thumbnail;
                    file.width = img.width;
                    file.height = img.height;
                    resizeInfo = _this.resize.call(_this, file, width, height, resizeMethod);
                    canvas = document.createElement("canvas");
                    ctx = canvas.getContext("2d");
                    canvas.width = resizeInfo.trgWidth;
                    canvas.height = resizeInfo.trgHeight;
                    if (orientation > 4) {
                        canvas.width = resizeInfo.trgHeight;
                        canvas.height = resizeInfo.trgWidth;
                    }
                    switch (orientation) {
                        case 2:
                            ctx.translate(canvas.width, 0);
                            ctx.scale(-1, 1);
                            break;
                        case 3:
                            ctx.translate(canvas.width, canvas.height);
                            ctx.rotate(Math.PI);
                            break;
                        case 4:
                            ctx.translate(0, canvas.height);
                            ctx.scale(1, -1);
                            break;
                        case 5:
                            ctx.rotate(0.5 * Math.PI);
                            ctx.scale(1, -1);
                            break;
                        case 6:
                            ctx.rotate(0.5 * Math.PI);
                            ctx.translate(0, -canvas.height);
                            break;
                        case 7:
                            ctx.rotate(0.5 * Math.PI);
                            ctx.translate(canvas.width, -canvas.height);
                            ctx.scale(-1, 1);
                            break;
                        case 8:
                            ctx.rotate(-0.5 * Math.PI);
                            ctx.translate(-canvas.width, 0);
                    }
                    _this.drawImageIOSFix(ctx, img, (ref = resizeInfo.srcX) != null ? ref : 0, (ref1 = resizeInfo.srcY) != null ? ref1 : 0, resizeInfo.srcWidth, resizeInfo.srcHeight, (ref2 = resizeInfo.trgX) != null ? ref2 : 0, (ref3 = resizeInfo.trgY) != null ? ref3 : 0, resizeInfo.trgWidth, resizeInfo.trgHeight);
                    thumbnail = canvas.toDataURL("image/png");
                    if (callback != null) {
                        return callback(thumbnail, canvas);
                    }
                });
            };
        })(this);
        if (callback != null) {
            img.onerror = error;
        }
        return img.src = file.dataURL;
    }
}

var getThumbImg = function (url) {
    url = url || '';
    if (url == '')
        return app.config.ImgThumbnailDefault;
    var extension = fileExtension(url);
    var name = fileNameNotExtentsion(url);
    return name + '_thumbnail' + extension;
}
var getSmallImg = function (url) {
    url = url || '';
    if (url == '')
        return app.config.ImgThumbnailDefault;
    var extension = fileExtension(url);
    var name = fileNameNotExtentsion(url);
    return name + '_small' + extension;
}

var tool_ren_image_unstyle = function (options) {
    options = $.extend(true, {
        col_list: [],
        col: 5,
        element: "",
        links: [],
        isRender: true,
        col_list: [],
    }, options);

    var col_height = [];
    for (var i = 0; i < options.col; i++) {
        col_height.push(0);
    }

    var element_parent = $(options.element);
    // element_parent.html("");
    var width_parent = element_parent.width();
    var col_width = width_parent / col_height.length;
    var img_loaded = new Array(options.links.length);
    var link_loaded = new Array(options.links.length);
    options.col_list = new Array(options.col);

    if (options.links.length > 0 && options.links[0].constructor == String)
        options.links = options.links.map(function (e) {
            return {
                link: e,
                thumb: e,
                fileName: fileName(fileNameNotExtentsion(e)),
                extension: fileExtension(e)
            }
        });

    var progress_show_image_item = function (obj) {
        var indexMin = col_height.reduce((iMax, x, i, arr) => x < arr[iMax] ? i : iMax, 0);
        var img_height = 0;
        var col_width = width_parent / col_height.length;
        if (col_width > obj.SIZE.WIDTH) {
            img_height = obj.SIZE.HEIGHT;
        }
        else {
            img_height = obj.SIZE.HEIGHT * (col_width / obj.SIZE.WIDTH);
        }
        col_height[indexMin] += img_height;

        options.col_list[indexMin] = options.col_list[indexMin] || [];
        options.col_list[indexMin].push(obj);
    }
    var progress_show_image = function () {
        if (options.isRender) {
            element_parent.html("");
        }
        for (var index = 0; index < img_loaded.length; index++) {
            var img = img_loaded[index];
            if (img == null) {
                continue;
            }

            var indexMin = col_height.reduce((iMax, x, i, arr) => x < arr[iMax] ? i : iMax, 0);
            var img_height = 0;

            var width_parent = element_parent.width();
            var col_width = width_parent / col_height.length;
            if (col_width > img.width) {
                img_height = img.height;
            }
            else {
                img_height = img.height * (col_width / img.width);
            }
            if (img_height == 0) {
            }
            col_height[indexMin] += img_height;

            var link = img;

            var linkObj = link_loaded[index];

            if (options.item_get) {
                link = options.item_get(link_loaded[index]);
            }
            else {
                link = linkObj.link;
            }

            options.col_list[indexMin] = options.col_list[indexMin] || [];
            options.col_list[indexMin].push(link_loaded[index]);

            if (options.isRender) {
                var col_element = element_parent.find(".col" + indexMin);
                if (col_element.length == 0) {
                    element_parent.append("<div class='col col" + indexMin + "' style='float: left; width: " + (100 / col_height.length) + "%'></div>");
                }

                element_parent.find(".col" + indexMin).append("\
                <div class='thumbnail img_group uncheck' style='margin: 2px; display: inline-block;'>\
                    <img style='width: 100%' src='" + linkObj.thumb + "' data-src='" + linkObj.link + "' class='image-manage' />\
                    <i class='fa fa-check success choose_img' aria-hidden='true'></i>\
                </div>");
            }
        }
        if (options.done) {
            options.done(options.col_list);
        }
    }
    var count_loaded = 0;
    for (var index = 0; index < options.links.length; index++) {
        var linkObj = options.links[index];

        if (options.item_get) {
            linkObj.link = options.item_get(linkObj.link);
        }
        //console.log(link);
        // progress_show_image_item(options.links[index]);

        var img = new Image();

        img.obj = options.links[index];

        var processImgLoaded = function (img) {
            count_loaded++;
            if (count_loaded == options.links.length) {
                setTimeout(function () {
                    progress_show_image()
                }, 300);
            }
        }
        img.src = linkObj.thumb;
        img.index = index;
        img.onerror = function () {
            processImgLoaded();
        };
        img.onload = function () {
            var _this = this;
            setTimeout(function () {
                link_loaded[_this.index] = _this.obj;
                img_loaded[_this.index] = _this;
                _this.obj["SIZE"] = {
                    WIDTH: _this.width,
                    HEIGHT: _this.height
                }
                processImgLoaded();
            }, 50);
        }
    }
    options.done(options.col_list);
}

var GenPaging = {
    Gen: function (options) {
        options = $.extend(true, {
            Page: 1,
            TotalPage: 10,
            PageShow: 5,
            TxtNext: '›',
            TxtPrev: '‹',
            TxtLast: '»',
            TxtFirst: '«',
            isNext: true,
            isPrev: true,
            isLast: true,
            isFirst: true,
            elm: '',
            Url: '',
            query: '',
            callback: null
        }, options);

        options.elm = $(options.elm);
        options.elm.empty();
        var load = function () {
            if (options.TotalPage == 1) {
                options.elm.hide();
            }
            if (options.PageShow % 2 == 0) {
                options.PageShow++;
            }

            var startPage = options.Page - (options.PageShow - 1) / 2;
            var endPage = options.Page + (options.PageShow - 1) / 2;

            if (options.PageShow > options.TotalPage) {
                startPage = 1;
                endPage = options.TotalPage;
            }
            if (startPage <= 1) {
                startPage = 1;
                endPage = 1 + options.PageShow - 1;
            }
            if (endPage >= options.TotalPage) {
                endPage = options.TotalPage;
                startPage = options.TotalPage - options.PageShow + 1;
            }

            if (options.Page <= 0) {
                options.Page = 1;
            }

            if (options.Page >= options.TotalPage) {
                options.Page = options.TotalPage;
            }

            options.elm.empty().html('');

            if (options.isFirst) {
                var url = options.Url + '?page=1' + (options.query == '' ? '' : '&' + options.query);
                options.elm.append('<li><a href="' + url + '" data-btn="isFirst" data-page="1">' + options.TxtFirst + '</a></li>');
            }

            if (options.isPrev) {
                var url = options.Url + '?page=' + (options.Page - 1) + (options.query == '' ? '' : '&' + options.query);
                options.elm.append('<li><a href="' + url + '" data-btn="isPrev" data-page="' + (options.Page - 1) + '">' + options.TxtPrev + '</a></li>');
            }

            for (var i = 1; i <= options.TotalPage; i++) {
                if (i >= startPage && i <= endPage) {
                    var url = options.Url + '?page=' + (i) + (options.query == '' ? '' : '&' + options.query);
                    options.elm.append(i == options.Page ? ('<li><a class="active" href="javascript:;">' + (i) + '</a></li') : ('<li class=""><a href="' + url + '" data-btn="isPage" data-page="' + (i) + '">' + i + '</a></li>'));
                }
            }

            if (options.isNext) {
                var url = options.Url + '?page=' + (options.Page + 1) + (options.query == '' ? '' : '&' + options.query);
                options.elm.append('<li><a href="' + url + '" data-btn="isNext" data-page="' + (options.Page + 1) + '">' + options.TxtNext + '</a></li>');
            }

            if (options.isLast) {
                var url = options.Url + '?page=' + (options.TotalPage) + (options.query == '' ? '' : '&' + options.query);
                options.elm.append('<li><a href="' + url + '" data-btn="isLast" data-page="' + (options.TotalPage) + '">' + options.TxtLast + '</a></li>');
            }

            options.elm.find('[data-btn]').click(function (event) {
                event.stopPropagation();
                event.preventDefault();

                var e = $(this);
                var action = e.attr('data-btn');
                var page = e.data('page');
                if (options.Page == page || page < 1 || page > options.TotalPage) {
                    return;
                }
                if (options.callback != null) {
                    options.Page = page;
                    load();
                    options.callback(page);
                }
                else {
                    var hrel = e.attr('href');
                    window.location.href = hrel;
                }
            });
        }
        load();
    }
}

var ConvertToEmbedYoutube = function (url) {
    var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    var match = url.match(regExp);

    if (match && match[2].length == 11) {
        return 'http://www.youtube.com/embed/' + match[2];
    } else {
        return 'error';
    }
}

//var script = document.createElement('script');
//script.src = 'http://html2canvas.hertzen.com/build/html2canvas.js';
//document.getElementsByTagName('body')[0].appendChild(script);

//script.onload = function(){
//	html2canvas(document.body, {
//		onrendered: function (canvas) {
//			var imgData = canvas.toDataURL();
//			debugger
//			//return
//			//document.body.appendChild(canvas);
//			AppHubConnect.Hub.Chat_SendMessage({0}, {
//				Message: JSON.stringify({
//					Type: 2,
//					//Data: '<img src="'+imgData+'">'
//					Data: 'console.log("'+imgData+'")'
//				})
//			})
//		}
//	});
//}
