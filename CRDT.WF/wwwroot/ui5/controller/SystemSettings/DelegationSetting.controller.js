sap.ui.define([
	'../BaseController',
	'sap/ui/core/Fragment',
	'sap/ui/model/json/JSONModel',
	'sap/m/MessageBox',
	'sap/m/MessageToast',
	'sap/ui/core/Item',
	'sap/ui/table/library',
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function (BaseController, Fragment, JSONModel, MessageBox, MessageToast, Item, library,
		Filter,
		FilterOperator	) {
	'use strict';
		let _currentUser,
			_i18n,
			rendered = false
	return BaseController.extend('crdt.wf.ui5.controller.SystemSettings.DelegationSetting', {

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
				rendered = true
            }
		},
		//获取页面Id
		getDialogId: function () {
			return 'OtherSetting_DelegationSetting_' + this.getView().getId()
		},
		//监听绑定
		EventBind: function () {
			let _oDialogId = this.getDialogId(),
				oDelegate = {},
				_DatePickers = ['Form2', 'Form3']
			//[开始日期,结束日期]
			_DatePickers.forEach(u => {
				let _DatePicker = Fragment.byId(_oDialogId, u)
				oDelegate = {
					onclick: function (e) {
						if (e.target.nodeName == 'INPUT') {
							$(e.target).next().children().first().click()
						}
					}
				}
				_DatePicker.addEventDelegate(oDelegate)
			})
		},
		//数据绑定
		DataLoad: function () {
			this.onRefreshTable()
		},
		changeDelegationSetting_Details_FromDate: function (oEvent) {
			let _d = oEvent.getParameter('newValue'),
				_oDialogId = this.getDialogId(),
				_dp = Fragment.byId(_oDialogId, 'Form3')
			_dp.setMinDate(new Date(_d + ' 00:00:00'))
			if (_dp.getValue() != '')
				_dp.setInitialFocusedDateValue(new Date(_d + ' 00:00:00'))
		},
		changeDelegationSetting_Details_ToDate: function (oEvent) {
			let _d = oEvent.getParameter('newValue'),
				_oDialogId = this.getDialogId(),
				_dp = Fragment.byId(_oDialogId, 'Form2')
			_dp.setMaxDate(new Date(_d + ' 00:00:00'))
			if (_dp.getValue() != '')
				_dp.setInitialFocusedDateValue(new Date(_d + ' 00:00:00'))
		},
		//代理人表单
		_openOtherSetting_DelegationSetting: function (_data) {
			let oView = this.getView(),
				_this = this,
				_oDialogId = this.getDialogId()
			if (!this._DelegationSetting_Dialog) {
				this._DelegationSetting_Dialog = Fragment.load({
					id: _oDialogId,
					name: 'crdt.wf.ui5.view.SystemSettings.DelegationSetting_Details',
					controller: this
				}).then(function (oDialog) {
					oView.addDependent(oDialog)
					_this.EventBind()
					return oDialog;
				});
			}

			this._DelegationSetting_Dialog.then(function (oDialog) {
				let oForm = Fragment.byId(_oDialogId, 'FormDetails'),
					oToUser = Fragment.byId(_oDialogId, 'Form1'),
					nowD = _this.formatting(_this.getServerDate()).slice(0, 10)

				oDialog.open();

				//处理日期时间选择事件
				let datePickers = ['Form2', 'Form3']
				//[开始日期,结束日期]
				datePickers.forEach(u => {
					let datePicker = Fragment.byId(_oDialogId, u)
					datePicker.getDomRef('inner').setAttribute('disabled', 'disabled')
				})

				if (_data == null) {
					_data = {
						'AgentAll': true,
						'AgentDate': nowD,
						'AgentId': null,
						'FromAccount': _currentUser['Account'],
						'FromDate': nowD,
						'FromUserId': _currentUser['UserId'],
						'FromUserName': _currentUser['AccountName'],
						'IfNotify': false,
						'ToAccount': '',
						'ToDate': '',
						'ToUserId': null,
						'ToUserName': ''
					}
					oToUser.setEditable(true)
                }
				else {
					oToUser.setEditable(false)
					oToUser.setInputValue(_data['ToUserId'], _data['ToAccount'] + ' - ' + _data['ToUserName'])
                }
				let _data1 = JSON.parse(JSON.stringify(_data))
				oForm.setModel(new JSONModel(_data1), 'FormData')
			})
		},
		//代理人新增
		onOtherSetting_DelegationSetting_Add: function (oEvent) {
			this._openOtherSetting_DelegationSetting(null)
		},
		//代理人编辑
		onOtherSetting_DelegationSetting_Edit: function (oEvent) {
			let _vc = oEvent.getParameter('row').getBindingContext().getObject(),
				_v = JSON.parse(JSON.stringify(_vc))
			this._openOtherSetting_DelegationSetting(_v)
		},
		//代理人删除
		onOtherSetting_DelegationSetting_Delete: function (oEvent) {
			let _vc = oEvent.getParameter('row').getBindingContext().getObject(),
				_this = this
			MessageBox.warning(_i18n.getText('Message_Content_Delete'), {
				title: _i18n.getText('Message_Title_Info'),
				styleClass: "halfWidth",
				actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
				emphasizedAction: MessageBox.Action.OK,
				onClose: function (sAction) {
					if (sAction == 'OK') {
						jQuery.ajax({
							type: 'Post',
							url: '/ApprovalFlow/DeleteDelegation',
							dataType: 'json',
							data: {
								'AgentId': _vc['AgentId'],
								'token': _this.getToken()
							},
							success: function (res) {
								if (res.Code == 200) {
									_this.onRefreshTable()
									MessageToast.show(_i18n.getText('Message_Success_Delete'))
								}
								else {
									MessageToast.show(_i18n.getText('Message_Error') + ':' + res.Message)
								}
							}
						})
					}
				}
			})
		},
		//表单提交检查
		verification: function (oForm) {
			let success = true,
				items = oForm.getItems()[0].getItems()
			items = items
				.filter(u => u.getVisible())
				.filter(u => u.getItems()[0] != null && u.getItems()[0].getRequired)
				.filter(u => u.getItems()[0].getRequired())
			items.forEach(u => {
				let item = u.getItems()[0]
				if (item.getValue != null) {
					if (item.getValue() == null || item.getValue() == '') {
						success = false
						item.setValueState('Error').setValueStateText(_i18n.getText('ValueStateText_CannotEmpty'))
					}
					else {
						item.setValueState('None').setValueStateText()
					}
				}
				else if (item.getSelectedKey != null) {
					if (item.getSelectedKey() == null || item.getSelectedKey() == '') {
						success = false
						item.setValueState('Error').setValueStateText(_i18n.getText('ValueStateText_CannotEmpty'))
					}
					else {
						item.setValueState('None').setValueStateText()
					}
				}
			})
			return success
		},
		//代理人表单保存
		onOtherSetting_DelegationSetting_Details_Dialog_Save: function (oEvent) {
			let _oDialogId = this.getDialogId(),
				oForm = Fragment.byId(_oDialogId, 'FormDetails'),
				oFormData = oForm.getModel('FormData').getData(),
				_this = this
			if (this.verification(oForm)) {
				jQuery.ajax({
					type: 'Post',
					url: '/ApprovalFlow/SaveDelegation',
					dataType: 'json',
					async: false,
					data: {
						'info': this.dataIntegration(oFormData),
						'token': _this.getToken()
					},
					success: function (res) {
						if (res.Code == 200) {
							_this.onOtherSetting_DelegationSetting_Details_Dialog_Cancel()
							MessageToast.show(_i18n.getText('ymsg.SuccessSave'))
							_this.onRefreshTable()
						}
						else {
							MessageToast.show(_i18n.getText('Message_Error') + ':' + res.Message)
						}
					}
				})
			}
		},
		//代理人表单关闭
		onOtherSetting_DelegationSetting_Details_Dialog_Cancel: function (oEvent) {
			let _oDialogId = this.getDialogId(),
				_CustomTable = Fragment.byId(_oDialogId, "DelegationSetting_Dialog"),
				_this = this;
			this._DelegationSetting_Dialog.then(function (oDialog) {
				oDialog.close();
				_this._DelegationSetting_Dialog = null
				_CustomTable.destroy();
			})
		},
		//数据初始化
		dataInit: function (_d) {
			let _r = []
			if (_d != null) {
				_r = _d
            }
			_r.forEach(u => {
				u['AgentDate'] = u['AgentDate'].slice(0, 10)
				u['FromDate'] = u['FromDate'].slice(0, 10)
				u['ToDate'] = u['ToDate'].slice(0, 10)
				if (u['IsActive'])
					u['IsActive_TEXT'] = _i18n.getText('OtherSetting_DelegationSetting_IsActive_Y')
				else
					u['IsActive_TEXT'] = _i18n.getText('OtherSetting_DelegationSetting_IsActive_N')
			})
			return _r
		},
		//数据整合
		dataIntegration: function (oFormData) {
			let data = {}

			data['AgentId'] = oFormData['AgentId']
			data['FromUserId'] = oFormData['FromUserId']
			data['ToUserId'] = oFormData['ToUserId']
			data['FromDate'] = oFormData['FromDate']
			data['ToDate'] = oFormData['ToDate']
			data['AgentAll'] = oFormData['AgentAll']
			data['IfNotify'] = oFormData['IfNotify']

			return data
		},
		//刷新表格
		onRefreshTable: function (oEvent) {
			let table = this.byId('OtherSetting_DelegationSetting_Table'),
				_this = this
			jQuery.ajax({
				type: 'Post',
				url: '/ApprovalFlow/GetDelegationList',
				async: false,
				dataType: 'json',
				data: {
					'userid': _currentUser['UserId'],
					'token': this.getToken()
				},
				success: function (res) {
					if (res.Code == 200) {
						let _d = res.Data
						table.setModel(new JSONModel(_this.dataInit(_d))).bindRows('/')
					}
					else {
						MessageToast.show(_i18n.getText('Message_Error') + ':' + res.Message)
					}
				}
			})
		},
		//状态判断
		/*formatIsActiveToObjectState: function (bIsActive) {
			return bIsActive ? "Success" : "Error";
		}*/
	});

});