using CRDT.WF.Interface;
using CRDT.WF.Response;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Localization;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Formatting;
using System.Net.Http.Headers;
using System.Reflection;
using System.Security.Authentication;
using System.Text;
using System.Threading.Tasks;
using Ui5.Data;

namespace CRDT.WF.Controllers
{
    public class BaseController : Controller
    {
        private static readonly string _Address = (SqlHelper.GetApiAddress("Address"));
        private static readonly string _AuthAddress = (SqlHelper.GetApiAddress("AuthAddress"));
        private static readonly string _RfcAddress = (SqlHelper.GetApiAddress("RfcAddress")); 
        private static readonly string _CMWFAddress = (SqlHelper.GetApiAddress("CMWFAddress"));
        protected IUnitWork UnitWork;
        private static int CultureLanguagesType;
        protected readonly IStringLocalizer<HomeController> Localizer;
        private static Token _token = null;
        private static readonly string _tokenUser = (SqlHelper.GetAppsettings("OtherInfo", "TokenUser"));
        private static readonly string _tokenPass = (SqlHelper.GetAppsettings("OtherInfo", "TokenPass"));
        public enum LanguageType
        {
            en_US,
            zh_HK,
            zh_CN
        }
        public BaseController(IStringLocalizer<HomeController> localizer, IUnitWork unitWork)
        {
            UnitWork = unitWork;
            Localizer = localizer;
            CultureLanguagesType = GetEnumValue(typeof(LanguageType), System.Globalization.CultureInfo.CurrentCulture.Name.Replace("-", "_"));
        }
        protected T GetAsync<T>(string requestUri, Token token)
        {
            using (var httpClientHandler = new HttpClientHandler())
            {
                httpClientHandler.ClientCertificateOptions = ClientCertificateOption.Manual;
                httpClientHandler.ServerCertificateCustomValidationCallback = (message, cert, chain, errors) => { return true; };
                httpClientHandler.SslProtocols = SslProtocols.Tls | SslProtocols.Tls11 | SslProtocols.Tls12;
                using (var client = new HttpClient(httpClientHandler))
                {
                    client.BaseAddress = new Uri(_Address);
                    client.DefaultRequestHeaders.Accept.Clear();
                    client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                    client.DefaultRequestHeaders.Add("Authorization", (token.token_type == null ? "Bearer" : token.token_type) + " " + (token.access_token == null ? "" : token.access_token));
                    client.DefaultRequestHeaders.Add("LanguageType", CultureLanguagesType.ToString());
                    client.MaxResponseContentBufferSize = 2147483647;
                    client.Timeout = new TimeSpan(0, 0, 20, 4);

                    HttpResponseMessage response = client.GetAsync(requestUri).Result;

                    if (response.IsSuccessStatusCode)
                    {
                        return response.Content.ReadAsAsync<T>().Result;
                    }
                }

                return default(T);
            }
        }

        protected static T GetAsync<T>(string requestUri)
        {
            using (var httpClientHandler = new HttpClientHandler())
            {
                httpClientHandler.ClientCertificateOptions = ClientCertificateOption.Manual;
                httpClientHandler.ServerCertificateCustomValidationCallback = (message, cert, chain, errors) => { return true; };
                httpClientHandler.SslProtocols = SslProtocols.Tls | SslProtocols.Tls11 | SslProtocols.Tls12;
                using (var client = new HttpClient(httpClientHandler))
                {
                    GetToken();
                    client.BaseAddress = new Uri(_Address);
                    client.DefaultRequestHeaders.Accept.Clear();
                    client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                    client.DefaultRequestHeaders.Add("Authorization", _token.token_type + " " + _token.access_token);
                    client.DefaultRequestHeaders.Add("LanguageType", CultureLanguagesType.ToString());
                    client.MaxResponseContentBufferSize = 2147483647;
                    client.Timeout = new TimeSpan(0, 0, 20, 4);

                    HttpResponseMessage response = client.GetAsync(requestUri).Result;

                    if (response.IsSuccessStatusCode)
                    {
                        return response.Content.ReadAsAsync<T>().Result;
                    }
                }
                return default(T);
            }
        }

        protected static T GetAsyncCMWF<T>(string requestUri)
        {
            using (var httpClientHandler = new HttpClientHandler())
            {
                httpClientHandler.ClientCertificateOptions = ClientCertificateOption.Manual;
                httpClientHandler.ServerCertificateCustomValidationCallback = (message, cert, chain, errors) => { return true; };
                httpClientHandler.SslProtocols = SslProtocols.Tls | SslProtocols.Tls11 | SslProtocols.Tls12;
                using (var client = new HttpClient(httpClientHandler))
                {
                    GetToken();
                    client.BaseAddress = new Uri(_CMWFAddress);
                    client.DefaultRequestHeaders.Accept.Clear();
                    client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                    client.DefaultRequestHeaders.Add("Authorization", _token.token_type + " " + _token.access_token);
                    client.DefaultRequestHeaders.Add("LanguageType", CultureLanguagesType.ToString());
                    client.MaxResponseContentBufferSize = 2147483647;
                    client.Timeout = new TimeSpan(0, 0, 20, 4);

                    HttpResponseMessage response = client.GetAsync(requestUri).Result;

                    if (response.IsSuccessStatusCode)
                    {
                        return response.Content.ReadAsAsync<T>().Result;
                    }
                }
                return default(T);
            }
        }

        protected T PostAsync<T, L>(string requestUri, L v, Token token)
        {
            using (var httpClientHandler = new HttpClientHandler())
            {
                httpClientHandler.ClientCertificateOptions = ClientCertificateOption.Manual;
                httpClientHandler.ServerCertificateCustomValidationCallback = (message, cert, chain, errors) => { return true; };
                httpClientHandler.SslProtocols = SslProtocols.Tls | SslProtocols.Tls11 | SslProtocols.Tls12;
                using (var client = new HttpClient(httpClientHandler))
                {
                    client.BaseAddress = new Uri(_Address);
                    client.DefaultRequestHeaders.Accept.Clear();
                    client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                    client.DefaultRequestHeaders.Add("Authorization", (token.token_type == null ? "Bearer" : token.token_type) + " " + (token.access_token == null ? "" : token.access_token));
                    client.DefaultRequestHeaders.Add("LanguageType", CultureLanguagesType.ToString());
                    client.MaxResponseContentBufferSize = 2147483647;
                    client.Timeout = new TimeSpan(0, 0, 20, 4);

                    HttpResponseMessage response = client.PostAsJsonAsync(requestUri, v).Result;

                    return response.Content.ReadAsAsync<T>().Result;
                    /*if (response.IsSuccessStatusCode)
                    {
                    }*/
                }
                //return default(T);
            }
        }
        protected static T PostAsyncRfc<T, L>(string requestUri, L v)
        {
            using (var httpClientHandler = new HttpClientHandler())
            {
                httpClientHandler.ClientCertificateOptions = ClientCertificateOption.Manual;
                httpClientHandler.ServerCertificateCustomValidationCallback = (message, cert, chain, errors) => { return true; };
                httpClientHandler.SslProtocols = SslProtocols.Tls | SslProtocols.Tls11 | SslProtocols.Tls12;
                using (var client = new HttpClient(httpClientHandler))
                {
                    GetToken();
                    client.BaseAddress = new Uri(_RfcAddress);
                    client.DefaultRequestHeaders.Accept.Clear();
                    client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                    client.DefaultRequestHeaders.Add("Authorization", (_token.token_type == null ? "Bearer" : _token.token_type) + " " + (_token.access_token == null ? "" : _token.access_token));
                    client.DefaultRequestHeaders.Add("LanguageType", CultureLanguagesType.ToString());
                    client.MaxResponseContentBufferSize = 2147483647;
                    client.Timeout = new TimeSpan(0, 0, 20, 4);

                    string uri = "crdt/" + requestUri + "_HK";

                    HttpResponseMessage response = client.PostAsJsonAsync(uri, v).Result;

                    return response.Content.ReadAsAsync<T>().Result;
                    /*if (response.IsSuccessStatusCode)
                    {
                    }*/
                }
            }
            //return default(T);
        }

        protected static T PostAsync<T, L>(string requestUri, L v)
        {
            using (var httpClientHandler = new HttpClientHandler())
            {
                httpClientHandler.ClientCertificateOptions = ClientCertificateOption.Manual;
                httpClientHandler.ServerCertificateCustomValidationCallback = (message, cert, chain, errors) => { return true; };
                httpClientHandler.SslProtocols = SslProtocols.Tls | SslProtocols.Tls11 | SslProtocols.Tls12;
                using (var client = new HttpClient(httpClientHandler))
                {
                    GetToken();
                    client.BaseAddress = new Uri(_Address);
                    client.DefaultRequestHeaders.Accept.Clear();
                    client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                    client.DefaultRequestHeaders.Add("Authorization", (_token.token_type == null ? "Bearer" : _token.token_type) + " " + (_token.access_token == null ? "" : _token.access_token));
                    client.DefaultRequestHeaders.Add("LanguageType", CultureLanguagesType.ToString());
                    client.MaxResponseContentBufferSize = 2147483647;
                    client.Timeout = new TimeSpan(0, 0, 20, 4);

                    HttpResponseMessage response = client.PostAsJsonAsync(requestUri, v).Result;

                    return response.Content.ReadAsAsync<T>().Result;
                    /*if (response.IsSuccessStatusCode)
                    {
                    }*/
                }
            }
            //return default(T);
        }

        //protected T PostAsync<T>(string requestUri)
        //{
        //    using (var client = new HttpClient())
        //    {
        //        client.BaseAddress = new Uri(_AuthAddress);
        //        client.DefaultRequestHeaders.Accept.Clear();
        //        client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/x-www-form-urlencoded"));
        //        string authorization = $"{"CE"}:{"123"}";//basic认证方式
        //        var authorizationBased64 = "Basic " + Convert.ToBase64String(Encoding.Default.GetBytes(authorization));//如果接口未加密省略此行
        //        client.DefaultRequestHeaders.Add("Authorization", authorizationBased64);
        //        client.DefaultRequestHeaders.Add("LanguageType", CultureLanguagesType.ToString());
        //        client.MaxResponseContentBufferSize = 2147483647;
        //        client.Timeout = new TimeSpan(0, 0, 20, 4);

        //        var dic = new Dictionary<string, object> { { "grant_type", "client_credentials" } };
        //        var dic_str = dic.Select(m => m.Key + "=" + m.Value).DefaultIfEmpty().Aggregate((m, n) => m + "&" + n);
        //        HttpContent httpcontent = new StringContent(dic_str);
        //        httpcontent.Headers.ContentType = new MediaTypeHeaderValue("application/x-www-form-urlencoded");
        //        HttpResponseMessage response = client.PostAsync(requestUri, httpcontent).Result;

        //        if (response.IsSuccessStatusCode)
        //        {
        //            return response.Content.ReadAsAsync<T>().Result;
        //        }
        //    }

        //    return default(T);
        //}

        protected T DeleteAsync<T, L>(string requestUri, L v, Token token)
        {
            using (var httpClientHandler = new HttpClientHandler())
            {
                httpClientHandler.ClientCertificateOptions = ClientCertificateOption.Manual;
                httpClientHandler.ServerCertificateCustomValidationCallback = (message, cert, chain, errors) => { return true; };
                httpClientHandler.SslProtocols = SslProtocols.Tls | SslProtocols.Tls11 | SslProtocols.Tls12;
                using (var client = new HttpClient(httpClientHandler))
                {
                    client.BaseAddress = new Uri(_Address);
                    client.DefaultRequestHeaders.Accept.Clear();
                    client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                    client.DefaultRequestHeaders.Add("Authorization", (token.token_type == null ? "Bearer" : token.token_type) + " " + (token.access_token == null ? "" : token.access_token));
                    client.DefaultRequestHeaders.Add("LanguageType", CultureLanguagesType.ToString());
                    client.MaxResponseContentBufferSize = 2147483647;
                    client.Timeout = new TimeSpan(0, 0, 20, 4);

                    HttpContent httpcontent = new ObjectContent(typeof(L), v, new JsonMediaTypeFormatter());
                    httpcontent.Headers.ContentType = new MediaTypeHeaderValue("application/json");

                    var hmes = new HttpRequestMessage();
                    hmes.Method = HttpMethod.Delete;
                    hmes.RequestUri = new Uri(_Address + requestUri);
                    hmes.Content = httpcontent;
                    HttpResponseMessage response = client.SendAsync(hmes).Result;
                    //HttpResponseMessage response = client.DeleteAsync(requestUri, v).Result;

                    return response.Content.ReadAsAsync<T>().Result;
                    /*if (response.IsSuccessStatusCode)
                    {
                    }*/
                }
            }
            //return default(T);
        }

        protected static PropertyInfo[] GetPropertyInfos(Type type)
        {
            return type.GetProperties(BindingFlags.Public | BindingFlags.Instance);
        }
        protected static void AutoMapping<S, T>(S s, T t)
        {
            // get source PropertyInfos
            PropertyInfo[] pps = GetPropertyInfos(s.GetType());
            // get target type
            Type target = t.GetType();

            foreach (var pp in pps)
            {
                PropertyInfo targetPP = target.GetProperty(pp.Name);
                object value = pp.GetValue(s, null);

                if (targetPP != null && value != null)
                {
                    targetPP.SetValue(t, value, null);
                }
            }
        }

        protected static int GetEnumValue(Type enumType, string enumName)
        {
            try
            {
                if (!enumType.IsEnum)
                    throw new ArgumentException("enumType必须是枚举类型");
                var values = Enum.GetValues(enumType);
                var ht = new Hashtable();
                foreach (var val in values)
                {
                    ht.Add(Enum.GetName(enumType, val), val);
                }
                return (int)ht[enumName];
            }
            catch (Exception ex)
            {
                return 0;
            }
        }
        protected static double GetTime()
        {
            DateTime minValue = new DateTime(1970, 1, 1);
            DateTime nowValue = DateTime.Now;
            double value = (nowValue - minValue).TotalMilliseconds;
            return Math.Floor(value);
        }

        protected static double GetTime(DateTime nowValue)
        {
            DateTime minValue = new DateTime(1970, 1, 1, 8, 0, 0);
            double value = (nowValue - minValue).TotalMilliseconds;
            return Math.Floor(value);
        }

        public static void CopyModel(object target, object source)
        {
            Type targetType = target.GetType();
            Type sourceType = source.GetType();
            foreach (var mi in sourceType.GetProperties())
            {
                var des = targetType.GetProperty(mi.Name);
                if (des != null)
                {
                    des.SetValue(target, mi.GetValue(source));
                }
            }
        }
        protected T PutAsync<T, L>(string requestUri, L v, Token token)
        {
            using (var httpClientHandler = new HttpClientHandler())
            {
                httpClientHandler.ClientCertificateOptions = ClientCertificateOption.Manual;
                httpClientHandler.ServerCertificateCustomValidationCallback = (message, cert, chain, errors) => { return true; };
                httpClientHandler.SslProtocols = SslProtocols.Tls | SslProtocols.Tls11 | SslProtocols.Tls12;
                using (var client = new HttpClient(httpClientHandler))
                {
                    client.BaseAddress = new Uri(_Address);
                    client.DefaultRequestHeaders.Accept.Clear();
                    client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                    client.DefaultRequestHeaders.Add("Authorization", (token.token_type == null ? "Bearer" : token.token_type) + " " + (token.access_token == null ? "" : token.access_token));
                    client.DefaultRequestHeaders.Add("LanguageType", CultureLanguagesType.ToString());
                    client.MaxResponseContentBufferSize = 2147483647;
                    client.Timeout = new TimeSpan(0, 0, 20, 4);

                    HttpContent httpcontent = new ObjectContent(typeof(L), v, new JsonMediaTypeFormatter());
                    httpcontent.Headers.ContentType = new MediaTypeHeaderValue("application/json");

                    var hmes = new HttpRequestMessage();
                    hmes.Method = HttpMethod.Put;
                    hmes.RequestUri = new Uri(_Address + requestUri);
                    hmes.Content = httpcontent;
                    HttpResponseMessage response = client.SendAsync(hmes).Result;
                    //HttpResponseMessage response = client.DeleteAsync(requestUri, v).Result;

                    return response.Content.ReadAsAsync<T>().Result;
                    /*if (response.IsSuccessStatusCode)
                    {
                    }*/
                }
            }
            //return default(T);
        }
        protected static T PutAsync<T, L>(string requestUri, L v)
        {
            using (var httpClientHandler = new HttpClientHandler())
            {
                httpClientHandler.ClientCertificateOptions = ClientCertificateOption.Manual;
                httpClientHandler.ServerCertificateCustomValidationCallback = (message, cert, chain, errors) => { return true; };
                httpClientHandler.SslProtocols = SslProtocols.Tls | SslProtocols.Tls11 | SslProtocols.Tls12;
                using (var client = new HttpClient(httpClientHandler))
                {
                    GetToken();
                    client.BaseAddress = new Uri(_Address);
                    client.DefaultRequestHeaders.Accept.Clear();
                    client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                    client.DefaultRequestHeaders.Add("Authorization", (_token.token_type == null ? "Bearer" : _token.token_type) + " " + (_token.access_token == null ? "" : _token.access_token));
                    client.DefaultRequestHeaders.Add("LanguageType", CultureLanguagesType.ToString());
                    client.MaxResponseContentBufferSize = 2147483647;
                    client.Timeout = new TimeSpan(0, 0, 20, 4);

                    HttpContent httpcontent = new ObjectContent(typeof(L), v, new JsonMediaTypeFormatter());
                    httpcontent.Headers.ContentType = new MediaTypeHeaderValue("application/json");

                    var hmes = new HttpRequestMessage();
                    hmes.Method = HttpMethod.Put;
                    hmes.RequestUri = new Uri(_Address + requestUri);
                    hmes.Content = httpcontent;
                    HttpResponseMessage response = client.SendAsync(hmes).Result;
                    //HttpResponseMessage response = client.DeleteAsync(requestUri, v).Result;

                    return response.Content.ReadAsAsync<T>().Result;
                    /*if (response.IsSuccessStatusCode)
                    {
                    }*/
                }
            }
            //return default(T);
        }

        protected T DeleteAsync<T>(string requestUri, Token token)
        {
            using (var httpClientHandler = new HttpClientHandler())
            {
                httpClientHandler.ClientCertificateOptions = ClientCertificateOption.Manual;
                httpClientHandler.ServerCertificateCustomValidationCallback = (message, cert, chain, errors) => { return true; };
                httpClientHandler.SslProtocols = SslProtocols.Tls | SslProtocols.Tls11 | SslProtocols.Tls12;
                using (var client = new HttpClient(httpClientHandler))
                {
                    client.BaseAddress = new Uri(_Address);
                    client.DefaultRequestHeaders.Accept.Clear();
                    client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                    client.DefaultRequestHeaders.Add("Authorization", (token.token_type == null ? "Bearer" : token.token_type) + " " + (token.access_token == null ? "" : token.access_token));
                    client.DefaultRequestHeaders.Add("LanguageType", CultureLanguagesType.ToString());
                    client.MaxResponseContentBufferSize = 2147483647;
                    client.Timeout = new TimeSpan(0, 0, 20, 4);

                    HttpResponseMessage response = client.DeleteAsync(requestUri).Result;

                    if (response.IsSuccessStatusCode)
                    {
                        return response.Content.ReadAsAsync<T>().Result;
                    }
                }

                return default(T);
            }
        }
        protected static T PostAsync<T>(string requestUri)
        {
            using (var httpClientHandler = new HttpClientHandler())
            {
                httpClientHandler.ClientCertificateOptions = ClientCertificateOption.Manual;
                httpClientHandler.ServerCertificateCustomValidationCallback = (message, cert, chain, errors) => { return true; };
                httpClientHandler.SslProtocols = SslProtocols.Tls | SslProtocols.Tls11 | SslProtocols.Tls12;
                using (var client = new HttpClient(httpClientHandler))
                {
                    client.BaseAddress = new Uri(_AuthAddress);
                    client.DefaultRequestHeaders.Accept.Clear();
                    client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/x-www-form-urlencoded"));
                    string authorization = $"{_tokenUser}:{_tokenPass}";//basic认证方式
                    var authorizationBased64 = "Basic " + Convert.ToBase64String(Encoding.Default.GetBytes(authorization));//如果接口未加密省略此行
                    client.DefaultRequestHeaders.Add("Authorization", authorizationBased64);
                    client.DefaultRequestHeaders.Add("LanguageType", CultureLanguagesType.ToString());
                    client.MaxResponseContentBufferSize = 2147483647;
                    client.Timeout = new TimeSpan(0, 0, 20, 4);
                    var dic = new Dictionary<string, object> { { "grant_type", "client_credentials" } };
                    var dic_str = dic.Select(m => m.Key + "=" + m.Value).DefaultIfEmpty().Aggregate((m, n) => m + "&" + n);
                    HttpContent httpcontent = new StringContent(dic_str);
                    httpcontent.Headers.ContentType = new MediaTypeHeaderValue("application/x-www-form-urlencoded");
                    HttpResponseMessage response = client.PostAsync(requestUri, httpcontent).Result;

                    if (response.IsSuccessStatusCode)
                    {
                        return response.Content.ReadAsAsync<T>().Result;
                    }
                }
                return default(T);
            }
        }
        /// <summary>
        /// 获取token
        /// </summary>
        /// <returns></returns>
        protected static Token GetToken()
        {
            if (_token == null || string.IsNullOrEmpty(_token.expires_in) || double.Parse(_token.expires_in) <= GetTime(DateTime.Now))
            {
                Token res = PostAsync<Token>("OAuth/Token");
                if (res.access_token != string.Empty)
                {
                    if (!string.IsNullOrEmpty(res.expires_in))
                    {
                        res.expires_in = GetTime(DateTime.Now.AddSeconds(double.Parse(res.expires_in))).ToString();
                    }
                }
                _token = res;
            }
            return _token;
        }
    }
}
