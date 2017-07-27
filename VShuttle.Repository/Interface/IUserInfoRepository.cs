using System;
using System.Collections.Generic;
using System.Data;
using System.Linq.Expressions;
using VShuttle.Model;
using VShuttle.Model.ViewModel;

namespace VShuttle.Repository.Interface
{
    public interface IUserInfoRepository: IRepo<UserInfo>
    {
  
        List<UserInfoLocation> FindAll(int offset, int rowNumber, string name);
        List<UserInfoLocation> FindAllByInumber(int offset, int rowNumber, string iNumber);
      
        int GetCount(string name);
        int GetCountByInumber(string iNumber);

        int Count(Expression<Func<UserInfo, bool>> filter = null);

        int CountLocation(int locationId);

        DataTable GetData();
        List<TotalUsers> GetTotalUser();
        List<LatLng> GetLocations(int id);   

        string GetUsedDate(string userid);
        UserInfo GetUserInfoById(string userid);       
    }
}