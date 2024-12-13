using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Playing_cards
{
    public static class Helper
    {
        public static string GenerateAccessToken(User user)
        {
            byte[] hash = Encoding.UTF8.GetBytes("MySecretKeyhueziebaziyfgzdgferfguzreigzrehjazejhabezyajk94781284g72T321GFYI273T172Gd2Y823Y913YGRfb781T3241TgD72");
            var key = new SymmetricSecurityKey(hash);
            var signingCredentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256Signature);

            var claims = new ClaimsIdentity(
            [
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Aud, user.Username),
            ]);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = claims,
                Expires = DateTime.UtcNow.AddDays(1),
                Issuer = "PlayingCards",
                SigningCredentials = signingCredentials
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        public static int GetIdFromToken(string token)
        {
            var handler = new JwtSecurityTokenHandler();
            JwtSecurityToken jwt = handler.ReadJwtToken(token);
            return int.Parse(jwt.Subject);            
        }

    }
}
