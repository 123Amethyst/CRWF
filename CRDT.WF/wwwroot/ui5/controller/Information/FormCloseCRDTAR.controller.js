sap.ui.define([
	'../BaseController',
	'sap/ui/table/library',
	'sap/m/MessageBox',
	'sap/m/MessageToast',
	'sap/ui/thirdparty/jquery',
	'sap/ui/core/Fragment',
	'sap/ui/model/json/JSONModel'
], function (
		BaseController,
		library,
		MessageBox,
		MessageToast,
		jQuery,
		Fragment,
		JSONModel,) {
		'use strict';
		let _i18n,
			_currentUser,
			_backgroundData,
			initVBA = false,
			initRecAccount = false;
	return BaseController.extend('crdt.wf.ui5.controller.Information.FormCloseCRDTAR', {
		//初始化
		onInit: function () {
			this.initLanguage()
			_i18n = this.getResourceBundle()
			_currentUser = this.getSysInfo('CurrentUser');
			_backgroundData = this.getSysInfo('BackgroundData')
			this.DataLoad();
		},
		//onAfterRendering: function () {
		//	if (initVBA) {
		//		this.byId("VirtualBankAccount").$().addClass("ChangeInputColor");
		//	}
		//	if (initRecAccount) {
		//		this.byId("ReconciliationAccount").$().addClass("ChangeSelectColor");
		//	}
		//},
		//数据绑定
		DataLoad: function () {
			var spras;
			if (_i18n.sLocale == "zh_CN" || _i18n.sLocale == "zh_HK") {
				spras = "M";
			}
			else if (_i18n.sLocale == "en_US") {
				spras = "E";
			}
			var jsonCusTypeDicModel;
			//var customerType = "CusType";
			//jQuery.ajax({
			//	type: "Get",
			//	dataType: "json",
			//	async: false,
			//	url: "/Dictionary/GetDicListByType?type=" + customerType,
			//	success: function (res) {
			//		if (res.Code == 200) {
			//			jsonCusTypeDicModel = res.Data;
			//		}
			//		else {
			//			MessageToast.show(res.Message);
			//		}
			//	},
			//	error: function (err) {
			//		MessageToast.show(err.statusText);
			//	}
			//});
			jQuery.ajax({
				type: "Get",
				dataType: "json",
				async: false,
				data:
				{
					SPRAS: spras,
					CoreId: "ZZCUSTORGTYPE"
				},
				url: "/Dictionary/GetCodeAndValueListByCoreId",
				success: function (res) {
					if (res.Code == 200) {
						jsonCusTypeDicModel = res.Data;
					}
					else {
						MessageToast.show(res.Message);
					}
				},
				error: function (err) {
					MessageToast.show(err.statusText);
				}
			});
			var jsonCreditTermDicModel;
			var creditTermType = "CreditTerm";
			jQuery.ajax({
				type: "Get",
				dataType: "json",
				async: false,
				url: "/Dictionary/GetDicListByType?type=" + creditTermType,
				success: function (res) {
					if (res.Code == 200) {
						jsonCreditTermDicModel = res.Data;
					}
					else {
						MessageToast.show(res.Message);
					}
				},
				error: function (err) {
					MessageToast.show(err.statusText);
				}
			});
			var jsonStatePrintDicModel;
			var statePrintType = "StatePrint";
			jQuery.ajax({
				type: "Get",
				dataType: "json",
				async: false,
				url: "/Dictionary/GetDicListByType?type=" + statePrintType,
				success: function (res) {
					if (res.Code == 200) {
						jsonStatePrintDicModel = res.Data;
					}
					else {
						MessageToast.show(res.Message);
					}
				},
				error: function (err) {
					MessageToast.show(err.statusText);
				}
			});
			var jsonInvoicePrintTimeDicModel;
			var invoicePrintTimeType = "InvoTime";
			jQuery.ajax({
				type: "Get",
				dataType: "json",
				async: false,
				url: "/Dictionary/GetDicListByType?type=" + invoicePrintTimeType,
				success: function (res) {
					if (res.Code == 200) {
						jsonInvoicePrintTimeDicModel = res.Data;
					}
					else {
						MessageToast.show(res.Message);
					}
				},
				error: function (err) {
					MessageToast.show(err.statusText);
				}
			});
			var jsonRiskClassDicModel;
			//var riskClassType = "RiskClass";
			//jQuery.ajax({
			//	type: "Get",
			//	dataType: "json",
			//	async: false,
			//	url: "/Dictionary/GetDicListByType?type=" + riskClassType,
			//	success: function (res) {
			//		if (res.Code == 200) {
			//			jsonRiskClassDicModel = res.Data;
			//		}
			//		else {
			//			MessageToast.show(res.Message);
			//		}
			//	},
			//	error: function (err) {
			//		MessageToast.show(err.statusText);
			//	}
			//});
			jQuery.ajax({
				type: "Get",
				dataType: "json",
				async: false,
				data:
				{
					SPRAS: spras,
					CoreId: "RISK_CLASS"
				},
				url: "/Dictionary/GetCodeAndValueListByCoreId",
				success: function (res) {
					if (res.Code == 200) {
						jsonRiskClassDicModel = res.Data;
					}
					else {
						MessageToast.show(res.Message);
					}
				},
				error: function (err) {
					MessageToast.show(err.statusText);
				}
			});
			var jsonCheckRuleDicModel;
			var jsonCheckRuleReBulidModel=[];
			//var checkRuleType = "CheckRule";
			//jQuery.ajax({
			//	type: "Get",
			//	dataType: "json",
			//	async: false,
			//	url: "/Dictionary/GetDicListByType?type=" + checkRuleType,
			//	success: function (res) {
			//		if (res.Code == 200) {
			//			jsonCheckRuleDicModel = res.Data;
			//		}
			//		else {
			//			MessageToast.show(res.Message);
			//		}
			//	},
			//	error: function (err) {
			//		MessageToast.show(err.statusText);
			//	}
			//});
			jQuery.ajax({
				type: "Get",
				dataType: "json",
				async: false,
				data:
				{
					SPRAS: spras,
					CoreId: "CHECK_RULE"
				},
				url: "/Dictionary/GetCodeAndValueListByCoreId",
				success: function (res) {
					if (res.Code == 200) {
						jsonCheckRuleDicModel = res.Data;
						if (jsonCheckRuleDicModel != null && jsonCheckRuleDicModel.length>0)
						{
							for (var i = 0; i < jsonCheckRuleDicModel.length; i++) {
								if (jsonCheckRuleDicModel[i].CORE_VALUE != "01" && jsonCheckRuleDicModel[i].CORE_VALUE != "02" && jsonCheckRuleDicModel[i].CORE_VALUE != "03" && jsonCheckRuleDicModel[i].CORE_VALUE != "10")
								{
									jsonCheckRuleReBulidModel.push(jsonCheckRuleDicModel[i]);
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
			var jsonRecAccountDicModel;
			var recAccountType = "RecAccount";
			jQuery.ajax({
				type: "Get",
				dataType: "json",
				async: false,
				url: "/Dictionary/GetDicListByType?type=" + recAccountType,
				success: function (res) {
					if (res.Code == 200) {
						jsonRecAccountDicModel = res.Data;
					}
					else {
						MessageToast.show(res.Message);
					}
				},
				error: function (err) {
					MessageToast.show(err.statusText);
				}
			});			
			let _arData = {};
			if (_backgroundData['HD']['REQID'] != null && _backgroundData['HD']['REQID'] != "") {
				if (_backgroundData['AR'] != null) {
					var businessNature = _backgroundData['AR']['BUSINESS_NATURE'];
					if (businessNature == "A1") {
						this.byId("EatDrink").setSelected(true);
					}
					else if (businessNature == "A2") {
						this.byId("Other").setSelected(true);
					}
					else {
						this.byId("EatDrink").setSelected(false);
						this.byId("Other").setSelected(false);
					}
					var security = _backgroundData['AR']['SECURITY'];
					if (security == "BG") {
						this.byId("BankGuarantee").setSelected(true);
					}
					else if (security == "Cash") {
						this.byId("Cash").setSelected(true);
					}
					else if (security == "Cheque") {
						this.byId("Cheque").setSelected(true);
					}
					else if (security == "Others") {
						this.byId("Others").setSelected(true);
					}
					else if (security == "Waived") {
						this.byId("Waived").setSelected(true);
					}
					else {
						this.byId("BankGuarantee").setSelected(false);
						this.byId("Cash").setSelected(false);
						this.byId("Cheque").setSelected(false);
						this.byId("Others").setSelected(false);
						this.byId("Waived").setSelected(false);
					}
					_arData =
					{
						'REQID': _backgroundData['AR']['REQID'],
						'CUST_TYPE': _backgroundData['AR']['CUST_TYPE'] != "" ? Array.from(_backgroundData['AR']['CUST_TYPE']) : [],
						'CREDIT_TERM': _backgroundData['AR']['CREDIT_TERM'].slice(1),
						'SEC_DEPOSIT': _backgroundData['AR']['SEC_DEPOSIT'],
						'CREDIT_LIMIT': _backgroundData['AR']['CREDIT_LIMIT'],
						'PRTOPT': _backgroundData['AR']['PRTOPT'],
						'BANKGUR_EXPDATE': this.formatting(_backgroundData['AR']['BANKGUR_EXPDATE']),
						'PERRL': _backgroundData['AR']['PERRL'],
						'VALID_TO': this.formatting(_backgroundData['AR']['VALID_TO']),
						'CRMANAGER': _backgroundData['AR']['CRMANAGER'],
						'DEPOSIT_REF_NO': _backgroundData['AR']['DEPOSIT_REF_NO'],
						'RISK_CLASS': _backgroundData['AR']['RISK_CLASS'],
						'CHECK_RULE': _backgroundData['AR']['CHECK_RULE'],
						'BU_BKEXT': _backgroundData['AR']['BU_BKEXT'],
						'PAYER_NO': _backgroundData['AR']['PAYER_NO'],
						'AKONT': _backgroundData['AR']['AKONT']
					}
					if (_currentUser["RoleId"].length > 0) {
						var isFinance = false;
						var isClerk = false;
						for (var i = 0; i < _currentUser["RoleId"].length; i++) {
							if (_currentUser["RoleId"][i] == "Clerk" && (_backgroundData['Operate'] == 'Approve_TabList_UpcomingWorkflow' ||
								_backgroundData['Operate'] == 'Approve_TabList_DelegatedWorkflow')) {
								isFinance = true;
								isClerk = true;
							}
							if ((_currentUser["RoleId"][i] == "Clerk" || _currentUser["RoleId"][i] == "Acct" || _currentUser["RoleId"][i] == "AM" || _currentUser["RoleId"][i] == "FD" || _currentUser["RoleId"][i] == "FM")
							&& (_backgroundData['Operate'] == 'Approve_TabList_CompletedWorkflow' ||
									_backgroundData['Operate'] == 'Approve_TabList_CompletedAgentWorkflow' ||
									_backgroundData['Operate'] == 'Approve_TabList_WorkflowSubmittedByOtherInitiator')) {
								this.byId("RiskClass").setVisible(true);
								this.byId("CheckRule").setVisible(true);
								this.byId("VirtualBankAccount").setVisible(true);
								this.byId("RiskClass").setEnabled(false);
								this.byId("CheckRule").setEnabled(false);
								this.byId("VirtualBankAccount").setEnabled(false);
								this.byId("SumInvoicePrintTime").setEnabled(false);
							}
							if (_backgroundData['Operate'] == 'Approve_TabList_SubmittedWorkflow') {
								if (_currentUser["RoleId"][i] == "Clerk" || _currentUser["RoleId"][i] == "Acct" || _currentUser["RoleId"][i] == "AM" || _currentUser["RoleId"][i] == "FD" || _currentUser["RoleId"][i] == "FM") {
									this.byId("RiskClass").setVisible(true);
									this.byId("CheckRule").setVisible(true);
									this.byId("VirtualBankAccount").setVisible(true);
									this.byId("RiskClass").setEnabled(false);
									this.byId("CheckRule").setEnabled(false);
									this.byId("VirtualBankAccount").setEnabled(false);
									this.byId("SumInvoicePrintTime").setEnabled(false);
								}
							}
							if (_currentUser["RoleId"][i] == "Acct" || _currentUser["RoleId"][i] == "AM" || _currentUser["RoleId"][i] == "FD" || _currentUser["RoleId"][i] == "FM") {
								isFinance = true;
							}
						}
					}
					if (isFinance) {
						this.byId("RiskClass").setVisible(true);
						this.byId("CheckRule").setVisible(true);
						this.byId("VirtualBankAccount").setVisible(true);
						//this.byId("ReconciliationAccount").setVisible(true);
						if (isClerk && _backgroundData['HD']['ACTCD'] != "END") {
							//this.byId("VirtualBankAccount").setEnabled(true);
							//this.byId("ReconciliationAccount").setEnabled(true);
							this.byId("SumInvoicePrintTime").setEnabled(true);
						}
					}
					else {
						this.byId("RiskClassLabel").setVisible(false);
						this.byId("CheckRuleLabel").setVisible(false);
						this.byId("VBAccountLabel").setVisible(false);
						//this.byId("ReconciliationAccountLabel").setVisible(false);
					}
					//var data;
					//jQuery.ajax({
					//	type: 'Post',
					//	url: '/ApprovalFlow/GetCustomerData',
					//	dataType: 'json',
					//	data:
					//	{
					//		BpNo: _backgroundData["Payer"]["KUNNR"],
					//		BUKRS: _backgroundData['HD']['PLANT'],
					//	},
					//	async: false,
					//	success: function (res) {
					//		if (res.Code == 200) {
					//			if (res.Data != null) {
					//				data = res.Data;
					//			}
					//		}
					//		else {
					//			MessageToast.show(res.Message);
					//		}
					//	},
					//	error: function (err) {
					//		MessageToast.show(err.statusText);
					//	}
					//})
					//this.byId("VBA").setValue(data["BU_BKEXT"]);
					//if (data["BU_BKEXT"] != _backgroundData['AR']['BU_BKEXT']) {
					//	this.byId("VirtualBankAccount").setTooltip("Exist:" + data["BU_BKEXT"]).rerender();
					//	initVBA = true;
					//}
					//else {
					//	this.byId("VirtualBankAccount").setTooltip("").rerender();
					//	initVBA = false;
					//}
					//this.byId("RECACCOUNT").setValue(data["AKONT"]);
					//if (data["AKONT"] != _backgroundData['AR']['AKONT']) {
					//	this.byId("ReconciliationAccount").setTooltip("Exist:" + data["AKONT"]).rerender();
					//	initRecAccount = true;
					//}
					//else {
					//	this.byId("ReconciliationAccount").setTooltip("").rerender();
					//	initRecAccount = false;
					//}


					//var jsonCreditManagerDicModel = new Array();
					//var cRManagerType = "CRManager";
					//jQuery.ajax({
					//	type: "Get",
					//	dataType: "json",
					//	async: false,
					//	url: "/Dictionary/GetDicListByTypeAndPTypeAndPCODE?type=" + cRManagerType + "&pType=SalesAdmin&pCode=" + _backgroundData['Payer']['SALESADMIN'],
					//	success: function (res) {
					//		if (res.Code == 200) {
					//			jsonCreditManagerDicModel = res.Data;
					//		}
					//		else {
					//			MessageToast.show(res.Message);
					//		}
					//	},
					//	error: function (err) {
					//		MessageToast.show(err.statusText);
					//	}
					//});
				}
			}
			else
			{
				//var jsonCreditManagerDicModel = new Array();
				//var jsonSalesAdminDicModel = new Array();
				//var salesAdminType = "SalesAdmin";
				//jQuery.ajax({
				//	type: "Get",
				//	dataType: "json",
				//	async: false,
				//	url: "/Dictionary/GetDicListByTypeAndPTypeAndPCODE?type=" + salesAdminType + "&pType=PLANT&pCode=" + _currentUser["Company"],
				//	success: function (res) {
				//		if (res.Code == 200) {
				//			jsonSalesAdminDicModel = res.Data;
				//		}
				//		else {
				//			MessageToast.show(res.Message);
				//		}
				//	},
				//	error: function (err) {
				//		MessageToast.show(err.statusText);
				//	}
				//});

				//var cRManagerType = "CRManager";
				//jQuery.ajax({
				//	type: "Get",
				//	dataType: "json",
				//	async: false,
				//	url: "/Dictionary/GetDicListByTypeAndPTypeAndPCODE?type=" + cRManagerType + "&pType=SalesAdmin&pCode=" + jsonSalesAdminDicModel[0].DCODE,
				//	success: function (res) {
				//		if (res.Code == 200) {
				//			jsonCreditManagerDicModel = res.Data;
				//		}
				//		else {
				//			MessageToast.show(res.Message);
				//		}
				//	},
				//	error: function (err) {
				//		MessageToast.show(err.statusText);
				//	}
				//});
				_arData =
				{
					'REQID': "",
					'CUST_TYPE': [],
					'CREDIT_TERM': "015",
					'SEC_DEPOSIT': "0",
					'CREDIT_LIMIT':"",
					'PRTOPT': "",
					'BANKGUR_EXPDATE': "",
					'PERRL': "Z1",
					'VALID_TO': "",
					'CRMANAGER': "",
					'DEPOSIT_REF_NO': "",
					'RISK_CLASS': "",
					'CHECK_RULE': "",
					'BU_BKEXT': ""
				}
				this.byId("EatDrink").setSelected(false);
				this.byId("Other").setSelected(false);
				this.byId("BankGuarantee").setSelected(false);
				this.byId("Cash").setSelected(false);
				this.byId("Cheque").setSelected(false);
				this.byId("Others").setSelected(false);
				this.byId("Waived").setSelected(false);
				this.byId("RiskClassLabel").setVisible(false);
				this.byId("CheckRuleLabel").setVisible(false);
				this.byId("VBAccountLabel").setVisible(false);
				//this.byId("ReconciliationAccountLabel").setVisible(false);
			}
			var jsonCreditManagerDicModel = new Array();
			var jsonSalesAdminDicModel = new Array();
			jQuery.ajax({
				type: "Post",
				dataType: "json",
				async: false,
				data:
				{
					SPRAS: spras,
					BUKRS: _backgroundData['HD']['PLANT'],
					SalesAdmin: _backgroundData['ApplicantUserProperty']['SalesAdmin']
				},
				url: "/Dictionary/GetSalesAdminByBukrs",
				success: function (res) {
					if (res.Code == 200) {
						jsonSalesAdminDicModel = res.Data;
					}
					else {
						MessageToast.show(res.Message);
					}
				},
				error: function (err) {
					MessageToast.show(err.statusText);
				}
			});
			var salesAdmin;
			if (_backgroundData['HD']['REQID'] == null || _backgroundData['HD']['REQID'] == "") {
				salesAdmin = (jsonSalesAdminDicModel != null && jsonSalesAdminDicModel.length > 0) ? jsonSalesAdminDicModel[0].ZZSALESADMIN : "";
			}
			else {
				salesAdmin = _backgroundData['Payer']['SALESADMIN'];
			}
			jQuery.ajax({
				type: "Post",
				dataType: "json",
				async: false,
				data:
				{
					SPRAS: "E",
					BUKRS: _backgroundData['HD']['PLANT'],
					SalesAdmin: salesAdmin
				},
				url: "/Dictionary/GetCRManagerListByBukrsAndSalesAdmin",
				success: function (res) {
					if (res.Code == 200) {
						jsonCreditManagerDicModel = res.Data;
					}
					else {
						MessageToast.show(res.Message);
					}
				},
				error: function (err) {
					MessageToast.show(err.statusText);
				}
			});
			var oData = {
				CustomerTypeModel: jsonCusTypeDicModel, CreditTermModel: jsonCreditTermDicModel,
				StatePrintModel: jsonStatePrintDicModel, SumInvoicePrintTimeModel: jsonInvoicePrintTimeDicModel,
				RiskClassModel: jsonRiskClassDicModel, CheckRuleModel: jsonCheckRuleReBulidModel, CreditManagerModel: jsonCreditManagerDicModel,
				RecAccountModel: jsonRecAccountDicModel
			};
			var oModel = new JSONModel(oData);
			this.getView().setModel(oModel);
			let _data = JSON.parse(JSON.stringify(_arData))
			this.byId('FormAR').setModel(new JSONModel(_data), 'FormData')
			
		},
		onVBAChange: function () {
			var sValueState = "None";
			var success = false;
			var newVBA = this.byId("VirtualBankAccount").getValue();
		//	var oldVBA = this.byId("VBA").getValue();
		//	if (newVBA != oldVBA) {
		//		this.byId("VirtualBankAccount").setTooltip("Exist:" + oldVBA).rerender();
		//		this.byId("VirtualBankAccount").$().addClass("ChangeInputColor");
		//	}
		//	else {
		//		this.byId("VirtualBankAccount").setTooltip("").rerender();
		//	}
			if (newVBA != "") {
				var jsonVBADicModel;
				var VBAType = "VBA";
				jQuery.ajax({
					type: "Get",
					dataType: "json",
					async: false,
					url: "/Dictionary/GetDicListByType?type=" + VBAType,
					success: function (res) {
						if (res.Code == 200) {
							jsonVBADicModel = res.Data;
						}
						else {
							MessageToast.show(res.Message);
						}
					},
					error: function (err) {
						MessageToast.show(err.statusText);
					}
				});
				if (jsonVBADicModel != null && jsonVBADicModel.length > 0) {
					for (var i = 0; i < jsonVBADicModel.length; i++) {
						if (jsonVBADicModel[i].DCODE == newVBA) {
							success = true;
						}
					}
				}
				if (!success) {
					this.byId("VirtualBankAccount").setValueState('Error').setValueStateText(_i18n.getText("ymsg.VBACheck")).rerender();
				}
				else {
					this.byId("VirtualBankAccount").setValueState(sValueState).rerender();
				}
			}
			else {
				this.byId("VirtualBankAccount").setValueState(sValueState).rerender();
			}
		},
		//onRecAccountChange: function () {
		//	var newRECACCOUNT = this.byId("ReconciliationAccount").getSelectedKey();
		//	var oldRECACCOUNT = this.byId("RECACCOUNT").getValue();
		//	if (newRECACCOUNT != oldRECACCOUNT) {
		//		this.byId("ReconciliationAccount").setTooltip("Exist:" + oldRECACCOUNT).rerender();
		//		this.byId("ReconciliationAccount").$().addClass("ChangeSelectColor");
		//	}
		//	else {
		//		this.byId("ReconciliationAccount").setTooltip("").rerender();
		//	}
		//}
	});
});