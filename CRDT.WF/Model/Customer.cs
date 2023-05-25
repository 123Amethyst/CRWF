using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace CRDT.WF.Model
{
    [Table("Customer")]
    public class Customer
    {
        /// <summary>
        /// Reference BP no.
        /// </summary>
        public string KUNNR { get; set; }

        /// <summary>
        /// 公司编码
        /// </summary>
        public string BUKRS { get; set; }

        /// <summary>
        /// BP 組
        /// </summary>
        public string BU_GROUP { get; set; }

        /// <summary>
        /// 搜索條件1
        /// </summary>
        public string BU_SORT1 { get; set; }

        /// <summary>
        /// 搜索條件2
        /// </summary>
        public string BU_SORT2 { get; set; }

        /// <summary>
        /// 英文名称1
        /// </summary>
        public string NAME_ORG1 { get; set; }

        /// <summary>
        /// 英文名称2
        /// </summary>
        public string NAME_ORG2 { get; set; }

        /// <summary>
        /// 街道
        /// </summary>
        public string STREET_SEN { get; set; }

        /// <summary>
        /// 街道
        /// </summary>
        public string STR_SUPPL3_SEN { get; set; }

        /// <summary>
        /// 街道
        /// </summary>
        public string LOCATION_SEN { get; set; }

        /// <summary>
        /// 中文名称1
        /// </summary>
        public string NAME1_SZF { get; set; }

        /// <summary>
        /// 中文名称2
        /// </summary>
        public string NAME2_SZF { get; set; }

        public string STREET_SZF { get; set; }

        /// <summary>
        /// 街道（中文）
        /// </summary>
        public string STR_SUPPL3_SZF { get; set; }

        /// <summary>
        /// 街道（中文）
        /// </summary>
        public string LOCATION_SZF { get; set; }

        /// <summary>
        /// STR_SUPPL3_SA
        /// </summary>
        public string STR_SUPPL3_SA { get; set; }

        /// <summary>
        /// LOCATION_SA
        /// </summary>
        public string LOCATION_SA { get; set; }

        /// <summary>
        /// 郵編
        /// </summary>
        public string POST_CODE1_SEN { get; set; }

        /// <summary>
        /// 城市
        /// </summary>
        public string CITY1_SEN { get; set; }

        /// <summary>
        /// 國家
        /// </summary>
        public string COUNTRY_SEN { get; set; }

        /// <summary>
        /// 房間（新地址類型1）
        /// </summary>
        public string ROOMNUMBER_DEN { get; set; }

        /// <summary>
        /// 樓層 
        /// </summary>
        public string FLOOR_DEN { get; set; }

        /// <summary>
        /// 代收名稱 
        /// </summary>
        public string NAME_CO_DEN { get; set; }

        /// <summary>
        /// 街道2
        /// </summary>
        public string STR_SUPPL1_DEN { get; set; }

        /// <summary>
        /// 街道3
        /// </summary>
        public string STR_SUPPL2_DEN { get; set; }

        /// <summary>
        /// 街道 門牌號碼
        /// </summary>
        public string STREET_DEN { get; set; }

        /// <summary>
        /// 街道4
        /// </summary>
        public string STR_SUPPL3_DEN { get; set; }

        /// <summary>
        /// 街道5
        /// </summary>
        public string LOCATION_DEN { get; set; }

        /// <summary>
        /// 地區
        /// </summary>
        public string CITY2_DEN { get; set; }

        /// <summary>
        /// 房間
        /// </summary>
        public string ROOMNUMBER_DZF { get; set; }

        /// <summary>
        /// 樓層 
        /// </summary>
        public string FLOOR_DZF { get; set; }

        /// <summary>
        /// 代收名稱 
        /// </summary>
        public string NAME_CO_DZF { get; set; }

        /// <summary>
        /// 街道2 
        /// </summary>
        public string STR_SUPPL1_DZF { get; set; }

        /// <summary>
        /// 街道3 
        /// </summary>
        public string STR_SUPPL2_DZF { get; set; }

        /// <summary>
        /// 街道 門牌號碼
        /// </summary>
        public string STREET_DZF { get; set; }

        /// <summary>
        /// 街道4
        /// </summary>
        public string STR_SUPPL3_DZF { get; set; }

        /// <summary>
        /// 街道5
        /// </summary>
        public string LOCATION_DZF { get; set; }

        /// <summary>
        /// 地區
        /// </summary>
        public string CITY2_DZF { get; set; }

        /// <summary>
        /// 名稱 （地址類型2）
        /// </summary>
        public string NAME1_CEN { get; set; }

        /// <summary>
        /// 街道 門牌號碼
        /// </summary>
        public string STREET_CEN { get; set; }

        /// <summary>
        /// 街道4
        /// </summary>
        public string STR_SUPPL3_CEN { get; set; }

        /// <summary>
        /// 街道5
        /// </summary>
        public string LOCATION_CEN { get; set; }

        /// <summary>
        /// 名稱 （地址類型2 中文版本）
        /// </summary>
        public string NAME1_CZF { get; set; }

        /// <summary>
        /// 街道 門牌號碼
        /// </summary>
        public string STREET_CZF { get; set; }

        /// <summary>
        /// 街道4
        /// </summary>
        public string STR_SUPPL3_CZF { get; set; }

        /// <summary>
        /// 街道5
        /// </summary>
        public string LOCATION_CZF { get; set; }

        /// <summary>
        /// 通訊語言
        /// </summary>
        public string LANGU_CZF { get; set; }

        /// <summary>
        /// 傳真
        /// </summary>
        public string FAX_NUMBER_CZF { get; set; }

        /// <summary>
        /// 銀行ID（virtual bank)
        /// </summary>
        public string BU_BKVID { get; set; }

        /// <summary>
        /// 銀行國家代碼（virtual bank)
        /// </summary>
        public string BU_BANKS { get; set; }

        /// <summary>
        /// 銀行賬號（virtual bank)
        /// </summary>
        public string BU_BANKK { get; set; }

        /// <summary>
        /// 銀行號碼（virtual bank)
        /// </summary>
        public string BU_BANKN { get; set; }

        /// <summary>
        /// 銀行外部ID（virtual bank)
        /// </summary>
        public string BU_BKEXT { get; set; }

        /// <summary>
        /// 銀行ID
        /// </summary>
        public string BU_BKVID_N { get; set; }

        /// <summary>
        /// 銀行國家代碼
        /// </summary>
        public string BU_BANKS_N { get; set; }

        /// <summary>
        /// 銀行賬號
        /// </summary>
        public string BU_BANKK_N { get; set; }

        /// <summary>
        /// 銀行號碼
        /// </summary>
        public string BU_BANKN_N { get; set; }

        /// <summary>
        /// 銷售組織
        /// </summary>
        public string VKORG { get; set; }

        /// <summary>
        /// 配銷通路
        /// </summary>
        public string VTWEG { get; set; }

        /// <summary>
        /// 部門
        /// </summary>
        public string SPART { get; set; }

        /// <summary>
        /// 銷售區域
        /// </summary>
        public string BZIRK { get; set; }

        /// <summary>
        /// 銷售辦公室
        /// </summary>
        public string VKBUR { get; set; }

        /// <summary>
        /// 幣種
        /// </summary>
        public string WAERS { get; set; }

        /// <summary>
        /// 客戶定價程序
        /// </summary>
        public string KALKS { get; set; }

        /// <summary>
        /// 交貨優先順序
        /// </summary>
        public string LPRIO { get; set; }

        /// <summary>
        /// 交貨工廠
        /// </summary>
        public string VWERK { get; set; }

        /// <summary>
        /// 出貨條件
        /// </summary>
        public string VSBED { get; set; }

        /// <summary>
        /// 付款條款
        /// </summary>
        public string ZTERM_KNVV { get; set; }

        /// <summary>
        /// 客戶賬戶分配組
        /// </summary>
        public string KTGRD { get; set; }

        /// <summary>
        /// 稅碼
        /// </summary>
        public string TAXKD { get; set; }

        /// <summary>
        /// 送達方
        /// </summary>
        public string ZSHIPTO { get; set; }

        /// <summary>
        /// 開票方
        /// </summary>
        public string ZBILLTO { get; set; }

        /// <summary>
        /// 付款方
        /// </summary>
        public string ZPAYER { get; set; }

        /// <summary>
        /// 統制科目
        /// </summary>
        public string AKONT { get; set; }

        /// <summary>
        /// FI付款條款
        /// </summary>
        public string ZTERM_KNB1 { get; set; }

        /// <summary>
        /// 付款方式
        /// </summary>
        public string ZWELS { get; set; }

        /// <summary>
        /// 排序碼
        /// </summary>
        public string ZUAWA { get; set; }

        /// <summary>
        /// BP類型
        /// </summary>
        public string KATR1 { get; set; }

        /// <summary>
        /// 直營加盟
        /// </summary>
        public string ZZCUSTTYPE { get; set; }

        /// <summary>
        /// 客戶型態
        /// </summary>
        public string ZZCUSTSTATUS { get; set; }

        /// <summary>
        /// 關閉日期
        /// </summary>
        public string ZZCLOSEDDATE { get; set; }

        /// <summary>
        /// 關閉原因
        /// </summary>
        public string ZZCLOSEDREASON { get; set; }

        /// <summary>
        /// 重開日期
        /// </summary>
        public string ZZREOPENDATE { get; set; }

        /// <summary>
        /// 出貨類型
        /// </summary>
        public string ZZDELTYPE { get; set; }

        /// <summary>
        /// KA Code
        /// </summary>
        public string ZZKACODE { get; set; }

        /// <summary>
        /// 座標(經度)
        /// </summary>
        public string ZZLONGITUDE { get; set; }

        /// <summary>
        /// 座標(緯度)
        /// </summary>
        public string ZZLATITUDE { get; set; }

        /// <summary>
        /// 業務性質
        /// </summary>
        public string KATR2 { get; set; }

        /// <summary>
        /// 客戶機構類型(多值）
        /// </summary>
        public string ZZCUSTORGTYPE { get; set; }

        /// <summary>
        /// BR 種類ID
        /// </summary>
        public string TYPE { get; set; }

        /// <summary>
        /// BR ID 名稱
        /// </summary>
        public string INSTITUTE { get; set; }

        /// <summary>
        /// BR 號碼
        /// </summary>
        public string IDNUMBER { get; set; }

        /// <summary>
        /// BR 有效日期從
        /// </summary>
        public string VALID_DATE_FROM { get; set; }

        /// <summary>
        /// BR 有效日期至
        /// </summary>
        public string VALID_DATE_TO { get; set; }

        /// <summary>
        /// 銀行擔保過期日
        /// </summary>
        public string ZZBANKGUREXPDATE { get; set; }

        /// <summary>
        /// 信貸經理
        /// </summary>
        public string ZZCRMANAGER { get; set; }

        /// <summary>
        /// 通路別
        /// </summary>
        public string ZZCHANNEL { get; set; }

        /// <summary>
        /// 子通路別 
        /// </summary>
        public string ZZSUBCHANNEL { get; set; }

        /// <summary>
        /// KA/ Non-KA
        /// </summary>
        public string KVGR1 { get; set; }

        /// <summary>
        /// 業務類型
        /// </summary>
        public string KVGR2 { get; set; }

        /// <summary>
        /// 銷售管理員
        /// </summary>
        public string ZZSALESADMIN { get; set; }

        /// <summary>
        /// 對帳單列印方式
        /// </summary>
        public string ZZRECONPRT { get; set; }

        /// <summary>
        /// 銷售路線
        /// </summary>
        public string ZZPS_ROUTE { get; set; }

        /// <summary>
        /// 維修區域
        /// </summary>
        public string ZZMAINTAREA { get; set; }

        /// <summary>
        /// 維修所
        /// </summary>
        public string ZZMAINTOFFICE { get; set; }

        /// <summary>
        /// 供貨點
        /// </summary>
        public string ZZSHIPPOINT { get; set; }

        /// <summary>
        /// 供貨型態
        /// </summary>
        public string ZZSHIPTYPE { get; set; }

        /// <summary>
        /// 電子發票資料傳輸
        /// </summary>
        public string ZZTURNKEY { get; set; }

        /// <summary>
        /// 成本中心
        /// </summary>
        public string ZZKOSTL { get; set; }

        /// <summary>
        /// 發票開立方式
        /// </summary>
        public string ZZINVPRTTYP { get; set; }

        /// <summary>
        /// 送貨單的價格
        /// </summary>
        public string ZZDELPRTTYP { get; set; }

        /// <summary>
        /// 自販/非自販
        /// </summary>
        public string ZZVSCUST { get; set; }

        /// <summary>
        /// 客戶屬性
        /// </summary>
        public string ZZAP_FLAG { get; set; }

        /// <summary>
        /// 客戶可售賣產品分類
        /// </summary>
        public string ZZMATTYPE { get; set; }

        /// <summary>
        /// 零銷量
        /// </summary>
        public string ZZZEROSALES { get; set; }

        /// <summary>
        /// Email
        /// </summary>
        public string ZZMAILADDR1 { get; set; }

        /// <summary>
        /// E-mail(財務)
        /// </summary>
        public string ZZMAILADDR2 { get; set; }

        /// <summary>
        /// E-mail(財務)
        /// </summary>
        public string ZZMAILADDR3 { get; set; }

        /// <summary>
        /// CSS訊息
        /// </summary>
        public string ZZTEXTCSS { get; set; }

        /// <summary>
        /// 業代訊息
        /// </summary>
        public string ZZTEXTSFA { get; set; }

        /// <summary>
        /// 交貨訊息
        /// </summary>
        public string ZZTEXTDN { get; set; }

        /// <summary>
        /// DN Copy
        /// </summary>
        public string ZZDNCOPY { get; set; }

        /// <summary>
        /// 派送路線
        /// </summary>
        public string ZZDROUTE { get; set; }

        /// <summary>
        /// 交貨訊息1
        /// </summary>
        public string ZZDSMESSAGE1 { get; set; }

        /// <summary>
        /// 交貨訊息2
        /// </summary>
        public string ZZDSMESSAGE2 { get; set; }

        /// <summary>
        /// 交貨訊息3
        /// </summary>
        public string ZZDSMESSAGE3 { get; set; }

        /// <summary>
        /// 交貨訊息4
        /// </summary>
        public string ZZDSMESSAGE4 { get; set; }

        /// <summary>
        /// 聯絡人-對帳單-姓名
        /// </summary>
        public string ZZCONTACTP09 { get; set; }

        /// <summary>
        /// 聯絡人-對帳單-電話
        /// </summary>
        public string ZZCONTACTT09 { get; set; }

        /// <summary>
        /// 聯絡人-對帳單-電話 2
        /// </summary>
        public string ZZCONTACTT09B { get; set; }

        /// <summary>
        /// 聯絡人-對帳單-Email
        /// </summary>
        public string ZZFMAILADDR1 { get; set; }

        /// <summary>
        /// 聯絡人-對帳單-Email2
        /// </summary>
        public string ZZFMAILADDR2 { get; set; }

        /// <summary>
        /// 聯絡人-對帳單-Email3
        /// </summary>
        public string ZZFMAILADDR3 { get; set; }

        /// <summary>
        /// 對帳單 Attn
        /// </summary>
        public string ZZCONTACTT11 { get; set; }

        /// <summary>
        /// 聯絡人-負責人-稱呼
        /// </summary>
        public string ZZCONTACTS10 { get; set; }

        /// <summary>
        /// 聯絡人-負責人-姓名 (代理人)
        /// </summary>
        public string ZZCONTACTP10 { get; set; }

        /// <summary>
        /// 聯絡人-負責人-聯係備注
        /// </summary>
        public string ZZCONTACTR10 { get; set; }

        /// <summary>
        /// 聯絡人-負責人-電話
        /// </summary>
        public string ZZCONTACTT10 { get; set; }

        /// <summary>
        /// 聯絡人-負責人-Office
        /// </summary>
        public string ZZCONTACTO10 { get; set; }

        /// <summary>
        /// 聯絡人-負責人-Email
        /// </summary>
        public string ZZCONTACTE10 { get; set; }

        /// <summary>
        /// 聯絡人-負責人2-Salutation
        /// </summary>
        public string ZZCONTACTS12 { get; set; }

        /// <summary>
        /// 聯絡人-負責人2- 姓名
        /// </summary>
        public string ZZCONTACTP12 { get; set; }

        /// <summary>
        /// 聯絡人-負責人2-聯係備注
        /// </summary>
        public string ZZCONTACTR12 { get; set; }

        /// <summary>
        /// 聯絡人-負責人2-Mobile
        /// </summary>
        public string ZZCONTACTT12 { get; set; }

        /// <summary>
        /// 聯絡人-負責人2-Office
        /// </summary>
        public string ZZCONTACTO12 { get; set; }

        /// <summary>
        /// 聯絡人-負責人2-Email
        /// </summary>
        public string ZZCONTACTE12 { get; set; }

        /// <summary>
        /// 星期一供貨
        /// </summary>
        public string ZDELMON { get; set; }

        /// <summary>
        /// 星期二供貨
        /// </summary>
        public string ZDELTUE { get; set; }

        /// <summary>
        /// 星期三供貨
        /// </summary>
        public string ZDELWED { get; set; }

        /// <summary>
        /// 星期四供貨
        /// </summary>
        public string ZDELTHU { get; set; }

        /// <summary>
        /// 星期五供貨
        /// </summary>
        public string ZDELFRI { get; set; }

        /// <summary>
        /// 星期六供貨
        /// </summary>
        public string ZDELSAT { get; set; }

        /// <summary>
        ///星期日供貨
        /// </summary>
        public string ZDELSUN { get; set; }

        /// <summary>
        /// Will供貨
        /// </summary>
        public string ZDELWILL { get; set; }

        /// <summary>
        /// 供貨時段1(起)
        /// </summary>
        public string ZTIME1_FROM { get; set; }

        /// <summary>
        /// 供貨時段1(終)
        /// </summary>
        public string ZTIME1_TO { get; set; }

        /// <summary>
        /// 供貨時段2(起)
        /// </summary>
        public string ZTIME2_FROM { get; set; }

        /// <summary>
        /// 供貨時段2(終)
        /// </summary>
        public string ZTIME2_TO { get; set; }

        /// <summary>
        /// 星期一供貨(Backup)
        /// </summary>
        public string ZDELMON2 { get; set; }

        /// <summary>
        /// 星期二供貨(Backup)
        /// </summary>
        public string ZDELTUE2 { get; set; }

        /// <summary>
        /// 星期三供貨(Backup)
        /// </summary>
        public string ZDELWED2 { get; set; }

        /// <summary>
        /// 星期四供貨(Backup)
        /// </summary>
        public string ZDELTHU2 { get; set; }

        /// <summary>
        /// 星期五供貨(Backup)
        /// </summary>
        public string ZDELFRI2 { get; set; }

        /// <summary>
        /// 星期六供貨(Backup)
        /// </summary>
        public string ZDELSAT2 { get; set; }

        /// <summary>
        /// 星期日供貨(Backup)
        /// </summary>
        public string ZDELSUN2 { get; set; }

        /// <summary>
        /// Will供貨(Backup)
        /// </summary>
        public string ZDELWILL2 { get; set; }

        /// <summary>
        /// DS Route2
        /// </summary>
        public string ZZDROUTE2 { get; set; }

        /// <summary>
        /// 交叉銷售
        /// </summary>
        public string ZZCROSSSELL { get; set; }

        /// <summary>
        /// 交叉銷售生效日期
        /// </summary>
        public string ZZCROSSEFFDATE { get; set; }

        /// <summary>
        /// 訂購方式
        /// </summary>
        public string KVGR3 { get; set; }

        /// <summary>
        /// 銷售類型
        /// </summary>
        public string KVGR4 { get; set; }

        /// <summary>
        /// 業務屬性
        /// </summary>
        public string ZZCUSTSEGMENT { get; set; }

        /// <summary>
        /// 難度級別
        /// </summary>
        public string ZZDIFFLEVEL { get; set; }

        /// <summary>
        /// 樓層數
        /// </summary>
        public string ZZNUMFLOOR { get; set; }

        /// <summary>
        ///樓梯費（是/否）
        /// </summary>
        public string ZZSTAIRFEE { get; set; }

        /// <summary>
        ///交貨附加費
        /// </summary>
        public string ZZDELSURCHAGE { get; set; }

        /// <summary>
        ///在 CCS 上顯示價格
        /// </summary>
        public string ZZDISPLAYPRICE { get; set; }

        /// <summary>
        ///凍結狀態（銷售區域）
        /// </summary>
        public string AUFSD { get; set; }

        /// <summary>
        ///座位數
        /// </summary>
        public string ZZNOOFSEAT { get; set; }

        /// <summary>
        ///在線客戶
        /// </summary>
        public string ZZONLINECUST { get; set; }

        /// <summary>
        ///呼叫窗口 from
        /// </summary>
        public string RULE_INDEX_FR { get; set; }

        /// <summary>
        ///呼叫窗口 to
        /// </summary>
        public string RULE_INDEX_TO { get; set; }

        /// <summary>
        ///營業時間
        /// </summary>
        public string ZZOPENHR { get; set; }

        /// <summary>
        ///關閉時間
        /// </summary>
        public string ZZCLOSEHR { get; set; }

        /// <summary>
        ///午餐時間
        /// </summary>
        public string ZZLUNCHHR { get; set; }

        /// <summary>
        ///運貨車類型
        /// </summary>
        public string ZZTRUCKLIMIT { get; set; }

        /// <summary>
        ///限制許可
        /// </summary>
        public string ZZRESTPERMIT { get; set; }

        /// <summary>
        ///簽名方法
        /// </summary>
        public string ZZSIGNMOD { get; set; }

        /// <summary>
        ///價格變動靈活性
        /// </summary>
        public string ZZPRICHFLEX { get; set; }

        /// <summary>
        ///產品靈活性
        /// </summary>
        public string ZZPROCHFLEX { get; set; }

        /// <summary>
        ///新產品
        /// </summary>
        public string ZZNSEAPRD { get; set; }

        /// <summary>
        ///屏幕媒體類型
        /// </summary>
        public string ZZMEDIAUSE { get; set; }

        /// <summary>
        ///售賣機群組
        /// </summary>
        public string ZZMULTMACHGRP { get; set; }

        /// <summary>
        ///價格分組
        /// </summary>
        public string ZZPRICEGRP { get; set; }

        /// <summary>
        ///客戶組
        /// </summary>
        public string ZZCUSTGRP { get; set; }

        /// <summary>
        ///協議類型
        /// </summary>
        public string ZZAGREEMENTTYPE { get; set; }

        /// <summary>
        ///協議起始日期
        /// </summary>
        public string ZZCONTRACTFROM { get; set; }

        /// <summary>
        ///協議過期日期
        /// </summary>
        public string ZZCONTRACTTO { get; set; }

        /// <summary>
        ///學校政策
        /// </summary>
        public string ZZSCHPOLICY { get; set; }

        /// <summary>
        ///執行備註
        /// </summary>
        public string ZZOPSREMARKS { get; set; }

        /// <summary>
        ///售賣機業務類型
        /// </summary>
        public string ZZVENDORTYPE { get; set; }

        /// <summary>
        ///Channel 細分
        /// </summary>
        public string ZZCHANNELSPEC { get; set; }

        /// <summary>
        ///協議號碼
        /// </summary>
        public string ZZLINKEDVENDOR { get; set; }

        /// <summary>
        ///位置類型
        /// </summary>
        public string ZZLOCATIONVENDOR { get; set; }

        /// <summary>
        ///位置與車場距離
        /// </summary>
        public string ZZDISTANCEOFINT { get; set; }

        /// <summary>
        ///電源備註
        /// </summary>
        public string ZZELECALH { get; set; }

        /// <summary>
        ///執行許可條件
        /// </summary>
        public string ZZSITE { get; set; }

        /// <summary>
        ///有樓梯向上或向下
        /// </summary>
        public string ZZSTAIRUPDOWN { get; set; }

        /// <summary>
        ///有斜路向上或向下
        /// </summary>
        public string ZZSLOPEUPDOWN { get; set; }

        /// <summary>
        ///斜路距離
        /// </summary>
        public string ZZSLOPEDISTANCE { get; set; }

        /// <summary>
        ///樓梯級數
        /// </summary>
        public string ZZNOOFSTAIR { get; set; }

        /// <summary>
        ///需要輕型送貨車
        /// </summary>
        public string ZZNEEDSMLTRUCK { get; set; }

        /// <summary>
        ///鎖櫃腳
        /// </summary>
        public string ZZMOUNTED { get; set; }

        /// <summary>
        ///加頂篷
        /// </summary>
        public string ZZCANOPY { get; set; }

        /// <summary>
        ///教職工/學生人數
        /// </summary>
        public string ZZNOOFSTAFF { get; set; }

        /// <summary>
        ///帳戶狀態
        /// </summary>
        public string ZZACCTSTATUS { get; set; }

        /// <summary>
        ///FSV飲料競爭對手
        /// </summary>
        public string ZZFSVBEVCOMPT { get; set; }

        /// <summary>
        ///售賣機競爭對手名稱
        /// </summary>
        public string ZZCOMPETITOR { get; set; }

        /// <summary>
        ///競爭對手售賣機數量
        /// </summary>
        public string ZZNOOFCOMPT { get; set; }

        /// <summary>
        ///競爭對手的預估銷量
        /// </summary>
        public string ZZSALESOFVOLUME { get; set; }

        /// <summary>
        ///是否客户补货 
        /// </summary>
        public string ZZCUSTOMERREP { get; set; }

        /// <summary>
        ///eDN
        /// </summary>
        public string ZZEDN { get; set; }

        /// <summary>
        ///Email
        /// </summary>
        public string SMTP_ADDR_DMS1 { get; set; }

        /// <summary>
        ///Email
        /// </summary>
        public string SMTP_ADDR_DMS2 { get; set; }

        /// <summary>
        ///Token ID
        /// </summary>
        public string ZZTOKENID { get; set; }

        /// <summary>
        ///信用卡後綴
        /// </summary>
        public string CCNUM_CR { get; set; }

        /// <summary>
        ///信用卡到期日
        /// </summary>
        public string DATBI_CR { get; set; }

        /// <summary>
        ///水檢編號
        /// </summary>
        public string ZZWATERINSNUM { get; set; }

        /// <summary>
        ///糖漿客戶
        /// </summary>
        public string ZZPOSTMIXOUTLET { get; set; }

        /// <summary>
        ///DA配送路線
        /// </summary>
        public string ZZDADROUTE { get; set; }

        /// <summary>
        ///交付屬性
        /// </summary>
        public string ZZDLVATTRIBUTE { get; set; }

        /// <summary>
        ///網上商店註冊日期
        /// </summary>
        public string ZZEREGDATE { get; set; }

        /// <summary>
        ///簪電線
        /// </summary>
        public string ZZELECAVA { get; set; }

        /// <summary>
        ///電源插頭類型
        /// </summary>
        public string ZZELEPOTY { get; set; }

        /// <summary>
        ///开店日期
        /// </summary>
        public string ZZOPENDATE { get; set; }

        /// <summary>
        ///拜访主数据标志
        /// </summary>
        public string VISITMASTER { get; set; }

        /// <summary>
        ///附加字段2
        /// </summary>
        public string ZFIELD02 { get; set; }

        /// <summary>
        ///附加字段3
        /// </summary>
        public string ZFIELD03 { get; set; }
        /// <summary>
        ///附加字段4
        /// </summary>
        public string ZFIELD04 { get; set; }
        /// <summary>
        ///附加字段5
        /// </summary>
        public string ZFIELD05 { get; set; }
        /// <summary>
        ///附加字段6
        /// </summary>
        public string ZFIELD06 { get; set; }
        /// <summary>
        ///附加字段7
        /// </summary>
        public string ZFIELD07 { get; set; }
        /// <summary>
        ///附加字段8
        /// </summary>
        public string ZFIELD08 { get; set; }
        /// <summary>
        ///附加字段9
        /// </summary>
        public string ZFIELD09 { get; set; }

        /// <summary>
        ///附加字段10
        /// </summary>
        public string ZFIELD10 { get; set; }

        /// <summary>
        ///開立發票日期
        /// </summary>
        public string PERFK { get; set; }

        /// <summary>
        ///發票清單排程
        /// </summary>
        public string PERRL { get; set; }

        /// <summary>
        ///客戶屬性
        /// </summary>
        public string ZZCUSTSEGMENT2 { get; set; }

        /// <summary>
        ///賬戶所有人
        /// </summary>
        public string KOINH { get; set; }

        /// <summary>
        ///賬戶名稱
        /// </summary>
        public string ACCNAME { get; set; }

        /// <summary>
        ///SYSID
        /// </summary>
        public string SYSID { get; set; }

        /// <summary>
        ///SEQNO
        /// </summary>
        public int SEQNO { get; set; }

        /// <summary>
        ///AENAM
        /// </summary>
        public string AENAM { get; set; }

        /// <summary>
        ///AEDAT
        /// </summary>
        public string AEDAT { get; set; }

        /// <summary>
        ///AEZET
        /// </summary>
        public string AEZET { get; set; }

    }
}
