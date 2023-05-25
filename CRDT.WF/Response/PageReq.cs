using System.Collections.Generic;

namespace CRDT.WF.Response
{
    /// <summary>
    /// 请求参数
    /// </summary>
    public class PageReq
    {
        public PageReq()
        {
            Page = 1;
            Limit = 10;
        }
        /// <summary>
        /// 页
        /// </summary>
        public int Page { get; set; }
        /// <summary>
        /// 每页数量
        /// </summary>
        public int Limit { get; set; }
        /// <summary>
        /// 排序字段
        /// </summary>
        public string SField { get; set; }
        /// <summary>
        /// 排序（desc/asc）
        /// </summary>
        public string SOrder { get; set; }
        /// <summary>
        /// 搜索条件
        /// </summary>
        public List<Filter> Filters { get; set; }
    }
    /// <summary>
    /// 搜索条件
    /// </summary>
    public class Filter
    {
        /// <summary>
        /// 字段名称
        /// </summary>
        public string Field { get; set; }
        /// <summary>
        /// 条件
        /// </summary>
        public string Conditional { get; set; }
        /// <summary>
        /// 值
        /// </summary>
        public string Value { get; set; }
        /// <summary>
        /// 类型
        /// </summary>
        public string Type { get; set; }
    }
}

