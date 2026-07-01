using Dapper.Contrib.Extensions;

namespace ISP.Models
{ 
    [Table("Servers")]
    public class Server
    {
        [Key]
        public int id { get; set; }
        
        public string name { get; set; } = string.Empty;
    
        public int coverage_id { get; set; } 
        public bool status { get; set; }

        public int bandwidth { get; set; } = 0; // in Mbps
        

        // Additional properties can be added as needed
    }
}
