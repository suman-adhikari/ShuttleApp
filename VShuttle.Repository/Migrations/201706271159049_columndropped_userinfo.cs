namespace VShuttle.Repository.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class columndropped_userinfo : DbMigration
    {
        public override void Up()
        {
            DropColumn("dbo.UserInfoes", "test");
        }
        
        public override void Down()
        {
            AddColumn("dbo.UserInfoes", "test", c => c.Int(nullable: false));
        }
    }
}
