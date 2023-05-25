using CRDT.WF.Data;
using CRDT.WF.Infrastructure;
using CRDT.WF.Interface;
using CRDT.WF.Service;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Localization;
using Microsoft.AspNetCore.Mvc.Razor;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Hosting;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using Ui5.Data;

namespace CRDT.WF
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.Configure<IISServerOptions>(options =>
            {
                options.AutomaticAuthentication = false;
                options.AllowSynchronousIO = true;
                options.MaxRequestBodySize = int.MaxValue;
            });
            services.Configure<IISOptions>(options =>
            {
                options.ForwardClientCertificate = false;
            });
            //页面使用IHtmlLocalizer添加服务(资源文件)
            services.AddLocalization(o =>
            {
                o.ResourcesPath = "Resources";
            });
            services.AddDbContext<TestContext>(options =>
            options.UseSqlServer(SqlHelper.GetConnectingString("CRDTDBContext")));
            services.AddControllers(mvcOptions => mvcOptions.EnableEndpointRouting = false);
            services.AddHttpClient();
            services.AddSession(o =>
            {
                o.IdleTimeout = TimeSpan.FromMinutes(60);
            });
            //解决跨域问题
            services.AddCors(options =>
            {
                options.AddPolicy(
                     "AllowAllOrigins",
                      builder => builder
                        .AllowAnyOrigin()
                        .AllowAnyHeader()
                        .AllowAnyMethod()
                        );

                options.DefaultPolicyName = "AllowAllOrigins";
            });
            services.AddControllersWithViews().AddViewLocalization();
            services.AddScoped<IUnitWork, UnitWork>();
            services.AddMvc(o =>
            {
                o.Filters.Add<CustomActionFilterAttribute>(); //全局注册：
            }).AddNewtonsoftJson(opt =>
            {
                opt.SerializerSettings.ContractResolver = new Newtonsoft.Json.Serialization.DefaultContractResolver();//json字符串大小写原样输出
            }).AddViewLocalization(LanguageViewLocationExpanderFormat.Suffix);
            //添加 身份验证 服务
        //    services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
        //        .AddCookie(CookieAuthenticationDefaults.AuthenticationScheme, o =>
        //        {
        //            o.LoginPath = new PathString("/Home/Login");
        //            o.Cookie.Path = "/";
        //            o.Cookie.MaxAge = TimeSpan.FromSeconds(1800);
        //            o.Cookie.SameSite = SameSiteMode.None;
        //        });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            //页面使用IHtmlLocalizer所需
            IList<CultureInfo> supportedCultures = new List<CultureInfo>
            {
                new CultureInfo("en-US"),
                new CultureInfo("zh-CN"),
                new CultureInfo("zh-HK"),
            };
            app.UseRequestLocalization(new RequestLocalizationOptions
            {
                DefaultRequestCulture = new RequestCulture("zh-CN"),
                SupportedCultures = supportedCultures,
                SupportedUICultures = supportedCultures
            });
            app.UseSession();
            //加载静态文件
            app.UseDirectoryBrowser(new DirectoryBrowserOptions
            {
                FileProvider = new PhysicalFileProvider(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "/")),
                RequestPath = "/ui5"
            });
            var provider = new FileExtensionContentTypeProvider();
            provider.Mappings[".properties"] = "application/text";
            app.UseStaticFiles(new StaticFileOptions
            {
                FileProvider = new PhysicalFileProvider(
                    Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "")),
                RequestPath = "",
                ContentTypeProvider = provider
            });
            app.UseRouting();
            app.UseDefaultFiles();
            app.UseCors();
            app.UseAuthentication();
            app.UseMvc(routes =>
            {
                routes.MapRoute(
                name: "default",
                template: "{controller=Home}/{action=Index}");
            });
        }
    }
}
