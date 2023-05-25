sap.ui.define([
	'../BaseController',
	'sap/ui/core/Fragment',
	'sap/ui/model/json/JSONModel',
	'sap/m/MessageBox',
	'sap/m/MessageToast',
	'sap/ui/core/Item',
	'sap/ui/export/Spreadsheet',
	'sap/ui/core/util/Export',
	'sap/ui/core/util/ExportTypeCSV',
	'sap/ui/table/library',
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/core/CustomData"
], function (BaseController, Fragment, JSONModel, MessageBox, MessageToast, Item, Spreadsheet, Export,ExportTypeCSV,library,
		Filter,
		FilterOperator, CustomData	) {
	'use strict';
		let _currentUser,
			_i18n,
			rendered = false
	return BaseController.extend('crdt.wf.ui5.controller.CreditWF.ToDoList', {

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
		//数据绑定
		DataLoad: function () {
			let tablist = [
				{
					name: _i18n.getText('ApprovalFlow_ToDoList_UpcomingWorkflow_Title'), code: 'TabList_UpcomingWorkflow', showBarcodeScanning: false, busy: true, list: [], show: {
						'REQID': true,
						'PLANT_NAME': true,
						'ACTION': true,
						'CLAIM_USER':true,
						'CREATOR': false,
						'ERDAT': true,
						'ACTNM': false,
						'APPRO_USER_LIST': false,
						'UPDATE_DATE_TIME': true,
						'selectionMode': 'None'
					}
				},
				{
					name: _i18n.getText('ApprovalFlow_ToDoList_DelegatedWorkflow_Title'), code: 'TabList_DelegatedWorkflow', showBarcodeScanning: false, busy: true, list: [], show: {
						'REQID': true,
						'PLANT_NAME': true,
						'ACTION': true,
						'CLAIM_USER': true,
						'CREATOR': false,
						'ERTXT': true,
						'ERDAT': true,
						'ACTNM': false,
						'APPRO_USER_LIST': false,
						'UPDATE_DATE_TIME': true,
						'selectionMode': 'None'
					}
				},
				{
					name: _i18n.getText('ApprovalFlow_ToDoList_CompletedWorkflow_Title'), code: 'TabList_CompletedWorkflow', showBarcodeScanning: false, busy: true, list: [], show: {
						'REQID': true,
						'PLANT_NAME': true,
						'ACTION': true,
						'CLAIM_USER': true,
						'CREATOR': false,
						'ERTXT': true,
						'ERDAT': true,
						'ACTNM': true,
						'APPRO_USER_LIST': true,
						'UPDATE_DATE_TIME': true,
						'selectionMode': 'None'
					}
				},
				{
					name: _i18n.getText('ApprovalFlow_ToDoList_Draft_Title'), code: 'TabList_Draft', showBarcodeScanning: false, busy: true, list: [], show: {
						'REQID': true,
						'PLANT_NAME': true,
						'ACTION': true,
						'CLAIM_USER': true,
						'CREATOR': false,
						'ERTXT': true,
						'ERDAT': true,
						'ACTNM': false,
						'APPRO_USER_LIST': false,
						'UPDATE_DATE_TIME': false,
						'selectionMode': 'None'
					}
				},
				{
					name: _i18n.getText('ApprovalFlow_ToDoList_SubmittedWorkflow_Title'), code: 'TabList_SubmittedWorkflow', showBarcodeScanning: false, busy: true, list: [], show: {
						'REQID': true,
						'PLANT_NAME': true,
						'ACTION': true,
						'CLAIM_USER': true,
						'CREATOR': false,
						'ERTXT': true,
						'ERDAT': true,
						'ACTNM': true,
						'APPRO_USER_LIST': true,
						'UPDATE_DATE_TIME': true,
						'selectionMode': 'None'
					}
				},
				{
					name: _i18n.getText('ApprovalFlow_ToDoList_CompletedAgentWorkflow_Title'), code: 'TabList_CompletedAgentWorkflow', showBarcodeScanning: false, busy: true, list: [], show: {
						'REQID': true,
						'PLANT_NAME': true,
						'ACTION': true,
						'CLAIM_USER': true,
						'CREATOR': false,
						'ERTXT': true,
						'ERDAT': true,
						'ACTNM': true,
						'APPRO_USER_LIST': true,
						'UPDATE_DATE_TIME': true,
						'selectionMode': 'None'
					}
				},
				{
					name: _i18n.getText('ApprovalFlow_ToDoList_WorkflowSubmittedByOtherInitiator_Title'), code: 'TabList_WorkflowSubmittedByOtherInitiator', showBarcodeScanning: false, busy: true, list: [], show: {
						'REQID': true,
						'PLANT_NAME': true,
						'ACTION': true,
						'CLAIM_USER': true,
						'CREATOR': false,
						'ERTXT': true,
						'ERDAT': true,
						'ACTNM': false,
						'APPRO_USER_LIST': false,
						'UPDATE_DATE_TIME': true,
						'selectionMode': 'None'
					}
				}]
			let tabList = this.byId('ToDoList_tabList')
			tabList.setModel(new JSONModel(tablist), 'ToDoList')
			jQuery.ajax({
				type: 'Get',
				url: '/ApprovalFlow/GetFiltersData',
				dataType: 'json',
				async: false,
				success: function (res) {
					if (res.Code == 200) {
						let fitlerSelect = {}
						res.Data.forEach(u => {
							fitlerSelect[u.Name] = u.Value == null ? [] : u.Value
						})
						tabList.setModel(new JSONModel(fitlerSelect), 'Select')
					}
					else {
						MessageToast.show(_i18n.getText('ymsg.Error') + ':' + res.Message)
					}
				}
			})
			tabList.fireSelect({ key: tablist[0].code, item: tabList.getItems()[0] })
		},
		//列表操作
		onToDoList_Operate: function (oEvent) {
			let _this = this,
				_data = {},
				_rowD = oEvent.getParameter('row').getBindingContext('ToDoList').getObject(),
				tabList = this.byId('ToDoList_tabList'),
				key = tabList.getSelectedKey()
			jQuery.ajax({
				type: 'Post',
				url: '/ApprovalFlow/GetApproForm',
				async: false,
				dataType: 'json',
				data: {
					'RequestId': _rowD['REQID'],
				},
				success: function (res) {
					if (res.Code == 200) {
						let _d = res.Data
						_data = _d
						if (_data["HD"]["APPTYPE"] == "CRDT01")
						{
							_data['Page'] = 'Form_OpenCRDT_Index'
						}
						else if (_data["HD"]["APPTYPE"] == "CRDT02") {
							_data['Page'] = 'Form_UpdateCRDT_Index'
						}
						else if (_data["HD"]["APPTYPE"] == "CRDT03") {
							_data['Page'] = 'Form_UpdateVBA_Index'
						}
						else if (_data["HD"]["APPTYPE"] == "CRDT04") {
							_data['Page'] = 'Form_CloseCRDT_Index'
						}
						else if (_data["HD"]["APPTYPE"] == "CRDT05") {
							_data['Page'] = 'Form_ReOpenCRDT_Index'
						}
						_data['Operate'] = 'Approve_' + key;
						let fun = function () {
							_this.reflashTableFlag()
						}
						jQuery.ajax({
							type: 'Post',
							url: '/ApprovalFlow/GetUsersInfo',
							async: false,
							dataType: 'json',
							data: {
								'accounts': [_rowD['CLAIM_USER'], _rowD['CREATOR'],_rowD['APPRO_USER'] == null ? "" : _rowD['APPRO_USER']],
								'token': _this.getToken()
							},
							success: function (res) {
								if (res.Code == 200) {
									if (res.Count > 0) {
										let _d = res.Data;
										_data['ApplicantUserProperty'] = _d[0]
										_data['SubmitterUserProperty'] = _d[1]
										_data['ApproveUserProperty'] = res.Count == 3 ? _d[2] : null										
									}
								}
							}
						});
						_this.openNewWin(_this, '/', _rowD['REQID'], { data: _data }, fun)
					}
					else
					{
						MessageToast.show(_i18n.getText('ymsg.Error') + ':' + res.Message);
					}
				}
			})
		},
		//刷新表格
		onRefreshTable: function (oEvent) {
			let tabList = this.byId('ToDoList_tabList'),
				_k = tabList.getSelectedKey(),
				_s = tabList.getItems().find(u => u.getKey() == _k).getContent().find(u => u.hasStyleClass('ToDoListTable'))
			_s.setBusy(true)
			this.loadTable(_s)
		},
		//tab切换
		selectTab: function (oEvent) {
			let _tab = oEvent.getParameter('item'),
				_table = _tab.getContent().find(u => u.hasStyleClass('ToDoListTable')),
				_b = _table.getProperty('busy'),
				_title = this.byId('ToDoList_Title')
			_title.setText(_tab.getText())
			let batch = _tab.getBindingContext('ToDoList').getObject('show/BatchApprove')
			if (_b) {
				this.loadTable(_table)
            }
		},
		//刷新表格状态
		reflashTableFlag: function () {
			let tabList = this.byId('ToDoList_tabList'),
				tabs = tabList.getItems(),
				key = tabList.getSelectedKey()
			if (key != '') {
				tabs.forEach(u => {
					u.getContent()[2].setProperty('busy', true)
					if (u.getContent()[2].getBinding().getContext().getObject().code == key) {
						tabList.fireSelect({ key: key, item: u })
					}
				})
            }
        },
		//加载表格
		loadTable: function (_s) {
			let dis = {
				'UserId': _currentUser['UserId']
			},
				url = '/ApprovalFlow/GetTaskList',
				_print = false,
				_this = this
			switch (this.getCustomData(_s,'tabFor')) {
				case 'TabList_UpcomingWorkflow':
					dis['Category'] = '0'
					dis['AgentFlag'] = false
					break
				case 'TabList_DelegatedWorkflow':
					dis['Category'] = '0'
					dis['AgentFlag'] = true
					break
				case 'TabList_CompletedWorkflow':
					dis['Category'] = '1'
					dis['AgentFlag'] = false
					break
				case 'TabList_Draft':
					dis['Account'] = _currentUser['Account']
					url = '/ApprovalFlow/GetDraftList'
					break
				case 'TabList_SubmittedWorkflow':
					dis['Category'] = '2'
					dis['AgentFlag'] = false
					break
				case 'TabList_CompletedAgentWorkflow':
					dis['Category'] = '1'
					dis['AgentFlag'] = true
					break
				case 'TabList_WorkflowSubmittedByOtherInitiator':
					dis['Category'] = '2'
					dis['AgentFlag'] = true
					break
				default: break
			}
			if (url != '') {
				jQuery.ajax({
					type: 'Post',
					url: url,
					async: false,
					dataType: 'json',
					data: {
						'TaskInfo': dis,
						'pageReq': this.getCustomData(_s, 'pageReq'),
						'token': this.getToken()
					},
					success: function (res) {
						if (res.Code == 200) {
							let _d = res.Data,
								_path = _s.getBinding().getContext().getPath(),
								oPageReq = _this.getCustomData(_s, 'pageReq')
							if (oPageReq != null) {
								oPageReq['Count'] = _d.length
								oPageReq['TotalCount'] = res.Count
								oPageReq['TotalPage'] = Math.ceil(res.Count / oPageReq['Limit'])
							}
							else {
								_s.addCustomData(
									new CustomData({
										key: 'pageReq',
										value: {
											Page: 1,
											Count: _d.length,
											TotalCount: res.Count,
											TotalPage: Math.ceil(res.Count / _s.getVisibleRowCount()),
											Limit: _s.getVisibleRowCount(),
											Filters: []
										}
									})
								)
                            }
							_d.forEach(u => {
								u['ERDAT'] = _this.formatting(u['ERDAT'])
								u['UPDATE_DATE_TIME'] = _this.formatting(u['UPDATE_DATE_TIME'])
							})
							_s.getBinding().getContext().getModel().setProperty(_path + '/list', _d)
						}
						else {
							MessageToast.show(_i18n.getText('ymsg.Error') + ':' + res.Message)
						}
					}
				})
			}
			_s.setProperty('busy', false).rerender()
		},
		//筛选
		searchToDoListTable: function (oEvent) {
			let oTable = this.byId(oEvent.getSource().getTableFor())
			this.loadTable(oTable)
		},
		//加载表格分页
		loadTablePage: function (oEvent) {
			let oTable = this.byId(oEvent.getSource().getTableFor())
			this.loadTable(oTable)
        },
		//总过滤
		_filter: function (_oTable) {
			let oFilter = null;

			if (this._oCellFilter) {
				oFilter = this._oCellFilter;
			}

			_oTable.getBinding().filter(oFilter);
		},
		//状态判断
		formatDOC_STATUSToObjectState: function (bDOC_STATUS) {
			return bDOC_STATUS == 'N' ? "Error" : "Success";
		},
		//打开/关闭筛选
		onFilterPress: function (oEvent) {
			let oButton = oEvent.getSource(),
				oPanel = oButton.getParent().getParent(),
				oExpanded = oPanel.getExpanded()
			oPanel.setExpanded(!oExpanded);
			if (oExpanded)
				oButton.setIcon("sap-icon://drop-down-list")
			else
				oButton.setIcon("sap-icon://collapse-all")
		},
		//导出表格
		onExportTable: function (oEvent) {
			let tabList = this.byId('ToDoList_tabList'),
				_k = tabList.getSelectedKey(),
				_tab = tabList.getItems().find(u => u.getKey() == _k),
				_s = _tab.getContent().find(u => u.hasStyleClass('ToDoListTable')),
				_data = this.getTableData(_s)
			
			let dataJson = new JSONModel(_data)
			let oSpreadsheet = new Spreadsheet({
				dataSource: dataJson.bindList('/'),
				fileName: _i18n.getText('Menu_CreditWF_ToDoList') + '-' + _tab.getText() + '.xlsx',
				workbook: {
					columns: [
						{
							label: _i18n.getText('Export_ToDoList_Field_WorkFlowID'),
							property: 'REQID',
							textAlign: 'center',
							width: 23
						}, {
							label: _i18n.getText('Export_ToDoList_Field_PlantCode'),
							property: 'PLANT',
							textAlign: 'center'
						}, {
							label: _i18n.getText('Export_ToDoList_Field_PlantName'),
							property: 'PLANT_NAME',
							textAlign: 'center',
							width:25
						}, {
							label: _i18n.getText('Export_ToDoList_Field_ApplicationActionCode'),
							property: 'APPTYPE',
							textAlign: 'center',
							width: 25
						}, {
							label: _i18n.getText('Export_ToDoList_Field_ApplicationActionName'),
							property: 'ACTION',
							textAlign: 'center',
							width: 25
						}, {
							label: _i18n.getText('Export_ToDoList_Field_ApplicantAccount'),
							property: 'CLAIM_USER',
							textAlign: 'center',
							width: 25
						}, {
							label: _i18n.getText('Export_ToDoList_Field_ApplicantName'),
							property: 'CLAIM_USER_NAME',
							textAlign: 'center',
							width: 20
						},
						{
							label: _i18n.getText('Export_ToDoList_Field_ApprovalStep'),
							property: 'ACTNM',
							textAlign: 'center',
							width: 20
						},
						{
							label: _i18n.getText('Export_ToDoList_Field_CurrentApprover'),
							property: 'APPRO_USER_LIST',
							textAlign: 'center',
							width: 20
						},
						{
							label: _i18n.getText('Export_ToDoList_Field_InitiatorAccount'),
							property: 'CREATOR',
							textAlign: 'center',
							width: 20
						}, {
							label: _i18n.getText('Export_ToDoList_Field_InitiatorName'),
							property: 'CREATOR_NAME',
							textAlign: 'center',
							width: 20
						},
						{
							label: _i18n.getText('Export_ToDoList_Field_CreateDate'),
							property: 'ERDAT',
							textAlign: 'center',
							width: 30
						},
						{
							label: _i18n.getText('Export_ToDoList_Field_SubmissionDate'),
							property: 'UPDATE_DATE_TIME',
							textAlign: 'center',
							width: 30
						}
					]
				}
			});
			oSpreadsheet.onprogress = function (iValue) {
				jQuery.sap.log.debug("Export: " + iValue + "% completed");
			};
			oSpreadsheet.build().then(function () {
				jQuery.sap.log.debug("Export is finished");
			}).catch(function (sMessage) { jQuery.sap.log.error("Export error: " + sMessage); });
		},
		//获取导出数据
		getTableData: function (_s) {
			let dis = {
				'UserId': _currentUser['UserId']
			},
				url = '/ApprovalFlow/GetTaskList',
				data = [],
				_this = this
			switch (this.getCustomData(_s, 'tabFor')) {
				case 'TabList_UpcomingWorkflow':
					dis['Category'] = '0'
					dis['AgentFlag'] = false
					break
				case 'TabList_DelegatedWorkflow':
					dis['Category'] = '0'
					dis['AgentFlag'] = true
					break
				case 'TabList_CompletedWorkflow':
					dis['Category'] = '1'
					dis['AgentFlag'] = false
					break
				case 'TabList_Draft':
					dis['Account'] = _currentUser['Account']
					url = '/ApprovalFlow/GetDraftList'
					break
				case 'TabList_SubmittedWorkflow':
					dis['Category'] = '2'
					dis['AgentFlag'] = false
					break
				case 'TabList_CompletedAgentWorkflow':
					dis['Category'] = '1'
					dis['AgentFlag'] = true
					break
				case 'TabList_WorkflowSubmittedByOtherInitiator':
					dis['Category'] = '2'
					dis['AgentFlag'] = true
					break
				default: break
			}
			if (url != '') {
				let req = this.getCustomData(_s, 'pageReq')
				req['Page'] = 0
				jQuery.ajax({
					type: 'Post',
					url: url,
					async: false,
					dataType: 'json',
					data: {
						'TaskInfo': dis,
						'pageReq': req,
						'token': this.getToken()
					},
					success: function (res) {
						if (res.Code == 200) {
							let _d = res.Data
							_d.forEach(u => {
								u['ERDAT'] = _this.formatting(u['ERDAT'])
								u['UPDATE_DATE_TIME'] = _this.formatting(u['UPDATE_DATE_TIME'])
							})
							data = _d
						}
						else {
							MessageToast.show(_i18n.getText('Message_Error') + ':' + res.Message)
						}
					}
				})
			}
			return data
		},
	});

});