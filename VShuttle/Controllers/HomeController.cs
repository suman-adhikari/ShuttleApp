using System.Web.Mvc;
using VShuttle.Model;
using VShuttle.Model.ViewModel;
using Excel = Microsoft.Office.Interop.Excel;
using System.Drawing;
using System;
using System.Runtime.InteropServices;
using System.Collections.Generic;
using VShuttle.Repository.Interface;
using Microsoft.Win32;

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
            string location = Registry.GetValue(@"HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Explorer\Shell Folders", "{374DE290-123F-4565-9164-39C4925E467B}", string.Empty).ToString();
            Excel.Application excelApp = new Excel.Application();
            Excel.Workbook excelWorkBook;
            Excel.Worksheet excelWorkSheet;
            object misValue = System.Reflection.Missing.Value;
            excelWorkBook = excelApp.Workbooks.Add(misValue);
            Excel.Range range;
            excelApp.DisplayAlerts = false;
           
            string fileName = "VShuttle " + DateTime.Now.ToLongTimeString().Replace(":", "").Replace(" ", "") + ".xlsx";
            string path =  Server.MapPath("~")+"exports\\"+fileName;
            excelWorkBook.SaveAs(path);

            Excel.Style headerStyle = excelWorkBook.Styles.Add("NewStyle");
            headerStyle.Font.Size = 10;
            excelWorkBook.InactiveListBorderVisible = true;
            headerStyle.HorizontalAlignment = Excel.XlHAlign.xlHAlignCenter;
            headerStyle.Font.Color = ColorTranslator.ToOle(Color.White);
            headerStyle.Interior.Color = ColorTranslator.ToOle(Color.Gray);
            headerStyle.Interior.Pattern = Excel.XlPattern.xlPatternSolid;


            excelWorkSheet = excelWorkBook.Sheets.Add();
            range = excelWorkSheet.get_Range("A1", "F1");
            range.Style = "NewStyle";
            range.Columns.ColumnWidth = 20;
            range.Resize.RowHeight = 20;
            range.Borders.Color = Color.Black;

            excelWorkSheet.Columns.EntireColumn.HorizontalAlignment = Excel.XlHAlign.xlHAlignCenter;
            excelWorkSheet.Columns.EntireColumn.VerticalAlignment = Excel.XlHAlign.xlHAlignCenter;


            var table = userInfoRepository.GetData();
            string previousValue = "";


            for (int i = 1; i < table.Columns.Count + 1; i++)
            {
                excelWorkSheet.Cells[1, i] = table.Columns[i - 1].ColumnName;
            }

            int count = 1;

            for (int j = 0; j < table.Rows.Count; j++)
            {
                for (int k = 0; k < table.Columns.Count; k++)
                {
                    string newValue = table.Rows[j].ItemArray[k].ToString();
                    if (k + 1 == 3)

                    {
                        if (newValue == previousValue) {
                            count++;
                            Excel.Range r = excelWorkSheet.Range[excelWorkSheet.Cells[j + 2 - 1, k + 1], excelWorkSheet.Cells[j + 2, k + 1]];
                            Excel.Range total = excelWorkSheet.Range[excelWorkSheet.Cells[j + 2 - 1, k + 2], excelWorkSheet.Cells[j + 2, k + 2]];
                            r.Merge(Type.Missing);
                            total.Merge(Type.Missing);
                            total.Value = "replace";
                            if (j == table.Rows.Count - 1)
                                excelWorkSheet.Cells.Replace("replace", count);

                        }
                        else
                        {
                            excelWorkSheet.Cells.Replace("replace", count);
                            excelWorkSheet.Cells.Replace("", 1);
                            count = 1;
                        }

                        previousValue = table.Rows[j].ItemArray[k].ToString();
                    }
                    if (j == table.Rows.Count - 1)
                    {
                        excelWorkSheet.Cells.Replace("", count);

                        Excel.Range finalTotal = excelWorkSheet.Range[excelWorkSheet.Cells[j + 3, 1], excelWorkSheet.Cells[j + 3, 6]];
                        Excel.Range finalTotalLeft = excelWorkSheet.Range[excelWorkSheet.Cells[j + 3, 1], excelWorkSheet.Cells[j + 3, 4]];
                        Excel.Range finalTotalRight = excelWorkSheet.Range[excelWorkSheet.Cells[j + 3, 5], excelWorkSheet.Cells[j + 3, 6]];
                        finalTotalLeft.Merge(Type.Missing);
                        finalTotalRight.Merge(Type.Missing);
                        finalTotalLeft.Value = "Total";
                        finalTotalRight.Value = j + 1;

                        finalTotal.Style = "NewStyle";
                        finalTotal.Resize.RowHeight = 20;
                        finalTotal.Borders.Color = Color.Black;
                        finalTotal.EntireColumn.HorizontalAlignment = Excel.XlHAlign.xlHAlignCenter;
                        finalTotal.EntireColumn.VerticalAlignment = Excel.XlHAlign.xlHAlignCenter;
                    }
                    excelWorkSheet.Cells[j + 2, k + 1] = newValue;
                }
            }


            excelWorkBook.Save();
            excelWorkBook.Close(true, misValue, misValue);
            excelApp.Quit();
            Marshal.ReleaseComObject(excelApp);

            Response.Buffer = true;
            Response.ContentType = "application/vnd.ms-excel";
            Response.AddHeader("Content-Disposition", "attachment;filename=\"" + fileName + "\"");
            Response.TransmitFile(path);
            Response.End();
            //System.IO.File.Delete(path);

            if (table.Rows.Count > 0)
            {
                Session["Status"] = "Success";
                Session["Message"] = "UserInfo Successfully Exported to Excel";
            }
            return RedirectToAction("Index","Home");
        }
    }
}