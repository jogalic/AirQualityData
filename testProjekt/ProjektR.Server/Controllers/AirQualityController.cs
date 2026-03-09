using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using System.Linq;
using ProjektR.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace ProjektR.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AirQualityController : ControllerBase
    {
        private readonly YourDbContext _context;
        private readonly ILogger<AirQualityController> _logger;

        public AirQualityController(YourDbContext context, ILogger<AirQualityController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpGet("{isoDateTime}")]
        public async Task<ActionResult<object>> GetAirQualityData(DateTime isoDateTime)
        {
            try
            {
                _logger.LogInformation("Fetching air quality data for: {DateTime}", isoDateTime);

                // Convert the dateTime to UTC
                isoDateTime = isoDateTime.ToUniversalTime();  // Ensure it's in UTC

                var airQualityData = await _context.AirQualityData
                    .FirstOrDefaultAsync(a => a.Timestamp == isoDateTime);

                if (airQualityData == null)
                {
                    _logger.LogWarning("No air quality data found for the specified date and time: {DateTime}", isoDateTime);
                    return NotFound("No air quality data found for the specified date and time.");
                }

                return Ok(new
                {
                    co2 = airQualityData.CO2,
                    ozone = airQualityData.Ozone,
                    tvoc = airQualityData.TVOC
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while fetching air quality data.");
                return StatusCode(500, "An error occurred while processing your request. Please try again later.");
            }
        }
        // Fallback Index action
        [HttpGet]
        public IActionResult Index()
        {
            return Ok("This is the fallback action.");
        }
    }
}

