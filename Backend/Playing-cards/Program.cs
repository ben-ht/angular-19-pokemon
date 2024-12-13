using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.Sqlite;
using Playing_cards;
using System.IdentityModel.Tokens.Jwt;
using System.Net.Http.Headers;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: "_myAllowSpecificOrigins", builder =>
    {
        builder.WithOrigins("http://localhost:4200/");
    });
});

var app = builder.Build();


// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

await using var conn = new SqliteConnection("Data Source=playing-cards.sqlite3;");
await conn.OpenAsync();


app.MapPost("/login", async ([FromBody] User user) =>
{
    await using var cmd = new SqliteCommand($"SELECT * FROM users WHERE username = '{user.Username}' AND password = '{user.Password}';", conn);
    await using var dataReader = await cmd.ExecuteReaderAsync();
    await dataReader.ReadAsync();
    if (dataReader.HasRows)
    {
        User getUser = new(
            Id: int.Parse(dataReader["id"].ToString()!),
            Username: dataReader["username"].ToString()!,
            FirstName: dataReader["firstName"].ToString()!,
            LastName: dataReader["lastName"].ToString()!,
            Password: ""
        );
        string token = Helper.GenerateAccessToken(getUser);
        return TypedResults.Ok(token);
    }

    return Results.Unauthorized();
});

app.MapPost("/logout", ([FromHeader] string authorization) =>
{
    if (AuthenticationHeaderValue.TryParse(authorization, out var headerValue))
    {
        string? token = headerValue.Parameter;
        if (!string.IsNullOrEmpty(token))
        {
            var handler = new JwtSecurityTokenHandler();
            JwtSecurityToken jwt = handler.ReadJwtToken(token);
            if (jwt.Issuer == "PlayingCards")
            {
                return Results.NoContent();
            }
        }
    }

    return Results.Unauthorized();
});

app.MapGet("/me", async ([FromHeader] string? authorization) =>
{
    if (AuthenticationHeaderValue.TryParse(authorization, out var headerValue))
    {
        string? token = headerValue.Parameter;
        if (!string.IsNullOrEmpty(token))
        {
            var id = Helper.GetIdFromToken(token);
            await using var cmd = new SqliteCommand($"SELECT * FROM users WHERE id = '{id}';", conn);
            await using var dataReader = await cmd.ExecuteReaderAsync();
            await dataReader.ReadAsync();

            User user = new(
                Id: int.Parse(dataReader["id"].ToString()!),
                Username: dataReader["username"].ToString()!,
                FirstName: dataReader["firstName"].ToString()!,
                LastName: dataReader["lastName"].ToString()!,
                Password: ""
                );

            return TypedResults.Ok(user);
        }
    }

    return Results.Unauthorized();
});


app.MapGet("/monsters", async ([FromHeader] string? authorization) =>
{
    if (AuthenticationHeaderValue.TryParse(authorization, out var headerValue))
    {
        string? token = headerValue.Parameter;
        if (!string.IsNullOrEmpty(token))
        {
            int id = Helper.GetIdFromToken(token);
            List<Monster> monsters = [];
            await using var cmd = new SqliteCommand($"SELECT * FROM monsters WHERE user_id = {id}", conn);
            await using var dataReader = await cmd.ExecuteReaderAsync();
            while (await dataReader.ReadAsync())
            {
                Monster monster = new(
                    Id: int.Parse(dataReader["id"].ToString()!),
                    Name: dataReader["name"].ToString()!,
                    Image: dataReader["image"].ToString()!,
                    Type: dataReader["type"].ToString()!,
                    Hp: int.Parse(dataReader["hp"].ToString()!),
                    Description: dataReader["description"].ToString()!,
                    AttackName: dataReader["attack_name"].ToString()!,
                    AttackStrength: int.Parse(dataReader["attack_strength"].ToString()!),
                    AttackDescription: dataReader["attack_description"].ToString()!,
                    UserId: id
                );

                monsters.Add(monster);
            }

            return TypedResults.Ok(monsters);
        }
    }

    return Results.Unauthorized();
});

app.MapPost("/monsters", async ([FromHeader] string? authorization, [FromBody] Monster monster) =>
{
    if (AuthenticationHeaderValue.TryParse(authorization, out var headerValue))
    {
        string? token = headerValue.Parameter;
        if (!string.IsNullOrEmpty(token))
        {
            int id = Helper.GetIdFromToken(token);
            await using var cmd = new SqliteCommand($"INSERT INTO monsters (name, image, type, hp, description," +
                $"attack_name, attack_strength, attack_description, user_id) VALUES('{monster.Name}', '{monster.Image}', '{monster.Type}'," +
                $"{monster.Hp}, '{monster.Description}', '{monster.AttackName}', {monster.AttackStrength}, '{monster.AttackDescription}', {id});", conn);
            var rowCount = await cmd.ExecuteNonQueryAsync();
            if (rowCount > 0)
            {
                return Results.Created();
            }

            return Results.UnprocessableEntity();
        }
    }

    return Results.Unauthorized();
});

app.MapGet("/monsters/{id}", async ([FromHeader] string? authorization, [FromRoute] int id) =>
{
    if (AuthenticationHeaderValue.TryParse(authorization, out var headerValue))
    {
        string? token = headerValue.Parameter;
        if (!string.IsNullOrEmpty(token))
        {
            await using var cmd = new SqliteCommand($"SELECT * FROM monsters WHERE id = {id}", conn);
            await using var dataReader = await cmd.ExecuteReaderAsync();
            await dataReader.ReadAsync();

            Monster monster = new(
                Id: int.Parse(dataReader["id"].ToString()!),
                Name: dataReader["name"].ToString()!,
                Image: dataReader["image"].ToString()!,
                Type: dataReader["type"].ToString()!,
                Hp: int.Parse(dataReader["hp"].ToString()!),
                Description: dataReader["description"].ToString()!,
                AttackName: dataReader["attack_name"].ToString()!,
                AttackStrength: int.Parse(dataReader["attack_strength"].ToString()!),
                AttackDescription: dataReader["attack_description"].ToString()!,
                UserId: id);

            return TypedResults.Ok(monster);
        }
    }

    return Results.Unauthorized();
});

app.MapPut("/monsters/{id}", async ([FromHeader] string? authorization, [FromRoute] int id, [FromBody] Monster monster) =>
{
    if (AuthenticationHeaderValue.TryParse(authorization, out var headerValue))
    {
        string? token = headerValue.Parameter;
        if (!string.IsNullOrEmpty(token))
        {
            int userId = Helper.GetIdFromToken(token);
            await using var cmd = new SqliteCommand($"SELECT user_id FROM monsters WHERE id = {id}", conn);
            await using var dataReader = await cmd.ExecuteReaderAsync();
            await dataReader.ReadAsync();
            int checkUserId = int.Parse(dataReader["user_id"].ToString()!);

            if (userId == checkUserId)
            {
                await using var cmd2 = new SqliteCommand($"UPDATE monsters SET name = '{monster.Name}', image = '{monster.Image}', type = '{monster.Type}', " +
                    $"hp = {monster.Hp}, description = '{monster.Description}', attack_name = '{monster.AttackName}', attack_strength = {monster.AttackStrength}, " +
                    $"attack_description = '{monster.AttackDescription}' WHERE id = {id}", conn);
                var rowCount = await cmd2.ExecuteNonQueryAsync();
                if (rowCount > 0)
                {
                    return TypedResults.Ok(monster);
                }
            }
        }
    }

    return Results.Unauthorized();
});

app.MapDelete("/monsters/{id}", async ([FromHeader] string? authorization, [FromRoute] int id) =>
{
    if (AuthenticationHeaderValue.TryParse(authorization, out var headerValue))
    {
        string? token = headerValue.Parameter;
        if (!string.IsNullOrEmpty(token))
        {
            int userId = Helper.GetIdFromToken(token);
            await using var cmd = new SqliteCommand($"SELECT user_id FROM monsters WHERE id = '{userId}'", conn);
            await using var dataReader = await cmd.ExecuteReaderAsync();
            await dataReader.ReadAsync();
            int checkUserId = int.Parse(dataReader["user_id"].ToString()!);     

            if (userId == checkUserId)
            {
                await using var cmd2 = new SqliteCommand($"DELETE FROM monsters WHERE id = {userId}", conn);
                var rowCount = await cmd2.ExecuteNonQueryAsync();
                if (rowCount > 0)
                {
                    return Results.NoContent();
                }
            }
        }
    }

    return Results.Unauthorized();
});


app.UseCors(
    options => options.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());

app.Run();

public record User(int Id, string Username, string Password, string FirstName, string LastName);

public record Monster(int Id, string Description, string AttackName, int AttackStrength, string AttackDescription,
    string Name, string Image, string Type, int Hp, int UserId);