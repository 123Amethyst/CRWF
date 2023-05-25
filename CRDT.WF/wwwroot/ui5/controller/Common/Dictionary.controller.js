sap.ui.define([
	'../BaseController',
	'sap/ui/core/Fragment',
	'sap/ui/model/json/JSONModel',
	'sap/m/MessageBox',
	'sap/m/MessageToast',
	'sap/ui/core/Item',
    'sap/ui/table/library',
    "../../model/jszip",
    "../../model/xlsx",
], function (BaseController, Fragment, JSONModel, MessageBox, MessageToast, Item, library, jszip, xlsx) {
	'use strict';
		let _i18n,
			_currentUser,
            _applicantUser,
            _this,
            rendered = false
    return BaseController.extend('crdt.wf.ui5.controller.Common.Dictionary', {

        //初始化
        onInit: function (oEvent) {
            this.initLanguage()
        },
        onAfterRendering: function (oEvent) {
            this.initLanguage()
            _i18n = this.getResourceBundle()
            _currentUser = this.getSysInfo('CurrentUser')
            if (!rendered) {
                this.DataLoad()
            }
        },
        DataLoad: function (oEvent)
        {
            var type = this.oView.oPropagatedProperties.oModels.type.oData.type;
            if (type == "VBA") {
                this.byId("uploadVBA").setVisible(true);
            }
            else
            {
                this.byId("uploadVBA").setVisible(false);
            }
            this.byId("dtype").setValue(type);
            this._onRefresh();
        },
        //数据初始化
        dataInit: function (_d) {
            let _r = []
            if (_d != null) {
                _r = _d
            }
            return _r
        },
        //数据整合
        dataIntegration: function (oFormData) {
            let data = oFormData
            return data
        },
        //厂房列表查询
        _onRefresh: function ()
        {
            var dtype = this.byId("dtype").getValue();
            var table = this.byId("table");
            _this = this
            var jsonDicModel;
            jQuery.ajax({
                type: "Post",
                dataType: "json",
                async: false,
                data: {
                    type: dtype,
                    pageReq: this.getCustomData(table, 'pageReq')
                },
                url: "/Dictionary/GetDicListByType",
                success: function (res) {
                    if (res.Code == 200) {
                        jsonDicModel = res.Data;
                        if (jsonDicModel.length > 0) {
                            for (var i = 0; i < jsonDicModel.length; i++) {
                                jsonDicModel[i].ERDAT = _this.formatting(jsonDicModel[i].ERDAT);
                                if (jsonDicModel[i].AEDAT != null) {
                                    jsonDicModel[i].AEDAT = _this.formatting(jsonDicModel[i].AEDAT);
                                }
                                else {
                                    jsonDicModel[i].AEDAT = null;
                                }
                            }
                        }
                        _this.updatePage(table, res)
                        table.setModel(new JSONModel(_this.dataInit(jsonDicModel))).bindRows('/')
                    }
                    else {
                        MessageToast.show(res.Message);
                    }
                },
                error: function (err) {
                    MessageToast.show(err.statusText);
                }
            });
        },
        //字典表单页面
        _openDicForm: function (_data) {
            let oView = this.getView(),
                _this = this,
                _oDialogId = this.getDialogId()
            if (!this._DicFormDialog) {
                this._DicFormDialog = Fragment.load({
                    id: _oDialogId,
                    name: 'crdt.wf.ui5.view.common.DictionaryForm',
                    controller: this
                }).then(function (oDialog) {
                    oView.addDependent(oDialog)
                    //_this.EventBind(_data)
                    return oDialog;
                });
            }

            this._DicFormDialog.then(function (oDialog) {
                let oForm = Fragment.byId(_oDialogId, 'FormDetails')

                oDialog.open();
                let _data1 = JSON.parse(JSON.stringify(_data))
                oForm.setModel(new JSONModel(_data1), 'FormData')
            })
        },
        //获取页面Id
        getDialogId: function () {
            return this.getView().getId();
        },
        //字典新增页面
        onDialogCreate: function () {
            var type = this.byId("dtype").getValue();
            var _v = {
                ID: null,
                DTYPE: type,
                DCODE: "",
                DNAME: "",
                PTYPE: "",
                PCODE: ""
            }
            this._openDicForm(_v);
        },
        //字典编辑
        onEdit: function (oEvent) {
            let _vc = oEvent.getParameter('row').getBindingContext().getObject(),
                _v = JSON.parse(JSON.stringify(_vc))
            this._openDicForm(_v)
        },
        //监听绑定
        //EventBind: function (data) {
        //    var _oDialogId = this.getDialogId()
        //    var _dTypeInputs = ['dTypeInput'];
        //    _dTypeInputs.forEach(u => {
        //        var _Input = Fragment.byId(_oDialogId, u);
        //       _Input.setEditable(false);
        //    })
        //},
        //字典表单关闭
        onCancel: function (oEvent) {
            let _oDialogId = this.getDialogId(),
                _CustomTable = Fragment.byId(_oDialogId, "dialog_dictionaryForm"),
                _this = this;
            this._DicFormDialog.then(function (oDialog) {
                oDialog.close();
                _this._DicFormDialog = null
                _CustomTable.destroy();
            })
        },
        //数据校验
        onDTYPEChange: function (oEvent) {
            var oInput = oEvent.getSource();
            this._validateInput(oInput);
        },
        onDCODEChange: function (oEvent) {
            var oInput = oEvent.getSource();
            this._validateInput(oInput);
        },
        onDNAMEChange: function (oEvent) {
            var oInput = oEvent.getSource();
            this._validateInput(oInput);
        },
        _validateInput: function (oInput) {
            var sValueState = "None";
            var bValidationError = false;
            var value = oInput.getValue();
            if (oInput.getRequired() && (value == null || value == "")) {
                sValueState = "Error";
                bValidationError = "true";
                var sValueStateText = _i18n.getText('ymsg.NullValue');
                oInput.setValueStateText(sValueStateText);
            }
            oInput.setValueState(sValueState);

            return bValidationError;
        },
        //提交表单数据
        onSubmit: function () {
            var id = this.byId("idInput").getValue();
            var errorDTYPE = this._validateInput(this.byId("dTypeInput"));
            var errorDCODE = this._validateInput(this.byId("dCodeInput"));
            var errorDNAME = this._validateInput(this.byId("dNameInput"));
            if (errorDTYPE == "true" || errorDCODE == "true" || errorDNAME == "true") {
                return;
            }
            let _oDialogId = this.getDialogId(),
                oForm = Fragment.byId(_oDialogId, 'FormDetails'),
                oFormData = oForm.getModel('FormData').getData(),
                _this = this,
                _currentUser;
            _currentUser = this.getSysInfo('CurrentUser')
            oFormData.ERNAM = _currentUser["Account"];
            if (oFormData.ID > 0) {
                oFormData.AENAM = _currentUser["Account"];
            }
            jQuery.ajax({
                type: 'Post',
                url: '/Dictionary/SaveDic',
                dataType: 'json',
                async: false,
                data: {
                    id: id,
                    dicModel: this.dataIntegration(oFormData)
                },
                success: function (res) {
                    if (res.Code == 200) {
                        _this.onCancel();
                        MessageToast.show(_i18n.getText('ymsg.SuccessSave'))
                        _this._onRefresh();
                    }
                    else {
                        MessageToast.show(_i18n.getText('ymsg.Error') + ':' + res.Message)
                    }
                }
            })
        },
        //刪除
        onDelete: function (oEvent) {
            var _vc = oEvent.getParameter('row').getBindingContext().getObject();
            var _v = JSON.parse(JSON.stringify(_vc));
            MessageBox.warning(_i18n.getText('ymsg.DeleteContent'), {
                styleClass: "halfWidth",
                actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
                emphasizedAction: MessageBox.Action.OK,
                onClose: function (sAction) {
                    if (sAction == 'OK') {
                        $.ajax({
                            type: "Delete",
                            async: false,
                            url: "/Dictionary/DeleteDicById?id=" + _v.ID,
                            success: function (data) {
                                if (data.Code == 200) {
                                    _this._onRefresh();
                                    MessageToast.show(_i18n.getText('ymsg.SuccessDelete'));
                                }
                                else {
                                    MessageToast.show(_i18n.getText('ymsg.Error') + ':' + data.Message)
                                }
                            },
                            error: function (err) {
                                MessageToast.show(err.statusText);
                            }
                        });
                    }
                }
            })
        },
        onUploadVBA: function ()
        {
            let oView = this.getView(),
                _this = this,
                _oDialogId = this.getDialogId()
            if (!this._VBAUploadDialog) {
                this._VBAUploadDialog = Fragment.load({
                    id: _oDialogId,
                    name: 'crdt.wf.ui5.view.common.VBAUpload',
                    controller: this
                }).then(function (oDialog) {
                    oView.addDependent(oDialog)
                    return oDialog;
                });
            }
            this._VBAUploadDialog.then(function (oDialog) {
                oDialog.open();
                _this.initList();
            })
        },
        initList: function () {
            var oFileUploader = this.getView().byId("fileUploader");
            oFileUploader.clear();
            var oModel = new sap.ui.model.json.JSONModel();
            var VBA = {};
            oModel.setData(VBA);
            this.getView().setModel(oModel, "dataModel");
        },
        onUploadCancel: function ()
        {
            let _oDialogId = this.getDialogId(),
                _CustomTable = Fragment.byId(_oDialogId, "dialog_vBAUpload"),
                _this = this;
            this._VBAUploadDialog.then(function (oDialog) {
                oDialog.close();
                _this._onRefresh();
                _this._VBAUploadDialog = null
                _CustomTable.destroy();
            })
        },
        handleChange: function (oEvent) {

            var oFileUploader = this.getView().byId("fileUploader");

            var oFile = oFileUploader.oFileUpload.files[0];

            this._import(oFile);
        },
        _import: function (file) {

            if (file && window.FileReader) {

                var reader = new FileReader();

                var result = {},

                    data;

                var that = this;

                reader.onload = function (e) {

                    data = e.target.result;

                    //XLSX: Defined in xlsx.js

                    var wb = XLSX.read(data, {

                        type: 'binary'

                    });

                    wb.SheetNames.forEach(function (sheetName) {

                        var roa = XLSX.utils.sheet_to_row_object_array(wb.Sheets[sheetName]);

                        var jsonObjString = JSON.stringify(roa);

                        if (roa.length > 0) {
                            result[sheetName] = roa;
                        }
                    });
                };
                reader.readAsBinaryString(file);
                reader.onloadend = function (e) {
                    that.result = result;

                };
            }
        },
        handleUploadPress: function (e) {
            var oFileUploader = this.getView().byId("fileUploader");
            var domRef = oFileUploader.getFocusDomRef();
            var file = domRef.files[0];
            if (file == null) {
                MessageToast.show(_i18n.getText('xfld.PleaseChooseFile'));
                return;
            }
            if (this.result) {
                var JSONString = JSON.stringify(this.result);

                var JSONObject = JSON.parse(JSONString);

                var oJSONModel = new JSONModel();

                oJSONModel.setData(JSONObject);

                this.getView().setModel(oJSONModel, "dataModel");

            };
        },
        uploadFileData: function (e) {           
            var oFileUploader = this.getView().byId("fileUploader");
            var domRef = oFileUploader.getFocusDomRef();
            var file = domRef.files[0];
            if (file == null) {
                MessageToast.show(_i18n.getText('xfld.PleaseChooseFile'));
                return;
            }
            var _currentUser;
            _currentUser = this.getSysInfo('CurrentUser')
            var oFileUploader = this.getView().byId("fileUploader");
            var VBAArray = this.result.VBA;
            if (VBAArray != null && VBAArray.length > 0) {
                for (var i = 0; i < VBAArray.length; i++) {
                    var oFormData = {};
                    var id = null;
                    oFormData.DTYPE = "VBA";
                    oFormData.DCODE = VBAArray[i].VBA;
                    oFormData.DNAME = "VBA";
                    oFormData.ERNAM = _currentUser["Account"];
                    jQuery.ajax({
                        type: 'Post',
                        url: '/Dictionary/SaveDic',
                        dataType: 'json',
                        async: false,
                        data: {
                            id: id,
                            dicModel: this.dataIntegration(oFormData)
                        },
                        success: function (res) {
                            if (res.Code == 200) {
                                VBAArray[i].Result = "Success Import";
                                _this.handleUploadPress();
                            }
                            else {
                                VBAArray[i].Result = "Fail Import:" + res.Message;
                                _this.handleUploadPress();
                            }
                        }
                    })
                }
            } else {
                MessageToast.show(_i18n.getText('ymsg.NullContent'));
            }
        },
	});
});