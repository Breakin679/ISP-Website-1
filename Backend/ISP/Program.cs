using ISP.DataAccess;
using ISP.DataAccess.Interfaces;
using ISP.Models;
using ISP.Services;
using ISP.Services.Interfaces;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;
using Dapper;

var builder = WebApplication.CreateBuilder(args);

// enable Dapper underscore↔camel mapping
Dapper.DefaultTypeMap.MatchNamesWithUnderscores = true;

var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";
var jwt = builder.Configuration.GetSection("Jwt");
var key = Encoding.ASCII.GetBytes(jwt["Key"]!);

// 1️⃣ Authentication (JWT Bearer)
builder.Services
  .AddAuthentication(options =>
  {
      options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
      options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
  })
  .AddJwtBearer(options =>
  {
      options.RequireHttpsMetadata = true;
      options.SaveToken = true;
      options.TokenValidationParameters = new TokenValidationParameters
      {
          ValidateIssuer = true,
          ValidateAudience = true,
          ValidateIssuerSigningKey = true,
          ValidIssuer = jwt["Issuer"],
          ValidAudience = jwt["Audience"],
          IssuerSigningKey = new SymmetricSecurityKey(key),
          ClockSkew = TimeSpan.Zero
      };
  });

// 2️⃣ CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins, policy =>
    {
        policy
          .AllowAnyOrigin()   // or .WithOrigins("https://your-react-app")
          .AllowAnyHeader()
          .AllowAnyMethod();
    });
});

// 3️⃣ Controllers
builder.Services.AddControllers();

// 4️⃣ Data‑access & application services
builder.Services.AddSingleton(typeof(IRepository<>), typeof(DapperRepository<>));
builder.Services.AddSingleton<IPlansDataAccess, PlansDataAccess>();
builder.Services.AddSingleton<IPlansService, PlansService>();

// 5️⃣ Swagger / OpenAPI
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "MyISP API", Version = "v1" });
    var scheme = new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Enter your JWT with Bearer prefix"
    };
    c.AddSecurityDefinition("Bearer", scheme);
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        [scheme] = new[] { "Bearer" }
    });
});

// 6️⃣ Authorization: subscription‑key policy
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("SubscriptionKeyValidated", policy =>
        policy.RequireAssertion(context =>
            context.User.HasClaim("subKeyValid", "true")
        )
    );
});

var app = builder.Build();

// 7️⃣ Middleware pipeline

// IMPORTANT: CORS must come *before* Authentication/Authorization and MapControllers
app.UseCors(MyAllowSpecificOrigins);

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "MyISP API v1");
    c.RoutePrefix = string.Empty;
});

app.MapControllers();

app.Run();
