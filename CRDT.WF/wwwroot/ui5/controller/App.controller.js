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
], function (Device, BaseController, JSONModel, Popover, Button, library, jQuery, MessageToast, Fragment, NavigationListItem) {
	'use strict';

	return BaseController.extend('crdt.wf.ui5.controller.App', {
		onInit: function () {
			// apply content density mode to root view
			this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass())
		}
	});
});