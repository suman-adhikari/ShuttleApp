using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Linq.Expressions;
using VShuttle.Model;
using VShuttle.Model.ViewModel;
using VShuttle.Repository.Interface;

namespace VShuttle.Repository
{
    public class UserInfoRepository : Repo<UserInfo>, IUserInfoRepository
    {
       

        public List<UserInfoLocation> FindAll(int offset, int rowNumber, string name)
        {

            var userinfo = (from userinfos in db.UserInfos
                            join route in db.Route
                            on userinfos.RouteId equals route.Id
                            where DbFunctions.TruncateTime(userinfos.Date) == DbFunctions.TruncateTime(DateTime.Now)  
                            select new UserInfoLocation
                            {
                                Id = userinfos.Id,
                                INumber = userinfos.INumber,
                                Name = userinfos.Name,
                                Route = route.RouteLocations,
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
                            join route in db.Route
                            on userinfos.RouteId equals route.Id
                            where (DbFunctions.TruncateTime(userinfos.Date) >= DbFunctions.TruncateTime(DateTime.Now) && userinfos.INumber == iNumber)
                            select new UserInfoLocation
                            {
                                Id = userinfos.Id,
                                INumber = userinfos.INumber,
                                Name = userinfos.Name,
                                Route = route.RouteLocations,
                                SubLocation = userinfos.SubLocation,
                                Date = userinfos.Date
                            }
                            );
          
            userinfo = userinfo.OrderByDescending(n => n.Id).Skip(offset).Take(rowNumber);
            return userinfo.ToList();
        }

        public int Count(Expression<Func<UserInfo, bool>> filter=null)
        {
            var query = db.UserInfos.Where(l => DbFunctions.TruncateTime(l.Date) == DbFunctions.TruncateTime(DateTime.Now));
            if(filter != null)
            {
                query.Where(filter);
            }
            return query.Count();
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

        public int CountLocation(int locationId)
        {
            return db.UserInfos.Where(l =>l.RouteId == locationId).Count();
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

            string sqlQuery = @"select r.RouteLocations as Route, count(u.RouteId) as Total from UserInfoes u
                                join Routes r on u.Routeid = r.Id
                                where  cast(u.Date as date) = cast(CURRENT_TIMESTAMP as date)
                                group by r.RouteLocations, cast(u.Date as date)";
            var Results = db.Database.SqlQuery<TotalUsers>(sqlQuery).ToList();
            return Results;
        }

        public DataTable GetData()
        {          
            DataTable dt = new DataTable();

            var userInfo = (from userinfo in db.UserInfos
                            join route in db.Route
                            on userinfo.RouteId equals route.Id
                            where DbFunctions.TruncateTime(userinfo.Date) == DbFunctions.TruncateTime(DateTime.Now)
                            select new
                            {
                                Id = userinfo.Id,                                
                                Name = userinfo.Name,
                                Route = route.RouteLocations,
                                Total = "",
                                SubLocation = userinfo.SubLocation,
                                Date = userinfo.Date
                            }).OrderBy(l=>l.Route);

        
            dt.Columns.Add("Id");
            dt.Columns.Add("Name");
            dt.Columns.Add("Route");
            dt.Columns.Add("Total");
            dt.Columns.Add("Location");
            dt.Columns.Add("Date");

            foreach (var item in userInfo.ToList())
            {
                dt.Rows.Add(item.Id, item.Name, item.Route, "", item.SubLocation, item.Date);
            }            
            return dt;
        }

        public string FindLocationByLatLng(string lat,string lng) {
            var query = from userinfo in db.UserInfos
                        where userinfo.Latitude.StartsWith(lat) && userinfo.Longitude.StartsWith(lng)
                        select userinfo.SubLocation;
            if(query.Count()>0)
               return query.First();
            return "NotFound";
        }

        public List<LatLngLocation> FindTodaysAllLocation() {
            var query = (from userinfo in db.UserInfos
                        where DbFunctions.TruncateTime(userinfo.Date) == DbFunctions.TruncateTime(DateTime.Now)
                        select new LatLngLocation {
                            Latitude = userinfo.Latitude,
                            Longitude = userinfo.Longitude,
                            Location = userinfo.SubLocation
                        });

            return query.ToList();
        }

        public List<LatLng> GetLocations(int routeid)
        {

            var query = (from userinfo in db.UserInfos
                         where DbFunctions.TruncateTime(userinfo.Date) == DbFunctions.TruncateTime(DateTime.Now)
                         && userinfo.RouteId == routeid
                         select new LatLng
                         {
                             Latitude = userinfo.Latitude,
                             Longitude = userinfo.Longitude
                         });

            return query.ToList();

        }

        public List<AllLocation> GetAllLocations()
        {

            var query = (from userinfo in db.UserInfos
                         where DbFunctions.TruncateTime(userinfo.Date) == DbFunctions.TruncateTime(DateTime.Now)
                         select new AllLocation
                         {
                             Latitude = userinfo.Latitude,
                             Longitude = userinfo.Longitude,
                             RouteId = userinfo.RouteId
                         });

            return query.ToList();

        }
        
    }
}
