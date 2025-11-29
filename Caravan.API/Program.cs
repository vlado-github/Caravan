using JasperFx;
using JasperFx.CodeGeneration;
using JasperFx.Events;
using JasperFx.Events.Daemon;
using Marten;
using Serilog;
using Caravan.API.Middlewares;
using Caravan.Domain.DependencyInjection;
using Caravan.Domain.SocialEventFeature.Commands;
using Caravan.Domain.SocialEventFeature.Schema.Indexes;
using Caravan.Domain.SocialEventFeature.Schema.Projections;
using Wolverine;
using Wolverine.FluentValidation;
using Wolverine.Marten;
using Wolverine.Postgresql;

var builder = WebApplication.CreateBuilder(args);

// Environment configuration
IConfigurationRoot configuration = new ConfigurationBuilder()
    .SetBasePath(Directory.GetCurrentDirectory())
    .AddJsonFile("appsettings.json")
    .AddJsonFile($"appsettings.{Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Production"}.json", true)
    .Build();

// Logger setup
Log.Logger = new LoggerConfiguration()
    .ReadFrom.Configuration(configuration) 
    .CreateLogger();
builder.Host.UseSerilog();

// Wolverine setup
builder.Host.UseWolverine(opts =>
{
    opts.UseFluentValidation();
    opts.Policies.MessageExecutionLogLevel(LogLevel.None);
    opts.CodeGeneration.TypeLoadMode = TypeLoadMode.Auto;
    opts.ApplicationAssembly = typeof(CreateSocialEventCommandHandler).Assembly;
});

// Marten database setup
var connectionString = configuration.GetConnectionString("CaravanDatabase");
builder.Services.AddMarten(opts =>
{
    opts.Connection(connectionString!);
    opts.DisableNpgsqlLogging = true;
    opts.CreateDatabasesForTenants(c =>
    {
        c.ForTenant().CheckAgainstPgDatabase().ConnectionLimit(500);
    });
    opts.AutoCreateSchemaObjects = AutoCreate.CreateOrUpdate;
    opts.Events.StreamIdentity = StreamIdentity.AsGuid;
    opts.Projections.AddSocialEventProjections();
    // Indexes
    opts.AddSocialEventIndexes();
}).UseLightweightSessions()
    .AddAsyncDaemon(DaemonMode.HotCold)
    .IntegrateWithWolverine(cfg =>
    {
        cfg.UseWolverineManagedEventSubscriptionDistribution = true;
    });

builder.Services.AddControllers();
builder.Services.AddDomain();

// Swagger setup
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment() || app.Environment.IsEnvironment("Local"))
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseMiddleware<ExceptionMiddleware>();
app.MapControllers();

app.Run();
