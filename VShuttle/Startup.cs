using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(VShuttle.Startup))]
namespace VShuttle
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            //ConfigureAuth(app);
        }
    }
}
