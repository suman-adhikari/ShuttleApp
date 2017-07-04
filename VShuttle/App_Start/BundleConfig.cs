using System.Web;
using System.Web.Optimization;

namespace VShuttle
{
    public class BundleConfig
    {
        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/jquery-2.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                        "~/Scripts/jquery.validate*"));

            bundles.Add(new ScriptBundle("~/bundles/datatable").Include(
                        "~/Scripts/DataTables/*.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryui").Include(
                        "~/Scripts/jquery-ui-1.10.3.js"));

            bundles.Add(new ScriptBundle("~/bundles/ajaxGrid").Include(
                        "~/Scripts/chart.js",
                        "~/Scripts/query.ui.timepicker.js",
                        "~/Scripts/dateTimepicker.js",
                        "~/Scripts/jquery.validationEngine.js",
                        "~/Scripts/validation.js",
                        "~/Scripts/jquery.minicolors.min.js",
                        "~/Scripts/prettify.js",
                        "~/Scripts/custom.js",
                        "~/Scripts/jquery.dataTables.min.js",
                        "~/Scripts/json2.js",
                        "~/Scripts/jquery.flot.min.js",
                        "~/Scripts/jquery.flot.resize.min.js",
                        "~/Scripts/jquery.cookie.js",
                         "~/Scripts/ajaxGrid.js"));

            bundles.Add(new ScriptBundle("~/bundles/Shared").Include(
                        "~/Scripts/Shared.js"));

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at http://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                      "~/Scripts/bootstrap.js",
                      "~/Scripts/respond.js"));

            bundles.Add(new StyleBundle("~/Content/css").Include(
                      "~/Content/bootstrap.css",
                      "~/Content/jquery-ui.css",
                      "~/Content/site.css"));

            bundles.Add(new StyleBundle("~/Content/fontawesome").Include(
                     "~/Content/font-awesome.css"));
        }
    }
}
