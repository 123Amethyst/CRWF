sap.ui.define([
	'../BaseController',
	'sap/m/MessageToast',
	'sap/ui/thirdparty/jquery',
	'sap/ui/model/json/JSONModel'
], function (
		BaseController,
		MessageToast,
		jQuery,
		JSONModel) {
		'use strict';
		let _i18n,
			_currentUser,
			_backgroundData,
			_question
	return BaseController.extend('crdt.wf.ui5.controller.Information.FormApprovalHistory', {
		//初始化
		onInit: function () {
			this.initLanguage()
			_i18n = this.getResourceBundle()
			_currentUser = this.getSysInfo('CurrentUser')
			_backgroundData = this.getSysInfo('BackgroundData')
			this.DataLoad()
			if (_backgroundData['mode'] == 'ReadOnly')
				this.readOnly(false)
			else if (_backgroundData['mode'] == 'PartialEdit')
				this.readOnly(true)
		},
		//数据绑定
		DataLoad: function () {
			let data = [],
				_this = this
			if (_backgroundData['HD'] != null && _backgroundData['HD']['REQID'] != '') {
				jQuery.ajax({
					type: 'Post',
					url: '/ApprovalFlow/GetApproHisList',
					dataType: 'json',
					async: false,
					data: {
						'requestId': _backgroundData['HD']['REQID'],
						'token': this.getToken()
					},
					success: function (res) {
						if (res.Code == 200) {
							let _d = res.Data;
							_d.forEach(u => {
								u['ApproDate'] = _this.formatting(u['ApproDate'])
							})
							if (_d != null && _d.length > 0) {
								_question = _d[_d.length - 1]['ApproDesc']
							}
							data = _d
						}
						else {
							MessageToast.show(_i18n.getText('ymsg.Error') + ':' + res.Message)
						}
					}
				})
			}
			let _data = JSON.parse(JSON.stringify(data))
			this.byId('Table_FormApprovalHistory').setModel(new JSONModel(_data)).bindRows('/')
		},
		//返回问题
		getQuestion: function () {
			return _question
		},
		//只读模式
		readOnly: function (canEdit) {
		}
	});
});