using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace CRDT.WF.Model
{
    [Table("ZCRDT_T_WFPI")]
    public class ZCRDT_T_WFPI
    {
        /// <summary>
        /// 主键
        /// </summary>
        [Key]
        public string REQID { get; set; }

        /// <summary>
        /// CLOSE_REASON
        /// </summary>		
        [StringLength(10)]
        [DisplayFormat(ConvertEmptyStringToNull = false)]
        public string CLOSE_REASON { get; set; }

        /// <summary>
        /// Payer info input option
        /// </summary>		
        [StringLength(10)]
        [DisplayFormat(ConvertEmptyStringToNull = false)]
        public string INPUT_OPTION { get; set; }

        /// <summary>
        /// upload message
        /// </summary>		
        [StringLength(2000)]
        public string UPLOAD_RESULT { get; set; }

        /// <summary>
        /// Reference BP no.
        /// </summary>		
        [StringLength(10)]
        [DisplayFormat(ConvertEmptyStringToNull = false)]
        public string KUNNR { get; set; }

        /// <summary>
        /// SALESADMIN
        /// </summary>		
        [StringLength(50)]
        [DisplayFormat(ConvertEmptyStringToNull = false)]
        public string SALESADMIN { get; set; }

        /// <summary>
        /// Bill-To
        /// </summary>		
        [StringLength(10)]
        [DisplayFormat(ConvertEmptyStringToNull = false)]
        public string BILL_TO { get; set; }

        /// <summary>
        /// Company Code
        /// </summary>		
        [StringLength(4)]
        [DisplayFormat(ConvertEmptyStringToNull = false)]
        public string BUKRS { get; set; }

        /// <summary>
        /// Company Name
        /// </summary>		
        [StringLength(25)]
        [DisplayFormat(ConvertEmptyStringToNull = false)]
        public string BUTXT { get; set; }

        /// <summary>
        /// CREDIT_SGMNT
        /// </summary>		
        [StringLength(10)]
        [DisplayFormat(ConvertEmptyStringToNull = false)]
        public string CREDIT_SGMNT { get; set; }

        /// <summary>
        /// 英文名称
        /// </summary>		
        [StringLength(35)]
        [DisplayFormat(ConvertEmptyStringToNull = false)]
        public string NAME_ORG1 { get; set; }

        /// <summary>
        /// 英文名称
        /// </summary>		
        [StringLength(35)]
        [DisplayFormat(ConvertEmptyStringToNull = false)]
        public string NAME_ORG2 { get; set; }

        /// <summary>
        /// 中文名称
        /// </summary>		
        [StringLength(35)]
        [DisplayFormat(ConvertEmptyStringToNull = false)]
        public string NAME1_SZF { get; set; }

        /// <summary>
        /// 中文名称
        /// </summary>		
        [StringLength(35)]
        [DisplayFormat(ConvertEmptyStringToNull = false)]
        public string NAME2_SZF { get; set; }

        /// <summary>
        /// 英文地址1
        /// </summary>		
        [StringLength(60)]
        [DisplayFormat(ConvertEmptyStringToNull = false)]
        public string STREET_EN1 { get; set; }

        /// <summary>
        /// 英文地址2
        /// </summary>		
        [StringLength(40)]
        [DisplayFormat(ConvertEmptyStringToNull = false)]
        public string STREET_EN2 { get; set; }

        /// <summary>
        /// 英文地址3
        /// </summary>		
        [StringLength(40)]
        [DisplayFormat(ConvertEmptyStringToNull = false)]
        public string STREET_EN3 { get; set; }

        /// <summary>
        /// 中文地址1
        /// </summary>		
        [StringLength(60)]
        [DisplayFormat(ConvertEmptyStringToNull = false)]
        public string STREET_CN1 { get; set; }

        /// <summary>
        /// 中文地址2
        /// </summary>		
        [StringLength(40)]
        [DisplayFormat(ConvertEmptyStringToNull = false)]
        public string STREET_CN2 { get; set; }

        /// <summary>
        /// 中文地址3
        /// </summary>		
        [StringLength(40)]
        [DisplayFormat(ConvertEmptyStringToNull = false)]
        public string STREET_CN3 { get; set; }

        /// <summary>
        /// ATTENTION
        /// </summary>		
        [StringLength(30)]
        [DisplayFormat(ConvertEmptyStringToNull = false)]
        public string ATTENTION1 { get; set; }

        /// <summary>
        /// 收件人
        /// </summary>		
        [StringLength(40)]
        [DisplayFormat(ConvertEmptyStringToNull = false)]
        public string ATTENTION2 { get; set; }

        /// <summary>
        /// PHONE1
        /// </summary>		
        [StringLength(30)]
        [DisplayFormat(ConvertEmptyStringToNull = false)]
        public string PHONE1 { get; set; }

        /// <summary>
        /// PHONE1_EXT
        /// </summary>		
        [StringLength(30)]
        [DisplayFormat(ConvertEmptyStringToNull = false)]
        public string PHONE1_EXT { get; set; }

        /// <summary>
        /// PHONE2
        /// </summary>		
        [StringLength(30)]
        [DisplayFormat(ConvertEmptyStringToNull = false)]
        public string PHONE2 { get; set; }

        /// <summary>
        /// PHONE2_EXT
        /// </summary>		
        [StringLength(30)]
        [DisplayFormat(ConvertEmptyStringToNull = false)]
        public string PHONE2_EXT { get; set; }

        /// <summary>
        /// EMAIL1
        /// </summary>		
        [StringLength(40)]
        [DisplayFormat(ConvertEmptyStringToNull = false)]
        public string EMAIL1 { get; set; }

        /// <summary>
        /// EMAIL2
        /// </summary>		
        [StringLength(40)]
        [DisplayFormat(ConvertEmptyStringToNull = false)]
        public string EMAIL2 { get; set; }

        /// <summary>
        /// EMAIL3
        /// </summary>		
        [StringLength(40)]
        [DisplayFormat(ConvertEmptyStringToNull = false)]
        public string EMAIL3 { get; set; }

        /// <summary>
        /// FAX
        /// </summary>		
        [StringLength(40)]
        [DisplayFormat(ConvertEmptyStringToNull = false)]
        public string FAX { get; set; }

        /// <summary>
        /// REMARK
        /// </summary>		
        [StringLength(200)]
        [DisplayFormat(ConvertEmptyStringToNull = false)]
        public string REMARK { get; set; }

        /// <summary>
        /// 通路別
        /// </summary>		
        [StringLength(3)]
        public string CHANNEL { get; set; }

        /// <summary>
        /// 子通路別 
        /// </summary>		
        [StringLength(3)]
        public string SUBCHANNEL { get; set; }

        /// <summary>
        /// KA/Non-KA
        /// </summary>		
        [StringLength(3)]
        public string KVGR1 { get; set; }

        /// <summary>
        /// KA Code
        /// </summary>		
        [StringLength(5)]
        public string KACODE { get; set; }

        /// <summary>
        /// CHAINCUST
        /// </summary>		
        [StringLength(5)]
        public string CHAINCUST { get; set; }

        /// <summary>
        /// 業務類型
        /// </summary>		
        [StringLength(3)]
        public string KVGR2 { get; set; }

        /// <summary>
        /// 銷售組織
        /// </summary>		
        [StringLength(4)]
        public string VKORG { get; set; }

        /// <summary>
        /// 交貨工廠
        /// </summary>		
        [StringLength(4)]
        public string VWERK { get; set; }

        /// <summary>
        /// 客戶定價程序
        /// </summary>		
        [StringLength(2)]
        public string KALKS { get; set; }

        /// <summary>
        /// 幣種
        /// </summary>		
        [StringLength(5)]
        public string WAERS { get; set; }

        /// <summary>
        /// 出貨條件
        /// </summary>		
        [StringLength(2)]
        public string VSBED { get; set; }

        /// <summary>
        /// 交貨優先順序
        /// </summary>		
        [StringLength(2)]
        public string LPRIO { get; set; }

        /// <summary>
        /// 客戶賬戶分配組
        /// </summary>		
        [StringLength(2)]
        public string KTGRD { get; set; }

        /// <summary>
        /// 客戶型態
        /// </summary>		
        [StringLength(2)]
        public string CUSTSTATUS { get; set; }

        /// <summary>
        /// 直營加盟
        /// </summary>		
        [StringLength(2)]
        public string CUSTTYPE { get; set; }

        /// <summary>
        /// 出貨類型
        /// </summary>		
        [StringLength(3)]
        public string DELTYPE { get; set; }

        /// <summary>
        /// 客戶可售賣產品分類
        /// </summary>		
        [StringLength(1)]
        public string MATTYPE { get; set; }

        /// <summary>
        /// DN Copy
        /// </summary>		
        [StringLength(1)]
        public string DNCOPY { get; set; }

        /// <summary>
        /// 派送路線
        /// </summary>		
        [StringLength(4)]
        public string DROUTE { get; set; }
    }
}
