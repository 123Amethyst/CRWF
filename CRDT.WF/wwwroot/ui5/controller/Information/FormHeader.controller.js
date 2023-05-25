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
	return BaseController.extend('crdt.wf.ui5.controller.Information.FormHeader', {
		//初始化
		onInit: function () {
			this.initLanguage()
			_i18n = this.getResourceBundle()
			_backgroundData = this.getSysInfo('BackgroundData')
			this.DataLoad()
			if (_backgroundData['mode'] == 'ReadOnly')
				this.readOnly(false)
			else if (_backgroundData['mode'] == 'PartialEdit')
				this.readOnly(true)
		},
		//数据绑定
		DataLoad: function () {
			let _headerData = {
				'REQID': _backgroundData['HD']['REQID'],
				'Plant': _backgroundData['HD']['PLANT_NAME'],
				'FormNumber': _backgroundData['HD']['REQID'],
				'Applicant': _backgroundData['ApplicantUserProperty']['AccountName'],
				'Department': _backgroundData['ApplicantUserProperty']['CostCenter'],
				'DepartmentName': _backgroundData['ApplicantUserProperty']['CostCenterName'],
				'Position': _backgroundData['ApplicantUserProperty']['PositionName'],
				'ApplicationAction': _backgroundData['HD']['ACTION'],
				'Initiator': _backgroundData['SubmitterUserProperty']['AccountName'],
				'ApplicationDate': this.formatting(new Date()).substr(0, 10),
				'Details': _backgroundData['HD']['DETAILS']
			}
			let _data = JSON.parse(JSON.stringify(_headerData))
			this.byId('FormHeader').setModel(new JSONModel(_data), 'FormData')
			if (_backgroundData['HD']['REQID'] != null && _backgroundData['HD']['REQID'] != "" && _backgroundData['HD']['ACTCD']!="DRAFT")
			{
				this.byId("Form8").setEnabled(false);
			}
		},
		//改变详情
		changeFormHeader_Details: function (oEvent) {
			_backgroundData['HD']['DETAILS'] = oEvent.getParameter('value')
		},
		//只读模式
		readOnly: function (canEdit) {
			this.byId('Form10').setEditable(false)
        }
	});
});