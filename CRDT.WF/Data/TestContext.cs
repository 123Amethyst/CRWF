using CRDT.WF.Model;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace CRDT.WF.Data
{
    public class TestContext : DbContext
    {
        public TestContext(DbContextOptions<TestContext> options) : base(options)
        {
        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<ZCRDT_T_DIC>()
             .HasKey(t => new { t.ID});
            modelBuilder.Entity<ZCRDT_T_WFAR>()
            .HasKey(t => new { t.REQID});
            modelBuilder.Entity<ZCRDT_T_WFBR>()
           .HasKey(t => new { t.REQID });
            modelBuilder.Entity<ZCRDT_T_WFPI>()
           .HasKey(t => new { t.REQID });
            modelBuilder.Entity<SerNum>()
           .HasKey(t => new { t.DateString,t.Num });
            modelBuilder.Entity<ZCRDT_T_WFHD>()
           .HasKey(t => new { t.REQID });
            modelBuilder.Entity<ZCRDT_T_TASK>()
           .HasKey(t => new { t.RequestId,t.StageCode,t.UserId });
            modelBuilder.Entity<Customer>()
           .HasKey(t => new { t.KUNNR, t.BUKRS});
            modelBuilder.Entity<SalesAdminDept>()
           .HasKey(t => new { t.CompanyCode, t.SalesAdmin,t.Region });
            modelBuilder.Entity<CostCenter>()
           .HasKey(t => new { t.BUKRS, t.CODE });
            modelBuilder.Entity<Dept>()
           .HasKey(t => new { t.DeptId});
            modelBuilder.Entity<SalesAdmin>()
          .HasKey(t => new { t.SPRAS,t.BUKRS,t.ZZSALESADMIN }); 
            modelBuilder.Entity<CreditManager>()
          .HasKey(t => new { t.SPRAS, t.BUKRS, t.ZZSALESADMIN,t.ZZCRMANAGER });
            modelBuilder.Entity<CVNormal>()
          .HasKey(t => new { t.SPRAS,t.CORE_ID,t.CORE_VALUE });
            modelBuilder.Entity<ZCRDT_T_CACHE>()
         .HasKey(t => new { t.KUNNR,t.BUKRS });
        }
        public DbSet<ZCRDT_T_DIC> Dics { get; set; }
        public DbSet<ZCRDT_T_WFAR> CRDTARs { get; set; }
        public DbSet<ZCRDT_T_WFBR> CRDTBRs { get; set; }
        public DbSet<ZCRDT_T_WFPI> CRDTWFPIs { get; set; }
        public DbSet<SerNum> SerNums { get; set; }
        public DbSet<ZCRDT_T_WFHD> CRDTWFHDs { get; set; }
        public DbSet<ZCRDT_T_TASK> CRDTTASKs { get; set; }
        public DbSet<Customer> Customers { get; set; }
        public DbSet<SalesAdminDept> SalesAdminDept { get; set; }
        public DbSet<CostCenter> CostCenters { get; set; }
        public DbSet<Dept> Depts { get; set; }
        public DbSet<SalesAdmin> SalesAdmins { get; set; }
        public DbSet<CreditManager> CreditManagers { get; set; }
        public DbSet<CVNormal> CVNormals { get; set; }
        public DbSet<ZCRDT_T_CACHE> Cache { get; set; }

        #region CommonDB
        public virtual DbSet<ApproFileUser> ApproFileUser { get; set; }

        #endregion

    }
}
