namespace VShuttle.Repository.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class newcolumnadded_userinfo : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.UserInfoes", "test", c => c.Int(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.UserInfoes", "test");
        }
    }
}
