using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using VShuttle.Model;
using VShuttle.Model.ViewModel;
using VShuttle.Repository;
using VShuttle.Repository.Interface;

namespace VShuttle.Controllers
{

    [AuthorizeAdmin]
    public class AdminController : Controller
    {
              
        private readonly IRoutesRepository routeRepository;
        private readonly ILocationRepository locationRepository;
            
        public AdminController(IRoutesRepository routeRepository, ILocationRepository locationRepository)
        {
            this.routeRepository = routeRepository;
            this.locationRepository = locationRepository;
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
            locationRepository.Add(location);        
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

        public ActionResult Form(int id) {
            var location = locationRepository.Get(id);
            return View(location);
        }

        public ActionResult Delete(int id)
        {
            locationRepository.Delete(id);
            return RedirectToAction("Index");
        }

        public ActionResult Edit(int id,string location)
        {
            locationRepository.Update(id, location);
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