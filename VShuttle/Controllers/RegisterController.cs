using System.Web.Mvc;
using VShuttle.Model;
using VShuttle.Repository;

namespace VShuttle.Controllers
{
    public class RegisterController : Controller
    {
        UserRepository userRepository = new UserRepository();
        
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public ActionResult Index(Users users)
        {
            var IsINumberAvailabel = userRepository.CheckINumber(users.INumber);
            if (IsINumberAvailabel)
            {
                var loginData = userRepository.Add(users);
                if (loginData)
                    return RedirectToAction("Index", "Login");
                else
                    return View();
            }           
              ViewData["error"] = "iNumber is already in use";
              return View();
            
        }
    }
}