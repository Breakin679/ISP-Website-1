using Dapper.Contrib.Extensions;


namespace ISP.Models
{
    [Table("Operation")]
    public class Operation
    {
        [Key]
        public int id { get; set; }

        public int operation_type_id { get; set; }
        public required string name { get; set; }
        public decimal price { get; set; }
        public string? description { get; set; }
    }
}
