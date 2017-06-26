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
           
                var loginData = userRepository.CheckUser(users);
                if (loginData != null)
                {
                    Session["Id"] = loginData.Id;
                    Session["UserId"] = loginData.INumber;
                    Session["UserName"] = loginData.UserName;
                    Session["UserRole"] = loginData.UserRole;
                    if(loginData.UserRole==1)
                      return RedirectToAction("Index", "Admin");
                    return RedirectToAction("Index", "Home");
                }
                ViewData["error"] = "Invalid username or password !!!";
            
            return View();
        }    
       
    }
}