sap.ui.define([
	'../BaseController',
	'sap/m/MessageBox',
	'sap/m/MessageToast',
	'sap/ui/thirdparty/jquery',
	'sap/ui/model/json/JSONModel',
	'sap/ui/unified/FileUploaderParameter'
], function (
		BaseController,
		MessageBox,
		MessageToast,
		jQuery,
		JSONModel,
		FileUploaderParameter) {
		'use strict';
		let _i18n,
			_currentUser,
			_backgroundData;
	return BaseController.extend('crdt.wf.ui5.controller.Information.FormUpload', {
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
			var jsonDocTypeDicModel;
			var docType = "DocType";
			jQuery.ajax({
				type: "Get",
				dataType: "json",
				async: false,
				url: "/Dictionary/GetDicListByType?type=" + docType,
				success: function (res) {
					if (res.Code == 200) {
						jsonDocTypeDicModel = res.Data;
					}
					else {
						MessageToast.show(res.Message);
					}
				},
				error: function (err) {
					MessageToast.show(err.statusText);
				}
			});

			let data = [],
				_this = this
			if (_backgroundData['HD'] != null && _backgroundData['HD']['REQID'] != '') {
				jQuery.ajax({
					type: 'Post',
					url: '/ApprovalFlow/GetApproFileList',
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
							data = _d
						}
						else {
							MessageToast.show(_i18n.getText('ymsg.Error') + ':' + res.Message)
						}
					}
				})
			}
			let _data = JSON.parse(JSON.stringify(data))
			//this.byId('Table_FormUpload').setModel(new JSONModel(_data)).bindRows('/')
			var oData = { DocTypeModel: jsonDocTypeDicModel, TableData: _data };
			var oModel = new JSONModel(oData);
			this.getView().setModel(oModel);
		},
		//上传完成
		onUploadComplete: function (oEvent) {
			let sResponse = oEvent.getParameter('response'),
				_Table_FormUpload = this.byId('Table_FormUpload')
			if (sResponse) {
				let res = JSON.parse(sResponse.replace(/^<.*>({.*})<.*>$/, '$1'))
				if (res.Code == 200) {
					let fileType = this.byId("DocType").getSelectedItem().getText();
					MessageToast.show(_i18n.getText('Message_Success_Upload'))
					let _data = _Table_FormUpload.getModel().getData()
					res.Data['FileType'] = fileType;
					res.Data['ApproUserName'] = _currentUser['AccountName']
					res.Data['ApproDate'] = this.formatting(this.getServerDate())
					_data["TableData"].push(res.Data)
					_Table_FormUpload.getModel().setData(_data)
					_backgroundData['AddFileList'].push(res.Data)
				}
				else {
					MessageToast.show(_i18n.getText('ymsg.Error') + ':' + res.Message);
				}
			}
		},
		//确认上传
		onFormUpload_Appendix_Upload: function (oEvent) {
			let oFileUploader = this.byId('fileUploader');
			if (!oFileUploader.getValue()) {
				MessageToast.show(_i18n.getText('Message_Error_Upload_NoData'));
				return;
			}
			oFileUploader.checkFileReadable().then(function () {
				oFileUploader.setUploadUrl('/ApprovalFlow/SaveAttachment').rerender()
				oFileUploader.upload();
			}, function (error) {
				MessageToast.show('The file cannot be read. It may have changed.');
			}).then(function () {
				oFileUploader.clear();
			});
		},
		//引入附件
		onFormUpload_Appendix_Insert: function (oEvent) {
			let _Table_FormUpload = this.byId('Table_FormUpload'),
				_this = this
			let oAttributes = {
				'title': _i18n.getText('FormUpload_Insert_Title'),
				'visibleBeginButton': false,
				'colsBind': ['FileName', 'ApproDate'],
				'width': ['11rem', 'auto'],
				'colsShow': [
					_i18n.getText('FormUpload_Field0'),
					_i18n.getText('FormUpload_Field2')
				],
				'rowSelectionChange': function (oEvent) {
					let _d = oEvent.getParameter('rowContext')
					if (_d) {
						let _data = _Table_FormUpload.getModel().getData()
						_data.push(_d)
						_Table_FormUpload.getModel().setData(_data)
						_backgroundData['AddFileList'].push(_d)
						_this._FormUpload_Appendix_Insert_Dialog.close()
					}
				}
			};
			_this.openSearchDialog(_this, '_FormUpload_Appendix_Insert_Dialog', oAttributes)
			jQuery.ajax({
				type: 'Post',
				url: '/ApprovalFlow/attList',
				dataType: 'json',
				data: {
					'fileName': '',
					'sDate': '',
					'eDate': '',
					'userid': _backgroundData['ApplicantUserProperty']['Account'],
					'fileType': 'ATT'
				},
				success: function (res) {
					if (res.Code == 200) {
						let _d = res.Data;
						oAttributes['data'] = _d
						_this.openSearchDialog(_this, '_FormUpload_Appendix_Insert_Dialog', oAttributes)
					}
					else {
						MessageToast.show(_i18n.getText('ymsg.Error') + ':' + res.Message);
					}
				}
			})
		},
		//下载附件
		onFormUpload_Appendix_DownLoad: function (oEvent) {
			let file = oEvent.getParameter('row').getBindingContext().getObject(),
				url = "/ApprovalFlow/DownloadApproFile",
				form = $("<form></form>").attr("action", url).attr("method", "post")
			form.append($("<input></input>").attr("type", "hidden").attr("name", "fileStr").attr("value", JSON.stringify(file)));
			form.appendTo('body').submit().remove()
		},
		//删除附件
		onFormUpload_Appendix_Delete: function (oEvent) {
			let file = oEvent.getParameter('row').getBindingContext().getObject(),
				_Table_FormUpload = this.byId('Table_FormUpload'),
				_data = _Table_FormUpload.getModel().getData()

			MessageBox.warning(_i18n.getText('Message_Content_Delete'), {
				title: _i18n.getText('Message_Title_Info'),
				styleClass: "halfWidth",
				actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
				emphasizedAction: MessageBox.Action.OK,
				onClose: function (sAction) {
					if (sAction == 'OK') {
						_data["TableData"] = _data["TableData"].filter(u => u.FileName != file.FileName)
						_Table_FormUpload.getModel().setData(_data)
						let addlistIndex = _backgroundData['AddFileList'].findIndex(u => u.FileName == file.FileName)
						if (addlistIndex != -1) {
							_backgroundData['AddFileList'].splice(addlistIndex, 1)
						}
						else {
							_backgroundData['DelFileList'].push(file)
						}
					}
				}
			})
		},
		//只读模式
		readOnly: function (canEdit) {
			this.byId('fileUploader').setVisible(false)
			this.byId('Table_FormUpload_Buttons_Upload').setVisible(false)
			this.byId('Table_FormUpload_Buttons_InsertAttachments').setVisible(false)
			this.byId('Table_FormUpload_Delete').setVisible(false)
			this.byId('Table_FormUpload').setRowActionTemplate(this.byId('Table_FormUpload').getRowActionTemplate()).rerender()
		}
	});
});