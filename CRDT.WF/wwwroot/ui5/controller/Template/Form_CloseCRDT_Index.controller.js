sap.ui.define([
	'../BaseController',
	'sap/m/MessageBox',
	'sap/m/MessageToast',
	'sap/ui/thirdparty/jquery',
	'sap/ui/core/Fragment',
	'sap/ui/model/json/JSONModel'
], function (
		BaseController,
		MessageBox,
		MessageToast,
		jQuery,
		Fragment,
		JSONModel) {
		'use strict';
	let _i18n,
		_backgroundData,
		_templete = 'container-ui5---Form_CloseCRDT_Index';
		var _currentUser;
	return BaseController.extend('crdt.wf.ui5.controller.Template.Form_CloseCRDT_Index', {
		//初始化
		onInit: function () {
			this.initLanguage();
			_i18n = this.getResourceBundle();
			_currentUser = this.getSysInfo('CurrentUser');
			_backgroundData = this.getSysInfo('BackgroundData')
			if (_backgroundData == null)
				_backgroundData = {}
			_backgroundData['AddFileList'] = []
			_backgroundData['DelFileList'] = []
			this.DataLoad();
			this.TypeLoad();
		},
		//数据绑定
		DataLoad: function () {
			let _title = this.byId('Form_Approve_Title'),
				_h = this.byId('Header'),
				_pinfo = this.byId('PayerInformation'),
				_ARinfo = this.byId('ARInformation'),
				_BRinfo = this.byId('BRInformation'),
				_ec = this.byId('EndContent')

			//表单标题
			if (_title) {
				if (_backgroundData['HD'] != null && _backgroundData['HD']['ACTION'] != null)
					_title.setText(_backgroundData['HD']['ACTION'])
			}
			//单据抬头
			if (_h) {
				_h.removeAllItems()
				_h.addItem(this._getFormView(this, 'FormHeader', 'crdt.wf.ui5.view.information'))
			}
			//付款人信息
			if (_pinfo) {
				_pinfo.removeAllItems()
				_pinfo.addItem(this._getFormView(this, 'FormCloseCRDTPayer', 'crdt.wf.ui5.view.information'))
			}
			//AR信息
			if (_ARinfo) {
				_ARinfo.removeAllItems()
				_ARinfo.addItem(this._getFormView(this, 'FormCloseCRDTAR', 'crdt.wf.ui5.view.information'))
			}
			//BR信息
			if (_BRinfo) {
				_BRinfo.removeAllItems()
				_BRinfo.addItem(this._getFormView(this, 'FormBR', 'crdt.wf.ui5.view.information'))
			}
			//底部内容
			if (_ec) {
				_ec.removeAllItems()
				//附件
				_ec.addItem(this._getFormView(this, 'FormUpload', 'crdt.wf.ui5.view.information'))
				//审批记录
				_ec.addItem(this._getFormView(this, 'FormApprovalHistory', 'crdt.wf.ui5.view.information'))
			}
		},
		//判断当前单子状态
		TypeLoad: function () {
			let Form_HTDPUA_Submit = Fragment.byId(_templete, "Form_HTDPUA_Submit"),
				Form_HTDPUA_SaveDraft = Fragment.byId(_templete, "Form_HTDPUA_SaveDraft"),
				Form_HTDPUA_Delete = Fragment.byId(_templete, "Form_HTDPUA_Delete"),
				Form_HTDPUA_CallBack = Fragment.byId(_templete, "Form_HTDPUA_CallBack"),
				Form_HTDPUA_Approve = Fragment.byId(_templete, "Form_HTDPUA_Approve"),
				Form_HTDPUA_Decline = Fragment.byId(_templete, "Form_HTDPUA_Decline"),
				Form_HTDPUA_ApproDesc = Fragment.byId(_templete, "Form_HTDPUA_ApproDesc"),
				Form_HTDPUA_ApproDesc_Label = Fragment.byId(_templete, "Form_HTDPUA_ApproDesc_Label"),
				Process = Fragment.byId(_templete, "Process")
			//新建
			if (_backgroundData['Operate'] == null || _backgroundData['Operate'] == '') {
				Form_HTDPUA_Submit.setVisible(true)
				Form_HTDPUA_SaveDraft.setVisible(true)
			}
			//草稿
			else if (_backgroundData['Operate'] == 'Approve_TabList_Draft') {
				Form_HTDPUA_Submit.setVisible(true)
				Form_HTDPUA_SaveDraft.setVisible(true)
				Form_HTDPUA_Delete.setVisible(true)
			}
			//代办列表，代理列表
			else if (_backgroundData['Operate'] == 'Approve_TabList_UpcomingWorkflow' ||
				_backgroundData['Operate'] == 'Approve_TabList_DelegatedWorkflow') {
				//拒绝退回
				if (_backgroundData['HD']['ACTCD'] == 'DRAFT') {
					Form_HTDPUA_Submit.setVisible(true)
					Form_HTDPUA_SaveDraft.setVisible(true)
				}
				//审批
				else if (_backgroundData['HD']['ACTCD'] != 'END') {
					Form_HTDPUA_ApproDesc.setVisible(true)
					Form_HTDPUA_ApproDesc_Label.setText(_i18n.getText('Form_HTDPUA_ApproDesc')).setVisible(true)
					Form_HTDPUA_Decline.setVisible(true)
					Form_HTDPUA_Approve.setVisible(true)
					_backgroundData['mode'] = 'ReadOnly'
				}
			}
			//已处理任务，代理人已处理任务，被申请流程
			else if (_backgroundData['Operate'] == 'Approve_TabList_CompletedWorkflow' ||
				_backgroundData['Operate'] == 'Approve_TabList_CompletedAgentWorkflow' ||
				_backgroundData['Operate'] == 'Approve_TabList_WorkflowSubmittedByOtherInitiator') {
				_backgroundData['mode'] = 'ReadOnly'
			}
			//我发起的流程
			else if (_backgroundData['Operate'] == 'Approve_TabList_SubmittedWorkflow') {
				if (_backgroundData['HD']['ACTCD'] != 'END' && _backgroundData['HD']['ACTCD'] != 'DRAFT') {
					Form_HTDPUA_ApproDesc.setVisible(true)
					Form_HTDPUA_ApproDesc_Label.setText(_i18n.getText('Form_HTDPUA_RecallReason')).setVisible(true)
					Form_HTDPUA_CallBack.setVisible(true)
				}
				//Form_HTDPUA_Print.setVisible(true)
				_backgroundData['mode'] = 'ReadOnly'
			}
			if (_backgroundData['HD']['ACTCD'] == "") {
				Process.setText("(" + _i18n.getText('Form_Approve_SubTitle') + ")");
			}
			else if (_backgroundData['HD']['ACTCD'] != "" && _backgroundData['HD']['ACTCD'] != "END" && _backgroundData['HD']['ACTCD'] != "DRAFT") {
				Process.setText("(" + _i18n.getText('Form_Approve_Process') + ")");
			}
			else if (_backgroundData['HD']['ACTCD'] == "END") {
				Process.setText("(" + _i18n.getText('Form_Approve_END') + ")");
			}
			else if (_backgroundData['HD']['ACTCD'] == "DRAFT") {
				Process.setText("(" + _i18n.getText('Form_Approve_DraftStatus') + ")");
			}
		},
		ApprovePress: function (type) {
			var isOwnDept = true;
			var payerInfo = this.byId('PayerInformation');
			var arInfo = this.byId('ARInformation');
			var brInfo = this.byId('BRInformation');
			var salesAdmin = payerInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_CloseCRDT_IndexFormCloseCRDTPayer--SalesAdmin').getSelectedKey();
			var deptCode;
			//if (salesAdmin == "FSV") {
			//	deptCode = "820003";
			//}
			//else {
			//	deptCode = "820004";
			//}

			jQuery.ajax({
				type: 'Post',
				url: '/SalesAdminDept/GetSalesAdminDeptBySalesAdminRegion',
				dataType: 'json',
				async: false,
				data: {
					'BUKRS': _backgroundData['HD']['PLANT'],
					'SalesAdmin': salesAdmin,
					'Region': _backgroundData['ApplicantUserProperty']['SalesRegion']
				},
				success: function (res) {
					if (res.Code == 200) {
						deptCode = res.Data;
					}
					else {
						isOwnDept = false;
						MessageToast.show(_i18n.getText(res.Message));
					}
				}
			})

			if (isOwnDept)
			{
				var flowCode = "";
				jQuery.ajax({
					type: 'Post',
					url: '/ApprovalFlow/GetFlowCode',
					dataType: 'json',
					async: false,
					data: {
						'company': _backgroundData['HD']['PLANT'],
						'dept': deptCode,
						'refc': _backgroundData['HD']["APPTYPE"],
						'token': this.getToken()
					},
					success: function (res) {
						if (res.Code == 200) {
							flowCode = res.Data;
						}
					}
				})
				_backgroundData['HD']["FLWCD"] = flowCode;
				var creditLimit = arInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_CloseCRDT_IndexFormCloseCRDTAR--CreditLimit').getValue();
				//var securityDeposit = arInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_CloseCRDT_IndexFormCloseCRDTAR--SecDeposit').getValue();
				var approvedAmount = creditLimit;
				var _this = this;
				var stageCode;
				if (type == "SUBMIT") {
					stageCode = "START";
				}
				else {
					stageCode = _backgroundData['HD']["ACTCD"]
				}
				var reason = this.byId("Form_HTDPUA_ApproDesc").getValue();
				//获取表单数据
				var _data = {};
				_data["ApproSubmit"] =
				{
					'RequestId': "",
					'FlowCode': _backgroundData['HD']["FLWCD"],
					'StageCode': stageCode,
					'NextStage': null,
					'ApproType': type,
					'ApproDesc': reason,
					'IP': "",
					'ApproUserId': _backgroundData['ApproveUserProperty'] != null ? _backgroundData['ApproveUserProperty']["UserId"] : _backgroundData['ApplicantUserProperty']["UserId"],
					'AgentUserId': _currentUser['UserId'],
					'RequestData': {}
				}
				_data["RequestData"] =
				{
					'BUKRS': _backgroundData['HD']['PLANT'],
					'BUKRS_NAME': _backgroundData['HD']['PLANT_NAME'],
					'TOTAL_AMT': approvedAmount,
					'ApproverName': _currentUser['AccountName'],
					'SalesAdmin': salesAdmin,
					'ApproDesc': reason,
					'CATEGORY': _backgroundData['HD']["APPTYPE"],
					'CATEGORY_NAME': _backgroundData['HD']["ACTION"],
					'CLAIM_USERID': _backgroundData['ApplicantUserProperty']["UserId"],
					'CLAIM_USER_NAME': _backgroundData['ApplicantUserProperty']["AccountName"],
					'CREATOR_USERID': _backgroundData['SubmitterUserProperty']["UserId"],
					'CREATOR_NAME': _backgroundData['SubmitterUserProperty']["AccountName"]
				}
				var businessNature="";
				var businessNatureGroup = arInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_CloseCRDT_IndexFormCloseCRDTAR--BusinessNature').getButtons();
				for (var j = 0; j < businessNatureGroup.length; j++) {
					if (businessNatureGroup[j].mProperties.selected) {
						businessNature = businessNatureGroup[j].mProperties.text;
					}
				}
				var jsonBusiNatureDicModel;
				var busiNatureType = "BusiNature";
				jQuery.ajax({
					type: "Get",
					dataType: "json",
					async: false,
					url: "/Dictionary/GetDicListByType?type=" + busiNatureType,
					success: function (res) {
						if (res.Code == 200) {
							jsonBusiNatureDicModel = res.Data;
							if (jsonBusiNatureDicModel.length > 0) {
								for (var i = 0; i < jsonBusiNatureDicModel.length; i++) {
									if (businessNature == jsonBusiNatureDicModel[i].DNAME) {
										businessNature = jsonBusiNatureDicModel[i].DCODE;
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
				var security="";
				var securityGroup = arInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_CloseCRDT_IndexFormCloseCRDTAR--Security').getButtons();
				for (var j = 0; j < securityGroup.length; j++) {
					if (securityGroup[j].mProperties.selected) {
						security = securityGroup[j].mProperties.text;
					}
				}
				var jsonSecurityDicModel;
				var securityType = "Security";
				jQuery.ajax({
					type: "Get",
					dataType: "json",
					async: false,
					url: "/Dictionary/GetDicListByType?type=" + securityType,
					success: function (res) {
						if (res.Code == 200) {
							jsonSecurityDicModel = res.Data;
							if (jsonSecurityDicModel.length > 0) {
								for (var i = 0; i < jsonSecurityDicModel.length; i++) {
									if (security == jsonSecurityDicModel[i].DNAME) {
										security = jsonSecurityDicModel[i].DCODE;
										console.log(security);
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
				var StaPrintMethod = "";
				var EDIInvoiceTramission = "";
				var staPrint = arInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_CloseCRDT_IndexFormCloseCRDTAR--StaPrintOpt').getSelectedKey();
				if (staPrint == "SP01") {
					StaPrintMethod = "A04";
					EDIInvoiceTramission = "N";
				}
				else if (staPrint == "SP02") {
					StaPrintMethod = "A07";
					EDIInvoiceTramission = "Y";
				}
				else if (staPrint == "SP03") {
					StaPrintMethod = "A06";
					EDIInvoiceTramission = "Y";
				}
				else if (staPrint == "SP04") {
					StaPrintMethod = "A01";
					EDIInvoiceTramission = "N";
				}
				var companyCode = "";
				var companyName = "";
				var companyInfo = payerInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_CloseCRDT_IndexFormCloseCRDTPayer--CompanyCode').getValue();
				if (companyInfo != null) {
					companyCode = companyInfo.substring(0, companyInfo.indexOf('-'));
					companyName = companyInfo.substring(companyInfo.indexOf('-') + 1);
				}
				var nameOrg1 = "";
				var nameOrg2 = "";
				var name1Szf = "";
				var name2Szf = "";
				var nameEN = payerInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_CloseCRDT_IndexFormCloseCRDTPayer--Name1').getValue();
				if ((nameEN != null && nameEN != "") && nameEN.length > 40) {
					nameOrg1 = nameEN.substring(0, 40);
					nameOrg2 = nameEN.substring(40, nameEN.length)
				}
				else {
					nameOrg1 = nameEN;
					nameOrg2 = '';
				}
				var nameCN = payerInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_CloseCRDT_IndexFormCloseCRDTPayer--Name2').getValue();
				if ((nameCN != null && nameCN != "") && nameCN.length > 40) {
					name1Szf = nameCN.substring(0, 40);
					name2Szf = nameCN.substring(40, nameCN.length)
				}
				else {
					name1Szf = nameCN;
					name2Szf = '';
				}
				var creditSegment;
				if (_backgroundData['HD']["PLANT"] == "8100") {
					creditSegment = "8101";
				}
				else if (_backgroundData['HD']["PLANT"] == "8200") {
					creditSegment = "8201";
				}
				if (_backgroundData['HD']['REQID'] != "") {
					_backgroundData['HD']['AENAM'] = _currentUser["Account"];
				}
				var paymentTerm;
				var perrl = arInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_CloseCRDT_IndexFormCloseCRDTAR--SumInvoicePrintTime').getSelectedKey();
				if (perrl == "Z1") {
					paymentTerm = "X" + arInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_CloseCRDT_IndexFormCloseCRDTAR--CreditTerm').getSelectedKey();
				}
				else if (perrl == "Z2") {
					paymentTerm = "Y" + arInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_CloseCRDT_IndexFormCloseCRDTAR--CreditTerm').getSelectedKey();
				}
				_data["HD"] = _backgroundData['HD'];
				_data["Payer"] =
				{
					'REQID': payerInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_CloseCRDT_IndexFormCloseCRDTPayer--reqid').getValue(),
					'CLOSE_REASON': payerInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_CloseCRDT_IndexFormCloseCRDTPayer--CloseReason').getSelectedKey(),
					'INPUT_OPTION': '',
					'UPLOAD_RESULT': '',
					'KUNNR': payerInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_CloseCRDT_IndexFormCloseCRDTPayer--ReferenceBpNo').getValue(),
					'SALESADMIN': payerInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_CloseCRDT_IndexFormCloseCRDTPayer--SalesAdmin').getSelectedKey(),
					'BILL_TO': payerInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_CloseCRDT_IndexFormCloseCRDTPayer--BillTo').getValue(),
					'BUKRS': companyCode,
					'BUTXT': companyName,
					'NAME_ORG1': nameOrg1,
					'NAME_ORG2': nameOrg2,
					'NAME1_SZF': name1Szf,
					'NAME2_SZF': name2Szf,
					'STREET_EN1': payerInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_CloseCRDT_IndexFormCloseCRDTPayer--CorrespondingAddress1').getValue(),
					'STREET_CN1': payerInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_CloseCRDT_IndexFormCloseCRDTPayer--PostalAddress1').getValue(),
					'STREET_EN2': payerInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_CloseCRDT_IndexFormCloseCRDTPayer--CorrespondingAddress2').getValue(),
					'STREET_CN2': payerInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_CloseCRDT_IndexFormCloseCRDTPayer--PostalAddress2').getValue(),
					'STREET_EN3': payerInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_CloseCRDT_IndexFormCloseCRDTPayer--CorrespondingAddress3').getValue(),
					'STREET_CN3': payerInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_CloseCRDT_IndexFormCloseCRDTPayer--PostalAddress3').getValue(),
					'ATTENTION1': payerInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_CloseCRDT_IndexFormCloseCRDTPayer--Attention').getValue(),
					'ATTENTION2': payerInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_CloseCRDT_IndexFormCloseCRDTPayer--Addressee').getValue(),
					'PHONE1': payerInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_CloseCRDT_IndexFormCloseCRDTPayer--Phone1').getValue(),
					'PHONE1_EXT': payerInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_CloseCRDT_IndexFormCloseCRDTPayer--Phone1Ext').getValue(),
					'PHONE2': payerInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_CloseCRDT_IndexFormCloseCRDTPayer--Phone2').getValue(),
					'PHONE2_EXT': payerInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_CloseCRDT_IndexFormCloseCRDTPayer--Phone2Ext').getValue(),
					'EMAIL1': payerInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_CloseCRDT_IndexFormCloseCRDTPayer--Email1').getValue(),
					'EMAIL2': payerInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_CloseCRDT_IndexFormCloseCRDTPayer--Email2').getValue(),
					'EMAIL3': payerInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_CloseCRDT_IndexFormCloseCRDTPayer--Email3').getValue(),
					'FAX': payerInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_CloseCRDT_IndexFormCloseCRDTPayer--Fax').getValue(),
					'REMARK': payerInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_CloseCRDT_IndexFormCloseCRDTPayer--Remark').getValue(),
					'CREDIT_SGMNT': creditSegment,
					'CHANNEL': payerInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_CloseCRDT_IndexFormCloseCRDTPayer--Channel').getValue(),
					'SUBCHANNEL': payerInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_CloseCRDT_IndexFormCloseCRDTPayer--SubChannel').getValue(),
					'KVGR1': payerInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_CloseCRDT_IndexFormCloseCRDTPayer--Kvgr1').getValue(),
					'KACODE': payerInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_CloseCRDT_IndexFormCloseCRDTPayer--KaCode').getValue(),
					'CHAINCUST': payerInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_CloseCRDT_IndexFormCloseCRDTPayer--ChainCust').getValue(),
					'KVGR2': payerInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_CloseCRDT_IndexFormCloseCRDTPayer--Kvgr2').getValue(),
					'VKORG': payerInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_CloseCRDT_IndexFormCloseCRDTPayer--Vkorg').getValue(),
					'VWERK': payerInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_CloseCRDT_IndexFormCloseCRDTPayer--Vwerk').getValue(),
					'KALKS': payerInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_CloseCRDT_IndexFormCloseCRDTPayer--Kalks').getValue(),
					'WAERS': payerInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_CloseCRDT_IndexFormCloseCRDTPayer--Waers').getValue(),
					'VSBED': payerInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_CloseCRDT_IndexFormCloseCRDTPayer--Vsbed').getValue(),
					'LPRIO': payerInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_CloseCRDT_IndexFormCloseCRDTPayer--Lprio').getValue(),
					'KTGRD': payerInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_CloseCRDT_IndexFormCloseCRDTPayer--Ktgrd').getValue(),
					'CUSTSTATUS': payerInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_CloseCRDT_IndexFormCloseCRDTPayer--CustStatus').getValue(),
					'CUSTTYPE': payerInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_CloseCRDT_IndexFormCloseCRDTPayer--CustType').getValue(),
					'DELTYPE': payerInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_CloseCRDT_IndexFormCloseCRDTPayer--DelType').getValue(),
					'MATTYPE': payerInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_CloseCRDT_IndexFormCloseCRDTPayer--MatType').getValue(),
					'DNCOPY': payerInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_CloseCRDT_IndexFormCloseCRDTPayer--DnCopy').getValue(),
					'DROUTE': payerInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_CloseCRDT_IndexFormCloseCRDTPayer--DRoute').getValue()
				};
				_data["AR"] =
				{
					'REQID': arInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_CloseCRDT_IndexFormCloseCRDTAR--reqid').getValue(),
					'CUST_STATUS': '',
					'CUST_TYPE': arInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_CloseCRDT_IndexFormCloseCRDTAR--CustomerType').getSelectedKeys() != [] ? arInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_CloseCRDT_IndexFormCloseCRDTAR--CustomerType').getSelectedKeys().join().replace(/,/g, "") : "",
					'BUSINESS_NATURE': businessNature,
					'MNRF': '',
					'CREDIT_TERM': paymentTerm,
					'CREDIT_TERM_SCORE': '',
					'SEC_DEPOSIT': arInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_CloseCRDT_IndexFormCloseCRDTAR--SecDeposit').getValue(),
					'SEC_DEPOSIT_SCORE': '',
					'CREDIT_LIMIT': arInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_CloseCRDT_IndexFormCloseCRDTAR--CreditLimit').getValue(),
					'PRTOPT': arInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_CloseCRDT_IndexFormCloseCRDTAR--StaPrintOpt').getSelectedKey(),
					'RECONPRT': StaPrintMethod,
					'TURNKEY': EDIInvoiceTramission,
					'BANKGUR_EXPDATE': arInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_CloseCRDT_IndexFormCloseCRDTAR--BankGurExpDate').getValue(),
					'PERRL': perrl,
					'VALID_TO': arInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_CloseCRDT_IndexFormCloseCRDTAR--CreditExpDate').getValue(),
					'CRMANAGER': arInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_CloseCRDT_IndexFormCloseCRDTAR--CreditManager').getSelectedKey(),
					'DEPOSIT_REF_NO': arInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_CloseCRDT_IndexFormCloseCRDTAR--DepRefNo').getValue(),
					'RISK_CLASS': arInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_CloseCRDT_IndexFormCloseCRDTAR--RiskClass').getSelectedKey(),
					'CHECK_RULE': arInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_CloseCRDT_IndexFormCloseCRDTAR--CheckRule').getSelectedKey(),
					'BU_BKEXT': arInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_CloseCRDT_IndexFormCloseCRDTAR--VirtualBankAccount').getValue(),
					'PAYER_NO': arInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_CloseCRDT_IndexFormCloseCRDTAR--RelatedPayerNoOrKAAccountNo').getValue(),
					'SECURITY': security,
					'AKONT': arInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_CloseCRDT_IndexFormCloseCRDTAR--ReconciliationAccount').getSelectedKey()
				};
				_data["BR"] =
				{
					'REQID': brInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_CloseCRDT_IndexFormBR--reqid').getValue(),
					'INSTITUTE': brInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_CloseCRDT_IndexFormBR--BRName').getValue(),
					'IDNUMBER': brInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_CloseCRDT_IndexFormBR--BRNo').getValue(),
					'VALID_DATE_FROM': brInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_CloseCRDT_IndexFormBR--BRValidFrom').getValue(),
					'VALID_DATE_TO': brInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_CloseCRDT_IndexFormBR--BRValidTo').getValue(),
				};
				_data["CustomerCredit"] =
				{
					'I_ZNUM': _backgroundData['HD']['REQID'],
					'I_ZSOURCE': "HD",
					'I_BUKRS': _backgroundData['HD']["PLANT"],
					'I_PARTNER': payerInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_CloseCRDT_IndexFormCloseCRDTPayer--ReferenceBpNo').getValue(),
					'I_LIMIT_RULE': "6000",
					'I_CREDIT_SGMNT': creditSegment,
					'I_CHECK_RULE': arInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_CloseCRDT_IndexFormCloseCRDTAR--CheckRule').getSelectedKey(),
					'I_RISK_CLASS': arInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_CloseCRDT_IndexFormCloseCRDTAR--RiskClass').getSelectedKey(),
					'I_CREDIT_LIMIT': arInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_CloseCRDT_IndexFormCloseCRDTAR--CreditLimit').getValue(),
					'I_LIMIT_VALID_DATE': arInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_CloseCRDT_IndexFormCloseCRDTAR--CreditExpDate').getValue(),
					'I_CREDIT_GROUP': ""
				}
				jQuery.ajax({
					type: 'Post',
					url: '/ApprovalFlow/SubmitForm',
					dataType: 'json',
					async: false,
					data: {
						'ApproSubmit': _data["ApproSubmit"],
						'RequestData': _data["RequestData"],
						'HD': _data["HD"],
						'Payer': _data["Payer"],
						'AR': _data["AR"],
						'BR': _data["BR"],
						'AddFileList': _backgroundData['AddFileList'],
						'DelFileList': _backgroundData['DelFileList'],
						'CustomerCredit': _data["CustomerCredit"],
						'token': this.getToken()
					},
					success: function (res) {
						if (res.Code == 200) {
							if (type == 'SUBMIT') {
								MessageBox.success(_i18n.getText('Message_Success_Submit_WithPROC', [res.Data]), {
									actions: [MessageBox.Action.OK],
									emphasizedAction: MessageBox.Action.OK,
									onClose: function (sAction) {
										if (sAction == 'OK') {
											_this.onCancelPress()
										}
									}
								})
							}
							else if (type == 'DRAFT') {
								MessageBox.success(_i18n.getText('Message_Success_Save_WithPROC', [res.Data]), {
									actions: [MessageBox.Action.OK],
									emphasizedAction: MessageBox.Action.OK,
									onClose: function (sAction) {
										if (sAction == 'OK') {
											_this.onCancelPress()
										}
									}
								})
							}
							else if (type == 'DELETE') {
								MessageToast.show(_i18n.getText('Message_Success_Delete'))
								setTimeout(() => { _this.onCancelPress() }, 500)
							}
							else if (type == 'DECLINE') {
								MessageToast.show(_i18n.getText('Message_Success_Decline'))
								setTimeout(() => { _this.onCancelPress() }, 500)
							}
							else if (type == 'CALLBACK') {
								MessageToast.show(_i18n.getText('Message_Success_Callback'))
								setTimeout(() => { _this.onCancelPress() }, 500)
							}
							else if (type == 'APPROVE') {
								MessageToast.show(_i18n.getText('Message_Success_Approve'))
								setTimeout(() => { _this.onCancelPress() }, 500)
							}
						}
						else {
							MessageToast.show(_i18n.getText('ymsg.Error') + ':' + _i18n.getText(res.Message))
						}
					},
					Error: function (err) {
						MessageToast.show(err);
					}
				})
			}
		},
		//页面提交
		onSubmitPress: function () {
			if (this.SubmitVerification()) {
				let _this = this
				var payerInfo = _this.byId('PayerInformation');
				var bpNo = payerInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_CloseCRDT_IndexFormCloseCRDTPayer--ReferenceBpNo').getValue();
				if (_backgroundData['AddFileList'].length == 0) {
					MessageBox.confirm(_i18n.getText('Message_Content_Confirm_NoFile'), {
						actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
						emphasizedAction: MessageBox.Action.OK,
						onClose: function (sAction) {
							if (sAction == 'OK') {
								if (bpNo.substr(0, 4) != "1209" && bpNo.substr(0, 3) != "121") {
									MessageToast.show(_i18n.getText("ymsg.OutletRangeCheck"));
								}
								else {
									var dateAndTime = _this.formatting(new Date());
									var dateEnd = dateAndTime.split(" ")[0].replace(/-/g, "");
									var timeEnd = dateAndTime.split(" ")[1].replace(/:/g, "");
									var formNumber = "CRDT" + dateEnd + timeEnd;
									var customerDataReq =
									{
										I_ZNUM: formNumber,
										I_ZSOURCE: "HD",
										I_BUKRS: _backgroundData['HD']['PLANT'],
										I_PARTNER: bpNo,
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
													if (dataPayerClose.PAYER_assigned != "X") {
														_this.ApprovePress('SUBMIT')
													}
													else {
														MessageToast.show(_i18n.getText("ymsg.PayerCloseCheck"));
													}
												}
												else {
													if (dataPayerClose.ZZCUSTSTATUS == "S") {
														MessageToast.show(_i18n.getText("ymsg.PayerStatusCheck"));
													}
													else {
														if (dataPayerClose.ZZCUSTSTATUS == "") {
															dataPayerClose.ZZCUSTSTATUS = "空";
														}
														MessageToast.show(_i18n.getText('ymsg.PayerStatusError', [dataPayerClose.ZZCUSTSTATUS]));
													}
												}
											}
											else {
												MessageToast.show(res.Message);
											}
										}
									})
								}
							}
						}
					})
				}
				else {
					MessageBox.confirm(_i18n.getText('Message_Content_Confirm', [_i18n.getText('Buttons_Submit')]), {
						actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
						emphasizedAction: MessageBox.Action.OK,
						onClose: function (sAction) {
							if (sAction == 'OK') {
								if (bpNo.substr(0, 4) != "1209" && bpNo.substr(0, 3) != "121") {
									MessageToast.show(_i18n.getText("ymsg.OutletRangeCheck"));
								}
								else {
									var dateAndTime = _this.formatting(new Date());
									var dateEnd = dateAndTime.split(" ")[0].replace(/-/g, "");
									var timeEnd = dateAndTime.split(" ")[1].replace(/:/g, "");
									var formNumber = "CRDT" + dateEnd + timeEnd;
									var customerDataReq =
									{
										I_ZNUM: formNumber,
										I_ZSOURCE: "HD",
										I_BUKRS: _backgroundData['HD']['PLANT'],
										I_PARTNER: bpNo,
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
													if (dataPayerClose.PAYER_assigned != "X") {
														_this.ApprovePress('SUBMIT')
													}
													else {
														MessageToast.show(_i18n.getText("ymsg.PayerCloseCheck"));
													}
												}
												else {
													if (dataPayerClose.ZZCUSTSTATUS == "S") {
														MessageToast.show(_i18n.getText("ymsg.PayerStatusCheck"));
													}
													else {
														if (dataPayerClose.ZZCUSTSTATUS == "") {
															dataPayerClose.ZZCUSTSTATUS = "空";
														}
														MessageToast.show(_i18n.getText('ymsg.PayerStatusError', [dataPayerClose.ZZCUSTSTATUS]));
													}
												}
											}
											else {
												MessageToast.show(res.Message);
											}
										}
									})
								}
							}
						}
					})
				}
			}
		},
		//保存草稿
		onSaveDraftPress: function () {
			if (this.SubmitVerification()) {
				this.ApprovePress("DRAFT");
			}
		},
		//审批同意
		onApprovePress: function () {
			if (this.SubmitVerification()) {
				let _this = this
				MessageBox.confirm(_i18n.getText('Message_Content_Confirm', [_i18n.getText('Buttons_Approve')]), {
					actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
					emphasizedAction: MessageBox.Action.OK,
					onClose: function (sAction) {
						if (sAction == 'OK') {
							if (_currentUser['RoleId'].length>0)
							{
								for (var i = 0; i < _currentUser['RoleId'].length; i++) {
									if (_currentUser["RoleId"][i] == "Clerk" || _currentUser["RoleId"][i] == "Acct") {
										var payerInfo = _this.byId('PayerInformation');
										var BpNo = payerInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_CloseCRDT_IndexFormCloseCRDTPayer--ReferenceBpNo').getValue();
										var BpNos = new Array();
										var BpNoObj = { SIGN: "I", OPTION: "EQ", LOW: BpNo, HIGH: BpNo };
										BpNos.push(BpNoObj);
										var dateAndTime = _this.formatting(new Date());
										var dateEnd = dateAndTime.split(" ")[0].replace(/-/g, "");
										var timeEnd = dateAndTime.split(" ")[1].replace(/:/g, "");
										var formNumber = "CRDT" + dateEnd + timeEnd;
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
												req: req,
												token: _this.getToken()
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
										if (dataPayerClose.DMBTR == 0) {
											if (dataPayerClose.Security_deposit == 0) {
												if (dataPayerClose.PAYER_assigned != "X") {
													_this.ApprovePress('APPROVE')
												}
												else {
													MessageToast.show(_i18n.getText("ymsg.PayerCloseCheck"));
												}
											}
											else {
												MessageToast.show(_i18n.getText("ymsg.SecurityDepositCheck"));
											}
										}
										else {
											MessageToast.show(_i18n.getText("ymsg.ARBill"));
										}
									}
									else
									{
										_this.ApprovePress('APPROVE')
									}
							    }
							}
						}
					}
				})
			}
		},
		//审批拒绝
		onDeclinePress: function () {
			if (this.SubmitVerification()) {
				let _this = this;
				_this.ApprovePress("DECLINE");
			}
		},
		//召回
		onCallBackPress: function () {
			if (this.SubmitVerification()) {
				let _this = this
				MessageBox.confirm(_i18n.getText('Message_Content_Confirm', [_i18n.getText('Buttons_CallBack')]), {
					actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
					emphasizedAction: MessageBox.Action.OK,
					onClose: function (sAction) {
						if (sAction == 'OK') {
							_this.ApprovePress('CALLBACK')
						}
					}
				})
			}
		},
		//删除
		onDeletePress: function () {
			if (this.SubmitVerification()) {
				let _this = this
				MessageBox.confirm(_i18n.getText('Message_Content_Confirm', [_i18n.getText('Buttons_Delete')]), {
					actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
					emphasizedAction: MessageBox.Action.OK,
					onClose: function (sAction) {
						if (sAction == 'OK') {
							_this.ApprovePress('DELETE')
						}
					}
				})
			}			
		},
		//数据非空校验
		SubmitVerification: function () {
			var success = true;
			var CreditManager = false;
			var VBACheck = false;
			var payerInfo = this.byId('PayerInformation');
			var arInfo = this.byId('ARInformation');
			var brInfo = this.byId('BRInformation');
			var CloseReason = this._validateSelect(payerInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_CloseCRDT_IndexFormCloseCRDTPayer--CloseReason'));
			var Kunnr = this._validateInput(payerInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_CloseCRDT_IndexFormCloseCRDTPayer--ReferenceBpNo'));
			//var Bill_To = this._validateInput(payerInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_CloseCRDT_IndexFormCloseCRDTPayer--BillTo'));
			//var SalesAdmin = this._validateSelect(payerInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_CloseCRDT_IndexFormCloseCRDTPayer--SalesAdmin'));
			//var Name_EN = this._validateInput(payerInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_CloseCRDT_IndexFormCloseCRDTPayer--Name1'));
			//var Street_EN1 = this._validateInput(payerInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_CloseCRDT_IndexFormCloseCRDTPayer--CorrespondingAddress1'));
			//var Street_EN2 = this._validateInput(payerInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_CloseCRDT_IndexFormCloseCRDTPayer--CorrespondingAddress2'));
			//var Street_EN3 = this._validateInput(payerInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_CloseCRDT_IndexFormCloseCRDTPayer--CorrespondingAddress3'));
			//var Attention1 = this._validateInput(payerInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_CloseCRDT_IndexFormCloseCRDTPayer--Attention'));
			//var Phone1 = this._validateInput(payerInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_CloseCRDT_IndexFormCloseCRDTPayer--Phone1'));
			//var Email1 = this._validateInput(payerInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_CloseCRDT_IndexFormCloseCRDTPayer--Email1'));
			//if (!Email1) {
			//	var email1 = this.validateValue(payerInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_CloseCRDT_IndexFormCloseCRDTPayer--Email1'))
			//	if (email1) {
			//		Email1 = true;
			//	}
			//}
			//var email2Input = payerInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_CloseCRDT_IndexFormCloseCRDTPayer--Email2');
			//var email3Input = payerInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_CloseCRDT_IndexFormCloseCRDTPayer--Email3');
			//if (email2Input.getValue() != "") {
			//	var Email2 = this.validateValue(email2Input);
			//}
			//else {
			//	var Email2 = this.validateValue(email2Input);
			//}
			//if (email3Input.getValue() != "") {
			//	var Email3 = this.validateValue(email3Input)
			//}
			//else {
			//	var Email3 = this.validateValue(email3Input)
			//}
			//var CustomerType = this._validateComboBox(arInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_CloseCRDT_IndexFormCloseCRDTAR--CustomerType'));
			//var CreditTerm = this._validateSelect(arInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_CloseCRDT_IndexFormCloseCRDTAR--CreditTerm'));
			//var SecDeposit = this._validateNumberInput(arInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_CloseCRDT_IndexFormCloseCRDTAR--SecDeposit'));
			//var CreditLimit = this._validateNumberInput(arInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_CloseCRDT_IndexFormCloseCRDTAR--CreditLimit'));
			//var StaPrintOpt = this._validateSelect(arInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_CloseCRDT_IndexFormCloseCRDTAR--StaPrintOpt'));
			//var BankGurExpDate = this._validateInput(arInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_CloseCRDT_IndexFormCloseCRDTAR--BankGurExpDate'));
			//if (!BankGurExpDate) {
			//	var bankDateRes = this.validDate(arInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_CloseCRDT_IndexFormCloseCRDTAR--BankGurExpDate'));
			//	if (bankDateRes) {
			//		BankGurExpDate = true;
			//	}
			//}
			//var validTo = arInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_CloseCRDT_IndexFormCloseCRDTAR--CreditExpDate')
			//if (validTo.getValue() != "") {
			//	var ValidToRes = this.validDate(validTo);
			//}
			//var SumInvoicePrintTime = this._validateSelect(arInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_CloseCRDT_IndexFormCloseCRDTAR--SumInvoicePrintTime'));
			//var creditManager = arInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_CloseCRDT_IndexFormCloseCRDTAR--CreditManager').getSelectedKey();
			//if (creditManager != "") {
			//	CreditManager = this._validateSelect(arInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_CloseCRDT_IndexFormCloseCRDTAR--CreditManager'));
			//}
			//var RiskClass = this._validateSelect(arInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_CloseCRDT_IndexFormCloseCRDTAR--RiskClass'));
			//var CheckRule = this._validateSelect(arInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_CloseCRDT_IndexFormCloseCRDTAR--CheckRule'));
			//var RecAccount = this._validateSelect(arInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_CloseCRDT_IndexFormCloseCRDTAR--ReconciliationAccount'));
			//var BRName = this._validateInput(brInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_CloseCRDT_IndexFormBR--BRName'));
			//var BRNo = this._validateInput(brInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_CloseCRDT_IndexFormBR--BRNo'));
			//var BRValidFrom = this._validateInput(brInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_CloseCRDT_IndexFormBR--BRValidFrom'));
			//if (!BRValidFrom) {
			//	var bRValidFromRes = this.validDate(brInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_CloseCRDT_IndexFormBR--BRValidFrom'));
			//	if (bRValidFromRes) {
			//		BRValidFrom = true;
			//	}
			//}
			//var BRValidTo = this._validateInput(brInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_CloseCRDT_IndexFormBR--BRValidTo'));
			//if (!BRValidTo) {
			//	var bRValidToRes = this.validDate(brInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_CloseCRDT_IndexFormBR--BRValidTo'));
			//	if (bRValidToRes) {
			//		BRValidTo = true;
			//	}
			//}
			//if (!BRValidFrom && !BRValidTo) {
			//	var validFrom = brInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_CloseCRDT_IndexFormBR--BRValidFrom');
			//	var validTo = brInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_CloseCRDT_IndexFormBR--BRValidTo');
			//	var validDate = this.validStartTimeAndEndTime(validFrom, validTo);
			//	if (validDate) {
			//		BRValidFrom = true;
			//		BRValidTo = true;
			//	}
			//}
			if (_currentUser['RoleId'] != null && _currentUser['RoleId'].length > 0) {
				for (var i = 0; i < _currentUser['RoleId'].length; i++) {
					if (_currentUser['RoleId'][i] == "Clerk") {
						var VBA = arInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_CloseCRDT_IndexFormCloseCRDTAR--VirtualBankAccount').getValue();
						if (VBA != "") {
							VBACheck = this.validateVBA(arInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_CloseCRDT_IndexFormCloseCRDTAR--VirtualBankAccount'));
						}
					}
				}
			}
			//if (CloseReason || Kunnr || Bill_To || Name_EN || Street_EN1 || Street_EN2 || Street_EN3 || Attention1 || Phone1 || Email1 || VBACheck||
			//	CustomerType || CreditTerm || CreditLimit || StaPrintOpt || BankGurExpDate || SumInvoicePrintTime  || RiskClass || CheckRule ||
			//	BRName || BRNo || BRValidFrom || BRValidTo || Email2 || Email3 || ValidToRes || CreditManager || SecDeposit || RecAccount || SalesAdmin) 
			if (VBACheck || CloseReason || Kunnr)
			{
				success = false;
				MessageToast.show(_i18n.getText("ymsg.RequiredNotNull"));
				return;
			}
			return success;
		}, 
		//关闭窗口
		onCancelPress: function () {
			window.close()
		}
	});
});