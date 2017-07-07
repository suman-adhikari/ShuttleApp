using System.Web.Mvc;
using VShuttle.Model;
using VShuttle.Model.ViewModel;
using System;
using System.Collections.Generic;
using VShuttle.Repository.Interface;
using ClosedXML.Excel;

namespace VShuttle.Controllers
{
    public class HomeController : Controller
    {

        private readonly IUserInfoRepository userInfoRepository;
        private readonly IRoutesRepository routesRepository;
        private readonly ILocationRepository locationRepository;
        private static string UserId = "";


        public HomeController(IUserInfoRepository userInfoRepository, IRoutesRepository routesRepository, ILocationRepository locationRepository)
        {
            this.userInfoRepository = userInfoRepository;
            this.routesRepository = routesRepository;
            this.locationRepository = locationRepository;

        }

        public ActionResult Index()
        {

            UserId = Session["Id"] != null ? Session["Id"].ToString() : "";
            RouteUserinfo routeUserinfo = new RouteUserinfo();
            var userinfo = new UserInfo();
            var usedDate = "empty";
            var locationList = locationRepository.FindAll();
            var routes = routesRepository.FindAll();
            if (UserId != "")
            {
                userinfo = userInfoRepository.GetUserInfoById(UserId);
                usedDate = userInfoRepository.GetUsedDate(UserId);
            }

            ViewBag.UsedDate = usedDate;
            ViewBag.location = locationList;
            routeUserinfo.Routes = routes;
            routeUserinfo.UserInfo = userinfo;

            return View(routeUserinfo);
        }

        [HttpPost]
        public ActionResult Index(UserInfo userInfo, string days)
        {
            var status = false;
            var successAction = "Added";
            var FailedAction = "Addition";
            if (userInfo.Id > 0)
            {
                status = userInfoRepository.Update(userInfo);
                successAction = "Updated";
                FailedAction = "Update";
            }
            else
            {
                var date = DateTime.Now;
                while (date.DayOfWeek.ToString() != "Monday")
                {
                    date = date.AddDays(-1);
                }
                var day = days.Trim().Split(' ');
                foreach (var item in day)
                {
                    userInfo.Date = date.AddDays(Convert.ToInt32(item));
                    userInfo.INumber = UserId;
                    status = userInfoRepository.Add(userInfo);
                }
            }

            Session["Status"] = status ? "Success" : "Failed";
            Session["Message"] = status ? "UserInfo Successfully " + successAction + "" : "UserInfo " + FailedAction + " Failed";

            return RedirectToAction("Index");
        }

        public ActionResult FindAll(int offset, int rowNumber, string sortExpression, string sortOrder, int pageNumber, string Name = "")
        {

            List<UserInfoLocation> userdata;
            int count = 0;

            if (UserId != "")
            {
                userdata = userInfoRepository.FindAllByInumber(offset, rowNumber, UserId);
                count = userInfoRepository.GetCountByInumber(UserId);
                //var c1 = userInfoRepository.Count(UserId);

            }
            else
            {
                userdata = userInfoRepository.FindAll(offset, rowNumber, Name);
                count = userInfoRepository.GetCount(Name);
                //var c = userInfoRepository.Count(Name);
            }

            AjaxGridResult result = new AjaxGridResult();
            result.Data = userdata;
            result.pageNumber = pageNumber;
            result.RowCount = count;
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        public ActionResult Form(int id)
        {
            var userinfo = userInfoRepository.Get(id);
            var location = locationRepository.FindAll();
            ViewBag.location = location;
            return View(userinfo);
        }

        public ActionResult Delete(int id) {
            var status = userInfoRepository.Delete(id);
            Session["Status"] = status ? "Success" : "Failed";
            Session["Message"] = status ? "UserInfo Successfully Deleted" : "UserInfo Deletion Failed";
            return RedirectToAction("Index");
        }

        public ActionResult FindAllTotal(AjaxModel ajaxGrid)
        {
            var totalUsers = userInfoRepository.GetTotalUser();
            AjaxGridResult result = new AjaxGridResult();
            result.Data = totalUsers;
            result.pageNumber = ajaxGrid.pageNumber;
            result.RowCount = ajaxGrid.rowNumber;
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        public ActionResult ExportToExcel()
        {
       
            string fileName = "VShuttle " + DateTime.Now.ToLongTimeString().Replace(":", "").Replace(" ", "") + ".xlsx";
            string path =  Server.MapPath("~")+"exports\\"+fileName;                 
            var table = userInfoRepository.GetData();
            var WorkBook = new XLWorkbook();
            var WorkSheet = WorkBook.Worksheets.Add("Sheet 1");
            int TotalColumns = table.Columns.Count;

            for (int i = 1; i < table.Columns.Count + 1; i++)
            {
                WorkSheet.Cell(1, i).Value = table.Columns[i - 1].ColumnName;
            }

            WorkSheet.Style
                .Alignment.SetHorizontal(XLAlignmentHorizontalValues.Center)
                .Alignment.SetVertical(XLAlignmentVerticalValues.Center);


            int count = 1;
            string previousValue = "";
            IXLRange range_total = null;
            for (int j = 0; j < table.Rows.Count; j++)
            {
                for (int k = 0; k < table.Columns.Count; k++)
                {                 
                    var newValue = table.Rows[j].ItemArray[k].ToString();
                    if (k + 1 == 3)
                    {
                        if (newValue == previousValue)
                        {
                            count++;
                            var range = WorkSheet.Range("C" + (j-(count-2)+1) + ":C" + (j+2));
                            range_total = WorkSheet.Range("D" + (j-(count-2)+1) + ":D" + (j+2));
                            range.Merge();
                            range_total.Merge();                            

                        }
                        else
                        {
                            if (count > 1)
                            {
                                 range_total.Value = count;                               
                            }
                            count = 1;
                        }
                        if(j== table.Rows.Count - 1)
                        {
                            range_total.Value = count;
                            var right = WorkSheet.Range("A" + (table.Rows.Count + 2) + ":C" + (table.Rows.Count + 2));
                            var left = WorkSheet.Range("D" + (table.Rows.Count + 2) + ":F" + (table.Rows.Count + 2));
                            right.Merge().Value = "Total";
                            left.Merge().Value = table.Rows.Count;                   
                        }

                        previousValue = table.Rows[j].ItemArray[k].ToString();

                    }
                    var value = table.Rows[j].ItemArray[k].ToString();
                    WorkSheet.Cell(j + 2, k + 1).Value = value==""?"1":value;
                }
            }

            WorkSheet.Columns().Width = 20;
            WorkSheet.Rows().Height = 20;

            var rngData = WorkSheet.Range(WorkSheet.FirstCellUsed(), WorkSheet.LastCellUsed());
            var AllCell = rngData.Cells(c => c.Value != "");
            AllCell.ForEach(c => c.Style.Fill.BackgroundColor = XLColor.WhiteSmoke);
            AllCell.ForEach(c => c.Style.Border.OutsideBorder = XLBorderStyleValues.Thin);
            AllCell.ForEach(c => c.Style.Border.OutsideBorderColor = XLColor.Gray);

            var totalRange = WorkSheet.Range("A" + (table.Rows.Count + 2) + ":F" + (table.Rows.Count + 2));
            totalRange.Style.Fill.BackgroundColor = XLColor.BlueGray;
            totalRange.Style.Font.FontColor = XLColor.White;

            var header = WorkSheet.Cells("A1:F1");
            header.Style.Fill.BackgroundColor = XLColor.BlueGray;
            header.Style.Font.FontColor = XLColor.White;

            WorkBook.SaveAs(path);

            Response.Buffer = true;
            Response.ContentType = "application/vnd.ms-excel";
            Response.AddHeader("Content-Disposition", "attachment;filename=\"" + fileName + "\"");
            Response.TransmitFile(path);
            Response.End();
            System.IO.File.Delete(path);

            if (table.Rows.Count > 0)
            {
                Session["Status"] = "Success";
                Session["Message"] = "UserInfo Successfully Exported to Excel";
            }
            return RedirectToAction("Index","Home");
        }
    }
}