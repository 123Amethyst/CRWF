sap.ui.define([
	'../BaseController',
	'sap/ui/table/library',
	'sap/m/MessageBox',
	'sap/m/MessageToast',
	'sap/ui/thirdparty/jquery',
	'sap/ui/core/Fragment',
	'sap/ui/model/json/JSONModel',
	"../../model/jszip",
	"../../model/xlsx",
], function (BaseController, library, MessageBox, MessageToast, jQuery, Fragment, JSONModel, jszip, xlsx) {
	'use strict';
	let _i18n,
		_currentUser,
		_backgroundData,
		isSAPExist = true;
	return BaseController.extend('crdt.wf.ui5.controller.Information.FormOpenCRDTPayer', {
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
			if (_backgroundData['HD']['REQID'] != null && _backgroundData['HD']['REQID'] != "")
			{
				let _payerData = {};
				if (_backgroundData['Payer'] != null) {
					var inputOption = _backgroundData['Payer']['INPUT_OPTION'];
					if (inputOption == "Single") {
						this.byId("Single").setSelected(true);
					}
					else if (inputOption == "Mass") {
						this.byId("Mass").setSelected(true);
						this.byId("outletNo").setVisible(true);
						this.byId("fileUploader").setVisible(true);
						this.byId("template").setVisible(true);
						this.byId("uploadBtn").setVisible(true);
						this.byId("UploadTip").setVisible(true);
					}
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
				if (_backgroundData['HD']['ACTCD'] != "DRAFT") {
					this.byId("DataSourceChoice").setEnabled(false);
					this.byId("fileUploader").setEnabled(false);
					this.byId("template").setEnabled(false);
					this.byId("uploadBtn").setEnabled(false);
					this.byId("ReferenceBpNo").setEnabled(false);
					this.byId("BPSearch").setEnabled(false);
					this.byId("SalesAdmin").setEnabled(false);
					this.byId("BillTo").setEnabled(false);
					this.byId("CompanyCode").setEnabled(false);
					this.byId("Name1").setEnabled(false);
					this.byId("Name2").setEnabled(false);
					this.byId("CorrespondingAddress1").setEnabled(false);
					this.byId("PostalAddress1").setEnabled(false);
					this.byId("CorrespondingAddress2").setEnabled(false);
					this.byId("PostalAddress2").setEnabled(false);
					this.byId("CorrespondingAddress3").setEnabled(false);
					this.byId("PostalAddress3").setEnabled(false);
					this.byId("Attention").setEnabled(false);
					this.byId("Addressee").setEnabled(false);
					this.byId("Phone1").setEnabled(false);
					this.byId("Phone1Ext").setEnabled(false);
					this.byId("Phone2").setEnabled(false);
					this.byId("Phone2Ext").setEnabled(false);
					this.byId("Email1").setEnabled(false);
					this.byId("Email2").setEnabled(false);
					this.byId("Email3").setEnabled(false);
					this.byId("Fax").setEnabled(false);
					this.byId("Remark").setEnabled(false);
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

			if (_backgroundData['HD']['REQID'] == null || _backgroundData['HD']['REQID'] == "")
			{
				this.byId("SalesAdmin").setSelectedKey((jsonSalesAdminDicModel != null && jsonSalesAdminDicModel.length > 0) ? jsonSalesAdminDicModel[0].ZZSALESADMIN:"");
			}
			var oData = { SalesAdminModel: jsonSalesAdminDicModel };
			var oModel = new JSONModel(oData);
			this.getView().setModel(oModel);
		},
		handleChange: function (oEvent) {

			var oFileUploader = this.getView().byId("fileUploader");

			var oFile = oFileUploader.oFileUpload.files[0];
			this._import(oFile);
		},
		result: {},
		_import: function (file) {
			if (file && window.FileReader) {

				var reader = new FileReader();

				var result = {},

					data;

				var that = this;

				reader.onload = function (e) {

					data = e.target.result;

					//XLSX: Defined in xlsx.js

					if (file.name.split('.')[1].toLowerCase() == "xlsx" || file.name.split('.')[1].toLowerCase() == "xls")
					{
						var wb = XLSX.read(data, {

							type: 'binary'

						});

						wb.SheetNames.forEach(function (sheetName) {

							var roa = XLSX.utils.sheet_to_row_object_array(wb.Sheets[sheetName]);

							var jsonObjString = JSON.stringify(roa);

							if (roa.length > 0) {
								result[sheetName] = roa;
							}
						});
					}
					if (file.name.split('.')[1].toLowerCase() == "csv")
					{
						that.csvJSON(data);
					}
				};
				reader.readAsBinaryString(file);
				reader.onloadend = function (e) {
					that.result = result;
				};
			}
		},
		csvJSON: function (csv) {

			//var lines = csv.split("\n");

			var lines = csv.split("\r\n");

			var result = [];

			var headers = lines[0].split(",");

			for (var i = 1; i < lines.length-1; i++) {

				var obj = {};

				var currentline = lines[i].split(",");

				for (var j = 0; j < headers.length; j++) {

					obj[headers[j]] = currentline[j];

				}

				result.push(obj);

			}

			// var oStringResult = JSON.stringify(result);

			//var oFinalResult = JSON.parse(oStringResult.replace(/\\r/g, ""));

			this.oStringResult = JSON.stringify(result);

			this.oFinalResult = JSON.parse(this.oStringResult);

			//this.oFinalResult = JSON.parse(this.oStringResult.replace(/\\r/g, ""));

			//sap.ui.getCore().getModel().setProperty("/", oFinalResult);

		},
		handleUploadPress: function () {
			//var _this = this;
			//var oFileUploader = this.getView().byId("fileUploader");
			//var domRef = oFileUploader.getFocusDomRef();
			//var file = domRef.files[0];
			//if (file == null) {
			//	MessageToast.show(_i18n.getText('xfld.PleaseChooseFile'));
			//	return;
			//}
			//var oFileUploader = this.getView().byId("fileUploader");
			//var outletNoArray = [];
			//if (file.name.split('.')[1].toLowerCase() == "xlsx" || file.name.split('.')[1].toLowerCase() == "xls")
			//{
			//	outletNoArray = this.result.PayerInfo;
			//}
			//if (file.name.split('.')[1].toLowerCase() == "csv")
			//{
			//	outletNoArray = this.oFinalResult;
			//}
			//if (outletNoArray != null && outletNoArray.length > 0) {
			//	var outletNo = "";
			//	var firstOutletNo = "";
			//	var _data = new Array();
			//	var isApproveComplete = false;
			//	var isPayerCheck = true;
			//	var message = "";
			//	this.byId("outletNo").setValue("");
			//	this.byId("ReferenceBpNo").setValue("");
			//	for (var i = 0; i < outletNoArray.length; i++) {
			//		firstOutletNo = outletNoArray[0].OutletNo;
			//		if (i < outletNoArray.length - 1) {
			//			outletNo = outletNo + outletNoArray[i].OutletNo + ",";
			//		}
			//		else {
			//			outletNo = outletNo + outletNoArray[i].OutletNo;
			//		}
			//		if (outletNoArray[i].OutletNo.substr(0, 4) == "1209" || outletNoArray[i].OutletNo.substr(0, 3) == "121") {
			//			MessageToast.show(outletNoArray[i].OutletNo + "," + _i18n.getText("ymsg.PayerRangeCheck"));
			//			isPayerCheck = false;
			//			break;
			//		}
			//		else {
			//			var customerData;
			//			var dateAndTime = this.formatting(new Date());
			//			var dateEnd = dateAndTime.split(" ")[0].replace(/-/g, "");
			//			var timeEnd = dateAndTime.split(" ")[1].replace(/:/g, "");
			//			var formNumber = "CRDT" + dateEnd + timeEnd;
			//			var customerDataReq =
			//			{
			//				I_ZNUM: formNumber,
			//				I_ZSOURCE: "HD",
			//				I_BUKRS: _backgroundData['HD']['PLANT'],
			//				I_PARTNER: outletNoArray[i].OutletNo,
			//				I_DATAB: "20200101",
			//				I_TIMAB: "000000",
			//				I_DATBI: dateEnd,
			//				I_TIMBI: timeEnd,
			//				I_SAP: ""
			//			}
			//			jQuery.ajax({
			//				type: "Post",
			//				dataType: "json",
			//				async: false,
			//				data:
			//				{
			//					req: customerDataReq
			//				},
			//				url: "/ApprovalFlow/GetCheckBpNoResult",
			//				success: function (res) {
			//					if (!res) {
			//						message = message + outletNoArray[i].OutletNo+","
			//					}
			//				},
			//				error: function (err) {
			//					MessageToast.show(err.statusText);
			//				}
			//			});
			//		}
			//	}
			//	if (isPayerCheck) {
			//		if (message == "") {
			//			this.byId("outletNo").setValue("There are " + outletNoArray.length + " outlets uploaded. Outlet no.:" + outletNo)
			//			this.byId("ReferenceBpNo").setValue(firstOutletNo);
			//			MessageToast.show(_i18n.getText('Message_Success_Upload'));
			//		}
			//		else {
			//			MessageToast.show(message + "Invalid record contains ,Verification failed");
			//			_this.byId("outletNo").setValue("Invalid record contains. Please check and reupload.")
			//			_this.byId("ReferenceBpNo").setValue("");
			//		}
			//	}
			//}
			//else
			//{
			//	this.byId("outletNo").setValue("")
			//	this.byId("ReferenceBpNo").setValue("");
			//	MessageToast.show(_i18n.getText('ymsg.NullContent'));
			//}

			var _this = this;
			var oFileUploader = this.getView().byId("fileUploader");
			var domRef = oFileUploader.getFocusDomRef();
			var file = domRef.files[0];
			if (file == null) {
				MessageToast.show(_i18n.getText('xfld.PleaseChooseFile'));
				return;
			}
			var oFileUploader = this.getView().byId("fileUploader");
			var outletNoArray = [];
			if (file.name.split('.')[1].toLowerCase() == "xlsx" || file.name.split('.')[1].toLowerCase() == "xls") {
				outletNoArray = this.result.PayerInfo;
			}
			if (file.name.split('.')[1].toLowerCase() == "csv") {
				outletNoArray = this.oFinalResult;
			}
			if (outletNoArray != null && outletNoArray.length > 0) {
				var outletNo = "";
				var firstOutletNo = "";
				var _data = new Array();
				var isApproveComplete = true;
				var isPayerCheck = true;
				var message = "";
				for (var i = 0; i < outletNoArray.length; i++) {
					firstOutletNo = outletNoArray[0].OutletNo;
					if (i < outletNoArray.length - 1) {
						outletNo = outletNo + outletNoArray[i].OutletNo + ",";
					}
					else {
						outletNo = outletNo + outletNoArray[i].OutletNo;
					}
					if (outletNoArray[i].OutletNo.substr(0, 4) == "1209" || outletNoArray[i].OutletNo.substr(0, 3) == "121") {
						MessageToast.show(outletNoArray[i].OutletNo + "," + _i18n.getText("ymsg.PayerRangeCheck"));
						isPayerCheck = false;
						break;
					}
					else {
						var customerData;
						var dateAndTime = this.formatting(new Date());
						var dateEnd = dateAndTime.split(" ")[0].replace(/-/g, "");
						var timeEnd = dateAndTime.split(" ")[1].replace(/:/g, "");
						var formNumber = "CRDT" + dateEnd + timeEnd;
						var customerDataReq =
						{
							I_ZNUM: formNumber,
							I_ZSOURCE: "HD",
							I_BUKRS: _backgroundData['HD']['PLANT'],
							I_PARTNER: outletNoArray[i].OutletNo,
							I_DATAB: "20200101",
							I_TIMAB: "000000",
							I_DATBI: dateEnd,
							I_TIMBI: timeEnd,
							I_SAP: ""
						}
						jQuery.ajax({
							type: "Post",
							dataType: "json",
							async: false,
							data:
							{
								req: customerDataReq
							},
							url: "/ApprovalFlow/GetCustomerDataByApi",
							success: function (res) {
								if (res.Code == 200) {
									if (res.Data != null) {
										customerData = res.Data;
									}
								}
								else {
									var outlet = { BpNo: outletNoArray[i].OutletNo };
									_data.push(outlet);
									isApproveComplete = false;
									if (i == outletNoArray.length - 1) {
										message = message + res.Message;
									}
									else {
										message = message + res.Message + ",";
									}
								}
							},
							error: function (err) {
								isApproveComplete = false;
								MessageToast.show(err.statusText);
							}
						});
					}
				}
				if (isPayerCheck) {
					if (!isApproveComplete) {
						MessageToast.show(message + " ,Verification failed");
						_this.byId("outletNo").setValue("Invalid record contains. Please check and reupload.")
						_this.byId("ReferenceBpNo").setValue("");
					}
					else {
						this.byId("outletNo").setValue("There are " + outletNoArray.length + " outlets uploaded. Outlet no.:" + outletNo)
						this.byId("ReferenceBpNo").setValue(firstOutletNo);
						MessageToast.show(_i18n.getText('Message_Success_Upload'));
					}
				}
			}
			else {
				this.byId("outletNo").setValue("")
				this.byId("ReferenceBpNo").setValue("");
				MessageToast.show(_i18n.getText('ymsg.NullContent'));
			}

		},
		//选择单个检索还是多条上传
		onChangeChoice: function () {
			var DataSource;
			var DataSourceGroup = this.byId("DataSourceChoice").getButtons();
			for (var j = 0; j < DataSourceGroup.length; j++) {
				if (DataSourceGroup[j].mProperties.selected) {
					DataSource = DataSourceGroup[j].mProperties.text;
				}
			}
			if (DataSource == "Mass update outlet under this payer") {
				this.byId("outletNo").setVisible(true);
				this.byId("fileUploader").setVisible(true);
				this.byId("template").setVisible(true);
				this.byId("uploadBtn").setVisible(true);
				this.byId("UploadTip").setVisible(true);
				this.byId("ReferenceBpNo").setEnabled(false);
				this.byId("outletNo").setValue("");
				this.byId("fileUploader").setValue("");
				this.byId("ReferenceBpNo").setValue("");
				this.clearValue();
			}
			else {
				this.byId("outletNo").setVisible(false);
				this.byId("fileUploader").setVisible(false);
				this.byId("template").setVisible(false);
				this.byId("uploadBtn").setVisible(false);
				this.byId("UploadTip").setVisible(false);
				this.byId("ReferenceBpNo").setEnabled(true);
				this.byId("ReferenceBpNo").setValue("");
				this.clearValue();
			}
		},
		onBPNoSearch: function () {
			var _this = this;
			var bpNo = this.byId("ReferenceBpNo").getValue();
			if (bpNo == "" || bpNo == null) {
				MessageToast.show(_i18n.getText("ymsg.BPNullValid"));
			}
			else
			{
				if (bpNo.substr(0, 4) == "1209" || bpNo.substr(0, 3) == "121") {
					_this.clearValue();
					MessageToast.show(_i18n.getText("ymsg.PayerRangeCheck"));
				}
				else
				{
			//		var dateAndTime = this.formatting(new Date());
			//		var dateEnd = dateAndTime.split(" ")[0].replace(/-/g, "");
			//		var timeEnd = dateAndTime.split(" ")[1].replace(/:/g, "");
			//		var formNumber = "CRDT" + dateEnd + timeEnd;

			//		var data;
			//		var creditData;
			//		var jsoncreditData;
			//		var isPassValid = true;
			//		var customerCreditData =
			//		{
			//			I_ZNUM: formNumber,
			//			I_ZSOURCE: "HD",
			//			I_PARTNER: this.byId("ReferenceBpNo").getValue(),
			//			I_BUKRS: _backgroundData['HD']['PLANT'],
			//		}
			//		var customerDataReq =
			//		{
			//			I_ZNUM: formNumber,
			//			I_ZSOURCE: "HD",
			//			I_BUKRS: _backgroundData['HD']['PLANT'],
			//			I_PARTNER: _this.byId("ReferenceBpNo").getValue(),
			//			I_DATAB: "20200101",
			//			I_TIMAB: "000000",
			//			I_DATBI: dateEnd,
			//			I_TIMBI: timeEnd,
			//			I_SAP: ""
			//		}
			//		//调用506接口获取BP数据
			//		jQuery.ajax({
			//			type: 'Post',
			//			url: '/ApprovalFlow/GetCustomerDataByApiOrCMWF',
			//			dataType: 'json',
			//			data:
			//			{
			//				req: customerDataReq
			//			},
			//			async: false,
			//			success: function (res) {
			//				if (res.Code==200) {
			//					if (res.Data != null) {
			//						data = res.Data;
			//						if (res.Message == "CMWF") {
			//							data["AKONT"] = "0" + data["AKONT"];
			//							creditData = { CHECK_RULE: "ZX", CREDIT_LIMIT: 0, RISK_CLASS: "B", VALID_DATE: "9999-12-31" }
			//						}
			//						else if (res.Message == "SAP") {
			//							//调用688接口获取信用主数据
			//							jQuery.ajax({
			//								type: 'Post',
			//								url: '/ApprovalFlow/GetCustomerCredit',
			//								dataType: 'json',
			//								data:
			//								{
			//									req: customerCreditData
			//								},
			//								async: false,
			//								success: function (res) {
			//									if (res.Code == 200) {
			//										creditData = res.Data[0];
			//									}
			//									else {
			//										isPassValid = false;
			//										_this.clearValue();
			//										MessageToast.show(res.Message);
			//									}
			//								},
			//								error: function (err) {
			//									isPassValid = false;
			//									_this.clearValue();
			//									MessageToast.show(err.statusText);
			//								}
			//							})
			//						}
			//					}
			//					else {
			//						isPassValid = false;
			//						_this.clearValue();
			//						MessageToast.show(_i18n.getText("ymsg.BPInvalidError"));
			//					}
			//				}
			//				else
			//				{
			//					isPassValid = false;
			//					_this.clearValue();
			//					MessageToast.show(_i18n.getText(res.Message));
			//				}
			//			},
			//			error: function (err) {
			//				isPassValid = false;
			//				_this.clearValue();
			//				MessageToast.show(err.statusText);
			//			}
			//		})






			var dateAndTime = this.formatting(new Date());
			var dateEnd = dateAndTime.split(" ")[0].replace(/-/g, "");
			var timeEnd = dateAndTime.split(" ")[1].replace(/:/g, "");
			var formNumber = "CRDT" + dateEnd + timeEnd;

			var data;
			var creditData;
			var jsoncreditData;
			var isPassValid = true;
			var customerCreditData =
			{
				I_ZNUM: formNumber,
				I_ZSOURCE: "HD",
				I_PARTNER: this.byId("ReferenceBpNo").getValue(),
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
			//调用506接口获取BP数据
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
							//var type = res.Message.split(",")[1];
							//if (type == "CMWF") {
							//	creditData = { CHECK_RULE: "ZX", CREDIT_LIMIT: 0, RISK_CLASS: "B", VALID_DATE: "9999-12-31" }
							//}
							//else if (type == "SAP")
							//{
								//调用688接口获取信用主数据
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
							//}
						}
						else {
							isPassValid = false;
							_this.clearValue();
							MessageToast.show(_i18n.getText("ymsg.BPInvalidError"));
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
						var businessNatureGroup = arInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_OpenCRDT_IndexFormOpenCRDTAR--BusinessNature').getButtons();
						if (data["KATR2"] == "A1") {
							businessNatureGroup[0].setSelected(true);
						}
						else if (data["KATR2"] == "A2") {
							businessNatureGroup[1].setSelected(true);
						}
						else
						{
							businessNatureGroup[0].setSelected(false);
							businessNatureGroup[1].setSelected(false);
						}
						if (data["ZZRECONPRT"] == "A04") {
							arInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_OpenCRDT_IndexFormOpenCRDTAR--StaPrintOpt').setSelectedKey("SP01")
						}
						else if (data["ZZRECONPRT"] == "A07") {
							arInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_OpenCRDT_IndexFormOpenCRDTAR--StaPrintOpt').setSelectedKey("SP02")
						}
						else if (data["ZZRECONPRT"] == "A06") {
							arInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_OpenCRDT_IndexFormOpenCRDTAR--StaPrintOpt').setSelectedKey("SP03")
						}
						else if (data["ZZRECONPRT"] == "A01") {
							arInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_OpenCRDT_IndexFormOpenCRDTAR--StaPrintOpt').setSelectedKey("SP04")
						}
						var creditTermScore = 0.8;
						if (data["ZTERM_KNVV"] == "X015" || data["ZTERM_KNVV"] == "Y015") {
							creditTermScore = 0.8;
						}
						else if (data["ZTERM_KNVV"] == "X030" || data["ZTERM_KNVV"] == "Y030") {
							creditTermScore = 1.3;
						}
						else if (data["ZTERM_KNVV"] == "X045" || data["ZTERM_KNVV"] == "Y045") {
							creditTermScore = 1.8;
						}
						else if (data["ZTERM_KNVV"] == "X060" || data["ZTERM_KNVV"] == "Y060") {
							creditTermScore = 2.3;
						}
						else if (data["ZTERM_KNVV"] == "X070" || data["ZTERM_KNVV"] == "Y070") {
							creditTermScore = 2.6;
						}
						else if (data["ZTERM_KNVV"] == "X090" || data["ZTERM_KNVV"] == "Y090") {
							creditTermScore = 3.3;
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
						var ScoreSecDesposit = "";
						if (data["ZZCUSTORGTYPE"] != null && data["ZZCUSTORGTYPE"]!="")
						{
							if (data["ZZCUSTORGTYPE"].indexOf("A") != -1 || data["ZZCUSTORGTYPE"].indexOf("B") != -1 || data["ZZCUSTORGTYPE"].indexOf("C") != -1) {
								ScoreSecDesposit = 1;
							}
						}
						var isExist = false;
						var salesAdmin = payerInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_OpenCRDT_IndexFormOpenCRDTPayer--SalesAdmin').getSelectedKey();
						for (var i = 0; i < _backgroundData['ApplicantUserProperty']["SalesAdmin"].length; i++) {
							if (data["ZZSALESADMIN"] == _backgroundData['ApplicantUserProperty']["SalesAdmin"][i])
							{
								isExist = true;
							}
                        }
						salesAdmin = isExist ? data["ZZSALESADMIN"] : salesAdmin;
						//var creditManager = arInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_OpenCRDT_IndexFormOpenCRDTAR--CreditManager').getSelectedKey();
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
						arInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_OpenCRDT_IndexFormOpenCRDTAR--CreditManager').setModel(oModel);
						if (jsonCreditManagerDicModel.length == 0) {
							arInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_OpenCRDT_IndexFormOpenCRDTAR--CreditManager').setSelectedKey("");
						}
						else if (jsonCreditManagerDicModel.length > 0) {
							arInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_OpenCRDT_IndexFormOpenCRDTAR--CreditManager').setSelectedKey(data["ZZCRMANAGER"] == "" ? jsonCreditManagerDicModel[0].DCODE : data["ZZCRMANAGER"]);
						}
						var creditManager = arInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_OpenCRDT_IndexFormOpenCRDTAR--CreditManager').getSelectedKey();
						//payerInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_OpenCRDT_IndexFormOpenCRDTPayer--ReferenceBpNo').setValue(data["KUNNR"]),
						payerInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_OpenCRDT_IndexFormOpenCRDTPayer--SalesAdmin').setSelectedKey(salesAdmin),
						payerInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_OpenCRDT_IndexFormOpenCRDTPayer--BillTo').setValue("审批后系统给号"),
						payerInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_OpenCRDT_IndexFormOpenCRDTPayer--CompanyCode').setValue(data["BUKRS"] + "-" + companyName),
						payerInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_OpenCRDT_IndexFormOpenCRDTPayer--Name1').setValue((data["NAME_ORG1"] == null ? "" : data["NAME_ORG1"])+ "" + (data["NAME_ORG2"] == null ? "" : data["NAME_ORG2"])),
						payerInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_OpenCRDT_IndexFormOpenCRDTPayer--Name2').setValue((data["NAME1_SZF"] == null ? "" : data["NAME1_SZF"]) + "" + (data["NAME2_SZF"] == null ? "" : data["NAME2_SZF"])),
						payerInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_OpenCRDT_IndexFormOpenCRDTPayer--CorrespondingAddress1').setValue(data["STREET_CEN"]),
						payerInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_OpenCRDT_IndexFormOpenCRDTPayer--PostalAddress1').setValue(data["STREET_CZF"]),
						payerInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_OpenCRDT_IndexFormOpenCRDTPayer--CorrespondingAddress2').setValue(data["STR_SUPPL3_CEN"]),
						payerInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_OpenCRDT_IndexFormOpenCRDTPayer--PostalAddress2').setValue(data["STR_SUPPL3_CZF"]),
						payerInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_OpenCRDT_IndexFormOpenCRDTPayer--CorrespondingAddress3').setValue(data["LOCATION_CEN"]),
						payerInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_OpenCRDT_IndexFormOpenCRDTPayer--PostalAddress3').setValue(data["LOCATION_CZF"]),
						payerInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_OpenCRDT_IndexFormOpenCRDTPayer--Attention').setValue(data["ZZCONTACTT11"]),
						payerInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_OpenCRDT_IndexFormOpenCRDTPayer--Addressee').setValue(data["ZZCONTACTP09"]),
						payerInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_OpenCRDT_IndexFormOpenCRDTPayer--Phone1').setValue(data["ZZCONTACTT09"]),
						payerInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_OpenCRDT_IndexFormOpenCRDTPayer--Phone1Ext').setValue(""),
						payerInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_OpenCRDT_IndexFormOpenCRDTPayer--Phone2').setValue(data["ZZCONTACTT09B"]),
						payerInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_OpenCRDT_IndexFormOpenCRDTPayer--Phone2Ext').setValue(""),
						payerInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_OpenCRDT_IndexFormOpenCRDTPayer--Email1').setValue(data["ZZFMAILADDR1"]),
						payerInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_OpenCRDT_IndexFormOpenCRDTPayer--Email2').setValue(data["ZZFMAILADDR2"]),
						payerInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_OpenCRDT_IndexFormOpenCRDTPayer--Email3').setValue(data["ZZFMAILADDR3"]),
						payerInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_OpenCRDT_IndexFormOpenCRDTPayer--Fax').setValue(data["FAX_NUMBER_CZF"]),
						payerInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_OpenCRDT_IndexFormOpenCRDTPayer--Remark').setValue(""),
					  //arInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_OpenCRDT_IndexFormOpenCRDTAR--CustomerStatus').setSelectedKey(data["ZZCUSTSTATUS"]),
						arInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_OpenCRDT_IndexFormOpenCRDTAR--CustomerType').setSelectedKeys((data["ZZCUSTORGTYPE"] != "" && data["ZZCUSTORGTYPE"] != null)? Array.from(data["ZZCUSTORGTYPE"]) : []),
						arInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_OpenCRDT_IndexFormOpenCRDTAR--MNRF').setValue(""),
						arInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_OpenCRDT_IndexFormOpenCRDTAR--CreditTerm').setSelectedKey((data["ZTERM_KNVV"] != "" && data["ZTERM_KNVV"] != null) ? data["ZTERM_KNVV"].slice(1) : "015"),
						arInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_OpenCRDT_IndexFormOpenCRDTAR--SCreditTerm').setValue(creditTermScore),
						arInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_OpenCRDT_IndexFormOpenCRDTAR--SecDeposit').setValue(0),
						arInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_OpenCRDT_IndexFormOpenCRDTAR--SSecDeposit').setValue(ScoreSecDesposit),
						arInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_OpenCRDT_IndexFormOpenCRDTAR--CreditLimit').setValue(creditData["CREDIT_LIMIT"]),
						arInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_OpenCRDT_IndexFormOpenCRDTAR--BankGurExpDate').setValue((data["ZZBANKGUREXPDATE"] != null && data["ZZBANKGUREXPDATE"]!="")?(data["ZZBANKGUREXPDATE"].replace(/^(\d{4})(\d{2})(\d{2})$/, "$1-$2-$3")):""),
						arInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_OpenCRDT_IndexFormOpenCRDTAR--SumInvoicePrintTime').setSelectedKey("Z1"),
						arInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_OpenCRDT_IndexFormOpenCRDTAR--CreditExpDate').setValue("9999-12-31"),
						arInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_OpenCRDT_IndexFormOpenCRDTAR--CreditManager').setSelectedKey(creditManager),
						arInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_OpenCRDT_IndexFormOpenCRDTAR--DepRefNo').setValue(""),
						arInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_OpenCRDT_IndexFormOpenCRDTAR--RiskClass').setSelectedKey(creditData["RISK_CLASS"]),
						arInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_OpenCRDT_IndexFormOpenCRDTAR--CheckRule').setSelectedKey(creditData["CHECK_RULE"]),
						arInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_OpenCRDT_IndexFormOpenCRDTAR--VirtualBankAccount').setValue(""),
						arInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_OpenCRDT_IndexFormOpenCRDTAR--RelatedPayerNoOrKAAccountNo').setValue(""),
						arInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_OpenCRDT_IndexFormOpenCRDTAR--ReconciliationAccount').setSelectedKey(data["AKONT"]),
						brInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_OpenCRDT_IndexFormBR--BRName').setValue(data["INSTITUTE"]),
						brInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_OpenCRDT_IndexFormBR--BRNo').setValue(data["IDNUMBER"]),
						brInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_OpenCRDT_IndexFormBR--BRValidFrom').setValue((data["VALID_DATE_FROM"] != null && data["VALID_DATE_FROM"] != "") ? data["VALID_DATE_FROM"].replace(/^(\d{4})(\d{2})(\d{2})$/, "$1-$2-$3") : ""),
						brInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_OpenCRDT_IndexFormBR--BRValidTo').setValue((data["VALID_DATE_TO"] != null && data["VALID_DATE_TO"]!="")?data["VALID_DATE_TO"].replace(/^(\d{4})(\d{2})(\d{2})$/, "$1-$2-$3"):"")
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
			var salesAdmin = payerInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_OpenCRDT_IndexFormOpenCRDTPayer--SalesAdmin').getSelectedKey();
			var creditManager = arInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_OpenCRDT_IndexFormOpenCRDTAR--CreditManager').getSelectedKey();
			arInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_OpenCRDT_IndexFormOpenCRDTAR--StaPrintOpt').setSelectedKey("SP01")
			//payerInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_OpenCRDT_IndexFormOpenCRDTPayer--ReferenceBpNo').setValue(""),
			payerInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_OpenCRDT_IndexFormOpenCRDTPayer--SalesAdmin').setSelectedKey(salesAdmin),
			payerInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_OpenCRDT_IndexFormOpenCRDTPayer--BillTo').setValue(""),
			payerInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_OpenCRDT_IndexFormOpenCRDTPayer--CompanyCode').setValue(""),
			payerInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_OpenCRDT_IndexFormOpenCRDTPayer--Name1').setValue(""),
			payerInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_OpenCRDT_IndexFormOpenCRDTPayer--Name2').setValue(""),
			payerInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_OpenCRDT_IndexFormOpenCRDTPayer--CorrespondingAddress1').setValue(""),
			payerInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_OpenCRDT_IndexFormOpenCRDTPayer--PostalAddress1').setValue(""),
			payerInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_OpenCRDT_IndexFormOpenCRDTPayer--CorrespondingAddress2').setValue(""),
			payerInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_OpenCRDT_IndexFormOpenCRDTPayer--PostalAddress2').setValue(""),
			payerInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_OpenCRDT_IndexFormOpenCRDTPayer--CorrespondingAddress3').setValue(""),
			payerInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_OpenCRDT_IndexFormOpenCRDTPayer--PostalAddress3').setValue(""),
			payerInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_OpenCRDT_IndexFormOpenCRDTPayer--Attention').setValue(""),
			payerInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_OpenCRDT_IndexFormOpenCRDTPayer--Addressee').setValue(""),
			payerInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_OpenCRDT_IndexFormOpenCRDTPayer--Phone1').setValue(""),
			payerInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_OpenCRDT_IndexFormOpenCRDTPayer--Phone1Ext').setValue(""),
			payerInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_OpenCRDT_IndexFormOpenCRDTPayer--Phone2').setValue(""),
			payerInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_OpenCRDT_IndexFormOpenCRDTPayer--Phone2Ext').setValue(""),
			payerInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_OpenCRDT_IndexFormOpenCRDTPayer--Email1').setValue(""),
			payerInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_OpenCRDT_IndexFormOpenCRDTPayer--Email2').setValue(""),
			payerInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_OpenCRDT_IndexFormOpenCRDTPayer--Email3').setValue(""),
			payerInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_OpenCRDT_IndexFormOpenCRDTPayer--Fax').setValue(""),
			payerInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_OpenCRDT_IndexFormOpenCRDTPayer--Remark').setValue(""),
			arInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_OpenCRDT_IndexFormOpenCRDTAR--CustomerStatus').setSelectedKey("CS01"),
			arInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_OpenCRDT_IndexFormOpenCRDTAR--CustomerType').setSelectedKeys([]),
			arInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_OpenCRDT_IndexFormOpenCRDTAR--MNRF').setValue(""),
			arInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_OpenCRDT_IndexFormOpenCRDTAR--CreditTerm').setSelectedKey("015"),
			arInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_OpenCRDT_IndexFormOpenCRDTAR--SCreditTerm').setValue("0.8"),
			arInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_OpenCRDT_IndexFormOpenCRDTAR--SecDeposit').setValue(0),
			arInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_OpenCRDT_IndexFormOpenCRDTAR--SSecDeposit').setValue(""),
			arInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_OpenCRDT_IndexFormOpenCRDTAR--CreditLimit').setValue(""),
			arInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_OpenCRDT_IndexFormOpenCRDTAR--BankGurExpDate').setValue(""),
			arInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_OpenCRDT_IndexFormOpenCRDTAR--SumInvoicePrintTime').setSelectedKey("Z1"),
			arInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_OpenCRDT_IndexFormOpenCRDTAR--CreditExpDate').setValue(""),
			arInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_OpenCRDT_IndexFormOpenCRDTAR--CreditManager').setSelectedKey(creditManager),
			arInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_OpenCRDT_IndexFormOpenCRDTAR--DepRefNo').setValue(""),
			arInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_OpenCRDT_IndexFormOpenCRDTAR--RiskClass').setSelectedKey("B"),
			arInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_OpenCRDT_IndexFormOpenCRDTAR--CheckRule').setSelectedKey("ZX"),
			arInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_OpenCRDT_IndexFormOpenCRDTAR--VirtualBankAccount').setValue(""),
			arInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_OpenCRDT_IndexFormOpenCRDTAR--ReconciliationAccount').setSelectedKey("0115101450"),
			arInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_OpenCRDT_IndexFormOpenCRDTAR--RelatedPayerNoOrKAAccountNo').setValue(""),
			brInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_OpenCRDT_IndexFormBR--BRName').setValue(""),
			brInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_OpenCRDT_IndexFormBR--BRNo').setValue(""),
			brInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_OpenCRDT_IndexFormBR--BRValidFrom').setValue(""),
			brInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_OpenCRDT_IndexFormBR--BRValidTo').setValue("")
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
			var securityGroup = arInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_OpenCRDT_IndexFormOpenCRDTAR--Security').getButtons();
			securityGroup[0].setSelected(false);
			securityGroup[1].setSelected(false);
			securityGroup[2].setSelected(false);
			securityGroup[3].setSelected(false);
			securityGroup[4].setSelected(false);
			var businessNatureGroup = arInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_OpenCRDT_IndexFormOpenCRDTAR--BusinessNature').getButtons();
			businessNatureGroup[0].setSelected(false);
			businessNatureGroup[1].setSelected(false);
		},
		onSalesAdminChange: function ()
		{
			var salesAdmin = this.byId("SalesAdmin").getSelectedKey();
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
			arInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_OpenCRDT_IndexFormOpenCRDTAR--CreditManager').setModel(oModel);
			if (jsonCreditManagerDicModel.length == 0) {
				arInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_OpenCRDT_IndexFormOpenCRDTAR--CreditManager').setSelectedKey("");
			}
			else if (jsonCreditManagerDicModel.length>0)
			{
				arInfo.getControlsByFieldGroupId().find(e => e.sId == 'container-ui5---Form_OpenCRDT_IndexFormOpenCRDTAR--CreditManager').setSelectedKey(jsonCreditManagerDicModel[0].DCODE);
			}
		},
		//只读模式
		readOnly: function (canEdit) {
			this.byId('Form10').setEditable(false)
		}
	});
});