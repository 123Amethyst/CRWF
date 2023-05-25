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
			_backgroundData;
	return BaseController.extend('crdt.wf.ui5.controller.Information.FormUpdateVBAPayer', {
		//初始化
		onInit: function () {
			this.initLanguage()
			_i18n = this.getResourceBundle()
			_currentUser = this.getSysInfo('CurrentUser');
			_backgroundData = this.getSysInfo('BackgroundData')
			if (_backgroundData['mode'] == 'ReadOnly')
				this.readOnly(false)
			else if (_backgroundData['mode'] == 'PartialEdit')
				this.readOnly(true)
			this.DataLoad();
		},
		//数据绑定
		DataLoad: function () {
			if (_backgroundData['HD']['REQID'] != null && _backgroundData['HD']['REQID'] != "") {
				let _payerData = {};
				if (_backgroundData['Payer'] != null)
				{
					_payerData = {
						'REQID': _backgroundData['Payer']['REQID'],
						'UPLOAD_RESULT': _backgroundData['Payer']['UPLOAD_RESULT'],
						'KUNNR': _backgroundData['Payer']['KUNNR'],
						'SALES_ADMIN': _backgroundData['Payer']['SALESADMIN'],
						'BILL_TO': _backgroundData['Payer']['BILL_TO'],
						'BUKRS': _backgroundData['Payer']['BUKRS'],
						'BUTXT': _backgroundData['Payer']['BUTXT'],
						'NAME_ORG1': _backgroundData['Payer']['NAME_ORG1'],
						'NAME_ORG2': _backgroundData['Payer']['NAME_ORG2'],
						'NAME1_SZF': _backgroundData['Payer']['NAME1_SZF'],
						'NAME2_SZF': _backgroundData['Payer']['NAME2_SZF'],
						'STREET1': _backgroundData['Payer']['STREET_EN1'],
						'STREET4': _backgroundData['Payer']['STREET_CN1'],
						'STREET2': _backgroundData['Payer']['STREET_EN2'],
						'STREET5': _backgroundData['Payer']['STREET_CN2'],
						'STREET3': _backgroundData['Payer']['STREET_EN3'],
						'STREET6': _backgroundData['Payer']['STREET_CN3'],
						'ATTENTION1': _backgroundData['Payer']['ATTENTION1'],
						'ATTENTION2': _backgroundData['Payer']['ATTENTION2'],
						'PHONE1': _backgroundData['Payer']['PHONE1'],
						'PHONE1_EXT': _backgroundData['Payer']['PHONE1_EXT'],
						'PHONE2': _backgroundData['Payer']['PHONE2'],
						'PHONE2_EXT': _backgroundData['Payer']['PHONE2_EXT'],
						'EMAIL1': _backgroundData['Payer']['EMAIL1'],
						'EMAIL2': _backgroundData['Payer']['EMAIL2'],
						'EMAIL3': _backgroundData['Payer']['EMAIL3'],
						'FAX': _backgroundData['Payer']['FAX'],
						'REMARK': _backgroundData['Payer']['REMARK'],
						'CHANNEL': _backgroundData['Payer']['CHANNEL'],
						'SUBCHANNEL': _backgroundData['Payer']['SUBCHANNEL'],
						'KVGR1': _backgroundData['Payer']['KVGR1'],
						'KACODE': _backgroundData['Payer']['KACODE'],
						'CHAINCUST': _backgroundData['Payer']['CHAINCUST'],
						'KVGR2': _backgroundData['Payer']['KVGR2'],
						'VKORG': _backgroundData['Payer']['VKORG'],
						'VWERK': _backgroundData['Payer']['VWERK'],
						'KALKS': _backgroundData['Payer']['KALKS'],
						'WAERS': _backgroundData['Payer']['WAERS'],
						'VSBED': _backgroundData['Payer']['VSBED'],
						'LPRIO': _backgroundData['Payer']['LPRIO'],
						'KTGRD': _backgroundData['Payer']['KTGRD'],
						'CUSTSTATUS': _backgroundData['Payer']['CUSTSTATUS'],
						'CUSTTYPE': _backgroundData['Payer']['CUSTTYPE'],
						'DELTYPE': _backgroundData['Payer']['DELTYPE'],
						'MATTYPE': _backgroundData['Payer']['MATTYPE'],
						'DNCOPY': _backgroundData['Payer']['DNCOPY'],
						'DROUTE': _backgroundData['Payer']['DROUTE']
					}
				}
				if (_backgroundData['HD']['ACTCD'] != "DRAFT") 
				{
					this.byId("ReferenceBpNo").setEnabled(false);
					this.byId("BPSearch").setEnabled(false);
				}
				let _data = JSON.parse(JSON.stringify(_payerData))
				this.byId('FormPayer').setModel(new JSONModel(_data), 'FormData')
			}
			var jsonSalesAdminDicModel = new Array();
			var spras;
			if (_i18n.sLocale == "zh_CN" || _i18n.sLocale == "zh_HK") {
				spras = "M";
			}
			else if (_i18n.sLocale == "en_US") {
				spras = "E";
			}
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
			if (_backgroundData['HD']['REQID'] == null || _backgroundData['HD']['REQID'] == "") {
				this.byId("SalesAdmin").setSelectedKey((jsonSalesAdminDicModel != null && jsonSalesAdminDicModel.length > 0) ? jsonSalesAdminDicModel[0].ZZSALESADMIN : "");
			}
			var oData = { SalesAdminModel: jsonSalesAdminDicModel };
			var oModel = new JSONModel(oData);
			this.getView().setModel(oModel);
		},
		onBPNoSearch: function () {
			var _this = this;
			var bpNo = this.byId("ReferenceBpNo").getValue();
			if (bpNo == "" || bpNo == null) {
				MessageToast.show(_i18n.getText("ymsg.PayerNullValid"));
			}
			else {
				if (bpNo.substr(0, 4) != "1209" && bpNo.substr(0, 3) != "121") {
					_this.clearValue();
					MessageToast.show(_i18n.getText("ymsg.OutletRangeCheck"));
				}
				else {
					var data;
					var creditData;
					var jsoncreditData;
					var isPassValid = true;
					var dateAndTime = _this.formatting(new Date());
					var dateEnd = dateAndTime.split(" ")[0].replace(/-/g, "");
					var timeEnd = dateAndTime.split(" ")[1].replace(/:/g, "");
					var formNumber = "CRDT" + dateEnd + timeEnd;
					var customerCreditData =
					{
						I_ZNUM: formNumber,
						I_ZSOURCE: "HD",
						I_PARTNER: _this.byId("ReferenceBpNo").getValue(),
						I_BUKRS: _backgroundData['HD']['PLANT'],
					}
					var customerDataReq =
					{
						I_ZNUM: formNumber,
						I_ZSOURCE: "HD",
						I_BUKRS: _backgroundData['HD']['PLANT'],
						I_PARTNER: _this.byId("ReferenceBpNo").getValue(),
						I_DATAB: "20200101",
						I_TIMAB: "000000",
						I_DATBI: dateEnd,
						I_TIMBI: timeEnd,
						I_SAP: ""
					}
					jQuery.ajax({
						type: 'Post',
						url: '/ApprovalFlow/GetCustomerDataByApi',
						dataType: 'json',
						data:
						{
							req: customerDataReq
						},
						async: false,
						success: function (res) {
							if (res.Code == 200) {
								if (res.Data != null) {
									data = res.Data;
									var BpNos = new Array();
									var BpNoObj = { SIGN: "I", OPTION: "EQ", LOW: bpNo, HIGH: bpNo };
									BpNos.push(BpNoObj);
									var req =
									{
										"IM_BUKRS": _backgroundData['HD']['PLANT'],
										"IM_ZNUM": formNumber,
										"IM_ZSOURCE": "HD",
										"IM_KUNNR": BpNos
									};
									var dataPayerClose;
									jQuery.ajax({
										type: "Post",
										dataType: "json",
										async: false,
										data:
										{
											req: req
										},
										url: "/ApprovalFlow/OutletCloseCheck",
										success: function (res) {
											if (res.Code == 200) {
												if (res.Data != null) {
													dataPayerClose = res.Data;
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
									if (dataPayerClose.ZZCUSTSTATUS == "N") {
										jQuery.ajax({
											type: 'Post',
											url: '/ApprovalFlow/GetCustomerCredit',
											dataType: 'json',
											data:
											{
												req: customerCreditData
											},
											async: false,
											success: function (res) {
												if (res.Code == 200) {
													creditData = res.Data[0];
													var currentDate = new Date();
													var y = currentDate.getFullYear();
													var m = currentDate.getMonth() + 1;
													var d = currentDate.getDate();
													var currentDateStr = y + "-" + m + "-" + d;
													if (_this.checkTime(creditData["VALID_DATE"], currentDateStr)) {
														isPassValid = false;
														_this.clearValue();
														MessageToast.show(_i18n.getText("ymsg.CreditLimitIsExpired"));
													}
												}
												else {
													isPassValid = false;
													_this.clearValue();
													MessageToast.show(res.Message);
												}
											},
											error: function (err) {
												isPassValid = false;
												_this.clearValue();
												MessageToast.show(err.statusText);
											}
										})
									}
									else {
										if (dataPayerClose.ZZCUSTSTATUS == "S") {
											isPassValid = false;
											_this.clearValue();
											MessageToast.show(_i18n.getText("ymsg.PayerStatusCheck"));
										}
										else {
											if (dataPayerClose.ZZCUSTSTATUS == "") {
												dataPayerClose.ZZCUSTSTATUS = "空";
											}
											isPassValid = false;
											_this.clearValue();
											MessageToast.show(_i18n.getText('ymsg.PayerStatusError', [dataPayerClose.ZZCUSTSTATUS]));
										}
									}
								}
								else {
									isPassValid = false;
									_this.clearValue();
									MessageToast.show(_i18n.getText('ymsg.PayerInvalidError'));
								}
							}
							else {
								isPassValid = false;
								_this.clearValue();
								MessageToast.show(res.Message);
							}
						},
						error: function (err) {
							isPassValid = false;
							_this.clearValue();
							MessageToast.show(err.statusText);
						}
					})
					if (isPassValid) {
						//SAP未返回数据从本地库获取
						var _data;
						jQuery.ajax({
							type: "Post",
							dataType: "json",
							async: false,
							data:
							{
								KUNNR: this.byId("ReferenceBpNo").getValue(),
								BUKRS: _backgroundData['HD']['PLANT']
							},
							url: "/ApprovalFlow/GetSAPNotReturnData",
							success: function (res) {
								if (res.Code == 200) {
									_data = res.Data;
								}
								else {
									MessageToast.show(res.Message);
								}
							},
							error: function (err) {
								MessageToast.show(err.statusText);
							}
						});

						var companyName;
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
									if (jsonPlantDicModel.length > 0) {
										for (var i = 0; i < jsonPlantDicModel.length; i++) {
											if (jsonPlantDicModel[i].DCODE == data["BUKRS"]) {
												companyName = jsonPlantDicModel[i].DNAME;
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
						var payer = this.byId('FormPayer');
						var payerInfo = payer.getParent().getParent().getParent().getParent().getParent().getContent()[1];
						var arInfo = payer.getParent().getParent().getParent().getParent().getParent().getContent()[2];
						var brInfo = payer.getParent().getParent().getParent().getParent().getParent().getContent()[3];
						var businessNatureGroup = arInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_UpdateVBA_IndexFormUpdateVBAAR--BusinessNature').getButtons();
						if (data["KATR2"] == "A1") {
							businessNatureGroup[0].setSelected(true);
						}
						else if (data["KATR2"] == "A2") {
							businessNatureGroup[1].setSelected(true);
						}
						else {
							businessNatureGroup[0].setSelected(false);
							businessNatureGroup[1].setSelected(false);
						}
						var securityGroup = arInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_UpdateVBA_IndexFormUpdateVBAAR--Security').getButtons();
						if (_data == null) {
							securityGroup[0].setSelected(false);
							securityGroup[1].setSelected(false);
							securityGroup[2].setSelected(false);
							securityGroup[3].setSelected(false);
							securityGroup[4].setSelected(false);
						}
						else if (_data["SECURITY"] == "BG") {
							securityGroup[0].setSelected(true);
						}
						else if (_data["SECURITY"] == "Cash") {
							securityGroup[1].setSelected(true);
						}
						else if (_data["SECURITY"] == "Cheque") {
							securityGroup[2].setSelected(true);
						}
						else if (_data["SECURITY"] == "Others") {
							securityGroup[3].setSelected(true);
						}
						else if (_data["SECURITY"] == "Waived") {
							securityGroup[4].setSelected(true);
						}
						else {
							securityGroup[0].setSelected(false);
							securityGroup[1].setSelected(false);
							securityGroup[2].setSelected(false);
							securityGroup[3].setSelected(false);
							securityGroup[4].setSelected(false);
						}
						var staPrintOpt = arInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_UpdateVBA_IndexFormUpdateVBAAR--StaPrintOpt');
						if (data["ZZRECONPRT"] == "A04") {
							staPrintOpt.setSelectedKey("SP01")
						}
						else if (data["ZZRECONPRT"] == "A07") {
							staPrintOpt.setSelectedKey("SP02")
						}
						else if (data["ZZRECONPRT"] == "A06") {
							staPrintOpt.setSelectedKey("SP03")
						}
						else if (data["ZZRECONPRT"] == "A01") {
							staPrintOpt.setSelectedKey("SP04")
						}

						if (creditData["CHECK_RULE"].indexOf("KA") != -1) {
							creditData["CHECK_RULE"] = "KA";
						}
						else if (creditData["CHECK_RULE"].indexOf("Z1") != -1) {
							creditData["CHECK_RULE"] = "Z1";
						}
						else if (creditData["CHECK_RULE"].indexOf("Z2") != -1) {
							creditData["CHECK_RULE"] = "Z2";
						}
						else if (creditData["CHECK_RULE"].indexOf("Z3") != -1) {
							creditData["CHECK_RULE"] = "Z3";
						}
						else if (creditData["CHECK_RULE"].indexOf("Z4") != -1) {
							creditData["CHECK_RULE"] = "Z4";
						}
						else if (creditData["CHECK_RULE"].indexOf("Z5") != -1) {
							creditData["CHECK_RULE"] = "Z5";
						}
						else if (creditData["CHECK_RULE"].indexOf("Z6") != -1) {
							creditData["CHECK_RULE"] = "Z6";
						}
						else if (creditData["CHECK_RULE"].indexOf("ZX") != -1) {
							creditData["CHECK_RULE"] = "ZX";
						}
						var salesAdmin = payerInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_UpdateVBA_IndexFormUpdateVBAPayer--SalesAdmin').getSelectedKey();
						var isExist = false;
						for (var i = 0; i < _backgroundData['ApplicantUserProperty']["SalesAdmin"].length; i++) {
							if (data["ZZSALESADMIN"] == _backgroundData['ApplicantUserProperty']["SalesAdmin"][i]) {
								isExist = true;
							}
						}
						salesAdmin = isExist ? data["ZZSALESADMIN"] : salesAdmin;
						//var creditManager = arInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_UpdateVBA_IndexFormUpdateVBAAR--CreditManager').getSelectedKey();
						//creditManager = data["ZZCRMANAGER"] == "" ? creditManager : data["ZZCRMANAGER"];
						var jsonCreditManagerDicModel = new Array();
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
							CreditManagerModel: jsonCreditManagerDicModel
						};
						var oModel = new JSONModel(oData);
						var payer = this.byId('FormPayer');
						var arInfo = payer.getParent().getParent().getParent().getParent().getParent().getContent()[2];
						arInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_UpdateVBA_IndexFormUpdateVBAAR--CreditManager').setModel(oModel);
						if (jsonCreditManagerDicModel.length == 0) {
							arInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_UpdateVBA_IndexFormUpdateVBAAR--CreditManager').setSelectedKey("");
						}
						else if (jsonCreditManagerDicModel.length > 0) {
							arInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_UpdateVBA_IndexFormUpdateVBAAR--CreditManager').setSelectedKey(data["ZZCRMANAGER"] == "" ? jsonCreditManagerDicModel[0].DCODE : data["ZZCRMANAGER"]);
						}
						var creditManager = arInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_UpdateVBA_IndexFormUpdateVBAAR--CreditManager').getSelectedKey();
						payerInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_UpdateVBA_IndexFormUpdateVBAPayer--ReferenceBpNo').setValue(data["KUNNR"]),
						payerInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_UpdateVBA_IndexFormUpdateVBAPayer--SalesAdmin').setSelectedKey(salesAdmin),
						payerInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_UpdateVBA_IndexFormUpdateVBAPayer--BillTo').setValue(data["ZBILLTO"]),
						payerInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_UpdateVBA_IndexFormUpdateVBAPayer--CompanyCode').setValue(data["BUKRS"] + "-" + companyName),
						payerInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_UpdateVBA_IndexFormUpdateVBAPayer--Name1').setValue(data["NAME_ORG1"] + "" + data["NAME_ORG2"]),
						payerInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_UpdateVBA_IndexFormUpdateVBAPayer--Name2').setValue(data["NAME1_SZF"] + "" + data["NAME2_SZF"]),
						payerInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_UpdateVBA_IndexFormUpdateVBAPayer--CorrespondingAddress1').setValue(data["STREET_CEN"]),
						payerInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_UpdateVBA_IndexFormUpdateVBAPayer--PostalAddress1').setValue(data["STREET_CZF"]),
						payerInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_UpdateVBA_IndexFormUpdateVBAPayer--CorrespondingAddress2').setValue(data["STR_SUPPL3_CEN"]),
						payerInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_UpdateVBA_IndexFormUpdateVBAPayer--PostalAddress2').setValue(data["STR_SUPPL3_CZF"]),
						payerInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_UpdateVBA_IndexFormUpdateVBAPayer--CorrespondingAddress3').setValue(data["LOCATION_CEN"]),
						payerInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_UpdateVBA_IndexFormUpdateVBAPayer--PostalAddress3').setValue(data["LOCATION_CZF"]),
						payerInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_UpdateVBA_IndexFormUpdateVBAPayer--Attention').setValue(data["ZZCONTACTT11"]),
						payerInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_UpdateVBA_IndexFormUpdateVBAPayer--Addressee').setValue(data["ZZCONTACTP09"]),
						payerInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_UpdateVBA_IndexFormUpdateVBAPayer--Phone1').setValue(data["ZZCONTACTT09"]),
						payerInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_UpdateVBA_IndexFormUpdateVBAPayer--Phone1Ext').setValue(_data == null ? "" : _data["PHONE1_EXT"]),
						payerInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_UpdateVBA_IndexFormUpdateVBAPayer--Phone2').setValue(data["ZZCONTACTT09B"]),
						payerInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_UpdateVBA_IndexFormUpdateVBAPayer--Phone2Ext').setValue(_data == null ? "" : _data["PHONE2_EXT"]),
						payerInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_UpdateVBA_IndexFormUpdateVBAPayer--Email1').setValue(data["ZZFMAILADDR1"]),
						payerInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_UpdateVBA_IndexFormUpdateVBAPayer--Email2').setValue(data["ZZFMAILADDR2"]),
						payerInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_UpdateVBA_IndexFormUpdateVBAPayer--Email3').setValue(data["ZZFMAILADDR3"]),
						payerInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_UpdateVBA_IndexFormUpdateVBAPayer--Fax').setValue(data["FAX_NUMBER_CZF"]),
						payerInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_UpdateVBA_IndexFormUpdateVBAPayer--Remark').setValue(_data == null ? "" : _data["REMARK"]),
						arInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_UpdateVBA_IndexFormUpdateVBAAR--CustomerType').setSelectedKeys(data["ZZCUSTORGTYPE"] != "" ? Array.from(data["ZZCUSTORGTYPE"]) : []),
						arInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_UpdateVBA_IndexFormUpdateVBAAR--CreditTerm').setSelectedKey(data["ZTERM_KNVV"].slice(1)),
						arInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_UpdateVBA_IndexFormUpdateVBAAR--SecDeposit').setValue(_data == null ? 0 : _data["SEC_DEPOSIT"]),
						arInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_UpdateVBA_IndexFormUpdateVBAAR--CreditLimit').setValue(creditData["CREDIT_LIMIT"]),
						arInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_UpdateVBA_IndexFormUpdateVBAAR--BankGurExpDate').setValue((data["ZZBANKGUREXPDATE"] != null && data["ZZBANKGUREXPDATE"]!="")?data["ZZBANKGUREXPDATE"].replace(/^(\d{4})(\d{2})(\d{2})$/, "$1-$2-$3"):""),
						arInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_UpdateVBA_IndexFormUpdateVBAAR--SumInvoicePrintTime').setSelectedKey((data["PERRL"] == "" || data["PERRL"] == null) ? "Z1" : data["PERRL"]),
						arInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_UpdateVBA_IndexFormUpdateVBAAR--CreditExpDate').setValue((creditData["VALID_DATE"] != null && creditData["VALID_DATE"]!="")?creditData["VALID_DATE"]:""),
						arInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_UpdateVBA_IndexFormUpdateVBAAR--CreditManager').setSelectedKey(creditManager),
						arInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_UpdateVBA_IndexFormUpdateVBAAR--DepRefNo').setValue(_data == null ? "" : _data["DEPOSIT_REF_NO"]),
						arInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_UpdateVBA_IndexFormUpdateVBAAR--RiskClass').setSelectedKey(creditData["RISK_CLASS"]),
						arInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_UpdateVBA_IndexFormUpdateVBAAR--CheckRule').setSelectedKey(creditData["CHECK_RULE"]),
						arInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_UpdateVBA_IndexFormUpdateVBAAR--VirtualBankAccount').setValue(data["BU_BKEXT"]),
						arInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_UpdateVBA_IndexFormUpdateVBAAR--ReconciliationAccount').setSelectedKey(data["AKONT"]),
						arInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_UpdateVBA_IndexFormUpdateVBAAR--RelatedPayerNoOrKAAccountNo').setValue(_data == null ? "" : _data["PAYER_NO"]),
						brInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_UpdateVBA_IndexFormBR--BRName').setValue(data["INSTITUTE"]),
						brInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_UpdateVBA_IndexFormBR--BRNo').setValue(data["IDNUMBER"]),
						brInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_UpdateVBA_IndexFormBR--BRValidFrom').setValue((data["VALID_DATE_FROM"] != null && data["VALID_DATE_FROM"] != "") ? data["VALID_DATE_FROM"].replace(/^(\d{4})(\d{2})(\d{2})$/, "$1-$2-$3") : ""),
						brInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_UpdateVBA_IndexFormBR--BRValidTo').setValue((data["VALID_DATE_TO"] != null && data["VALID_DATE_TO"]!="")?data["VALID_DATE_TO"].replace(/^(\d{4})(\d{2})(\d{2})$/, "$1-$2-$3"):"")
						arInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_UpdateVBA_IndexFormUpdateVBAAR--VBA').setValue(data["BU_BKEXT"]),
						arInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_UpdateVBA_IndexFormUpdateVBAAR--RECACCOUNT').setValue(data["AKONT"]),
						this.byId("Channel").setValue(data["ZZCHANNEL"]);
						this.byId("SubChannel").setValue(data["ZZSUBCHANNEL"]);
						this.byId("Kvgr1").setValue(data["KVGR1"]);
						this.byId("KaCode").setValue(data["ZZKACODE"]);
						this.byId("ChainCust").setValue("");
						this.byId("Kvgr2").setValue(data["KVGR2"]);
						this.byId("Vkorg").setValue(data["VKORG"]);
						this.byId("Vwerk").setValue(data["VWERK"]);
						this.byId("Kalks").setValue(data["KALKS"]);
						this.byId("Waers").setValue(data["WAERS"]);
						this.byId("Vsbed").setValue(data["VSBED"]);
						this.byId("Lprio").setValue(data["LPRIO"]);
						this.byId("Ktgrd").setValue(data["KTGRD"]);
						this.byId("CustStatus").setValue(data["ZZCUSTSTATUS"]);
						this.byId("CustType").setValue(data["ZZCUSTTYPE"]);
						this.byId("DelType").setValue(data["ZZDELTYPE"]);
						this.byId("MatType").setValue(data["ZZMATTYPE"]);
						this.byId("DnCopy").setValue(data["ZZDNCOPY"]);
						this.byId("DRoute").setValue(data["ZZDROUTE"]);
					}
				}
			}
		},
		clearValue: function ()
		{
			var payer = this.byId('FormPayer');
			var payerInfo = payer.getParent().getParent().getParent().getParent().getParent().getContent()[1];
			var arInfo = payer.getParent().getParent().getParent().getParent().getParent().getContent()[2];
			var brInfo = payer.getParent().getParent().getParent().getParent().getParent().getContent()[3];
			var salesAdmin = payerInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_UpdateVBA_IndexFormUpdateVBAPayer--SalesAdmin').getSelectedKey();
			var creditManager = arInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_UpdateVBA_IndexFormUpdateVBAAR--CreditManager').getSelectedKey();
			//payerInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_UpdateVBA_IndexFormUpdateVBAPayer--ReferenceBpNo').setValue(""),
			payerInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_UpdateVBA_IndexFormUpdateVBAPayer--SalesAdmin').setSelectedKey(salesAdmin),
			payerInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_UpdateVBA_IndexFormUpdateVBAPayer--BillTo').setValue(""),
			payerInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_UpdateVBA_IndexFormUpdateVBAPayer--CompanyCode').setValue(""),
			payerInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_UpdateVBA_IndexFormUpdateVBAPayer--Name1').setValue(""),
			payerInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_UpdateVBA_IndexFormUpdateVBAPayer--Name2').setValue(""),
			payerInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_UpdateVBA_IndexFormUpdateVBAPayer--CorrespondingAddress1').setValue(""),
			payerInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_UpdateVBA_IndexFormUpdateVBAPayer--PostalAddress1').setValue(""),
			payerInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_UpdateVBA_IndexFormUpdateVBAPayer--CorrespondingAddress2').setValue(""),
			payerInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_UpdateVBA_IndexFormUpdateVBAPayer--PostalAddress2').setValue(""),
			payerInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_UpdateVBA_IndexFormUpdateVBAPayer--CorrespondingAddress3').setValue(""),
			payerInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_UpdateVBA_IndexFormUpdateVBAPayer--PostalAddress3').setValue(""),
			payerInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_UpdateVBA_IndexFormUpdateVBAPayer--Attention').setValue(""),
			payerInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_UpdateVBA_IndexFormUpdateVBAPayer--Addressee').setValue(""),
			payerInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_UpdateVBA_IndexFormUpdateVBAPayer--Phone1').setValue(""),
			payerInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_UpdateVBA_IndexFormUpdateVBAPayer--Phone1Ext').setValue(""),
			payerInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_UpdateVBA_IndexFormUpdateVBAPayer--Phone2').setValue(""),
			payerInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_UpdateVBA_IndexFormUpdateVBAPayer--Phone2Ext').setValue(""),
			payerInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_UpdateVBA_IndexFormUpdateVBAPayer--Email1').setValue(""),
			payerInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_UpdateVBA_IndexFormUpdateVBAPayer--Email2').setValue(""),
			payerInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_UpdateVBA_IndexFormUpdateVBAPayer--Email3').setValue(""),
			payerInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_UpdateVBA_IndexFormUpdateVBAPayer--Fax').setValue(""),
			payerInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_UpdateVBA_IndexFormUpdateVBAPayer--Remark').setValue(""),
			arInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_UpdateVBA_IndexFormUpdateVBAAR--CustomerType').setSelectedKeys([]),
			arInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_UpdateVBA_IndexFormUpdateVBAAR--CreditTerm').setSelectedKey("015"),
			arInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_UpdateVBA_IndexFormUpdateVBAAR--SecDeposit').setValue(0),
			arInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_UpdateVBA_IndexFormUpdateVBAAR--CreditLimit').setValue(""),
			arInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_UpdateVBA_IndexFormUpdateVBAAR--StaPrintOpt').setSelectedKey("SP01"),
			arInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_UpdateVBA_IndexFormUpdateVBAAR--BankGurExpDate').setValue(""),
			arInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_UpdateVBA_IndexFormUpdateVBAAR--SumInvoicePrintTime').setSelectedKey("Z1"),
			arInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_UpdateVBA_IndexFormUpdateVBAAR--CreditExpDate').setValue(""),
			arInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_UpdateVBA_IndexFormUpdateVBAAR--CreditManager').setSelectedKey(creditManager),
			arInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_UpdateVBA_IndexFormUpdateVBAAR--DepRefNo').setValue(""),
			arInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_UpdateVBA_IndexFormUpdateVBAAR--RiskClass').setSelectedKey("B"),
			arInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_UpdateVBA_IndexFormUpdateVBAAR--CheckRule').setSelectedKey("ZX"),
			arInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_UpdateVBA_IndexFormUpdateVBAAR--VirtualBankAccount').setValue(""),
			arInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_UpdateVBA_IndexFormUpdateVBAAR--RelatedPayerNoOrKAAccountNo').setValue(""),
			arInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_UpdateVBA_IndexFormUpdateVBAAR--ReconciliationAccount').setSelectedKey("0115101450"),
			brInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_UpdateVBA_IndexFormBR--BRName').setValue(""),
			brInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_UpdateVBA_IndexFormBR--BRNo').setValue(""),
			brInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_UpdateVBA_IndexFormBR--BRValidFrom').setValue(""),
			brInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_UpdateVBA_IndexFormBR--BRValidTo').setValue("")
			this.byId("Channel").setValue("");
			this.byId("SubChannel").setValue("");
			this.byId("Kvgr1").setValue("");
			this.byId("KaCode").setValue("");
			this.byId("ChainCust").setValue("");
			this.byId("Kvgr2").setValue("");
			this.byId("Vkorg").setValue("");
			this.byId("Vwerk").setValue("");
			this.byId("Kalks").setValue("");
			this.byId("Waers").setValue("");
			this.byId("Vsbed").setValue("");
			this.byId("Lprio").setValue("");
			this.byId("Ktgrd").setValue("");
			this.byId("CustStatus").setValue("");
			this.byId("CustType").setValue("");
			this.byId("DelType").setValue("");
			this.byId("MatType").setValue("");
			this.byId("DnCopy").setValue("");
			this.byId("DRoute").setValue("");
			var securityGroup = arInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_UpdateVBA_IndexFormUpdateVBAAR--Security').getButtons();
			securityGroup[0].setSelected(false);
			securityGroup[1].setSelected(false);
			securityGroup[2].setSelected(false);
			securityGroup[3].setSelected(false);
			securityGroup[4].setSelected(false);
			var businessNatureGroup = arInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_UpdateVBA_IndexFormUpdateVBAAR--BusinessNature').getButtons();
			businessNatureGroup[0].setSelected(false);
			businessNatureGroup[1].setSelected(false);
		},
		//只读模式
		readOnly: function (canEdit) {
			this.byId('Form10').setEditable(false)
        }
	});
});