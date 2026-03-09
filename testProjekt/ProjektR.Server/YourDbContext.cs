using Microsoft.EntityFrameworkCore;
using ProjektR.Server.Models;

namespace ProjektR.Server
{
    public class YourDbContext : DbContext
    {
        public YourDbContext(DbContextOptions<YourDbContext> options) : base(options) { }

        public DbSet<AirQualityData> AirQualityData { get; set; }

    }
}