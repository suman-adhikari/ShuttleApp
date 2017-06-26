using System.Web.Mvc;
using VShuttle.Model;
using VShuttle.Model.ViewModel;
using VShuttle.Repository;
using Excel = Microsoft.Office.Interop.Excel;
using System.Data;
using System.Drawing;
using System;
using System.Runtime.InteropServices;

namespace VShuttle.Controllers
{
    public class HomeController : Controller
    {
      
        UserInfoRepository userInfoRepository = new UserInfoRepository();
        LocationRepository locationRepository = new LocationRepository();
        RoutesRepository routeRepository = new RoutesRepository();

        public ActionResult Index()
        {
           RouteUserinfo routeUserinfo = new RouteUserinfo();
           var locationList = locationRepository.FindAllLocation();
           var routes = routeRepository.FindAll();       
           ViewBag.location = locationList;
           routeUserinfo.Routes = routes;
           routeUserinfo.UserInfo = new UserInfo();     
           return View(routeUserinfo);
        }

        [HttpPost]
        public ActionResult Index(UserInfo userInfo)
        {
            if (userInfo.Id > 0)
                userInfoRepository.Update(userInfo);
            else
                userInfoRepository.Add(userInfo, Convert.ToInt32(Session["Id"]));  
            return RedirectToAction("Index"); 
        }

        public ActionResult FindAll(int offset, int rowNumber, string sortExpression, string sortOrder, int pageNumber, string Name="")
        {

            AjaxGridResult result = new AjaxGridResult();
            result.Data = userInfoRepository.FindAll(offset, rowNumber, Name);
            result.pageNumber = pageNumber;
            result.RowCount = userInfoRepository.GetCount(Name);
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        public ActionResult Form(int id)
        {
            var userinfo = userInfoRepository.Get(id);
            var location = locationRepository.FindAll();            
            ViewBag.location= location;
            return View(userinfo);
        }

        public ActionResult Delete(int id) {
            userInfoRepository.Delete(id);
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
            
            Excel.Application excelApp = new Excel.Application();
            Excel.Workbook excelWorkBook;
            Excel.Worksheet excelWorkSheet;
            object misValue = System.Reflection.Missing.Value;
            excelWorkBook = excelApp.Workbooks.Add(misValue);
            Excel.Range range;
            excelApp.DisplayAlerts = false;

            string location = DateTime.Now.ToLongTimeString().Replace(":", "").Replace(" ", "") + ".xlsx";
            excelWorkBook.SaveAs(@"E:\"+location+"");

            Excel.Style headerStyle = excelWorkBook.Styles.Add("NewStyle");
            headerStyle.Font.Size = 10;
            excelWorkBook.InactiveListBorderVisible = true;
            headerStyle.HorizontalAlignment = Excel.XlHAlign.xlHAlignCenter;
            headerStyle.Font.Color = ColorTranslator.ToOle(Color.White);
            headerStyle.Interior.Color =ColorTranslator.ToOle(Color.Gray);
            headerStyle.Interior.Pattern = Excel.XlPattern.xlPatternSolid;
            

            excelWorkSheet = excelWorkBook.Sheets.Add();
            range = excelWorkSheet.get_Range("A1", "G1");
            range.Style = "NewStyle";
            range.Columns.AutoFit();
            range.Resize.RowHeight = 20;
            range.Borders.Color = Color.Black;
           

            excelWorkSheet.Columns.EntireColumn.HorizontalAlignment = Excel.XlHAlign.xlHAlignCenter;
            excelWorkSheet.Columns.EntireColumn.VerticalAlignment = Excel.XlHAlign.xlHAlignCenter;

            for (int i = 3; i <= 7; i++)
            {
                excelWorkSheet.Columns[i].ColumnWidth = 15;             
            }
           
            var ds = userInfoRepository.GetData();
            string previousValue = "";

            foreach (DataTable table in ds.Tables)
            {              

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
                         if (k+1==3)

                        {                         
                            if(newValue == previousValue){
                                count++;                             
                                Excel.Range r = excelWorkSheet.Range[excelWorkSheet.Cells[j + 2 - 1, k + 1], excelWorkSheet.Cells[j + 2, k + 1]];
                                Excel.Range total = excelWorkSheet.Range[excelWorkSheet.Cells[j + 2 - 1, k + 2], excelWorkSheet.Cells[j + 2, k + 2]];
                                r.Merge(Type.Missing);
                                total.Merge(Type.Missing);
                                total.Value = "replace";
                                if (j== table.Rows.Count-1)
                                   excelWorkSheet.Cells.Replace("replace", count);
                                
                            }
                            else
                            {                                                            
                                excelWorkSheet.Cells.Replace("replace", count);
                                excelWorkSheet.Cells.Replace("", 1);
                                //excelWorkSheet.Cells[NoResetCount, 7] =  count;                                                                                                                             
                                count = 1;
                            }
                            
                            previousValue = table.Rows[j].ItemArray[k].ToString();
                        }
                        if (j== table.Rows.Count-1)
                        {
                            excelWorkSheet.Cells.Replace("", count);
                           
                            Excel.Range finalTotal = excelWorkSheet.Range[excelWorkSheet.Cells[j + 3, 1], excelWorkSheet.Cells[j + 3, 7]];
                            Excel.Range finalTotalLeft = excelWorkSheet.Range[excelWorkSheet.Cells[j + 3, 1], excelWorkSheet.Cells[j + 3, 4]];
                            Excel.Range finalTotalRight = excelWorkSheet.Range[excelWorkSheet.Cells[j + 3, 5], excelWorkSheet.Cells[j + 3, 7]];
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
            }

            excelWorkBook.Save();
            excelWorkBook.Close(true,misValue,misValue);
            excelApp.Quit();
            Marshal.ReleaseComObject(excelApp);

            return RedirectToAction("Index","Home");
        }
    }
}