sap.ui.define([
	'../BaseController',
	'sap/ui/core/Fragment',
	'sap/ui/model/json/JSONModel',
	'sap/m/MessageBox',
	'sap/m/MessageToast',
	'sap/ui/core/Item',
	'sap/ui/table/library'
], function (BaseController, Fragment, JSONModel, MessageBox, MessageToast, Item, library) {
	'use strict';
		let _i18n,
			_currentUser,
            _applicantUser,
            _this,
            rendered = false
    return BaseController.extend('crdt.wf.ui5.controller.SystemSettings.SalesAdminDept', {

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
            var table = this.byId("table");
            _this = this
            var jsonSalesAdminDeptModel;
            jQuery.ajax({
                type: "Post",
                dataType: "json",
                async: false,
                data: {
                    pageReq: this.getCustomData(table, 'pageReq')
                },
                url: "/SalesAdminDept/GetSalesAdminRegionDeptList",
                success: function (res) {
                    if (res.Code == 200) {
                        jsonSalesAdminDeptModel = res.Data;
                        if (jsonSalesAdminDeptModel.length > 0) {
                            for (var i = 0; i < jsonSalesAdminDeptModel.length; i++) {
                                jsonSalesAdminDeptModel[i].CreateDate = _this.formatting(jsonSalesAdminDeptModel[i].CreateDate);
                                if (jsonSalesAdminDeptModel[i].UpdateDate != null) {
                                    jsonSalesAdminDeptModel[i].UpdateDate = _this.formatting(jsonSalesAdminDeptModel[i].UpdateDate);
                                }
                                else {
                                    jsonSalesAdminDeptModel[i].UpdateDate = null;
                                }
                            }
                        }
                        _this.updatePage(table, res)
                        table.setModel(new JSONModel(_this.dataInit(jsonSalesAdminDeptModel))).bindRows('/')
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
        //销售管理员-区域-部门组表单页面
        _openSalesAdminRegionDeptForm: function (_data) {
            let oView = this.getView(),
                _this = this,
                _oDialogId = this.getDialogId()
            if (!this._SalesAdminRegionDeptFormDialog) {
                this._SalesAdminRegionDeptFormDialog = Fragment.load({
                    id: _oDialogId,
                    name: 'crdt.wf.ui5.view.SystemSettings.SalesAdminDeptForm',
                    controller: this
                }).then(function (oDialog) {
                    oView.addDependent(oDialog)
                    _this.EventBind(_data)
                    return oDialog;
                });
            }

            this._SalesAdminRegionDeptFormDialog.then(function (oDialog) {
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
        //销售管理员-区域-部门组新增页面
        onDialogCreate: function () {
            var _this = this;
            var _v = {
                CompanyCode: "8200",
                SalesAdmin: "AWH",
                Region: "",
                DeptCode: "",
                DeptName:"",
                Type:"Add"
            }
            this._openSalesAdminRegionDeptForm(_v);
        },
        //销售管理员-区域-部门组编辑
        onEdit: function (oEvent) {
            let _vc = oEvent.getParameter('row').getBindingContext().getObject(),
                _v = JSON.parse(JSON.stringify(_vc))
            _v.Type = "Edit";
            this._openSalesAdminRegionDeptForm(_v)
        },
        //监听绑定
        EventBind: function (data) {
            var spras;
            if (_i18n.sLocale == "zh_CN" || _i18n.sLocale == "zh_HK") {
                spras = "M";
            }
            else if (_i18n.sLocale == "en_US") {
                spras = "E";
            }
            var SalesAdminList;
            jQuery.ajax({
                type: 'Post',
                url: '/SalesAdminDept/GetSalesAdminListByBukrs',
                dataType: 'json',
                async: false,
                data: {
                    SPRAS: spras,
                    BUKRS: "8200"
                },
                success: function (res) {
                    if (res.Code == 200) {
                        SalesAdminList = res.Data;
                    }
                    else {
                        MessageToast.show(_i18n.getText('ymsg.Error') + ':' + res.Message)
                    }
                }
            })
            var oSalesAdminJSONData = {
                SalesAdminModel: SalesAdminList
            };
            var oModel = new sap.ui.model.json.JSONModel();
            oModel.setData(oSalesAdminJSONData);
            this.getView().setModel(oModel, "SalesAdmin");
            var jsonPlantDicModel;
            var plantType = "PLANT";
            jQuery.ajax({
                type: "Get",
                dataType: "json",
                async: false,
                url: "/Dictionary/GetDicListByType?type=" + plantType,
                success: function (res) {
                    if (res.Code == 200) {
                        jsonPlantDicModel = res.Data;
                    }
                    else {
                        MessageToast.show(res.Message);
                    }
                },
                error: function (err) {
                    MessageToast.show(err.statusText);
                }
            });
            var oDicJSONData = {
                PlantModel: jsonPlantDicModel
            };
            var oModel = new sap.ui.model.json.JSONModel();
            oModel.setData(oDicJSONData);
            this.getView().setModel(oModel, "PlantData");
        },
        //销售管理员-区域-部门组表单关闭
        onCancel: function (oEvent) {
            let _oDialogId = this.getDialogId(),
                _CustomTable = Fragment.byId(_oDialogId, "dialog_salesAdminDeptForm"),
                _this = this;
            this._SalesAdminRegionDeptFormDialog.then(function (oDialog) {
                oDialog.close();
                _this._SalesAdminRegionDeptFormDialog = null
                _CustomTable.destroy();
            })
        },
        //提交表单数据
        onSubmit: function () {
            let success = true
            var sValueState = "None";
            let _oDialogId = this.getDialogId(),
                oForm = Fragment.byId(_oDialogId, 'FormDetails'),
                oFormData = oForm.getModel('FormData').getData(),
                _this = this;
            if (oFormData.Type=="Add")
            {
                oFormData.CreateUserId = _currentUser["UserId"];
            }
            else if (oFormData.Type == "Edit") {
                oFormData.UpdateUserId = _currentUser["UserId"];
            }
            var salesAdmin = this.byId("SalesAdmin").getSelectedItem();
            if (salesAdmin == null | salesAdmin == "") {
                this.byId("SalesAdmin").setValueState('Error').setValueStateText(_i18n.getText('ValueStateText_CannotEmpty'));
                success = false
            }
            else
            {
                this.byId("SalesAdmin").setValueState(sValueState)
                oFormData.SalesAdmin = salesAdmin.getKey();
            }
            if (!success) {
                MessageToast.show(_i18n.getText('ymsg.Validation'))
            }
            else
            {
                jQuery.ajax({
                    type: 'Post',
                    url: '/SalesAdminDept/SaveSalesAdminDept',
                    dataType: 'json',
                    async: false,
                    data: {
                        salesAdminDeptModel: this.dataIntegration(oFormData),
                        token: _this.getToken()
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
            }
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
                            url: "/SalesAdminDept/DeleteSalesAdminDept?companyCode=" + _v.CompanyCode + "&salesAdmin=" + _v.SalesAdmin + "&region=" + _v.Region,
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
        onPlantChange: function ()
        {
            var spras;
            if (_i18n.sLocale == "zh_CN" || _i18n.sLocale == "zh_HK") {
                spras = "M";
            }
            else if (_i18n.sLocale == "en_US") {
                spras = "E";
            }
            var companyCode = this.byId("CompanyCode").getSelectedKey();
            var SalesAdminList;
            jQuery.ajax({
                type: 'Post',
                url: '/SalesAdminDept/GetSalesAdminListByBukrs',
                dataType: 'json',
                async: false,
                data: {
                    SPRAS: spras,
                    BUKRS: companyCode
                },
                success: function (res) {
                    if (res.Code == 200) {
                        SalesAdminList = res.Data;
                    }
                    else {
                        MessageToast.show(_i18n.getText('ymsg.Error') + ':' + res.Message)
                    }
                }
            })
            var oSalesAdminJSONData = {
                SalesAdminModel: SalesAdminList
            };
            var oModel = new sap.ui.model.json.JSONModel();
            oModel.setData(oSalesAdminJSONData);
            this.getView().setModel(oModel, "SalesAdmin");
        }
	});
});