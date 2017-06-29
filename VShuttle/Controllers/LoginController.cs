using System;
using System.Configuration;
using System.DirectoryServices;
using System.DirectoryServices.AccountManagement;
using System.Web.Mvc;
using VShuttle.Model;
using VShuttle.Repository;

namespace VShuttle.Controllers
{
    public class LoginController : Controller
    {
        UserRepository userRepository = new UserRepository();
        // GET: Admin
        public ActionResult Index()
        {
            return View();
        }
     
        [HttpPost]
        public ActionResult Index(Users users)
        {
           
            PrincipalContext ctx = new PrincipalContext(ContextType.Domain);
            bool isValid = ctx.ValidateCredentials(users.INumber, users.Password);
            UserPrincipal user = UserPrincipal.FindByIdentity(ctx, users.INumber);
            if (isValid)
            {               
                string INumber = users.INumber;
                Session["Id"] = INumber;
                Session["UserName"] = user.Name;
                if(INumber == "i10244") 
                    Session["UserRole"] = 1;
                else
                    Session["UserRole"] = 2;
                if(Convert.ToInt32(Session["UserRole"]) == 1)
                    return RedirectToAction("Index", "Admin");
                 return RedirectToAction("Index", "Home");
            }
            ViewData["error"] = "Invalid username or password !!!";
            return View();

            //string domain = ConfigurationManager.AppSettings["Domain"];
            //string path = ConfigurationManager.AppSettings["DomainPath"];
            //string username = "";
            //string password = "";
            //string domainAndUsername = domain + @"\" + username;
            //DirectoryEntry entry = new DirectoryEntry(path, domainAndUsername,password);
            //var loginData = userRepository.CheckUser(users);
            //if (loginData != null)
            //{
            //    Session["Id"] = loginData.Id;
            //    Session["UserId"] = loginData.INumber;
            //    Session["UserName"] = loginData.UserName;
            //    Session["UserRole"] = loginData.UserRole;
            //    if(loginData.UserRole==1)
            //      return RedirectToAction("Index", "Admin");
            //    return RedirectToAction("Index", "Home");
            //}
            //

        }

    }
}