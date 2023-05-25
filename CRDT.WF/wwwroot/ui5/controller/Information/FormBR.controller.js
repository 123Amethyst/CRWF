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
	return BaseController.extend('crdt.wf.ui5.controller.Information.FormBR', {
		//初始化
		onInit: function () {
			this.initLanguage()
			_i18n = this.getResourceBundle()
			_backgroundData = this.getSysInfo('BackgroundData')
			this.DataLoad();
		},
		//数据绑定
		DataLoad: function () {
			if (_backgroundData['HD']['REQID'] != null && _backgroundData['HD']['REQID'] != "")
			{
				let _brData = {};
				if (_backgroundData['BR'] != null)
				{
					_brData = {
						'REQID': _backgroundData['BR']['REQID'],
						'IDNUMBER': _backgroundData['BR']['IDNUMBER'],
						'INSTITUTE': _backgroundData['BR']['INSTITUTE'],
						'VALID_DATE_FROM': this.formatting(_backgroundData['BR']['VALID_DATE_FROM']),
						'VALID_DATE_TO': this.formatting(_backgroundData['BR']['VALID_DATE_TO'])
					}
				}
				if (_backgroundData['HD']['ACTCD'] != "DRAFT") {
					this.byId("BRName").setEnabled(false);
					this.byId("BRNo").setEnabled(false);
					this.byId("BRValidFrom").setEnabled(false);
					this.byId("BRValidTo").setEnabled(false);
				}
				let _data = JSON.parse(JSON.stringify(_brData))
				this.byId('FormBR').setModel(new JSONModel(_data), 'FormData')
			}
			var applicationAction = _backgroundData['HD']['APPTYPE'];
			if (applicationAction == "CRDT03" || applicationAction == "CRDT04")
			{
				this.byId("BRName").setEnabled(false);
				this.byId("BRNo").setEnabled(false);
				this.byId("BRValidFrom").setEnabled(false);
				this.byId("BRValidTo").setEnabled(false);
			}
		},
	});
});