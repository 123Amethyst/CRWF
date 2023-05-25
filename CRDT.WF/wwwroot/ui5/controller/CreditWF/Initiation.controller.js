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
			rendered = false
	return BaseController.extend('crdt.wf.ui5.controller.CreditWF.Initiation', {

		//初始化
		onInit: function () {
			this.initLanguage()
			//_i18n = this.getResourceBundle()
			//_currentUser = this.getSysInfo('CurrentUser');
			//_applicantUser = _currentUser
			//this.DataLoad()
		},
		onAfterRendering: function (oEvent) {
			this.initLanguage()
			_i18n = this.getResourceBundle()
			_currentUser = this.getSysInfo('CurrentUser')
			_applicantUser = _currentUser
			if (!rendered) {
				this.DataLoad()
				rendered = true
			}
		},
		//数据绑定
		DataLoad: function () {
			let oForm = this.byId('FormApprovalFlow_Initiation');
			var currentPlant = new Array();
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
						if (_currentUser["Company"] != null && _currentUser["Company"].length>0)
						{
							if (jsonPlantDicModel != null && jsonPlantDicModel.length > 0) {
								for (var i = 0; i < _currentUser["Company"].length; i++) {
									for (var j = 0; j < jsonPlantDicModel.length; j++) {
										if (_currentUser["Company"][i] == jsonPlantDicModel[j].DCODE)
										{
											currentPlant.push(jsonPlantDicModel[j]);
										}
									}
                                }
							}
						}
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
				PlantModel: currentPlant
			};
			var oModel = new sap.ui.model.json.JSONModel();
			oModel.setData(oDicJSONData);
			this.getView().setModel(oModel, "PlantData");
			var jsonAppTypeDicModel;
			var appType = "APPTYPE";
			jQuery.ajax({
				type: "Get",
				dataType: "json",
				async: false,
				url: "/Dictionary/GetDicListByType?type=" + appType,
				success: function (res) {
					if (res.Code == 200) {
						jsonAppTypeDicModel = res.Data;
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
				AppTypeModel: jsonAppTypeDicModel
			};
			var oModel = new sap.ui.model.json.JSONModel();
			oModel.setData(oDicJSONData);
			this.getView().setModel(oModel, "AppTypeData");			
			let _d = {
				BUKRS: (_currentUser['Company'] != null && _currentUser['Company'].length > 0) ? _currentUser['Company'][0] : "",
				InitiatorUserId: _currentUser['UserId'],
				InitiatorAccount: _currentUser['Account'],
				InitiatorAccountName: _currentUser['AccountName'],
				ApplicantUserId: _currentUser['UserId'],
				ApplicantAccount: _currentUser['Account'],
				ApplicantAccountName: _currentUser['AccountName'],
				Department: _currentUser['CostCenter'],
				DepartmentName: _currentUser['CostCenterName'],
				AppType: "CRDT01"
			}
			oForm.setModel(new JSONModel(_d), 'FormData');
		},
		onSubmitPress: function (oEvent)
		{
			//if (_applicantUser["SalesAdmin"] != null && _applicantUser["SalesAdmin"].length>0) {
				let _todolist = sap.ui.getCore().byId("Page_CreditWF_ToDoList");
				var appAction = this.byId("ApplicationAction").getSelectedKey();
				if (this.SubmitVerification()) {
					let _data = {}
					_data['HD'] = {
						'REQID': '',
						'FLWNM': "",
						'FLWCD': "",
						'ACTCD': '',
						'ACTNM': '',
						'USRID': _applicantUser['Account'],
						'USRNM': _applicantUser['AccountName'],
						'APPTYPE': this.byId("ApplicationAction").getSelectedKey(),
						'PLANT': this.byId("Plant").getSelectedKey(),
						'PLANT_NAME': this.byId("Plant").getSelectedItem().getText().substring(this.byId("Plant").getSelectedItem().getText().indexOf('-') + 1),
						'DEPTC': _applicantUser['CostCenter'],
						'DEPTN': _applicantUser['CostCenterName'],
						'POSTXT': _applicantUser['PositionName'],
						'ACTION': this.byId("ApplicationAction").getSelectedItem().getText(),
						'APDAT': this.formatting(new Date()).substr(0, 10),
						'DETAILS': this.byId("Details").getValue(),
						'MESSAGE': "",
						'DELFG': 'N',
						'ERNAM': _currentUser['Account'],
						'ERTXT': _currentUser['AccountName']
					}
					_data['Detail'] = []
					_data['ApplicantUserProperty'] = _applicantUser
					_data['SubmitterUserProperty'] = _currentUser
					if (appAction == "CRDT01") {
						var isSales = false;
						if (_applicantUser['RoleId'].length > 0) {
							//for (var i = 0; i < _applicantUser['RoleId'].length; i++) {
							//	if (_applicantUser['RoleId'][i] == "SM" || _applicantUser['RoleId'][i] == "DM" || _applicantUser['RoleId'][i] == "SD") {
							//		isSales = true;
							//		break;
							//	}
							//}
							for (var i = 0; i < _applicantUser['RoleId'].length; i++) {
								if (_applicantUser['RoleId'][i] == "Applicant") {
									isSales = true;
									break;
								}
							}
						}
						if (isSales) {
							_data['Page'] = 'Form_OpenCRDT_Index'
						}
						else {
							MessageToast.show(_i18n.getText("ymsg.AppTypeSubmitCheck", ["Open Credit Customer"]));
							return;
						}
					}
					else if (appAction == "CRDT02") {
						var isSales = false;
						if (_applicantUser['RoleId'].length > 0) {
							//for (var i = 0; i < _applicantUser['RoleId'].length; i++) {
							//	if (_applicantUser['RoleId'][i] == "SM" || _applicantUser['RoleId'][i] == "DM" || _applicantUser['RoleId'][i] == "SD") {
							//		isSales = true;
							//		break;
							//	}
							//}
							for (var i = 0; i < _applicantUser['RoleId'].length; i++) {
								if (_applicantUser['RoleId'][i] == "Applicant") {
									isSales = true;
									break;
								}
							}
						}
						if (isSales) {
							_data['Page'] = 'Form_UpdateCRDT_Index'
						}
						else {
							MessageToast.show(_i18n.getText("ymsg.AppTypeSubmitCheck", ["Update Credit Customer"]));
							return;
						}
					}
					else if (appAction == "CRDT03") {
						var isClerk = false;
						if (_applicantUser['RoleId'].length > 0) {
							for (var i = 0; i < _applicantUser['RoleId'].length; i++) {
								if (_applicantUser['RoleId'][i] == "Clerk") {
									isClerk = true;
									break;
								}
							}
						}
						if (isClerk) {
							_data['Page'] = 'Form_UpdateVBA_Index'
						}
						else {
							MessageToast.show(_i18n.getText("ymsg.AppTypeSubmitCheck", ["Update VBA/Reconciliation Account"]));
							return;
						}
					}
					else if (appAction == "CRDT04") {
						var isSales = false;
						if (_applicantUser['RoleId'].length > 0) {
							//for (var i = 0; i < _applicantUser['RoleId'].length; i++) {
							//	if (_applicantUser['RoleId'][i] == "SM" || _applicantUser['RoleId'][i] == "DM" || _applicantUser['RoleId'][i] == "SD") {
							//		isSales = true;
							//		break;
							//	}
							//}
							for (var i = 0; i < _applicantUser['RoleId'].length; i++) {
								if (_applicantUser['RoleId'][i] == "Applicant") {
									isSales = true;
									break;
								}
							}
						}
						if (isSales) {
							_data['Page'] = 'Form_CloseCRDT_Index'
						}
						else {
							MessageToast.show(_i18n.getText("ymsg.AppTypeSubmitCheck", ["Close Credit Customer"]));
							return;
						}
					}
					else if (appAction == "CRDT05") {
						var isSales = false;
						if (_applicantUser['RoleId'].length > 0) {
							//for (var i = 0; i < _applicantUser['RoleId'].length; i++) {
							//	if (_applicantUser['RoleId'][i] == "SM" || _applicantUser['RoleId'][i] == "DM" || _applicantUser['RoleId'][i] == "SD") {
							//		isSales = true;
							//		break;
							//	}
							//}
							for (var i = 0; i < _applicantUser['RoleId'].length; i++) {
								if (_applicantUser['RoleId'][i] == "Applicant") {
									isSales = true;
									break;
								}
							}
						}
						if (isSales) {
							_data['Page'] = 'Form_ReOpenCRDT_Index'
						}
						else {
							MessageToast.show(_i18n.getText("ymsg.AppTypeSubmitCheck", ["Reopen Credit Customer"]));
							return;
						}
					}
					let fun = function () {
						_todolist = _todolist || sap.ui.getCore().byId("Page_CreditWF_ToDoList")
						if (_todolist != null)
							_todolist.getContent()[0].getController().reflashTableFlag()
					}
					if (_applicantUser["SalesAdmin"] != null && _applicantUser["SalesAdmin"].length > 0)
					{
						this.openNewWin(this, '/', 'newWin', { data: _data }, fun)
					}
					else {
						MessageToast.show(_i18n.getText("ymsg.IsOwnSalesAdmin"));
					}
				}
			//}
			//else
			//{
			//	MessageToast.show(_i18n.getText("ymsg.IsOwnSalesAdmin"));
			//}
		},
		SubmitVerification: function ()
		{
			let success = true
			var sValueState = "None";
			var plant = this.byId("Plant").getSelectedItem();
			if (plant == null) {
				this.byId("Plant").setValueState('Error').setValueStateText(_i18n.getText('ValueStateText_CannotEmpty'))
				success = false
			} else
			{
				this.byId("Plant").setValueState(sValueState)
			}
			if (this.byId("Initiator").getValue() == null || this.byId("Initiator").getValue() =="") {
				this.byId("Initiator").setValueState('Error').setValueStateText(_i18n.getText('ValueStateText_CannotEmpty'))
				success = false
			} else {
				this.byId("Initiator").setValueState(sValueState)
			}
			if (this.byId("Applicant").getValue() == null || this.byId("Applicant").getValue() =="") {
				this.byId("Applicant").setValueState('Error').setValueStateText(_i18n.getText('ValueStateText_CannotEmpty'))
				success = false
			} else {
				this.byId("Applicant").setValueState(sValueState)
			}
			if (this.byId("DepartmentName").getValue() == null || this.byId("DepartmentName").getValue()=="") {
				this.byId("DepartmentName").setValueState('Error').setValueStateText(_i18n.getText('ValueStateText_CannotEmpty'))
				success = false
			}else
			{
				this.byId("DepartmentName").setValueState(sValueState)
			}
			var applicationAction = this.byId("ApplicationAction").getSelectedItem();
			if (applicationAction == null) {
				this.byId("ApplicationAction").setValueState('Error').setValueStateText(_i18n.getText('ValueStateText_CannotEmpty'))
				success = false
			} else {
				this.byId("ApplicationAction").setValueState(sValueState)
			}
			if (this.byId("Details").getValue() == '') {
				this.byId("Details").setValueState('Error').setValueStateText(_i18n.getText('ValueStateText_CannotEmpty'))
				success = false
			}
			else
			{
				this.byId("Details").setValueState(sValueState)
			}
			if (!success)
				MessageToast.show(_i18n.getText('ymsg.Validation'))
			return success
		},
		//申请人选择
		ApplicantSelectionChange: function (oEvent) {
			let _d = oEvent.getParameter('rowContext').getObject(),
				_FormData = oEvent.getSource().getModel('FormData').getData()
			_applicantUser = _d
		},
		onPlantChange: function (oEvent)
		{
			var oForm = this.byId('FormApprovalFlow_Initiation');
			var _d = oEvent.getSource().getModel('FormData').getData();
			oForm.setModel(new JSONModel(_d), 'FormData');
			var _oDialogId = this.getView().getId();
			var _s = Fragment.byId(_oDialogId, 'Applicant');
			_s.setFirstSearch(true);
		}
	});
});