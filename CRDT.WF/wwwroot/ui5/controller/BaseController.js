sap.ui.define([
	'sap/ui/core/mvc/Controller',
	'sap/ui/core/UIComponent',
	'sap/m/library',
	'sap/ui/table/library',
	'sap/ui/table/Table',
	'sap/ui/table/Column',
	'sap/m/Text',
	'sap/m/Button',
	'sap/m/ButtonType',
	'sap/m/Label',
	'sap/m/Dialog',
	'sap/ui/core/Fragment',
	'sap/ui/model/json/JSONModel',
	'sap/ui/model/BindingMode',
	'sap/m/MessageToast',
	'sap/ui/core/CustomData'
], function (Controller, UIComponent, mobileLibrary, library,
	Table,
	Column,
	Text,
	Button,
	ButtonType,
	Label,
	Dialog,
	Fragment,
	JSONModel,
	BindingMode,
	MessageToast,
	CustomData
) {
	"use strict";

	return Controller.extend("crdt.wf.ui5.controller.BaseController", {
		//获取路径
		getRouter: function () {
			return UIComponent.getRouterFor(this);
		},

		//获取绑定模型
		getModel: function (sName) {
			return this.getView().getModel(sName);
		},

		//设置绑定模型
		setModel: function (oModel, sName) {
			return this.getView().setModel(oModel, sName);
		},

		//获取随机ID
		getRandomId: function (length) {
			return 'w' + Number(Math.random().toString().substr(3, length - 1) + Date.now()).toString(36);
		},

		//初始化翻译资源
		getResourceBundle: function () {
			let load = this.getOwnerComponent() || this
			if (load != null) {
				let i18n = load.getModel("i18n").getResourceBundle()

				if (i18n.hasText('CurrencyEquivalent')) {
					let CurrencyEquivalent = i18n.getText('CurrencyEquivalent', this.getSysInfo('CurrencyName'))
					i18n.aPropertyFiles[0].setProperty('CurrencyEquivalent', CurrencyEquivalent)
				}

				return i18n
			}
			else
				return null
		},

		//获取系统信息
		getSysInfo: function (p) {
			let load = this.getOwnerComponent() || this
			if (load != null) {
				if (p)
					return load.getModel('_sysInfo').getProperty('/' + p)
				else
					return load.getModel('_sysInfo').getData()
			}
			else
				return null


		},

		//设置系统信息
		setSysInfo: function (p, d) {
			let load = this.getOwnerComponent()
			if (load != null)
				return this.getOwnerComponent().getModel("_sysInfo").setProperty('/' + p, d);
			else
				return null
		},

		//获取token
		getToken: function () {
			let _token = JSON.parse(localStorage.getItem('token'))
			let _i18n = this.getResourceBundle()
			if (_token == null || _token.expires_in < this.getServerDate().getTime()) {
				jQuery.ajax({
					type: 'Post',
					url: '/Home/GetToken',
					async: false,
					success: function (res) {
						if (res.Code == 200) {
							if (res.Data != null) {
								localStorage.setItem('token', JSON.stringify(res.Data))
								_token = res.Data
							}
							else {
								localStorage.removeItem('token')
								_token = null
							}
						}
						else {
							MessageToast.show(_i18n.getText('ymsg.Error') + ':' + res.Message)
						}
					}
				})
			}
			return _token
		},

		//获取父控制器
		getParentController: function (oControl) {
			let i = 20,
				view = oControl.getView().getParent(),
				c = null
			while (i > 0) {
				if (view.getMetadata().getName() == 'sap.ui.core.mvc.XMLView') {
					if (view.getController && view.getController() != null) {
						c = view.getController()
						i = 0
					}
				}
				else {
					view = view.getParent()
					i--
				}
			}
			return c
		},

		//初始化语言
		initLanguage: function () {
			let _l = this.getCookie('.AspNetCore.Culture'), _c = 'zh-CN';
			if (_l.length == 0)
				this.addCookie('.AspNetCore.Culture', 'c=zh-CN|uic=zh-CN', 99999, '/');
			_c = this.getCookie('.AspNetCore.Culture').split('|')[0].slice(2);
			sap.ui.getCore().getConfiguration().setLanguage(_c.replace('-', '_'));
		},

		//初始化默认
		//initFormDefault: function (oControl) {
		//	let _h = oControl.byId('Header'),
		//		_u = oControl.byId('Upload');
		//	if (_h) {
		//		_h.removeAllContent();
		//		_h.insertContent(this._getFormFragment(oControl, 'FormHeader', 'ui5.ui5.view.Infrastructure'));
		//		let _currentUser = this.getCurrentUser(),
		//			_backgroundData = this.getBackgroundData(),
		//			_ApplicantUserProperty = _backgroundData['ApplicantUserProperty'],
		//			_headerData = {
		//				'Plant': _ApplicantUserProperty == null ? null : _backgroundData['HD']['PLANT_NAME'],
		//				'Applicant': _ApplicantUserProperty == null ? null : _backgroundData['ApplicantUserProperty']['AccountName'],
		//				'Department': _ApplicantUserProperty == null ? null : _backgroundData['ApplicantUserProperty']['CostCenterName'],
		//				'Position': _ApplicantUserProperty == null ? null : _backgroundData['ApplicantUserProperty']['PositionName'],
		//				'Approver': _ApplicantUserProperty == null ? null : _backgroundData['ApplicantUserProperty']['LeadName'],
		//				'ExpensesCategory': _backgroundData['HD']['CATEGORY'],
		//				'EmployeeVendor': _ApplicantUserProperty == null ? null : _backgroundData['ApplicantUserProperty']['Vendor'],
		//				'Initiator': _currentUser['AccountName'],
		//				'ApplicationDate': this.formatting(new Date()).substr(0, 10),
		//				'ApplicantMailbox': _ApplicantUserProperty == null ? null : _backgroundData['ApplicantUserProperty']['Email'],
		//				'Details': _backgroundData['HD']['CLAIM_TXT'],
		//			}
		//		this.byId('CustomTable_FormHeader').setData(_headerData)
		//	}
		//	if (_u) {
		//		_u.removeAllContent();
		//		_u.insertContent(this._getFormFragment(oControl, 'FormUpload', 'ui5.ui5.view.Infrastructure'));
		//	}
		//},

		//获取Fragment
		_getFormFragment: function (oControl, oFragmentName, oFragment) {
			if (oControl._formFragments == null)
				oControl._formFragments = {};
			let oFormFragment = oControl._formFragments[oFragmentName];
			if (oFormFragment) {
				return oFormFragment;
			}

			/*oFormFragment = Fragment.load({
				id: oControl.getView().getId(),
				name: oFragment + '.' + oFragmentName,
				controller: oControl
			}).then(function (oDialog) {
				oControl.getView().addDependent(oDialog);
				oControl._formFragments[oFragmentName] = oDialog;
				return oDialog;
			})*/
			oFormFragment = sap.ui.xmlfragment(oControl.getView().getId() + oFragmentName, oFragment + '.' + oFragmentName, oControl);
			this._formFragments[oFragmentName] = oFormFragment;
			return oControl._formFragments[oFragmentName];
		},

		//获取View
		_getFormView: function (oControl, oFragmentName, oFragment) {
			if (oControl._formViews == null)
				oControl._formViews = {};
			let oFormView = oControl._formViews[oFragmentName];
			if (oFormView) {
				return oFormView;
			}

			jQuery.ajax({
				type: 'Get',
				url: '/' + oFragment.replace(/crdt.wf./, '').replace(/[.]/g, '/') + '/' + oFragmentName + '.view.xml',
				async: false,
				success: function (res) {
					oFormView = sap.ui.xmlview(oControl.getView().getId() + oFragmentName, oFragment + '.' + oFragmentName)
				},
				error: function () {
					oFormView = sap.ui.xmlview(oControl.getView().getId() + oFragmentName, "ui5.ui5.view.Infrastructure.NotFound")
				}
			})

			oControl.getView().addDependent(oFormView)
			this._formViews[oFragmentName] = oFormView
			return oControl._formViews[oFragmentName]
		},

		//打开搜索弹窗
		openSearchDialog: function (oControl, oName, oAttributes) {
			let _data = new JSONModel(oAttributes['data'])
			_data.setDefaultBindingMode(BindingMode.OneWay)
			if (!oControl[oName]) {
				let columns = [];
				for (let i = 0; i < oAttributes['colsBind'].length; i++) {
					columns.push(new Column({
						width: oAttributes['width'][i],
						filterProperty: oAttributes['colsBind'][i],
						label: new Label({
							text: oAttributes['colsShow'][i]
						}),
						template: new Text({
							text: '{' + oAttributes['colsBind'][i] + '}'
						}),
						visible: oAttributes['colsShow'][i] == '' ? false : true,
						/*multiLabels: new sap.ui.table.multiLabels({
							
						})*/
					}))
				}

				oControl[oName] = new Dialog({
					id: oControl.getView().getId() + oName,
					title: oAttributes['title'],
					contentHeight: oAttributes['contentHeight'] || 'auto',
					contentWidth: oAttributes['contentWidth'] != null ? oAttributes['contentWidth'] : '30rem',
					content: new Table({
						visibleRowCountMode: library.VisibleRowCountMode.Auto,
						selectionMode: oAttributes['selectionMode'] != null ? oAttributes['selectionMode'] : library.SelectionMode.Single,
						selectionBehavior: oAttributes['selectionBehavior'] != null ? oAttributes['selectionBehavior'] : library.SelectionBehavior.Row,
						rowSelectionChange: oAttributes['rowSelectionChange'],
						columns: columns,
						enableCellFilter: false,
						columnSelect: function () {
							console.log(123213)
						}
					}).setModel(_data).bindRows('/'),
					beginButton: new Button({
						type: ButtonType.Emphasized,
						text: this.getResourceBundle().aPropertyFiles[0].getProperty('Buttons_Query'),
						visible: oAttributes['visibleBeginButton'] != null ? oAttributes['visibleBeginButton'] : true,
						press: function () {
							oControl[oName].close();
						}.bind(oControl)
					}),
					endButton: new Button({
						text: this.getResourceBundle().aPropertyFiles[0].getProperty('Buttons_Cancel'),
						press: function () {
							oControl[oName].close();
						}.bind(oControl)
					})
				});
				oControl[oName].addStyleClass('SearchDialog');
				// to get access to the controller's model
				oControl.getView().addDependent(oControl[oName]);
			}
			else {
				oControl[oName].getContent()[0].setModel(_data).bindRows('/')
			}
			oControl[oName].open();
		},

		//打开新窗口
		openNewWin: function (oControl, oUrl, oName, oData, oClosedFun) {
			let _id = oControl.getView().getId(),
				_postform = $('#' + _id)
			if ($('#' + _id + '_form').length == 0)
				_postform.append('<form id="' + _id + '_form" style="display:none"></form>')
			_postform = $('#' + _id + '_form')
			_postform.html('')
			if (oData != null) {
				for (let i in oData) {
					_postform.append('<input type="hidden" name="' + i + '" value="' +
						(Object.prototype.toString.call(oData[i]) === '[object Object]' ?
							this.htmlEncodeByRegExp(JSON.stringify(oData[i]))
						/*JSON.stringify(oData[i]).replace(/"/g, "\\\"").replace(/'/g, "\\\'")*/ : oData[i]) +
						'"></input>'
					)
				}
			}
			//.append('<input type="hidden" name="data" value=\'' + JSON.stringify(oData) + '\' />')
			_postform.attr('target', oName)
				.attr('method', 'post')
				.attr('action', oUrl)
			let wd = window.open(oUrl, oName, 'width=' + (window.screen.availWidth - 10) + ',height=' + (window.screen.availHeight - 100) + ',top=0,left=0,resizable=yes,status=yes,menubar=no,scrollbars=yes,location=no')
			_postform.submit()
			//监听关闭事件
			if (oClosedFun != null) {
				let loop = setInterval(function () {
					if (wd != null && wd.closed) {
						clearInterval(loop);
						oClosedFun()
					}
				}, 800);
			}
		},

		//数字输入格式化
		bindNumberInput: function (oControl, oInputs, oDialogId) {
			let oDelegate = {}

			oInputs.forEach(u => {
				let _Input = oDialogId != null && oDialogId != '' ? Fragment.byId(oDialogId, u) : oControl.byId(u)
				if (_Input) {
					oDelegate = {
						onfocusout: function () {
							let _v = _Input.getValue()
							if (_v == '' || _v == '.')
								_Input.setValue(_Input.getPlaceholder())
							else
								_Input.setValue(('0' + _v)
									.replace(/0*(((([1-9][0-9]*)|(0))[.][0-9]+)|([1-9][0-9]*)|0)/g, '$1')
									.replace(/([0-9]*)[.]0*$/g, '$1'))
						}
					}
					_Input.addEventDelegate(oDelegate)
				}
			})
		},

		//过滤%00
		filterUrlencode: function (oData) {
			for (var u in oData) {
				if (encodeURI(oData[u]) === '%00')
					oData[u] = ''
			}
			return oData
		},

		//日期格式转换
		formatting: function (_time, format, onlyTime) {
			if (_time == null || _time == '')
				return ''
			if (format == null || format == '')
				format = 'yyyy-MM-dd HH:mm:ss'
			if (onlyTime)
				_time = '1999-01-01 ' + _time
			let time = new Date(_time)
			let y = time.getFullYear()
			let m = time.getMonth() + 1
			let d = time.getDate()
			let h = time.getHours()
			let mm = time.getMinutes()
			let s = time.getSeconds()

			return format.replace('yyyy', y)
				.replace('MM', this.repair0(m))
				.replace('M', m)
				.replace('dd', this.repair0(d))
				.replace('d', d)
				.replace('HH', this.repair0(h))
				.replace('H', h)
				.replace('mm', this.repair0(mm))
				.replace('m', mm)
				.replace('ss', this.repair0(s))
				.replace('s', s)
		},

		//日期格式美化
		repair0: function (m) {
			return m < 10 ? '0' + m : m
		},

		//数字转换为大写汉字
		upDigit: function (n) {
			let fraction = ['角', '分'];
			let digit = ['零', '壹', '貳', '叁', '肆', '伍', '陸', '柒', '捌', '玖'];
			let unit = [['元', '萬', '億'], ['', '拾', '佰', '仟']];
			let head = n < 0 ? '欠' : '';
			n = Math.abs(n);

			let s = '';

			for (let i = 0; i < fraction.length; i++) {
				s += (digit[Math.floor(n * 10 * Math.pow(10, i)) % 10] + fraction[i]).replace(/零./, '');
			}
			s = s || '整';
			n = Math.floor(n);

			for (let i = 0; i < unit[0].length && n > 0; i++) {
				let p = '';
				for (let j = 0; j < unit[1].length && n > 0; j++) {
					p = digit[n % 10] + unit[1][j] + p;
					n = Math.floor(n / 10);
				}
				s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
			}
			return head + s.replace(/(零.)*零元/, '元').replace(/(零.)+/g, '零').replace(/^整$/, '零元整');
		},

		//位数补0
		formatZero: function (num, len) {
			if (String(num).length > len) return num
			return (Array(len).join(0) + num).slice(-len)
		},

		//格式化x位小数
		formatNum: function (num, len) {
			let c = 0,
				re
			num = num.toString().replace(/[^0-9.]/g, '')
				.replace(/\./g, () => { return (c++ === 0) ? '.' : ''; })
			if (len == 0) {
				num = num.replace(/([0-9]*)\.[0-9]*/g, '$1')
			}
			else {
				eval("re = /([0-9]*\.[0-9]{" + len + "})[0-9]*/g");
				num = num.replace(re, '$1')
			}
			return num
		},

		//字符转数字
		toNum: function (v, s) {
			let p = 0
			if (s != null)
				p = s.getPlaceholder()
			if (v[v.length - 1] === '.' && v.length > 1) {
				v = parseFloat(v.toString().substr(0, v.length - 1))
			}
			else if (v === '' || v === '.' || isNaN(parseFloat(v))) {
				v = parseFloat(p)
			}
			else {
				v = parseFloat(v)
			}
			return v
		},

		//转为unicode 编码  
		encodeUnicode: function (str) {
			let res = [];
			for (let i = 0; i < str.length; i++) {
				res[i] = ('00' + str.charCodeAt(i).toString(16)).slice(-4);
			}
			return '\\u' + res.join('\\u');
		},

		//html 转码
		htmlEncodeByRegExp: function (str) {
			var s = "";
			if (str.length == 0) return "";
			s = str.replace(/&/g, "&amp;");
			s = s.replace(/</g, "&lt;");
			s = s.replace(/>/g, "&gt;");
			s = s.replace(/ /g, "&nbsp;");
			s = s.replace(/\'/g, "&#39;");
			s = s.replace(/\"/g, "&quot;");
			return s;
		},

		//html 解码
		htmlDecodeByRegExp: function (str) {
			var s = "";
			if (str.length == 0) return "";
			s = str.replace(/&amp;/g, "&");
			s = s.replace(/&lt;/g, "<");
			s = s.replace(/&gt;/g, ">");
			s = s.replace(/&nbsp;/g, " ");
			s = s.replace(/&#39;/g, "\'");
			s = s.replace(/&quot;/g, "\"");
			return s;
		},

		//写Cookie
		addCookie: function (objName, objValue, objHours, objPath) {
			let str = objName + '=' + objValue; //编码
			if (objHours > 0) {//为0时不设定过期时间，浏览器关闭时cookie自动消失
				let date = new Date();
				let ms = objHours * 3600 * 1000;
				date.setTime(date.getTime() + ms);
				str += '; expires=' + date.toGMTString();
			}
			if (objPath != null)
				str += ';Path=' + objPath
			document.cookie = str;
		},

		//读Cookie
		getCookie: function (objName) {//获取指定名称的cookie的值
			let arrStr = document.cookie.split('; ');
			for (let i = 0; i < arrStr.length; i++) {
				let temp = arrStr[i].split('=');
				if (temp[0] == objName) return unescape(arrStr[i].slice(objName.length + 1));  //解码
			}
			return '';
		},

		//获取服务器时间
		getServerDate: function () {
			return new Date($.ajax({ async: false }).getResponseHeader("Date"));
		},

		//获取CustomData
		getCustomData: function (oT, oKey) {
			let _t = oT.getCustomData().find(u => u.getKey() == oKey)
			return _t == null ? null : _t.getValue()
		},

		//删除存在的CustomData
		deleteCustomData: function (oT, oKey) {
			if (oKey == null || oKey == '')
				oT.removeAllCustomData()
			else {
				let _t = oT.getCustomData().find(u => u.getKey() == oKey)
				if (_t != null)
					oT.removeCustomData(_t)
			}
			return oT
		},

		//改变编辑状态
		changeEditable: function (oList, oStatus, oDialogId) {
			oList.forEach(u => {
				let item = Fragment.byId(oDialogId, u)
				if (item != null) {
					item.setEditable(oStatus == null ? false : oStatus)
					if (oStatus)
						item.setValueState('Information').setValueStateText()
					else
						item.setValueState('None')
				}
			})
		},

		//触发动作
		fireEvent: function (oList, oDialogId) {
			oList.forEach(u => {
				let Item = Fragment.byId(oDialogId, u),
					pattern = /.+[.]([^.]+)/g
				if (Item != null) {
					if (pattern.test(Item.getMetadata().getElementName())) {
						let type = Item.getMetadata().getElementName().replace(pattern, '$1')
						switch (type) {
							case 'Input':
							case 'DatePicker':
								Item.fireLiveChange({ newValue: Item.getValue() })
								break
							case 'Select':
								Item.fireChange({ selectedItem: Item.getSelectedItem() })
								break
							case 'CheckBox':
								Item.fireSelect({ selected: Item.getSelected() })
								break
							/*case 'TableInput': Item.fireRowSelectionChange({ rowContext: Item.getSelected() })
								break*/
							default: break
						}
					}
				}
			})
		},

		//更新分页
		updatePage: function (oS, oR) {
			if (oS != null) {
				let oPageReq = this.getCustomData(oS, 'pageReq'),
					_d = oR.Data || []
				if (oPageReq != null) {
					oPageReq['Count'] = _d.length
					oPageReq['TotalCount'] = oR.Count
					oPageReq['TotalPage'] = Math.ceil(oR.Count / oPageReq['Limit'])
				}
				else {
					oS.addCustomData(
						new CustomData({
							key: 'pageReq',
							value: {
								Page: 1,
								Count: _d.length,
								TotalCount: oR.Count,
								TotalPage: Math.ceil(oR.Count / oS.getVisibleRowCount()),
								Limit: oS.getVisibleRowCount(),
								Filters: []
							}
						})
					)
				}
			}
		},
		//密码输入格式化
		passwordInput: function (newPassword, oldPassword, p) {
			let truePassword = ''

			for (var i = 0; i < newPassword.length; i++) {
				var c = newPassword.charAt(i);
				if (i < p && c != '●') {
					truePassword += c;
				} else if (i < p && c == '●') {
					truePassword += oldPassword.charAt(i);
				} else {
					truePassword += oldPassword.substr(oldPassword.length - newPassword.length + p, newPassword.length - p);
					break;
				}
			}

			return truePassword
		},
		_validateInput: function (oInput) {
			var _i18n = this.getResourceBundle();
			var sValueState = "None";
			var bValidationError = false;
			var value = oInput.getValue();
			if (oInput.getRequired() && (value == null || value == "")) {
				sValueState = "Error";
				bValidationError = "true";
				var sValueStateText = _i18n.getText('ymsg.NullValue');
				oInput.setValueStateText(sValueStateText);
			}
			oInput.setValueState(sValueState);

			return bValidationError;
		},
		_validateSelect: function (oInput) {
			var _i18n = this.getResourceBundle();
			var value;
			var sValueState = "None";
			var bValidationError = false;
			var select = oInput.getSelectedItem();
			if (select != null) {
				value = select.getKey();
			}
			else {
				value = null;
			}
			if (oInput.getRequired() && (value == null || value == "")) {
				sValueState = "Error";
				bValidationError = "true";
				var sValueStateText = _i18n.getText('ymsg.NullValue');
				oInput.setValueStateText(sValueStateText);
			}
			oInput.setValueState(sValueState);

			return bValidationError;
		},
		validateValue: function (oInput) {
			var _i18n = this.getResourceBundle();
			var sValueState = "None";
			var bValidationError = false;
			var oValue = oInput.getValue();
			if (oValue != null && oValue!="")
			{
				var rexMail = /^\w+[\w-+\.]*\@\w+([-\.]\w+)*\.[a-zA-Z]{2,}$/;
				if (!oValue.match(rexMail)) {
					sValueState = "Error";
					bValidationError = "true";
					var sValueStateText = oValue + _i18n.getText('ymsg.ValidEmail');
					oInput.setValueStateText(sValueStateText);
				}
			}
			oInput.setValueState(sValueState);
			
			return bValidationError;
		},
		validDate: function (oInput)
		{
			var _i18n = this.getResourceBundle();
			var sValueState = "None";
			var bValidationError = false;
			var oValue = oInput.getValue();
			if (oValue=="0000-00-00")
			{
				sValueState = "Error";
				bValidationError = "true";
				var sValueStateText = oValue + _i18n.getText('ymsg.ValidDate');
				oInput.setValueStateText(sValueStateText);
			}
			oInput.setValueState(sValueState);

			return bValidationError;
		},
		_validateComboBox: function (oInput)
		{
			var _i18n = this.getResourceBundle();
			var value;
			var sValueState = "None";
			var bValidationError = false;
			var select = oInput.getSelectedItems();
			if (select != null) {
				value = oInput.getSelectedKeys();
			}
			else {
				value = null;
			}
			if (oInput.getRequired() && (value == null || value == "")) {
				sValueState = "Error";
				bValidationError = "true";
				var sValueStateText = _i18n.getText('ymsg.NullValue');
				oInput.setValueStateText(sValueStateText);
			}
			else if (value.length>5)
			{
				sValueState = "Error";
				bValidationError = "true";
				var sValueStateText = _i18n.getText('ymsg.SelectLengthValid');
				oInput.setValueStateText(sValueStateText);
			}
			oInput.setValueState(sValueState);

			return bValidationError;
		},
		validStartTimeAndEndTime: function (oInput1, oInput2)
		{
			var _i18n = this.getResourceBundle();
			var value;
			var sValueState = "None";
			var bValidationError = false;
			var startTime = oInput1.getValue();
			var endTime = oInput2.getValue();
			if (startTime > endTime) {
				sValueState = "Error";
				bValidationError = "true";
				var sValueStateText = _i18n.getText('ymsg.DateCompare');
				oInput1.setValueStateText(sValueStateText);
				oInput2.setValueStateText(sValueStateText);
			}
			oInput1.setValueState(sValueState);
			oInput2.setValueState(sValueState);

			return bValidationError;
		},
		validCreditLimit: function (oInput) {
			var _i18n = this.getResourceBundle();
			var sValueState = "None";
			var bValidationError = false;
			var oValue = oInput.getValue();
			if (oValue % 2000 != 0 || oValue<=0) {
				sValueState = "Error";
				bValidationError = "true";
				var sValueStateText = _i18n.getText("ymsg.MultipleCheck");
				oInput.setValueStateText(sValueStateText);
			}
			oInput.setValueState(sValueState); 

			return bValidationError;
		},
		validateVBA: function (oInput)
		{
			var _i18n = this.getResourceBundle();
			var success = false;
			var sValueState = "None";
			var bValidationError = false;
			var oValue = oInput.getValue();
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
					if (jsonVBADicModel[i].DCODE == oValue) {
						success = true;
					}
				}
			}
			if (!success) {
				sValueState = "Error";
				bValidationError = "true";
				var sValueStateText = _i18n.getText("ymsg.VBACheck");
				oInput.setValueStateText(sValueStateText);
			}
			oInput.setValueState(sValueState);

			return bValidationError;
		},
		_validateNumberInput: function (oInput)
		{
			var _i18n = this.getResourceBundle();
			var sValueState = "None";
			var bValidationError = false;
			var oValue = oInput.getValue();
			if (oInput.getRequired() && (oValue == null || oValue == ""))
			{
				sValueState = "Error";
				bValidationError = "true";
				var sValueStateText = _i18n.getText('ymsg.NullValue');
				oInput.setValueStateText(sValueStateText);
			}
			else if (oValue < 0) {
				sValueState = "Error";
				bValidationError = "true";
				var sValueStateText = _i18n.getText("ymsg.AMTCheck");
				oInput.setValueStateText(sValueStateText);
			}
			oInput.setValueState(sValueState);

			return bValidationError;
		},
		checkTime: function (stime, etime) {　　 //通过replace方法将字符串转换成Date格式
			var sdate = new Date(Date.parse(stime.replace(/-/g, "/")));
			var edate = new Date(Date.parse(etime.replace(/-/g, "/")));
			//获取两个日期的年月日
			var smonth = sdate.getMonth() + 1;
			var syear = sdate.getFullYear();
			var sday = sdate.getDate();

			var emonth = edate.getMonth() + 1;
			var eyear = edate.getFullYear();
			var eday = edate.getDate();
			//从年，月，日，分别进行比较
			if (syear < eyear) {
				return true;
			}
			else if (syear == eyear) {
				if (smonth < emonth) {
					return true;
				}
				else if (smonth == emonth) {
					if (sday < eday) {
						return true;
					}
					else {
						return false;
					}
				}
				else {
					return false;
				}
			}
			else {
				return false;
			}
		},
		subValidate: function (num1,num2)
		{
			var str1 = num1.toString(), str2 = num2.toString(), result, str1Length, str2Length;
			try { str1Length = str1.split('.')[1].length } catch (error) { str1Length = 0 }
			try { str2Length = str2.split('.')[1].length } catch (error) { str2Length = 0 }
			var step = Math.pow(10, Math.max(str1Length, str2Length))
			result = (num1 * step - num2 * step) / step
			return result;
		}
	});
})