using System;

namespace ProjektR.Server.Models
{
    public class AirQualityData
    {
        public int id { get; set; }
        public DateTime Timestamp { get; set; }
        public String CO2 { get; set; }
        public String Ozone { get; set; }
        public String TVOC { get; set; }
    }
}