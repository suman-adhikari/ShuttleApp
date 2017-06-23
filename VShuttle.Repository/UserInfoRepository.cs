using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using VShuttle.Model;
using VShuttle.Model.ViewModel;

namespace VShuttle.Repository
{
    public class UserInfoRepository : Repo
    {
        public bool Add(UserInfo userInfo, int id)
        {
            userInfo.Date = DateTime.Now;
            userInfo.UserId = id;
            db.UserInfos.Add(userInfo);
            db.SaveChanges();
            return false;
        }

        public List<UserInfoLocation> FindAll()
        {

            var userinfo = (from userinfos in db.UserInfos
                            join loc in db.Locations
                            on userinfos.Location equals loc.Id                                               
                            select new UserInfoLocation
                            {
                                Id = userinfos.Id,
                                UserId = userinfos.UserId,
                                Name = userinfos.Name,
                                Location = loc.Location,
                                SubLocation = userinfos.SubLocation,
                                Date = userinfos.Date
                            }
                            );

            return userinfo.ToList();
        }

        public UserInfo Get(int id)
        {
            return db.UserInfos.FirstOrDefault(Model => Model.Id == id);
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
                                group by l.Location, cast(u.Date as date)";
            var Results = db.Database.SqlQuery<TotalUsers>(sqlQuery).ToList();
            return Results;
        }

        public DataSet GetData()
        {
            DataSet ds = new DataSet();
            DataTable dt = new DataTable();

            List<UserInfo> userInfo = new List<UserInfo>() {
                new UserInfo{ Id=1, UserId=1, Name="Abc",  Location=1,  SubLocation="subloc",   Date=DateTime.Now},
                new UserInfo{ Id=2, UserId=2, Name="Abc1", Location=1, SubLocation="subloc1",  Date=DateTime.Now},
                new UserInfo{ Id=2, UserId=2, Name="Abc1", Location=1, SubLocation="subloc1",  Date=DateTime.Now},
                new UserInfo{ Id=2, UserId=2, Name="Abc1", Location=1, SubLocation="subloc1",  Date=DateTime.Now},
                new UserInfo{ Id=2, UserId=2, Name="Abc1", Location=1, SubLocation="subloc1",  Date=DateTime.Now},
                new UserInfo{ Id=2, UserId=2, Name="Abc1", Location=1, SubLocation="subloc1",  Date=DateTime.Now},
                new UserInfo{ Id=2, UserId=2, Name="Abc1", Location=1, SubLocation="subloc1",  Date=DateTime.Now},
                new UserInfo{ Id=2, UserId=2, Name="Abc1", Location=1, SubLocation="subloc1",  Date=DateTime.Now},
                new UserInfo{ Id=3, UserId=3, Name="Abc2", Location=1, SubLocation="subloc2",  Date=DateTime.Now},
                new UserInfo{ Id=4, UserId=4, Name="Abc3", Location=1, SubLocation="subloc3",  Date=DateTime.Now},
                new UserInfo{ Id=4, UserId=4, Name="Abc3", Location=1, SubLocation="subloc3",  Date=DateTime.Now},
                new UserInfo{ Id=4, UserId=4, Name="Abc3", Location=1, SubLocation="subloc3",  Date=DateTime.Now},
                new UserInfo{ Id=4, UserId=4, Name="Abc3", Location=1, SubLocation="subloc3", Date=DateTime.Now},
                new UserInfo{ Id=4, UserId=4, Name="Abc3", Location=1, SubLocation="subloc3", Date=DateTime.Now}

            };

            dt.Columns.Add("Id");
            dt.Columns.Add("UserId");
            dt.Columns.Add("Name");
            dt.Columns.Add("Location");
            dt.Columns.Add("Total");
            dt.Columns.Add("SubLocation");
            dt.Columns.Add("Date");

            foreach (var item in userInfo)
            {
                dt.Rows.Add(item.Id, item.UserId, item.Name, item.Location, "", item.SubLocation, item.Date);
            }
            ds.Tables.Add(dt);
            return ds;
        }

    }
}
