using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Linq.Expressions;
using CRDT.WF.Data;
using CRDT.WF.Interface;
using Z.EntityFramework.Plus;
using System.Data;
using Microsoft.Data.SqlClient;

namespace CRDT.WF
{
    public class UnitWork : IUnitWork
    {
        private TestContext _context;
        public UnitWork(TestContext context)
        {
            _context = context;
        }

        public void Delete<T>(T entity) where T : class
        {
            _context.Set<T>().Remove(entity);
        }

        public void Delete<T>(Expression<Func<T, bool>> exp) where T : class
        {
            _context.Set<T>().RemoveRange(Filter(exp));
        }

        public DataTable ExecuteDataTableSql(string cmdText, string connStr = "")
        {
            System.Data.DataTable dt = new DataTable();
            if (string.IsNullOrEmpty(connStr))
            {
                _context.Database.OpenConnection();
                System.Data.Common.DbConnection conn = _context.Database.GetDbConnection();

                if (conn.State == ConnectionState.Closed)
                    conn.Open();
                var comd = conn.CreateCommand();
                comd.CommandText = cmdText;
                var reader = comd.ExecuteReader(CommandBehavior.CloseConnection);
                dt.Load(reader);
                reader.Close();
                comd.Dispose();
                _context.Database.CloseConnection();
                if (conn.State != ConnectionState.Closed)
                    conn.Close();
                //conn.Dispose();
            }
            else
            {
                using (SqlConnection connection = new SqlConnection(connStr))
                {
                    DataSet ds = new DataSet();
                    try
                    {
                        connection.Open();
                        SqlDataAdapter command = new SqlDataAdapter(cmdText, connection);
                        command.Fill(ds, "ds");
                    }
                    catch (SqlException ex)
                    {
                        throw new Exception(ex.Message);
                    }
                    dt = ds.Tables[0];
                }
            }
            GC.Collect();
            return dt;
        }
        public DataTable ExecuteDataTableSql(string cmdText, object[] param, string connStr = "")
        {
            System.Data.DataTable dt = new DataTable();
            if (string.IsNullOrEmpty(connStr))
            {
                _context.Database.OpenConnection();
                System.Data.Common.DbConnection conn = _context.Database.GetDbConnection();

                if (conn.State == ConnectionState.Closed)
                    conn.Open();
                var comd = conn.CreateCommand();
                comd.Parameters.AddRange(param);
                comd.CommandText = cmdText;
                comd.CommandTimeout = 300;
                var reader = comd.ExecuteReader(CommandBehavior.CloseConnection);
                dt.Load(reader);
                reader.Close();
                comd.Dispose();
                _context.Database.CloseConnection();
                if (conn.State != ConnectionState.Closed)
                    conn.Close();
                //conn.Dispose();
            }
            else
            {
                using (SqlConnection connection = new SqlConnection(connStr))
                {
                    DataSet ds = new DataSet();
                    try
                    {
                        connection.Open();
                        SqlCommand cmd = new SqlCommand(cmdText, connection);
                        cmd.Parameters.AddRange(param);
                        SqlDataAdapter command = new SqlDataAdapter(cmd);
                        command.Fill(ds, "ds");
                    }
                    catch (SqlException ex)
                    {
                        throw new Exception(ex.Message);
                    }
                    dt = ds.Tables[0];
                }
            }
            GC.Collect();
            return dt;
        }
        public IQueryable<T> Find<T>(Expression<Func<T, bool>> exp = null) where T : class
        {
            var dbSet = _context.Set<T>().AsNoTracking().AsQueryable();
            if (exp != null)
                dbSet = dbSet.Where(exp);
            return dbSet.AsNoTracking();
        }

        public IQueryable<T> Find<T>(TestContext con,Expression<Func<T, bool>> exp = null) where T : class
        {
            var dbSet = con.Set<T>().AsNoTracking().AsQueryable();
            if (exp != null)
                dbSet = dbSet.Where(exp);
            return dbSet.AsNoTracking();
        }


        public T FindSingle<T>(Expression<Func<T, bool>> exp = null) where T : class
        {
            return _context.Set<T>().AsNoTracking().FirstOrDefault(exp);
        }

        public int GetCount<T>(Expression<Func<T, bool>> exp = null) where T : class
        {
            return Filter(exp).Count();
        }

        public TestContext GetDbContext(string connectionString)
        {
            var optionsBuilder = new DbContextOptionsBuilder<TestContext>();
            optionsBuilder.UseSqlServer(connectionString);
            TestContext _context1 = new TestContext(optionsBuilder.Options);
            return _context1;
        }

        public bool IsExist<T>(Expression<Func<T, bool>> exp) where T : class
        {
            return _context.Set<T>().Any(exp);
        }

        public void Save()
        {
            _context.SaveChanges();
            _context.ChangeTracker.AcceptAllChanges();
            for (int i = 0; i < _context.ChangeTracker.Entries().Count(); i++)
            {
                var entity = _context.ChangeTracker.Entries().ElementAt(i);
                entity.State = EntityState.Detached;
            }
            /*_context.Database.CloseConnection();
            _context.Database.OpenConnection();*/
        }

        public void SaveNew()
        {
            _context.SaveChanges();
        }

        public void Add<T>(T entity) where T : class
        {
            _context.Add(entity);
        }

        public void AddRange<T>(T[] entity) where T : class
        {
            _context.AddRange(entity);
        }

        public void Update<T>(T entity) where T : class
        {
            var entry = _context.Entry(entity);
            if (entry.State != EntityState.Modified)
                entry.State = EntityState.Modified;
            if (!_context.ChangeTracker.HasChanges())
            {
                entry.State = EntityState.Unchanged;
            }
        }

        public void Update<T>(Expression<Func<T, bool>> where, Expression<Func<T, T>> entity) where T : class
        {
            _context.Set<T>().Where(where).Update(entity);
        }


        private IQueryable<T> Filter<T>(Expression<Func<T, bool>> exp) where T : class
        {
            var dbSet = _context.Set<T>().AsNoTracking().AsQueryable();
            if (exp != null)
                dbSet = dbSet.Where(exp);
            return dbSet;
        }

    }
}
