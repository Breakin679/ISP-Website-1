using System.Security.Cryptography;
using System.Text;

namespace ISP.Services
{
    public class Hashfunction
    {
        public static string ComputeSha1(string input)
        {
            using(SHA1 sha1 = SHA1.Create())
            {
                byte[] inputBytes = Encoding.UTF8.GetBytes(input);
                byte[] hashBytes = sha1.ComputeHash(inputBytes);
                StringBuilder sb = new StringBuilder();
                foreach (byte b in hashBytes)
                {
                    sb.Append(b.ToString("x2"));
                }
                return sb.ToString();
            }
        } 
    }
}
