sap.ui.define([
	'sap/ui/Device',
	'./BaseController',
	'sap/ui/model/json/JSONModel',
	'sap/m/Popover',
	'sap/m/Button',
	'sap/m/library',
	'sap/ui/thirdparty/jquery',
	'sap/m/MessageToast',
	'sap/ui/core/Fragment',
	'sap/tnt/NavigationListItem',
	'sap/m/ScrollContainer',
], function (Device, BaseController, JSONModel, Popover, Button, library, jQuery, MessageToast, Fragment, NavigationListItem, ScrollContainer) {
	"use strict";

 let ButtonType = library.ButtonType,
		PlacementType = library.PlacementType,
		_i18n,
		_currentUser;
	return BaseController.extend("crdt.wf.ui5.controller.Home", {
		//初始化
		onInit: function () {
			this.initLanguage()
			_i18n = this.getResourceBundle()
			// apply content density mode to root view
			_currentUser = this.getSysInfo('CurrentUser')
			this.byId('user_detail').setText(_currentUser["Account"]);
			this.InitMenu()
		},
		//初始化菜单
		InitMenu: function () {
			_i18n = this.getResourceBundle();
			//var jsonmodel = [];
			//var jsonDicModel;
			//jQuery.ajax({
			//	type: "Get",
			//	dataType: "json",
			//	async: false,
			//	url: "/Dictionary/GetDicType",
			//	success: function (res) {
			//		if (res.Code == 200) {
			//			jsonDicModel = res.Data;
			//			if (jsonDicModel.length > 0) {
			//				for (var i = 0; i < jsonDicModel.length; i++) {
			//					var dic = { DType: jsonDicModel[i] }
			//					jsonmodel.push(dic);
			//				}
			//			}
			//		}
			//		else {
			//			MessageToast.show(res.Message);
			//		}
			//	},
			//	error: function (err) {
			//		MessageToast.show(err.statusText);
			//	}
			//});
			//let _data = this.getOwnerComponent().getModel('menu').getData(),
			//	_list = this.byId('menuList');
			//const _creatList = function (i, j) {
			//	if (i != null) {
			//		i.forEach(u => {
			//			let _i = new NavigationListItem({
			//				text: _i18n.getText(u.title),
			//				key: u.key,
			//				expanded: u.expanded == null ? true : u.expanded,
			//				icon: u.icon == null ? "" : u.icon
			//			});
			//			if (u.title == "Menu_Common_Dictionary") {
			//				var items = [];
			//				if (jsonmodel.length > 0) {
			//					for (var i = 0; i < jsonmodel.length; i++) {
			//						var item = { title: jsonmodel[i].DType, key: jsonmodel[i].DType }
			//						items.push(item);
			//					}
			//				}
			//				u.items = items;
			//			}
			//			if (u.items != null) {
			//				_i.expanded = u.expanded
			//				_i.icon = u.icon
			//				_creatList(u.items, _i)
			//			}
			//			j.addItem(_i)
			//		})
			//	}
			//}
			//if (_data.navigation != null)
			//	_creatList(_data.navigation, _list)


			let /*_data = this.getOwnerComponent().getModel('menu').getData(),*/
				_list = this.byId('menuList')
			const _creatList = function (i, j) {
				if (i != null) {
					i.forEach(u => {
						
						let _i = new NavigationListItem({
							//text: u['ModuleName'],
							key: u['ModulePath'],
							expanded: u['IsClosed'],
							icon: u['ImgUrl']
						}).bindProperty('text', {
							parts: [
								{ path: "i18n>" + u['ModuleDesc'] }
							]
						})
						if (u['Children'] != null) {
							if (u['Children'].length > 0) {
								_creatList(u['Children'], _i)
							}
						}
						j.addItem(_i)
					})
				}
			}
			jQuery.ajax({
				type: 'Post',
				url: '/Home/GetMenu',
				async: false,
				dataType: 'json',
				data: {
					user: _currentUser['UserId']
				},
				success: function (res) {
					if (res.Code == 200) {
						if (res.Data != null) {
							_creatList(res.Data[0]['Children'], _list)
						}
					}
					else {
						MessageToast.show(_i18n.getText('Message_Error') + ':' + res.Message);
					}
				}
			})

		},
		setSelectedMenuItem: function (sKey) {
			this.byId("NavigationList").setSelectedKey(sKey);
		},
		//选择节点
		onItemSelect: function (oEvent) {
			//let oItem = oEvent.getParameter("item");
			//if (oItem.getItems().length) {
			//	oItem.setExpanded(!oItem.getExpanded())
			//}
			//else {
			//	if (oItem.oParent.mProperties.key=="Page_Common_Dictionary") {
			//		var data = { "type": oItem.getKey() };
			//		let page = this.byId('pageContainer').getPage("Common_Dictionary");
			//		if (page == null) {
			//			this.byId('pageContainer').addPage(new ScrollContainer({
			//				id: "Common_Dictionary",
			//				horizontal: false,
			//				vertical: true,
			//				height: "100%",
			//				content: this._getFormView(this, "Dictionary", 'crdt.wf.ui5.view.Common')
			//			})).setModel(new JSONModel(data), "dicType");
			//			this.byId("pageContainer").to("Common_Dictionary")
			//		}
			//		else {
			//			page.setModel(new JSONModel(data), "dicType");
			//			page.rerender();
			//			this.byId("pageContainer").to("Common_Dictionary")
			//		}
			//	}
			//	else {
			//		this.byId("pageContainer").to(this.getView().createId(oItem.getKey()));
			//	}
			//}

			let oItem = oEvent.getParameter("item")
			if (oItem.getItems().length) {
				oItem.setExpanded(!oItem.getExpanded())
			}
			else {
				let path = oItem.getKey().split('_')
				let page = this.byId('pageContainer').getPage(path[1] + '_' + path[2])
				if (page == null) {
					let data = { 'type': oItem.mBindingInfos.text.parts[0].path.split('_')[2] }
					page = new ScrollContainer({
						id: path[1] + '_' + path[2],
						horizontal: false,
						vertical: true,
						height: "100%",
						content: this._getFormView(this, path[2], 'crdt.wf.ui5.view.' + path[1])
					})
					page.setModel(new JSONModel(data), 'type')
					this.byId('pageContainer').addPage(page)
					this.byId("pageContainer").to(path[1] + '_' + path[2])
				} else {
					let data = { 'type': oItem.mBindingInfos.text.parts[0].path.split('_')[2] }
					page.setModel(new JSONModel(data), 'type')
					page.rerender()
					this.byId("pageContainer").to(path[1] + '_' + path[2])
				}
			}
		},
		//打开管理
		handleUserNamePress: function (event) {
			_i18n = this.getResourceBundle();
			let oPopover = new Popover({
				showHeader: false,
				placement: PlacementType.Bottom,
				content: [
					new Button({
						text: _i18n.getText('Home_Language'),
						icon: 'sap-icon://hello-world',
						type: ButtonType.Transparent
					}).attachPress(() => { this.onChangeLanguages() }),
					new Button({
						text: _i18n.getText('Home_ChangePassword'),
						icon: 'sap-icon://key',
						type: ButtonType.Transparent
					}).attachPress(() => { this.onChangePassword() }),
					new Button({
						text: _i18n.getText('Home_Logout'),
						icon: 'sap-icon://log',
						type: ButtonType.Transparent
					}).attachPress(() => { this.onLogOut() }),
				],
			}).addStyleClass('sapMOTAPopover sapTntToolHeaderPopover');

			oPopover.openBy(event.getSource());
		},
		//隐藏/展开面板
		onSideNavButtonPress: function () {
			let oToolPage = this.byId('Menu');
			oToolPage.setSideExpanded(!oToolPage.getSideExpanded());
		},
		//设置语言
		onChangeLanguages: function () {
			let oView = this.getView(),
				_local_languages = sap.ui.getCore().getConfiguration().getLanguage().replace('-', '_');
			if (!this._pLanguageSetting) {
				this._pLanguageSetting = Fragment.load({
					id: 'dialog_LanguagesSetting_' + oView.getId(),
					name: 'crdt.wf.ui5.view.languages',
					controller: this
				}).then(function (oDialog) {
					oView.addDependent(oDialog);
					return oDialog;
				});
			}
			this._pLanguageSetting.then(function (oDialog) {
				oDialog.getContent().find(u => u.getId() == 'dialog_LanguagesSetting_' + oView.getId() + '--LanguagesSelect').setSelectedKey(_local_languages)
				oDialog.open();
			});
		},
		//提交设置
		onConfirm: function (oEvent) {
			let oView = this.getView(),
				oLanguagesView = Fragment.byId('dialog_LanguagesSetting_' + oView.getId(), 'LanguagesSelect');
			sap.ui.getCore().getConfiguration().setLanguage(oLanguagesView.getSelectedKey())
			this.addCookie('.AspNetCore.Culture', 'c=' + oLanguagesView.getSelectedKey().replace('_', '-') + '|uic=' + oLanguagesView.getSelectedKey().replace('_', '-'), 99999, '/')
			_i18n = this.getOwnerComponent().getModel('i18n').getResourceBundle().aPropertyFiles[0]
			this.onCancel()
			window.location.reload()
			//let _data = this.getOwnerComponent().getModel('menu').getData(),
			//	_list = this.byId('menuList');
			//_data.navigation[0].title = "Menu_CreditWF";
		},
		//退出
		onLogOut: function () {
			window.location.href = "/Home/Login";
		},
		//关闭弹窗
		onCancel: function (oEvent) {
			this._pLanguageSetting.then(function (oDialog) {
				oDialog.close();
			});
		},
		//跳转首页
		onHomePress: function (oEvent) {
			this.byId('pageContainer').to(this.getView().createId('Home'));
		},
		//修改密码
		onChangePassword: function () {
			let oView = this.getView()
			if (!this._pChangePassword) {
				this._pChangePassword = Fragment.load({
					id: 'dialog_ChangePassword_' + oView.getId(),
					name: 'crdt.wf.ui5.view.ChangePassword',
					controller: this
				}).then(function (oDialog) {
					oView.addDependent(oDialog)
					return oDialog
				});
			}

			this._pChangePassword.then(function (oDialog) {
				let oForm = Fragment.byId('dialog_ChangePassword_' + oView.getId(), 'FormDetails')
				let oFormModel = new JSONModel({
					Account: _currentUser['Account'],
					OldPassword: '',
					NewPassword: '',
					ConfirmPassword: ''
				})
				oFormModel.setDefaultBindingMode('OneWay')
				oForm.setModel(oFormModel, 'FormData')

				oDialog.open()
			})
		},
		//避开这讨厌的自动填充T^T
		liveChange_Form_OldPassword: function (oEvent) {
			let oS = oEvent.getSource(),
				oD = oEvent.getParameter('value'),
				_FormData = oS.getModel('FormData').getData(),
				oI = oS.getDomRef('inner')
			if (oI != null) {
				let input = $(oI).get(0),
					p = input.selectionEnd,
					truePassword

				truePassword = this.passwordInput(oD, _FormData['OldPassword'], p)

				_FormData['OldPasswordShow'] = truePassword.replace(/\S/g, '●')
				_FormData['OldPassword'] = truePassword
				oS.setValue(_FormData['OldPasswordShow'])

				// 解决在win8中光标总是到input框的最后	
				input.selectionEnd = p
				input.selectionStart = p
			}
		},
		liveChange_Form_NewPassword: function (oEvent) {
			let oS = oEvent.getSource(),
				oD = oEvent.getParameter('value'),
				_FormData = oS.getModel('FormData').getData(),
				oI = oS.getDomRef('inner')
			if (oI != null) {
				let input = $(oI).get(0),
					p = input.selectionEnd,
					truePassword

				truePassword = this.passwordInput(oD, _FormData['NewPassword'], p)

				_FormData['NewPasswordShow'] = truePassword.replace(/\S/g, '●')
				_FormData['NewPassword'] = truePassword
				oS.setValue(_FormData['NewPasswordShow'])

				// 解决在win8中光标总是到input框的最后	
				input.selectionEnd = p
				input.selectionStart = p
			}


		},
		liveChange_Form_ConfirmPassword: function (oEvent) {
			let oS = oEvent.getSource(),
				oD = oEvent.getParameter('value'),
				_FormData = oS.getModel('FormData').getData(),
				oI = oS.getDomRef('inner')
			if (oI != null) {
				let input = $(oI).get(0),
					p = input.selectionEnd,
					truePassword

				truePassword = this.passwordInput(oD, _FormData['ConfirmPassword'], p)

				_FormData['ConfirmPasswordShow'] = truePassword.replace(/\S/g, '●')
				_FormData['ConfirmPassword'] = truePassword
				oS.setValue(_FormData['ConfirmPasswordShow'])

				// 解决在win8中光标总是到input框的最后	
				input.selectionEnd = p
				input.selectionStart = p
			}
		},
		//修改密码保存
		onChangePassword_Save: function (oEvent) {
			let oView = this.getView(),
				oS = Fragment.byId('dialog_ChangePassword_' + oView.getId(), 'FormDetails'),
				oData = oS.getModel('FormData').getData(),
				items = oS.getContent()[0].getItems(),
				success = true,
				_this = this
			items.forEach(u => {
				let item = u.getItems()[1]
				if (item.getValue() == null || item.getValue() == '') {
					success = false
					item.setValueState('Error').setValueStateText(_i18n.getText('ValueStateText_CannotEmpty'))
				}
				else {
					item.setValueState('None').setValueStateText()
				}
			})
			if (success) {
				let cp = Fragment.byId('dialog_ChangePassword_' + oView.getId(), 'ConfirmPassword')
				if (oData['NewPassword'] != oData['ConfirmPassword']) {
					cp.setValueState('Error').setValueStateText(_i18n.getText('ValueStateText_CannotEqual', [_i18n.getText('ConfirmPassword'), _i18n.getText('NewPassword')]))
				}
				else {
					cp.setValueState('None').setValueStateText()
					jQuery.ajax({
						type: 'Post',
						url: '/Home/ChangePassword',
						async: false,
						dataType: 'json',
						data: {
							info: {
								UserId: _currentUser['UserId'],
								Account: oData['Account'],
								OldPasswd: oData['OldPassword'],
								NewPasswd: oData['NewPassword']
							}
						},
						success: function (res) {
							if (res.Code == 200) {
								MessageToast.show(_i18n.getText('ymsg.SuccessSave'))
								_this.onChangePassword_Cancel()
							}
							else {
								MessageToast.show(_i18n.getText('Message_Error') + ':' + res.Message)
							}
						}
					})
				}
			}
		},
		//修改密码清空
		onChangePassword_Clear: function (oEvent) {
			let oView = this.getView(),
				oS = Fragment.byId('dialog_ChangePassword_' + oView.getId(), 'FormDetails'),
				oData = oS.getModel('FormData').getData()
			oData['OldPassword'] = ''
			oData['OldPasswordShow'] = ''
			oData['NewPassword'] = ''
			oData['NewPasswordShow'] = ''
			oData['ConfirmPassword'] = ''
			oData['ConfirmPasswordShow'] = ''
			oS.getModel('FormData').updateBindings()
		},
		//修改密码关闭
		onChangePassword_Cancel: function (oEvent) {
			let _this = this
			this._pChangePassword.then(function (oDialog) {
				oDialog.close()
				_this.onChangePassword_Clear()
			})
		},
	});

});