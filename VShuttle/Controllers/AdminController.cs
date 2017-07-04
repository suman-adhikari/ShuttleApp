using System.Web.Mvc;
using VShuttle.Model;
using VShuttle.Model.ViewModel;
using VShuttle.Repository.Interface;

namespace VShuttle.Controllers
{

    [AuthorizeAdmin]
    public class AdminController : Controller
    {
              
        private readonly IRoutesRepository routeRepository;
        private readonly ILocationRepository locationRepository;
        private readonly IUserInfoRepository userInfoRepository;
            
        public AdminController(IRoutesRepository routeRepository, ILocationRepository locationRepository, IUserInfoRepository userInfoRepository)
        {
            this.routeRepository = routeRepository;
            this.locationRepository = locationRepository;
            this.userInfoRepository = userInfoRepository;
        }

        public ActionResult Index()
        {
            var routes = routeRepository.FindAll();        
            LocationRoute locationRoute = new LocationRoute();
            locationRoute.Route = routes;
            return View(locationRoute);
        }

        [HttpPost]
        public ActionResult Index(Locations location)
        {        
            
            var status = locationRepository.Add(location);          
            Session["Status"] = status ? "Success" : "Failed";
            Session["Message"] = status ? "Location Successfully Added" : "Location Addition Failed";
            return RedirectToAction("Index");
        }

        public ActionResult FindAll(AjaxModel ajaxGrid)
        {                   
            AjaxGridResult result = new AjaxGridResult();
            result.Data = locationRepository.FindAll(); ;
            result.pageNumber = ajaxGrid.pageNumber;
            result.RowCount = ajaxGrid.rowNumber;
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        public ActionResult Form(int id)
        {
            var location = locationRepository.Get(id);
            return View(location);
        }

        public ActionResult Delete(int id)
        {
            int usercount = userInfoRepository.CountLocation(id);
            if (usercount > 0)
            {

            }
            else
            {
                var status =  locationRepository.Delete(id);
                Session["Status"] = status ? "Success" : "Failed";
                Session["Message"] = status ? "Location Successfully Deleted" : "Location Deletion Failed";
            } 
            return RedirectToAction("Index");
        }

        [HttpPost]
        public ActionResult Edit(int id, string location)
        {
            Locations locations = new Locations { Id = id, Location = location };
            var status = locationRepository.Update(locations);           
            Session["Status"] = status ? "Success" : "Failed";
            Session["Message"] = status ? "Location Successfully Updated" : "Location Update Failed";
            return RedirectToAction("Index");
        }

        public ActionResult UpdateRoute(FormCollection formdata)
        {
            int id = 0;
            foreach (string route in formdata)
            {
                id++;
                routeRepository.UpdateRoutes(id, formdata[route]);
            }          
            return RedirectToAction("Index");
        }
     
    }
}