using System;
using System.DirectoryServices.AccountManagement;
using System.Web.Mvc;
using VShuttle.Model;
using System.Configuration;



namespace VShuttle.Controllers
{
    public class LoginController : Controller
    {

        // GET: Admin
        public ActionResult Index()
        {
            if (Session["Id"] != null)
                return RedirectToAction("Index", "Home");
            return View();
        }
     
        [HttpPost]
        public ActionResult Index(Users users)
        {
           
            PrincipalContext ctx = new PrincipalContext(ContextType.Domain);
            bool isValid = ctx.ValidateCredentials(users.INumber, users.Password);
            UserPrincipal user = UserPrincipal.FindByIdentity(ctx, users.INumber);
            var admin = ConfigurationManager.AppSettings["AdminINumber"];
            if (isValid)
            {               
                string INumber = users.INumber;
                Session["Id"] = INumber;
                Session["UserName"] = user.Name;
                if(INumber == admin) 
                    Session["UserRole"] = 1;
                else
                    Session["UserRole"] = 2;
                if(Convert.ToInt32(Session["UserRole"]) == 1)
                    return RedirectToAction("Index", "Home");
                 return RedirectToAction("Index", "Home");
            }
            ViewData["error"] = "Invalid username or password !!!";
            return View();
        }

    }
}