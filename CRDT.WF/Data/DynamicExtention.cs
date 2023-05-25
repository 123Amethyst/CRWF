using CRDT.WF.Response;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Linq.Expressions;
using System.Reflection;
using System.Text;

namespace CRDT.WF.Data
{
    public static class DynamicExtention
    {
        public static IQueryable<T> Where<T>(this IQueryable<T> query, PageReq pageReq)
        {
            var param = DynamicLinq.CreateLambdaParam<T>("c");
            Expression body = Expression.Constant(true); //初始默认一个true
            if (pageReq.Filters != null)
            {
                foreach (var filter in pageReq.Filters)
                {
                    body = body.AndAlso(param.GenerateBody<T>(filter)); //这里可以根据需要自由组合
                }
            }
            var lambda = param.GenerateTypeLambda<T>(body); //最终组成lambda
            return query.Where(lambda).OrderBy(pageReq.SField, pageReq.SOrder);
        }

        public static IQueryable<T> Paging<T>(this IQueryable<T> query, PageReq pageReq)
        {
            if (pageReq.Page != 0)
            {
                var list = query.ToList();
                if (list.Count > pageReq.Limit)
                {
                    if ((list.Count / pageReq.Limit) < pageReq.Page)
                    {
                        if ((list.Count % pageReq.Limit) != 0)
                        {
                            pageReq.Page = (list.Count / pageReq.Limit) + 1;
                        }
                        else 
                        {
                            pageReq.Page = (list.Count / pageReq.Limit);
                        }
                    }
                    query = query.Skip(pageReq.Limit * (pageReq.Page - 1)).Take(pageReq.Limit);
                }
                else
                {
                    query = query.Take(pageReq.Limit);
                }
            }
            return query;
        }

        public static IQueryable<T> OrderBy<T>(this IQueryable<T> query, string field, string order)
        {
            if (string.IsNullOrEmpty(field) || string.IsNullOrEmpty(order))
                return query;
            if (!string.IsNullOrEmpty(field) && typeof(T).GetProperty(field) == null)
                return query;
            var param = DynamicLinq.CreateLambdaParam<T>("c");
            PropertyInfo property = typeof(T).GetProperty(field);
            Expression body = Expression.Property(param, property);
            Type type = property.PropertyType;
            if (order == "Ascending")
            {
                if (type == typeof(int))
                {
                    return query.OrderBy((Expression<Func<T, int>>)(param.GenerateLambda(body)));
                }
                else if (type == typeof(short))
                {
                    return query.OrderBy((Expression<Func<T, short>>)(param.GenerateLambda(body)));
                }
                else if (type == typeof(long))
                {
                    return query.OrderBy((Expression<Func<T, long>>)(param.GenerateLambda(body)));
                }
                else if (type == typeof(float))
                {
                    return query.OrderBy((Expression<Func<T, float>>)(param.GenerateLambda(body)));
                }
                else if (type == typeof(decimal))
                {
                    return query.OrderBy((Expression<Func<T, decimal>>)(param.GenerateLambda(body)));
                }
                else if (type == typeof(string))
                {
                    return query.OrderBy((Expression<Func<T, string>>)(param.GenerateLambda(body)));
                }
                else if (type == typeof(bool))
                {
                    return query.OrderBy((Expression<Func<T, bool>>)(param.GenerateLambda(body)));
                }
                else if (type == typeof(DateTime))
                {
                    return query.OrderBy((Expression<Func<T, int>>)(param.GenerateLambda(body)));
                }
                else
                {
                    throw new Exception("暂不能解析该Key的类型");
                }
            }
            else if (order == "Descending")
            {
                if (type == typeof(int))
                {
                    return query.OrderByDescending((Expression<Func<T, int>>)(param.GenerateLambda(body)));
                }
                else if (type == typeof(short))
                {
                    return query.OrderByDescending((Expression<Func<T, short>>)(param.GenerateLambda(body)));
                }
                else if (type == typeof(long))
                {
                    return query.OrderByDescending((Expression<Func<T, long>>)(param.GenerateLambda(body)));
                }
                else if (type == typeof(float))
                {
                    return query.OrderByDescending((Expression<Func<T, float>>)(param.GenerateLambda(body)));
                }
                else if (type == typeof(decimal))
                {
                    return query.OrderByDescending((Expression<Func<T, decimal>>)(param.GenerateLambda(body)));
                }
                else if (type == typeof(string))
                {
                    return query.OrderByDescending((Expression<Func<T, string>>)(param.GenerateLambda(body)));
                }
                else if (type == typeof(bool))
                {
                    return query.OrderByDescending((Expression<Func<T, bool>>)(param.GenerateLambda(body)));
                }
                else if (type == typeof(DateTime))
                {
                    return query.OrderByDescending((Expression<Func<T, int>>)(param.GenerateLambda(body)));
                }
                else
                {
                    throw new Exception("暂不能解析该Key的类型");
                }
            }
            else
            {
                return query;
            }

        }

    }
    /*public class Filter
    {
        public string field { get; set; } //过滤的关键字
        public string Value { get; set; } //过滤的值
        public string conditional { get; set; }// 过滤的约束 比如：'<' '<=' '>' '>=' 'like'等
        public string Type { get; set; }
    }*/

    public static class DynamicLinq
    {
        /// <summary>
        /// 创建lambda中的参数,即c=>c.xxx==xx 中的c
        /// </summary>
        public static ParameterExpression CreateLambdaParam<T>(string name)
        {
            return Expression.Parameter(typeof(T), name);
        }

        /// <summary>
        /// 创建linq表达示的body部分,即c=>c.xxx==xx 中的c.xxx==xx
        /// </summary>
        public static Expression GenerateBody<T>(this ParameterExpression param, Filter filterObj)
        {
            Type oType = null;
            PropertyInfo property = typeof(T).GetProperty(filterObj.Field);
            if (!string.IsNullOrEmpty(filterObj.Type))
            {
                oType = Type.GetType(GetTypeName(filterObj.Type));
            }
            if (oType == null)
            {
                oType = property.PropertyType;
            }
            //组装左边
            Expression left = Expression.Property(param, property);
            if (filterObj.Conditional.Trim().ToLower() == "includes")
            {
                oType = typeof(string);
            }
            if (oType != property.PropertyType)
            {
                Expression _Type = Expression.Constant(oType);
                MethodCallExpression _ChangeTypeMethod = Expression.Call(typeof(Convert).GetMethod("ChangeType", new Type[] { typeof(object), typeof(Type) }), left, _Type);
                left = Expression.Convert(_ChangeTypeMethod, oType);
            }
            //组装右边
            Expression right = null;
            Expression right1 = null;
            //未支持时间列表查询
            if (filterObj.Conditional.Trim().ToLower() == "includes")
            {
                right = Expression.Constant(new List<string>(filterObj.Value.Split(",")));
                //Expression _list = Expression.Constant(Array.ConvertAll(filterObj.Value.Split(","), u => Convert.ChangeType(u, oType)));
                //right = Expression.Convert(_list, typeof(List<>).MakeGenericType(new[] { oType }));
            }
            else if (oType == typeof(int))
            {
                right = Expression.Constant(int.Parse(filterObj.Value));
            }
            else if (oType == typeof(short))
            {
                right = Expression.Constant(short.Parse(filterObj.Value));
            }
            else if (oType == typeof(long))
            {
                right = Expression.Constant(long.Parse(filterObj.Value));
            }
            else if (oType == typeof(float))
            {
                right = Expression.Constant(float.Parse(filterObj.Value));
            }
            else if (oType == typeof(decimal))
            {
                right = Expression.Constant(decimal.Parse(filterObj.Value));
            }
            else if (oType == typeof(string))
            {
                right = Expression.Constant(filterObj.Value);
            }
            else if (oType == typeof(bool))
            {
                right = Expression.Constant(filterObj.Value.ToLower().Equals("true"));
            }
            else if (oType == typeof(DateTime))
            {
                if (filterObj.Conditional.Trim().ToLower() == "between")
                {
                    right = Expression.Constant(DateTime.Parse(filterObj.Value.Split("and")[0].Trim().Trim('\'')));
                    right1 = Expression.Constant(DateTime.Parse(filterObj.Value.Split("and")[1].Trim().Trim('\'')));
                }
                else
                {
                    right = Expression.Constant(DateTime.Parse(filterObj.Value));
                }
            }
            else
            {
                throw new Exception("暂不能解析该Key的类型");
            }

            //todo: 下面根据需要扩展自己的比较
            Expression filter = Expression.Constant(true);
            switch (filterObj.Conditional)
            {
                case "=":
                    filter = Expression.Equal(left, right);
                    break;

                case "<=":
                    filter = Expression.LessThanOrEqual(left, right);
                    break;

                case "<":
                    filter = Expression.LessThan(left, right);
                    break;

                case ">":
                    filter = Expression.GreaterThan(left, right);
                    break;

                case ">=":
                    filter = Expression.GreaterThanOrEqual(left, right);
                    break;

                case "between":
                    filter = Expression.GreaterThanOrEqual(left, right).AndAlso(Expression.LessThanOrEqual(left, right1));
                    break;

                case "like":
                    filter = Expression.Call(left, typeof(string).GetMethod("Contains", new[] { typeof(string) }), right);
                    break;

                case "includes":
                    //Type listT = typeof(List<>).MakeGenericType(new[] { oType });
                    filter = Expression.Call(right, typeof(List<string>).GetMethod("Contains"), left);
                    break;
            }

            return filter;
        }

        /// <summary>
        /// 创建完整的lambda,即c=>c.xxx==xx
        /// </summary>
        public static LambdaExpression GenerateLambda(this ParameterExpression param, Expression body)
        {
            return Expression.Lambda(body, param);
        }

        /// <summary>
        /// 创建完整的lambda，为了兼容EF中的where语句
        /// </summary>
        public static Expression<Func<T, bool>> GenerateTypeLambda<T>(this ParameterExpression param, Expression body)
        {
            return (Expression<Func<T, bool>>)(param.GenerateLambda(body));
        }

        public static Expression AndAlso(this Expression expression, Expression expressionRight)
        {
            return Expression.AndAlso(expression, expressionRight);
        }

        public static Expression Or(this Expression expression, Expression expressionRight)
        {
            return Expression.Or(expression, expressionRight);
        }

        public static Expression And(this Expression expression, Expression expressionRight)
        {
            return Expression.And(expression, expressionRight);
        }

        private static string GetTypeName(string type)
        {
            string TypeName = null;
            switch (type)
            {
                case "short":
                    TypeName = "System.Int16";
                    break;
                case "int":
                    TypeName = "System.Int32";
                    break;
                case "long":
                    TypeName = "System.Int64";
                    break;
                case "float":
                    TypeName = "System.Single";
                    break;
                case "decimal":
                    TypeName = "System.Decimal";
                    break;
                case "string":
                    TypeName = "System.String";
                    break;
                case "DateTime":
                    TypeName = "System.DateTime";
                    break;
                case "bool":
                    TypeName = "System.Boolean";
                    break;
                default:
                    break;
            }
            return TypeName;
        }
    }
}

