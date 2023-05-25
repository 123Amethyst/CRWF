sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"sap/ui/model/resource/ResourceModel",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/BindingMode",
	"./model/models",
	'sap/ui/thirdparty/jquery',
], function (UIComponent, Device, ResourceModel, JSONModel, BindingMode, models, jQuery) {
	"use strict";

	return UIComponent.extend("crdt.wf.ui5.Component", {

		metadata: {
			manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * In this function, the device models are set and the router is initialized.
		 * @public
		 * @override
		 */
		init: function () {
			var _data = JSON.parse(localStorage.getItem("data")),
				_curr = JSON.parse(localStorage.getItem("CurrentUser")),
				_envi = localStorage.getItem("Environment")
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);

			// initialize the error handler with the component

			// set the device model
			this.setModel(models.createDeviceModel(), "device");

			/*var oResourceModel = new ResourceModel({
				bundleName: "sap.ui.sdk.cn.i18n.i18n",
				supportedLocales: ["en", "zh_CN"],
				fallbackLocale: ""
			});
			this.setModel(oResourceModel, "i18n");*/
			//let curr = JSON.parse(_curr)
			let _sysInfo = {
				'BackgroundData': _data == '' ? null : _data,
			}
			this._oGlobalModel = new JSONModel(_sysInfo);
			this.setModel(this._oGlobalModel, '_sysInfo');
			localStorage.removeItem('data')
			localStorage.removeItem('CurrentUser')

			this.getModel('_sysInfo').setProperty('/CurrentUser', _curr)
			// create the views based on the url/hash
			let obj = this.getModel('_sysInfo').getProperty('/BackgroundData')
			if (obj != null) {
				if (this.getRouter().getRouteByHash(obj.Page))
					this.getRouter().getTargets().display(obj.Page)
				else
					this.getRouter().getTargets().display('notFound')
			}
			else {
				this.getRouter().initialize()
			}
		},

		/**
		 * The component is destroyed by UI5 automatically.
		 * In this method, the ErrorHandler is destroyed.
		 * @public
		 * @override
		 */
		destroy: function () {
			this._oErrorHandler.destroy();
			// call the base component's destroy function
			UIComponent.prototype.destroy.apply(this, arguments);
		},

		/**
		 * This method can be called to determine whether the sapUiSizeCompact or sapUiSizeCozy
		 * design mode class should be set, which influences the size appearance of some controls.
		 * @public
		 * @return {string} css class, either 'sapUiSizeCompact' or 'sapUiSizeCozy' - or an empty string if no css class should be set
		 */
		getContentDensityClass: function () {
			if (this._sContentDensityClass === undefined) {
				// check whether FLP has already set the content density class; do nothing in this case
				// eslint-disable-next-line sap-no-proprietary-browser-api
				if (document.body.classList.contains("sapUiSizeCozy") || document.body.classList.contains("sapUiSizeCompact")) {
					this._sContentDensityClass = "";
				} else if (!Device.support.touch) { // apply "compact" mode if touch is not supported
					this._sContentDensityClass = "sapUiSizeCompact";
				} else {
					// "cozy" in case of touch support; default for most sap.m controls, but needed for desktop-first controls like sap.ui.table.Table
					this._sContentDensityClass = "sapUiSizeCozy";
				}
			}
			return this._sContentDensityClass;
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
	});

});