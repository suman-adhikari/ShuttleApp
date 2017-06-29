using System.Collections.Generic;
using System.Data;
using VShuttle.Model;
using VShuttle.Model.ViewModel;

namespace VShuttle.Repository.Interface
{
    public interface IUserInfoRepository
    {
        bool Add(UserInfo userInfo);
        bool Delete(int id);
        List<UserInfoLocation> FindAll(int offset, int rowNumber, string name);
        List<UserInfoLocation> FindAllByInumber(int offset, int rowNumber, string iNumber);
        UserInfo Get(int id);
        int GetCount(string name);
        int GetCountByInumber(string iNumber);
        DataSet GetData();
        List<TotalUsers> GetTotalUser();
        string GetUsedDate(string userid);
        UserInfo GetUserInfoById(string userid);
        bool Update(UserInfo userInfo);
    }
}