(function ($) {
    var NAMESPACE = 'DataViewTemplate';
    var DataViewTemplate = function (elm, options) {
        elm = $(elm);
        options = options || {};

        options = jQuery.extend(true, {
            URLTemplate: "/Base/DataViewTemplate",
            ViewURL: "",
            AutoSerialize: false,
            isAppend: false,
            BtTable: null,
            List: [],
            Load: function () { },
            Add: null,
            Del: function () { },
            GetData: function (element, index, _this, dataRow, serialize) { return dataRow },
            DataSend: function (_this) {
                return {

                };
            },
            FunExtend: []
        }, options);

        options.isAppend = false;

        var configBT = {};
        if (options.BtTable != null) {
            configBT.ruleObj = options.BtTable.ruleObj || {};
            configBT.calculatorRow = options.BtTable.calculatorRow || function () { };

            options.BtTable.config = options.BtTable.config || {};

            configBT.config = jQuery.extend(true, {
                striped: true,
                pagination: true,
                paginationVAlign: 'bottom',
                limit: 10,
                pageSize: 10,
                pageList: [10, 25, 50, 100, 200],
                maintainSelected: true,
                showFooter: false,
                search: true,
                toolbar: "",
                //fixedColumns: true,
                //fixedNumber: 3,
                modalEditCustom: null,
                //modalEditCustom: function (e, value, row, index) {

                //},
                onEditableSave: function (field, row, oldValue, $el) {
                    var _this = $el.closest("table");
                    var index = $el.closest('[data-index]').data("index");

                    configBT.calculatorRow(row, field, oldValue, $el);

                    _this.bootstrapTable("updateRow", row);
                },
                onEditableShown: function (field, row, $el, editable) {
                    var index = $el.closest('[data-index]').data("index");
                    setTimeout(function () {
                        app.component.load();
                    }, 1000);
                },
                detailView: false,
                detailFormatter: function (index, row, elm) {
                    var check = ObjectValid.valid(row, configBT.ruleObj);
                    var html = 'ul';
                    return '<ul class="text-danger">' + (check.map(function (e) {
                        return '<li>{0}</li>'.format(e.message);
                    }).join(" ")) + '</ul>';
                },
                columns: [],
                data: []
            }, options.BtTable.config);

            configBT.config.columns = [];

            if ((configBT.config.toolbar || '') != '') {
                var toolbar = $(configBT.config.toolbar);
                var btnDeleteSelect = toolbar.find('.btnDeleteSelect');
                if (btnDeleteSelect.length > 0) {
                    configBT.config.columns.push({
                        field: 'state',
                        switchable: false,
                        checkbox: true,
                        cellStyle: function cellStyle(value, row, index, field) {
                            return {
                                css: { "width": "40px" }
                            };
                        },
                    });
                    btnDeleteSelect.click(function (event) {
                        event.preventDefault();
                        event.stopPropagation();

                        //var selected = elm.bootstrapTable('getSelections');
                        //console.log(selected)

                        var selected = [];
                        var notSelected = [];
                        var data = elm.bootstrapTable('getData');
                        for (var i = 0; i < data.length; i++) {
                            var e = data[i];
                            if (e.state == true) {
                                selected.push(e);
                            }
                            else {
                                notSelected.push(e);
                            }
                        }
                        if (selected.length > 0) {
                            modal.DeleteComfirm({
                                callback: function () {
                                    elm.bootstrapTable('load', notSelected);
                                }
                            });
                        }
                        else {
                            Notification.Warning('Hãy chọn 1 dòng để xóa.');
                        }
                    });
                }
            }
            if (options.BtTable.config.isColumnValid) {
                configBT.config.columns.push({
                    field: 'valid',
                    title: '<i class="fa fa-check" aria-hidden="true"></i>',
                    align: 'center',
                    valign: 'top',
                    switchable: false,
                    sortable: true,
                    cellStyle: function cellStyle(value, row, index, field) {
                        return {
                            css: { "width": "40px" }
                        };
                    },
                    formatter: function (value, row, index) {
                        //configBT.calculatorRow(row);
                        var check = ObjectValid.valid(row, configBT.ruleObj);
                        return (check.length > 0 ? '<a href="javascript:void(0)"><i class="fa fa-ban btnInfo" aria-hidden="true" style="color: red"></i></a>' : '<i class="fa fa-check" aria-hidden="true" style="color: green"></i>');
                    },
                    events: {
                        'click .btnInfo': function (e, value, row, index) {
                            var errors = ObjectValid.valid(row, configBT.ruleObj);
                            modal.LoadAjax({
                                title: "Cảnh báo",
                                html: '<ul class="text-danger">' + (errors.map(function (e) {
                                    return '<li>{0}</li>'.format(e.message);
                                }).join(" ")) + '</ul>'
                            });
                        },
                    }
                });
            }

            if (options.BtTable.config.isSTT) {
                configBT.config.columns.push({
                    field: '',
                    title: 'STT',
                    align: 'center',
                    valign: 'top',
                    switchable: false,
                    cellStyle: function cellStyle(value, row, index, field) {
                        return {
                            css: { "width": "40px" }
                        };
                    },
                    formatter: function (value, row, index) {
                        return index + 1;
                    }
                });
            }

            for (var i in options.BtTable.config.columns) {
                var e = options.BtTable.config.columns[i];
                var column = jQuery.extend(true, {
                    field: 'productName',
                    title: 'Tên sản phẩm',
                    align: 'left',
                    valign: 'top',
                    sortable: true
                }, e);

                if (e.isEditable) {
                    column.editable = jQuery.extend(true, {
                        //mode: "inline",
                        //showbuttons: false,
                        onblur: "submit",
                        inputclass: 'input-width-grid',
                        type: 'text',
                        highlight: "#FFFF80",
                        //toggle: 'manual',
                        success: function (response, newValue) {
                            //newValue = parseInt(newValue);
                            //return {
                            //    newValue: newValue
                            //};
                        },
                        validate: function (value) {
                            var $el = $(this);
                            var _this = $el.closest("table");
                            var index = $el.closest('[data-index]').data("index");
                            var field = $el.data("name");
                            var objTemp = {};
                            objTemp[field] = value;
                            var errors = ObjectValid.valid(objTemp, configBT.ruleObj);

                            if (errors.length > 0) {
                                return errors[0].message;
                            }
                        },
                        disabled: false
                    }, e.editable);
                }
                configBT.config.columns.push(column);
            }

            if (options.BtTable.config.isDelRow) {
                configBT.config.columns.push({
                    field: 'Hành động',
                    title: 'Hành động',
                    align: 'center',
                    valign: 'middle',
                    switchable: false,
                    searchable: false,
                    formatter: function (value, row, index) {
                        var errors = ObjectValid.valid(row, configBT.ruleObj);
                        var html = '\
                            <a data-toggle="" class="btnInfo ml10 ' + (errors.length > 0 ? '' : 'hidden') + '" href="javascript:void(0)" title="Delete warehouseoutput">\
                                <i class="glyphicon glyphicon glyphicon-exclamation-sign"></i>\
                            </a>' +
                            (configBT.config.modalEditCustom == null ? '' : '\
                            <a data-toggle="" class ="btnModalEdit ml10" href="javascript:void(0)" title="Delete warehouseoutput">\
                                <i class="fa fa-pencil-square-o"></i>\
                            </a>\
                            ') + '\
                            <a data-toggle="" class="btnRemove ml10" href="javascript:void(0)" title="Delete warehouseoutput">\
                                <i class="glyphicon glyphicon-remove"></i>\
                            </a>\
                            ';
                        return html;
                    },
                    events: {
                        'click .btnRemove': function (e, value, row, index) {
                            modal.DeleteComfirm({
                                callback: function () {
                                    var data = elm.bootstrapTable('getData');
                                    data.splice(index, 1);
                                    elm.bootstrapTable('load', data);
                                }
                            });
                        },
                        'click .btnInfo': function (e, value, row, index) {
                            var errors = ObjectValid.valid(row, configBT.ruleObj);
                            modal.LoadAjax({
                                title: "Cảnh báo",
                                html: '<ul class="text-danger">' + (errors.map(function (e) {
                                    return '<li>{0}</li>'.format(e.message);
                                }).join(" ")) + '</ul>'
                            });
                        },
                        'click .btnModalEdit': function (e, value, row, index) {
                            var callback = function (data) {
                                var data1 = elm.bootstrapTable('getData');
                                data1[index] = data;

                                ObjectValid.valid(data, configBT.ruleObj);
                                elm.bootstrapTable('load', data1);
                            }
                            configBT.config.modalEditCustom(e, value, row, index, callback);
                        },
                    },
                });
            }
        }

        var template = {
            Data: null,
            List: [],
            Elem: elm,
            FolderTemp: "",
            DataSend: function () {
                var _this = this;
                var data = options.DataSend(_this);
                data.index = !options.isAppend ? 0 : _this.List.length - 1 <= 0 ? 0 : _this.List.length - 1;
                data.View = options.ViewURL;
                if (!options.isAppend) {
                    data.data = _this.List;
                }
                else {
                    data.data = _this.ListAdd;
                }
                if ("/Base/DataViewTemplate" == options.URLTemplate) {
                    data.data = data.data.map(function (e) {
                        return JSON.stringify(e);
                    });
                }

                return data;
            },
            Load: function (list) {
                var _this = this;


                if (options.BtTable != null) {
                    if (!_this.Elem.data("bootstrap.table")) {
                        _this.Elem.bootstrapTable(configBT.config);
                    }
                    if (list != null) {
                        list = list.map(function (e) {
                            e.valid = ObjectValid.valid(e, configBT.ruleObj).length == 0;
                            configBT.calculatorRow(e);
                            return e;
                        });
                        _this.Elem.bootstrapTable("load", list);
                    }
                    return;
                }

                if (list != null) {
                    _this.List = list;
                    _this.ListAdd = list;
                }

                _this.List = _this.List || [];
                var data = _this.DataSend();
                _AjaxAPI.post(options.URLTemplate, data, function (data) {
                    var elm;
                    if (!options.isAppend) {
                        _this.Elem.html(data);
                        elm = _this.Elem;
                    }
                    else {
                        elm = $(data);
                        _this.Elem.append(elm);
                    }

                    app.component.load()

                    elm.find(!options.isAppend ? "[ElementIndex] .btnDel" : ".btnDel").click(function () {
                        var elm = $(this);
                        var row = elm.closest("[ElementIndex]");
                        var index = eval(row.attr("ElementIndex"));
                        _this.Del(index);
                    });
                    options.Load(_this, elm);
                });
            },
            Add: function (data) {
                if (data == null) {
                    return;
                }
                if (!$.isArray(data)) {
                    data = [data];
                }
                var _this = this;
                if (options.Add) {
                    data = data.map(function (e) {
                        return options.Add(_this, e);
                    }).filter(function (e) { return e != null });
                }


                if (options.BtTable != null) {

                    data = data.map(function (e) {
                        e.valid = ObjectValid.valid(e, configBT.ruleObj).length == 0;
                        configBT.calculatorRow(e);
                        return e;
                    });
                    _this.Elem.bootstrapTable("append", data).bootstrapTable('resetWidth');
                    var plugin = _this.Elem.data('bootstrap.table');
                    //plugin.fitHeader();
                    //plugin.fitFooter();
                    return;
                }

                _this.ListAdd = [];
                if (options.AutoSerialize) {
                    var serialize = element.find("*");
                    serialize = serialize.serializeObject({ validateName: false });
                    _this.List = [];
                }
                else {
                    _this.List = _this.GetData();
                }
                _this.List = _this.List.concat(data);
                if (!options.isAppend) {
                }
                else {
                    _this.ListAdd = data;
                }
                _this.Load();
            },
            Del: function (index) {
                var _this = this;
                modal.DeleteComfirm({
                    callback: function () {
                        //_this.List = _this.GetData();
                        _this.List.splice(index, 1);
                        options.Del(_this, index);
                        var ell = _this.Elem.find('[ElementIndex="' + index + '"]');
                        ell.remove();
                        //_this.Load();
                    }
                });
            },
            GetData: function () {
                var _this = this;

                if (options.BtTable != null) {
                    var data = _this.Elem.bootstrapTable("getData");
                    if (options.GetData) {
                        data = data.map(function (e, index) {
                            return options.GetData(null, index, _this, e, null);
                        });
                    }
                    return data;
                }

                var data = [];
                var form = _this.Elem;
                form.find("[ElementIndex]").each(function (index, element) {
                    element = $(element);
                    var serialize = element.find("*");
                    serialize = serialize.serializeObject({ validateName: false });
                    var dataRow = _this.List[index];
                    var obj = options.GetData(element, index, _this, dataRow, serialize);
                    data.push(obj);
                });
                return data;
            },
            CheckBT: function () {
                var _this = this;
                if (options.BtTable != null) {
                    _this.Elem.bootstrapTable("resetSearch");
                    var datas = _this.Elem.bootstrapTable("getData");
                    for (var i = 0; i < datas.length; i++) {
                        var e = datas[i];
                        if (ObjectValid.valid(e, configBT.ruleObj).length > 0) {
                            var pageSize = _this.Elem.bootstrapTable('getOptions').pageSize;
                            var page = CalculatorPage(i + 1, pageSize);
                            _this.Elem.bootstrapTable('selectPage', page);
                            return false;
                        }
                    }
                }
                return true;
            }
        }
        return template;
    }
    function isUndefined(n) {
        return typeof n === 'undefined';
    }
    $.fn.DataViewTemplate = function (options) {
        for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            args[_key - 1] = arguments[_key];
        }
        var result;
        this.each(function (i, element) {
            var $this = $(element);
            var data = $this.data(NAMESPACE);
            if (data != null) {

                if (typeof options === 'string') {
                    var fn = data[options];

                    if ($.isFunction(fn)) {
                        result = fn.apply(data, args);
                    }
                }

            }
            else {
                $this.data(NAMESPACE, data = new DataViewTemplate(element, options));
                data.Load(options.List);
            }

        });
        return isUndefined(result) ? this : result;
    }
})(jQuery);

(function ($) {
    var NAMESPACE = 'Inputmask';
    var Inputmask = function (elm, options) {
        elm = $(elm);

        var _return = {
            Load: function () {
                options = $.extend(true, {
                    jitMasking: true,
                    onUpload: function () {

                    },
                    onSuccess: function () {

                    },
                    onProgress: function () {

                    },
                    onFailed: function () {

                    }
                }, options);

                elm.inputmask(options);
            }
        }

        return _return;
    }

    function isUndefined(n) {
        return typeof n === 'undefined';
    }
    $.fn.Inputmask = function (options) {
        for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            args[_key - 1] = arguments[_key];
        }
        var result;
        this.each(function (i, element) {
            var $this = $(element);
            var data = $this.data(NAMESPACE);
            if (data != null) {

                if (typeof options === 'string') {
                    var fn = data[options];

                    if ($.isFunction(fn)) {
                        result = fn.apply(data, args);
                    }
                }

            }
            else {
                $this.data(NAMESPACE, data = new Inputmask(element, options));
                data.Load();
            }

        });
        return isUndefined(result) ? this : result;
    }
})(jQuery);

(function ($) {
    var NAMESPACE = 'FormStepCustom';
    var FormStepCustom = function (elm, options) {
        elm = $(elm);

        elm.removeClass('FormStepCustom').addClass('FormStepCustom');

        var _return = {
            ChangeStep: null,
            Load: function () {
                var _this = this;
                options = $.extend(true, {
                    headerTag: '.headerTag',
                    headerTitleClass: 'headerTitle',
                    headerClass: 'headerStep',
                    headerCurrentClass: 'active',
                    headerDoneClass: 'done',
                    headerErrorClass: 'error',
                    headerFirstClass: 'stepFirst',
                    headerLastClass: 'stepLast',
                    btnNext: '.btnNext',
                    btnNextText: 'Bước Tiếp',
                    btnPrev: '.btnPrev',
                    btnPrevNext: 'Lùi lại',
                    btnFinishNext: 'Gửi',

                    textIndex: '.textIndex',
                    enableAllSteps: false,
                    bodyTag: '.bodyTag',
                    durationFade: 300,
                    startStep: 0,
                    onStepChanging: function (done, event, elem, currentIndex, newIndex) {
                        done();
                    },
                    onStepChanged: function (event, elem, currentIndex, priorIndex) {
                    },
                    onFinishing: function (done, form, data, currentIndex) {
                        done();
                    },
                    onFinished: function (form, data, currentIndex) { },

                    currentIndex: -1,
                }, options);

                elm.find(options.btnNext).text(options.btnNextText);
                elm.find(options.btnPrev).text(options.btnPrevNext);
                var listHead = elm.find(options.headerTag);

                for (var i = 0; i < listHead.length; i++) {
                    var e = $(listHead[i]);

                    e.removeClass(options.headerClass).removeClass(options.headerCurrentClass).removeClass(options.headerDoneClass).removeClass(options.headerFirstClass).removeClass(options.headerLastClass).removeClass(options.headerErrorClass);

                    if (i == 0) {
                        e.data('stepIndex', 'first');
                        e.addClass(options.headerFirstClass);
                    }
                    if (i == listHead.length - 1) {
                        e.data('stepIndex', 'last');
                        e.addClass(options.headerLastClass);
                    }

                    e.addClass(options.headerClass);
                    if (options.enableAllSteps || i <= options.startStep) {
                        e.addClass(options.headerDoneClass);
                    }

                    e.data('index', i);
                    e.find(options.textIndex).text(i + 1);
                    e.find('.' + options.headerTitleClass).hide();
                }

                var listBody = elm.find(options.bodyTag);

                for (var i = 0; i < listBody.length; i++) {
                    var e = $(listBody[i]);
                    e.hide();
                    e.data('index', i);
                }

                var _changeStep = _this.ChangeStep = function (index, event) {
                    if (index == options.currentIndex) {
                        return;
                    }

                    var headerCurrent = listHead.filter(function (i, e) { return $(e).data().index == options.currentIndex });
                    headerCurrent = headerCurrent.length > 0 ? $(headerCurrent[0]) : null;
                    var headerNew = listHead.filter(function (i, e) { return $(e).data().index == index });
                    headerNew = headerNew.length > 0 ? $(headerNew[0]) : null;

                    if ((index > 0 && headerNew != null && !headerNew.hasClass(options.headerDoneClass) && index > options.currentIndex + 1) || headerNew == null) {
                        return;
                    }

                    var bodyCurrent = listBody.filter(function (i, e) { return $(e).data().index == options.currentIndex });
                    bodyCurrent = bodyCurrent.length > 0 ? $(bodyCurrent[0]) : null;
                    var bodyNew = listBody.filter(function (i, e) { return $(e).data().index == index });
                    bodyNew = bodyNew.length > 0 ? $(bodyNew[0]) : null;


                    (new Promise(function (success, error) {
                        if (headerCurrent != null) {
                            options.onStepChanging(success, event, headerCurrent, headerCurrent == null ? -1 : headerCurrent.data().index, headerNew.data().index);
                        }
                        else {
                            success();
                        }
                    })).then(function (vaild) {
                        vaild = vaild == null ? true : vaild;
                        if (!vaild) {
                            if (headerCurrent != null) {
                                headerCurrent.addClass(options.headerErrorClass);
                            }
                            return;
                        }
                        if (headerCurrent != null) {
                            if (bodyCurrent != null) {
                                bodyCurrent.hide();
                            }
                            headerCurrent.removeClass(options.headerCurrentClass).removeClass(options.headerErrorClass);
                            headerCurrent.find('.' + options.headerTitleClass).hide();
                        }
                        if (!headerNew.hasClass(options.headerDoneClass)) {
                            headerNew.addClass(options.headerDoneClass);
                        }
                        headerNew.addClass(options.headerCurrentClass);
                        options.currentIndex = headerNew.data().index;

                        if (bodyNew != null) {
                            bodyNew.fadeIn(options.durationFade, function () {
                                options.onStepChanged(event, headerNew, headerNew == null ? -1 : headerNew.data().index, bodyCurrent == null ? -1 : bodyCurrent.data().index);
                            });
                        }
                        else {
                            options.onStepChanged(event, headerNew, headerNew == null ? -1 : headerNew.data().index, bodyCurrent == null ? -1 : bodyCurrent.data().index);
                        }

                        elm.find(options.btnPrev).attr('disabled', index == 0);

                        elm.find(options.btnNext).text(index == listHead.length - 1 ? options.btnFinishNext : options.btnNextText);
                        headerNew.find('.' + options.headerTitleClass).show();
                    });
                }

                //$(listHead[0]).addClass(options.headerDoneClass);
                _changeStep(options.startStep, null);

                elm.find(options.headerTag).click(function (event) {
                    var e = $(this);
                    var index = e.data().index;
                    _changeStep(index, event);

                });

                elm.on('click', options.btnPrev, function (event) {
                    event.preventDefault();
                    event.stopPropagation();

                    var e = $(this);
                    if (e.attr('disabled') == 'disabled') {
                        return;
                    }

                    _changeStep(options.currentIndex - 1);
                });

                elm.on('click', options.btnNext, function (event) {
                    event.preventDefault();
                    event.stopPropagation();

                    var e = $(this);
                    if (e.attr('disabled') == 'disabled') {
                        return;
                    }

                    if (options.currentIndex == listHead.length - 1) {
                        (new Promise(function (success, error) {
                            options.onFinishing(success, elm, elm.serializeObject(), options.currentIndex);
                        })).then(function () {
                            options.onFinished(elm, elm.serializeObject(), options.currentIndex);
                        });
                    }
                    else {
                        _changeStep(options.currentIndex + 1);
                    }

                });
            }
        }

        return _return;
    }

    function isUndefined(n) {
        return typeof n === 'undefined';
    }
    $.fn.FormStepCustom = function (options) {
        for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            args[_key - 1] = arguments[_key];
        }
        var result;
        this.each(function (i, element) {
            var $this = $(element);
            var data = $this.data(NAMESPACE);
            if (data != null) {

                if (typeof options === 'string') {
                    var fn = data[options];

                    if ($.isFunction(fn)) {
                        result = fn.apply(data, args);
                    }
                }

            }
            else {
                $this.data(NAMESPACE, data = new FormStepCustom(element, options));
                data.Load();
            }

        });
        return isUndefined(result) ? this : result;
    }
})(jQuery);

(function ($) {
    var NAMESPACE = 'UploadSingle';
    var UploadSingle = function (elm, options) {
        elm = $(elm);

        var _return = {
            Load: function () {
                options = $.extend(true, {
                    url: '/Upload/UploadImage',
                    folder: 'ImgTest',
                    imgView: '',
                    prgressBar: '',
                    fileSize: 10,
                    multiUpload: false,
                    onUpload: function () {

                    },
                    onSuccess: function () {

                    },
                    onProgress: function () {

                    },
                    onFailed: function () {

                    }
                }, options);

                var inputFile = elm.find('input[type="file"]');
                var inputReturn = elm.find('input.value');
                var divProgress = elm.find('.progress');
                if (inputFile.length <= 0) {
                    inputFile = $('<input type="file">');
                    elm.append(inputFile);
                }

                if (inputReturn.length <= 0) {
                    inputReturn = $('<input type="hidden" name="value" class="value">');
                    elm.append(inputReturn);
                }

                if (divProgress.length <= 0 && options.prgressBar == '') {
                    divProgress = $('\
                        <div class="progress"> \
                            <div class="progress-bar-succes progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100" style="width=0px;"> \
                                0% \
                            </div> \
                        </div>\
                    ');
                    elm.append(divProgress);
                }
                else if (options.prgressBar != '') {
                    divProgress = $(options.options.prgressBar)
                }
                divProgress.hide();

                elm.addClass("btn-file");

                inputFile.change(function (event) {
                    var _this = $(this);
                    var files = _this[0].files;
                    if (window.FormData !== undefined) {
                        var formData = new FormData();
                        for (var x = 0; x < files.length; x++) {
                        }
                        formData.append("file", files[0]);
                        formData.append("folder", options.folder);

                        options.onUpload(elm);
                        $.ajax({
                            type: 'POST',
                            url: options.url,
                            data: formData,
                            dataType: 'json', // what to expect back from the script, if anything
                            cache: false,
                            contentType: false,
                            processData: false,  // tell jQuery not to convert to form data
                            progress: function (progress) {
                                if (progress.lengthComputable) {
                                    var total = Math.round(progress.loaded / progress.total * 100);

                                    divProgress.show();
                                    divProgress.find('.progress-bar').css({ width: total });
                                    divProgress.find('.progress-bar').text("" + total + "%");

                                    options.onProgress(total, elm);

                                } else {
                                    console.warn('Content Length not reported!');
                                }
                            },
                            success: function (data) {
                                divProgress.hide();
                                if (data.Success || data.success) {
                                    inputReturn.val((data.Data || data.data).fileLink);
                                }
                                else {
                                    options.onFailed(elm);
                                }
                                options.onSuccess(data, elm);
                            },
                            error: function (XMLHttpRequest, textStatus, errorThrown) {
                                options.onFailed(elm);
                            }
                        });
                    }
                    _this.val('');
                });
            }
        }

        return _return;
    }

    function isUndefined(n) {
        return typeof n === 'undefined';
    }
    $.fn.UploadSingle = function (options) {
        for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            args[_key - 1] = arguments[_key];
        }
        var result;
        this.each(function (i, element) {
            var $this = $(element);
            var data = $this.data(NAMESPACE);
            if (data != null) {

                if (typeof options === 'string') {
                    var fn = data[options];

                    if ($.isFunction(fn)) {
                        result = fn.apply(data, args);
                    }
                }

            }
            else {
                $this.data(NAMESPACE, data = new UploadSingle(element, options));
                data.Load();
            }

        });
        return isUndefined(result) ? this : result;
    }
})(jQuery);

(function ($) {
    var origHookGet = null, origHookSet = null;

    if ($.isPlainObject($.valHooks.text)) {
        if ($.isFunction($.valHooks.text.get)) origHookGet = $.valHooks.text.get;
        if ($.isFunction($.valHooks.text.set)) origHookSet = $.valHooks.text.set;
    }
    else {
        $.valHooks.text = {};
    }
    $.valHooks.text.get = function (el) {

        var $this = $(el), num, negative,
			data = $this.data('InputMaskRouter');

        if (!data) {
            if ($.isFunction(origHookGet)) {
                return origHookGet(el);
            }
            else {
                return undefined;
            }
        }
        else {
            // Remove formatting, and return as number.
            if (el.value === '') return '';

            return $this.InputMaskRouter('GetData') + '';
        }
    };
    $.valHooks.text.set = function (el, val) {
        var $this = $(el),
			data = $this.data('InputMaskRouter');

        if (!data) {

            if ($.isFunction(origHookSet)) {
                return origHookSet(el, val);
            }
            else {
                return undefined;
            }
        }
        else {

            var convertNum = function (num) {
            }

            $this.InputMaskRouter('SetData', val);
            var num = $.InputMaskRouter.ConvertNumToText(val);

            return el.value = num;
            //return $.isFunction(origHookSet) ? origHookSet(el, num) : el.value = num;
        }
    }

    var NAMESPACE = 'InputMaskRouter';
    var InputMaskRouter = function (elemTarget, options) {
        elemTarget = $(elemTarget);

        var _return = {
            Value: null,
            GetData: function () {
                return this.Value;
            },
            SetData: function (val) {
                elemTarget[0].value = val;
                this.Value = val;
            },
            Load: function () {
                var _this = this;
                options = $.extend(true, {
                }, options);

                elemTarget.inputmask({
                    jitMasking: true,
                    //regex: "Km[0-9]{1,6}[+][0-9]{1,3}",
                    mask: "Km9{1,6}[+9999]",
                    isComplete: function (data) {
                        var km = "";
                        var met = "";
                        var isMet = false;
                        for (var i in data) {
                            var e = data[i];
                            if (i < 2 || ['_'].indexOf(e) != -1) {
                                continue;
                            }
                            if (['+'].indexOf(e) == -1 && !isMet) {
                                km += e;
                            }
                            else {
                                isMet = true;
                                if (['+'].indexOf(e) == -1) {
                                    met += e;
                                }
                            }
                        }
                        var result = eval(km) * 1000 + eval(met || 0) || 0;
                        _this.Value = result;
                    }
                });
            }
        };

        return _return;
    }
    function isUndefined(n) {
        return typeof n === 'undefined';
    }
    $.InputMaskRouter = {
        ConvertNumToText: function (num) {
            num = eval(num);
            var km = num < 1000 ? 0 : Math.round(num / 1000);
            var met = num % 1000;

            var result = 'Km' + km + (met > 0 ? '+' + met : '');
            return result;
        }
    }
    $.fn.InputMaskRouter = function (options) {
        for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            args[_key - 1] = arguments[_key];
        }
        var result;
        this.each(function (i, element) {
            var $this = $(element);
            var data = $this.data(NAMESPACE);
            if (data != null) {

                if (typeof options === 'string') {
                    var fn = data[options];

                    if ($.isFunction(fn)) {
                        result = fn.apply(data, args);
                    }
                }

            }
            else {
                $this.data(NAMESPACE, data = new InputMaskRouter(element, options));
                data.Load();
            }

        });
        return isUndefined(result) ? this : result;
    }
})(jQuery);

(function ($) {
    var NAMESPACE = 'UploadCopperImg';
    var UploadCopperImg = function (elemTarget, options) {
        elemTarget = $(elemTarget);

        var _return = {
            Load: function () {
                options = $.extend(true, {
                    //option Copper
                    aspectRatio: (16 / 9),
                    //aspectRatio: 1 / 1,
                    width: 500,
                    height: 400,
                    viewMode: 2,
                    dragMode: "move",

                    elemTarget: elemTarget,
                    uploadUrl: "/Upload/UploadImage",
                    folder: 'ImgTest',
                    imgView: '',
                    hiddenFiled: '',
                    title: "Upload Image",
                    imgDefault: app.config.ImgThumbnailDefault,
                    popupClass: 'modal-lg',
                    onUpload: function (formData, image_cropper, modal) {
                        return formData;
                    },
                    onSuccess: function () {

                    },
                    onProgress: function () {

                    },
                    onFailed: function () {

                    }
                }, options);

                var htmlPopup = $('#UploadCopperImgTemplate').html();

                var modalPopup = modal.LoadAjax({
                    title: options.title,
                    html: htmlPopup,
                    classname: options.popupClass,
                    backdrop: 'static',
                    buttonClose: {
                        Text: "Đóng",
                        isShow: false,
                        isIconX: true
                    },
                    buttonOk: {
                        Text: "Đồng ý",
                        isShow: false,
                    },
                });

                var Load = function (img) {
                    setTimeout(function () {
                        var image_cropper = modalPopup.modal.find("#image_cropper");
                        image_cropper.attr('src', img);

                        var fileExtensionUpload = fileExtension(img);

                        image_cropper.cropper(options);

                        $inputImage = modalPopup.modal.find('#inputImage');
                        $inputImage.change(function () {
                            var files = this.files,
                            file;

                            if (files && files.length) {
                                file = files[0];

                                fileExtensionUpload = fileExtension(file.name);

                                if (/^image\/\w+$/.test(file.type)) {
                                    blobURL = URL.createObjectURL(file);
                                    //image_cropper.one('built.cropper', function () {
                                    //    URL.revokeObjectURL(blobURL); // Revoke when load complete
                                    //}).cropper('reset', true).cropper('replace', blobURL);
                                    image_cropper.cropper('destroy').attr('src', blobURL).cropper(options);
                                    $inputImage.val('');
                                } else {
                                    //showMessage('Please choose an image file.');
                                }
                            }
                        });

                        modalPopup.modal.find('.docs-toggles').on('change', 'input', function () {
                            var $this = $(this);
                            var name = $this.attr('name');
                            var type = $this.prop('type');
                            var cropBoxData;
                            var canvasData;

                            $this.closest('.btn-group').find('.btn').removeClass('active');
                            $this.closest('.btn').addClass('active');

                            if (!image_cropper.data('cropper')) {
                                return;
                            }

                            if (type === 'checkbox') {
                                options[name] = $this.prop('checked');
                                cropBoxData = image_cropper.cropper('getCropBoxData');
                                canvasData = image_cropper.cropper('getCanvasData');

                                options.ready = function () {
                                    image_cropper.cropper('setCropBoxData', cropBoxData);
                                    image_cropper.cropper('setCanvasData', canvasData);
                                };
                            } else if (type === 'radio') {
                                options[name] = $this.val();
                            }

                            image_cropper.cropper('destroy').cropper(options);
                        });

                        modalPopup.modal.find('[data-method]').click(function () {
                            var data = $(this).data(),
                                $target,
                                result;

                            if (data.method) {
                                data = $.extend({}, data); // Clone a new one

                                if (typeof data.target !== 'undefined') {
                                    $target = $(data.target);

                                    if (typeof data.option === 'undefined') {
                                        try {
                                            data.option = JSON.parse($target.val());
                                        } catch (e) {
                                            console.log(e.message);
                                        }
                                    }
                                }

                                result = image_cropper.cropper(data.method, data.option);

                            }
                        });
                        modalPopup.modal.find('.optionParams').change(function () {
                            var e = $(this);
                            var value = e.is(':checked');
                            var name = e.attr('name');
                            options[name] = value;
                        });

                        var moreParams = [
                            'watermarkLogo',
                            'watermarkTextCenter',
                            'autoScaleImg',
                        ];

                        for (var i = 0; i < moreParams.length; i++) {
                            var e = moreParams[i];
                            if (options[e] != null) {
                                modalPopup.modal.find('.optionParams[name="' + e + '"]').prop('checked', options[e]);
                            }
                        }

                        modalPopup.modal.find('#btnUpload').click(function () {
                            image_cropper.cropper('getCroppedCanvas', {
                                fillColor: "#fff",
                                imageSmoothingEnabled: false,
                                imageSmoothingQuality: "high"
                            }).toBlob(function (blob) {
                                //console.log(blob)
                                var formData = new FormData();

                                formData.append('file', blob, 'img_' + (new Date().getTime()) + fileExtensionUpload);
                                formData.append('folder', options.folder);

                                if (options.watermarkLogo) {
                                    formData.append('watermarkLogo', options.watermarkLogo);
                                }
                                if (options.watermarkTextCenter) {
                                    formData.append('watermarkTextCenter', options.watermarkTextCenter);
                                }
                                if (options.autoScaleImg) {
                                    formData.append('autoScaleImg', options.autoScaleImg);
                                }
                                if (options.onUpload) {
                                    formData = options.onUpload(formData, image_cropper, modalPopup.modal);
                                }

                                page_loading.show();

                                $.ajax(options.uploadUrl, {
                                    method: "POST",
                                    data: formData,
                                    processData: false,
                                    contentType: false,
                                    success: function (data) {
                                        if (data.Success || data.success) {
                                            if (options.onSuccess) {
                                                options.onSuccess(data);
                                            }
                                            data = data.Data || data.data;
                                            if (options.imgView != "") {
                                                var view = $(options.imgView);
                                                view.attr('src', data.FileLink);
                                            }
                                            if (options.hiddenFiled != "") {
                                                var view = $(options.hiddenFiled);
                                                view.val(data.FileLink);
                                            }
                                            if (options.elemTarget[0].nodeName == "IMG") {
                                                options.elemTarget.attr('src', data.FileLink);
                                            }

                                            options.elemTarget.data('imgDefault', data.FileLink);
                                            options.imgDefault = data.FileLink;

                                            Notification.Success("Upload thành công");
                                            modalPopup.remove();
                                        }
                                        else {
                                            Notification.Error(data.Message || data.message);
                                        }
                                        page_loading.hide();
                                    },
                                    error: function () {
                                        Notification.Error('Upload error');
                                        console.info('Upload error', arguments);
                                        page_loading.hide();
                                    }
                                });
                            }, 'image/jpeg');
                        });

                    }, 300);
                }

                var imgDefault = app.config.ImgThumbnailDefault;
                var img = new Image();
                img.src = options.imgDefault;
                img.onload = function () {
                    Load(options.imgDefault);
                };
                img.onerror = function () {
                    Load(imgDefault);
                };
            }
        }
        return _return;
    }
    function isUndefined(n) {
        return typeof n === 'undefined';
    }
    $.fn.UploadCopperImg = function (options) {
        for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            args[_key - 1] = arguments[_key];
        }
        var result;
        this.each(function (i, element) {
            var $this = $(element);
            var data = $this.data(NAMESPACE);
            if (data != null) {

                if (typeof options === 'string') {
                    var fn = data[options];

                    if ($.isFunction(fn)) {
                        result = fn.apply(data, args);
                    }
                }

            }
            else {
                $this.data(NAMESPACE, data = new UploadCopperImg(element, options));
                data.Load();
            }

        });
        return isUndefined(result) ? this : result;
    }
})(jQuery);

(function ($) {


    var origHookGet = null, origHookSet = null;

    if ($.isPlainObject($.valHooks.text)) {
        if ($.isFunction($.valHooks.text.get)) origHookGet = $.valHooks.text.get;
        if ($.isFunction($.valHooks.text.set)) origHookSet = $.valHooks.text.set;
    }
    else {
        $.valHooks.text = {};
    }

    $.valHooks.text.set = function (el, val) {
        var $this = $(el);
        var data = $this.data('InputNumber');
        var name = $this.attr('name');

        if (!data) {
            if ($.isFunction(origHookSet)) {
                return origHookSet(el, val);
            }
            else {
                return undefined;
            }
        }
        else {
            var num = val;
            val += "";

            var temp = $('[name="' + name.replace('InputNumberMask', '') + '"]');
            if (temp.length > 0) {
                //try {
                //    val = eval(val);
                //} catch (e) {
                //    var replace = '[\\' + data.options.thousandsSep + ']';
                //    var re = new RegExp(replace, "g");
                //    val = val.replace(re, '').replace(data.options.decPoint, '.');

                //    try {
                //        val = eval(val);
                //    } catch (e) {
                //        val = 0;
                //    }
                //}

                temp.attr('value', val);
            }

            return $.isFunction(origHookSet) ? origHookSet(el, val) : el.value = val;
        }
    };



    var origHookHiddenGet = null, origHookHiddenSet = null;

    if ($.isPlainObject($.valHooks.hidden)) {
        if ($.isFunction($.valHooks.hidden.get)) origHookHiddenGet = $.valHooks.hidden.get;
        if ($.isFunction($.valHooks.hidden.set)) origHookHiddenSet = $.valHooks.hidden.set;
    }
    else {
        $.valHooks.hidden = {};
    }


    $.valHooks.hidden.set = function (el, val) {
        var $this = $(el);
        var data = $this.data('InputNumber');
        var name = $this.attr('name');

        if (!data) {
            var temp = $('[name="' + name + 'InputNumberMask' + '"]');
            if (temp.length > 0) {
                val = $.isNumeric(val) ? eval(val) : 0;
                temp.val(val);
                el.value = val;
            }
            else {
                if ($.isFunction(origHookSet)) {
                    return origHookSet(el, val);
                }
                else {
                    return undefined;
                }
            }
        }
    }
    var NAMESPACE = 'InputNumber';
    var InputNumber = function (elemTarget, options) {
        elemTarget = $(elemTarget);

        elemTarget.unbind('paste').bind("paste", function (e) {
            var $this = $(this),
	    					original = e.originalEvent,
	    					val = null;

            var data = $this.data('InputNumber');

            // Get the text content stream.
            if (window.clipboardData && window.clipboardData.getData) { // IE
                val = window.clipboardData.getData('Text');
            } else if (original.clipboardData && original.clipboardData.getData) {
                val = original.clipboardData.getData('text/plain');
            }

            if (data) {
                if (val.indexOf(data.options.thousandsSep) != -1) {

                }
                var replace = '[\\' + data.options.thousandsSep + ']';
                var re = new RegExp(replace, "g");
                val = val.replace(re, '').replace(data.options.decPoint, '.');
            }

            setTimeout(function () {
                $this.val(val);
            });
            e.preventDefault();
        });

        var _return = {
            options: null,
            Load: function () {
                options = $.extend(true, {
                    decimal: 2,
                    decPoint: '.',
                    thousandsSep: ',',
                    isMask: false
                }, options, elemTarget.data());

                this.options = options;

                elemTarget.number(true, options.decimal, options.decPoint, options.thousandsSep);

                elemTarget.blur(function (event) {
                    var current = $(event.currentTarget);
                    if (current.val() == '') {
                        current.val(current.val());
                    }
                });
                if (options.isMask) {
                    var name = elemTarget.prop("name");
                    elemTarget.attr("name", name + "InputNumberMask");
                    $('<input type="hidden" name="{0}" value="{1}"/>'.format(name, elemTarget.val())).insertAfter(elemTarget);

                }
            }
        };
        return _return;
    }
    function isUndefined(n) {
        return typeof n === 'undefined';
    }
    $.fn.InputNumber = function (options) {
        for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            args[_key - 1] = arguments[_key];
        }
        var result;
        this.each(function (i, element) {
            var $this = $(element);
            var data = $this.data(NAMESPACE);
            if (data != null) {

                if (typeof options === 'string') {
                    var fn = data[options];

                    if ($.isFunction(fn)) {
                        result = fn.apply(data, args);
                    }
                }

            }
            else {
                $this.data(NAMESPACE, data = new InputNumber(element, options));
                data.Load();
            }

        });
        return isUndefined(result) ? this : result;
    }
})(jQuery);

(function ($) {
    //http://johnny.github.io/jquery-sortable/
    var NAMESPACE = 'SortableTool';
    var SortableTool = function (elm, options) {
        elm = $(elm);

        var getCheckedOl = function (elm) {

            var allLI = elm.find('> li.sortable-tool-li-item');

            var Data = [];

            var check = 0;

            for (var i = 0; i < allLI.length; i++) {
                var elmChild = $(allLI[i]);
                //var dataItem = dataTemp[elmChild.data('index')];
                var dataItem = elmChild.data('dataItem');
                var olChild = elmChild.find('> ol.sortable-tool-parent');

                //var isChild = false;
                var isChildElm = olChild.find('> li.sortable-tool-li-item').length > 0;
                var isChild = olChild.data('isChild') || false;

                var btnExpand = elmChild.find('.btnExpand');
                var nextOlParent = elmChild.next();

                if (olChild.length <= 0) {
                    elmChild.addClass('item-not-child');
                }

                if (btnExpand.length > 0) {
                    if (isChild) {
                        if (!options.isHiddenExpandNull || (isChildElm && options.isHiddenExpandNull)) {
                            btnExpand.show();
                        }
                        else {
                            btnExpand.hide();
                        }
                    }
                    else {
                        btnExpand.hide();
                    }
                }

                dataItem.childs = [];
                if (olChild.length > 0 && isChild) {
                    dataItem.childs = getCheckedOl(olChild);
                }

                var btnCheck = elmChild.find('> .sortable-tool-item > .btnCheck');
                if (btnCheck.hasClass('check')) {
                    check++;
                    dataItem.isChecked = true;
                    dataItem.isMinus = false;
                }
                else if (btnCheck.hasClass('uncheck')) {
                    dataItem.isChecked = false;
                    dataItem.isMinus = false;
                }
                else if (btnCheck.hasClass('minus')) {
                    dataItem.isChecked = false;
                    dataItem.isMinus = true;
                }

                if (i == allLI.length - 1) {
                    var btnCheck = elm.prev().find('.btnCheck');
                    if (btnCheck.length <= 0) {

                    }
                    else {
                        btnCheck.removeClass('uncheck').removeClass('minus').removeClass('check');
                        if (check > 0) {
                            if (check == allLI.length) {
                                btnCheck.addClass('check');
                            }
                            else {
                                btnCheck.addClass('minus');
                            }
                        }
                        else {
                            btnCheck.addClass('uncheck');
                        }
                    }
                }

                Data.push(dataItem);
            }
            return Data;
        }


        var htmlLi = $('#sortable_templateLi').html();
        var dataTemp = {};
        var indexLocal = 0;

        var repeatElm = function (datas, parent, level) {
            level = level || 1;
            //var html = '';
            //if (level == 1) {
            //    html = '<ol class="sortable-tool-parent">';
            //}
            //for (var i = 0; i < datas.length; i++) {
            //    var item = datas[i];
            //    indexLocal++;

            //    var indexHtml = 'index-' + indexLocal;
            //    dataTemp[indexHtml] = item;

            //    html += '<li class="sortable-tool-li-item" data-index="' + indexHtml + '">';

            //    //html += htmlLi.format(item.label);
            //    html += options.templateItem(item);

            //    if (item.childs != null && item.isChild) {
            //        html += '<ol class="sortable-tool-parent ' + (!options.isCollapse ? 'isCollapse' : 'isExpand') + '" data-is-child="' + item.isChild + '">';
            //        html += repeatElm(item.childs, level + 1);
            //        html += "</ol>";
            //    }
            //    html += "</li>";

            //}
            //if (level == 1) {
            //    html += "</ol>";
            //}
            //return html;

            if (level == 1) {
                var ol = $('<ol class="sortable-tool-parent"></ol>');
                parent.append(ol);
                parent = ol;
            }

            for (var i = 0; i < datas.length; i++) {
                var item = datas[i];

                var indexHtml = 'index-' + indexLocal;
                var li = $('<li class="sortable-tool-li-item">' + options.templateItem(item) + '</li>');
                li.data('dataItem', item);
                if (!options.defaultCheck) {
                    li.find('.btnCheck').removeClass('check uncheck minus').addClass('uncheck');
                }
                parent.append(li);
                if (item.childs != null && item.isChild) {
                    li.find('.btnExpand').show();
                    var ol = $('<ol class="sortable-tool-parent ' + (!options.isCollapse ? 'isCollapse' : 'isExpand') + '" data-is-child="' + item.isChild + '"></ol>');
                    li.append(ol);
                    repeatElm(item.childs, ol, level + 1);
                }
                else {
                    li.find('.btnExpand').hide();
                }
            }
        }

        var addEvent = function (elm) {
            elm.find('ol').each(function (index, e) {
                e = $(e);
                var isCollapse = !e.hasClass('isCollapse');
                e.prev().find('.btnExpand').removeClass('fa fa-chevron-down').removeClass('fa fa-chevron-right').addClass(isCollapse ? 'fa fa-chevron-down' : 'fa fa-chevron-right').addClass(isCollapse ? 'isExpand' : 'isCollapse');
            });

            if (options.isShowCheck) {
                elm.find('li .btnCheck').show();
            }
            else {
                elm.find('li .btnCheck').hide();
            }

            if (options.isShowMove) {
                elm.find('li .btnMove').show();
            }
            else {
                elm.find('li .btnMove').hide();
            }

            if (options.isShowExpand) {
                elm.find('li .btnExpand').show();
            }
            else {
                elm.find('li .btnExpand').hide();
            }

            elm.find('> ol').sortable({
                handle: '.btnMove',
                onDrop: function ($item, position, _super, event) {
                    getCheckedOl(options.elm.find('> ol.sortable-tool-parent'));
                    _super($item, position, _super, event);
                    options.onDrag($item, position, _super, event);
                }
            });

            elm.find('.btnExpand').click(function () {
                var elm = $(this);
                var isCollapse = elm.hasClass('isCollapse');
                if (isCollapse) {
                    options.onClickExpand.apply(options, [elm]);
                }
                elm.removeClass('fa fa-chevron-down').removeClass('fa fa-chevron-right').removeClass('isCollapse').removeClass('isExpand').addClass(isCollapse ? 'fa fa-chevron-down' : 'fa fa-chevron-right').addClass(isCollapse ? 'isExpand' : 'isCollapse');

                elm.closest('.sortable-tool-item').next().removeClass('isCollapse').removeClass('isExpand').addClass(isCollapse ? 'isExpand' : 'isCollapse');
            });
            elm.find('.btnCheck').click(function () {
                var elm = $(this);
                var isChecked = elm.hasClass('check');
                var isMinus = elm.hasClass('minus');
                elm.removeClass('uncheck').removeClass('minus').removeClass('check');
                if (isChecked == true) {
                    elm.addClass('uncheck');
                }
                else {
                    elm.addClass('check');
                }

                elm.closest('.sortable-tool-item').next().find('.sortable-tool-item .btnCheck').removeClass('uncheck').removeClass('minus').removeClass('check').addClass(isChecked ? 'uncheck' : 'check');
                getCheckedOl(options.elm.find('> ol.sortable-tool-parent'));
                options.onClickCheck();
            });
        }

        var _return = {
            checkAll: function (bool) {
                bool = bool != null ? bool : false;
                elm.find('.sortable-tool-item .btnCheck').removeClass('uncheck').removeClass('minus').removeClass('check').addClass(!bool ? 'uncheck' : 'check');
            },
            expandAll: function (bool) {
                bool = bool != null ? bool : false;
                elm.find('.btnExpand').removeClass('isExpand').removeClass('isCollapse').addClass(bool ? 'isCollapse' : 'isExpand').trigger('click');
            },
            refresh: function () {
                return getCheckedOl(options.elm.find('> ol.sortable-tool-parent'));
            },
            GetData: function () {
                return getCheckedOl(options.elm.find('> ol.sortable-tool-parent'));
            },
            AppendHTML: function (parent, datas) {
                repeatElm(datas, parent, 2);
                addEvent(parent);
                getCheckedOl(parent);
            },
            Load: function (datas) {
                options = $.extend(true, {
                    elm: elm,
                    isCollapse: false,
                    isShowCheck: false,
                    isShowMove: true,
                    isShowExpand: true,
                    isHiddenExpandNull: true,

                    defaultCheck: true,
                    data: [
                        //{
                        //    id: 0,
                        //    label: "dkamphuoc1",
                        //    isChild: true,
                        //    childs: []
                        //}
                    ],
                    templateItem: function (item) {
                        return htmlLi.format(item.label);
                    },
                    onClickExpand: function () {
                    },
                    onDrag: function () {
                    },
                    onClickCheck: function () {

                    },
                    onProgress: function () {

                    },
                    onFailed: function () {

                    }
                }, options);

                elm.html("");

                var html = repeatElm(datas || options.data, elm);
                //elm.html(html);
                addEvent(elm);
                getCheckedOl(options.elm.find('> ol.sortable-tool-parent'));
            }
        }
        return _return;
    }
    function isUndefined(n) {
        return typeof n === 'undefined';
    }
    $.fn.SortableTool = function (options) {
        for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            args[_key - 1] = arguments[_key];
        }
        var result;
        this.each(function (i, element) {
            var $this = $(element);
            var data = $this.data(NAMESPACE);
            if (data != null) {

                if (typeof options === 'string') {
                    var fn = data[options];

                    if ($.isFunction(fn)) {
                        result = fn.apply(data, args);
                    }
                }

            }
            else {
                $this.data(NAMESPACE, data = new SortableTool(element, options));
                data.Load();
            }

        });
        return isUndefined(result) ? this : result;
    }

    $.fn.SortableTool.append = function (elm, datas, options) {
        var appendFunc = function (datas, parent) {
            for (var i = 0; i < datas.length; i++) {
                var item = datas[i];

                var li = $('<li class="sortable-tool-li-item">' + options.templateItem(item) + '</li>');
                li.data('dataItem', item);
                parent.append(li);
                if (item.childs != null && item.isChild) {
                    var ol = $('<ol class="sortable-tool-parent ' + (!options.isCollapse ? 'isCollapse' : 'isExpand') + '" data-is-child="' + item.isChild + '"></ol>');
                    li.append(ol);
                    appendFunc(item.childs, ol);
                }
            }
        }

        appendFunc(datas, elm);
    };
})(jQuery);

(function ($) {
    $.fn.serializeObject = function (options) {
        options = jQuery.extend(true, {
            validateName: true
        }, options);

        var self = this,
            json = {},
            push_counters = {},
            patterns = {
                "validate": /^[a-zA-Z][a-zA-Z0-9_]*(?:\[(?:\d*|[a-zA-Z0-9_]+)\])*$/,
                "key": /[a-zA-Z0-9_]+|(?=\[\])/g,
                "push": /^$/,
                "fixed": /^\d+$/,
                "named": /^[a-zA-Z0-9_]+$/
            };


        this.build = function (base, key, value) {
            base[key] = value;
            return base;
        };

        this.push_counter = function (key) {
            if (push_counters[key] === undefined) {
                push_counters[key] = 0;
            }
            return push_counters[key]++;
        };

        $.each($(this).serializeArray(), function () {

            // skip invalid keys
            if (!patterns.validate.test(this.name) && options.validateName) {
                return;
            }

            var k,
                keys = this.name.match(patterns.key),
                merge = this.value,
                reverse_key = this.name;

            while ((k = keys.pop()) !== undefined) {

                // adjust reverse_key
                reverse_key = reverse_key.replace(new RegExp("\\[" + k + "\\]$"), '');

                // push
                if (k.match(patterns.push)) {
                    merge = self.build([], self.push_counter(reverse_key), merge);
                }

                    // fixed
                else if (k.match(patterns.fixed)) {
                    merge = self.build([], k, merge);
                }

                    // named
                else if (k.match(patterns.named)) {
                    merge = self.build({}, k, merge);
                }
            }

            json = $.extend(true, json, merge);
        });

        return json;
    };
})(jQuery);
