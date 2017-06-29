using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using VShuttle.Model;
using VShuttle.Model.ViewModel;

namespace VShuttle.Repository
{
    public class UserInfoRepository : Repo
    {
        public bool Add(UserInfo userInfo)
        {
            db.UserInfos.Add(userInfo);
            db.SaveChanges();
            return false;
        }

        public List<UserInfoLocation> FindAll(int offset, int rowNumber, string name)
        {

            var userinfo = (from userinfos in db.UserInfos
                            join loc in db.Locations
                            on userinfos.Location equals loc.Id
                            where DbFunctions.TruncateTime(userinfos.Date) == DbFunctions.TruncateTime(DateTime.Now)  
                            select new UserInfoLocation
                            {
                                Id = userinfos.Id,
                                INumber = userinfos.INumber,
                                Name = userinfos.Name,
                                Location = loc.Location,
                                SubLocation = userinfos.SubLocation,
                                Date = userinfos.Date
                            }
                            );

            if (name != "")
            {
                userinfo = userinfo.Where(n => n.Name.Contains(name));
            }
            userinfo = userinfo.OrderByDescending(n=>n.Id).Skip(offset).Take(rowNumber);
            return userinfo.ToList();
        }

        public List<UserInfoLocation> FindAllByInumber(int offset, int rowNumber, string iNumber)
        {

            var userinfo = (from userinfos in db.UserInfos
                            join loc in db.Locations
                            on userinfos.Location equals loc.Id
                            where (DbFunctions.TruncateTime(userinfos.Date) >= DbFunctions.TruncateTime(DateTime.Now) && userinfos.INumber== iNumber)
                            select new UserInfoLocation
                            {
                                Id = userinfos.Id,
                                INumber = userinfos.INumber,
                                Name = userinfos.Name,
                                Location = loc.Location,
                                SubLocation = userinfos.SubLocation,
                                Date = userinfos.Date
                            }
                            );
          
            userinfo = userinfo.OrderByDescending(n => n.Id).Skip(offset).Take(rowNumber);
            return userinfo.ToList();
        }

        

        public int GetCount(string name)
        {   
            if(name!="")
                return db.UserInfos.Where(l=> DbFunctions.TruncateTime(l.Date) == DbFunctions.TruncateTime(DateTime.Now)).Count(n=>n.Name.Contains(name));
            return db.UserInfos.Where(l => DbFunctions.TruncateTime(l.Date) == DbFunctions.TruncateTime(DateTime.Now)).Count();
        }

        public int GetCountByInumber(string iNumber)
        {       
            return db.UserInfos.Where(l => DbFunctions.TruncateTime(l.Date) >= DbFunctions.TruncateTime(DateTime.Now) && l.INumber==iNumber ).Count();
        }

        

        public UserInfo Get(int id)
        {
            return db.UserInfos.FirstOrDefault(Model => Model.Id == id);
        }

        public UserInfo GetUserInfoById(string userid)
        {
            return db.UserInfos.FirstOrDefault(m => m.INumber == userid && DbFunctions.TruncateTime(m.Date) == DbFunctions.TruncateTime(DateTime.Now));
        }

        public string GetUsedDate(string userid)
        {
            var x = db.UserInfos.Where(m => m.INumber == userid && DbFunctions.TruncateTime(m.Date) >= DbFunctions.TruncateTime(DateTime.Now))
                                 .Select(m=>m.Date.Day).ToArray();
            return string.Join(",",x);
        }


        public bool Delete(int id)
        {
            var UserInfo = db.UserInfos.FirstOrDefault(Models => Models.Id == id);
            db.UserInfos.Remove(UserInfo);
            db.SaveChanges();
            return true;
        }

        public bool Update(UserInfo userInfo)
        {
            var userInfos = db.UserInfos.FirstOrDefault(Models => Models.Id == userInfo.Id);
            userInfos.Name = userInfo.Name;
            userInfos.Location = userInfo.Location;
            userInfos.SubLocation = userInfo.SubLocation;
            userInfos.Date = userInfo.Date;
            db.SaveChanges();
            return true;
        }

        public List<TotalUsers> GetTotalUser()
        {
            //var totalUser = from userInfo in db.UserInfos
            //                 join loc in db.Locations
            //                 on userInfo.Location equals loc.Id
            //                 group userInfo by new { loc.Location, userInfo.Date } into g
            //                 select new
            //                 {

            //                     Location1 = g.Key.Location,
            //                     Total = g.Count(userInfo => userInfo.Location)

            //                 };                     

            string sqlQuery = @"select l.Location, count(u.Location) as Total from UserInfoes u
                                join Locations l on u.Location = l.Id
                                where  cast(u.Date as date) = cast(CURRENT_TIMESTAMP as date)
                                group by l.Location, cast(u.Date as date)";
            var Results = db.Database.SqlQuery<TotalUsers>(sqlQuery).ToList();
            return Results;
        }

        public DataSet GetData()
        {
            DataSet ds = new DataSet();
            DataTable dt = new DataTable();

            var userInfo = (from userinfo in db.UserInfos
                            join loc in db.Locations
                            on userinfo.Location equals loc.Id
                            where DbFunctions.TruncateTime(userinfo.Date) == DbFunctions.TruncateTime(DateTime.Now)
                            select new
                            {
                                Id = userinfo.Id,                                
                                Name = userinfo.Name,
                                Location = loc.Location,
                                Total = "",
                                SubLocation = userinfo.SubLocation,
                                Date = userinfo.Date
                            }).OrderBy(l=>l.Location);

          //List<UserInfo> userInfo = new List<UserInfo>() {
          //    new UserInfo{ Id=1, UserId=1, Name="Abc",  Location=1,  SubLocation="subloc",   Date=DateTime.Now},
          //    new UserInfo{ Id=2, UserId=2, Name="Abc1", Location=1, SubLocation="subloc1",  Date=DateTime.Now},
          //    new UserInfo{ Id=2, UserId=2, Name="Abc1", Location=1, SubLocation="subloc1",  Date=DateTime.Now},
          //    new UserInfo{ Id=2, UserId=2, Name="Abc1", Location=2, SubLocation="subloc1",  Date=DateTime.Now},
          //    new UserInfo{ Id=2, UserId=2, Name="Abc1", Location=2, SubLocation="subloc1",  Date=DateTime.Now}          
          //};

          dt.Columns.Add("Id");
            dt.Columns.Add("Name");
            dt.Columns.Add("Location");
            dt.Columns.Add("Total");
            dt.Columns.Add("SubLocation");
            dt.Columns.Add("Date");

            foreach (var item in userInfo.ToList())
            {
                dt.Rows.Add(item.Id, item.Name, item.Location, "", item.SubLocation, item.Date);
            }
            ds.Tables.Add(dt);
            return ds;
        }

    }
}
