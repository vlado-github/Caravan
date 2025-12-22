using Microsoft.Extensions.DependencyInjection;
using Caravan.Domain.SocialEventFeature.Queries;
using Caravan.Domain.SocialGroupFeature.Queries;

namespace Caravan.Domain.DependencyInjection;

public static class DomainDependencies
{
    public static void AddDomain(this IServiceCollection services)
    {
        services.AddScoped<ISocialEventQuery, SocialEventQuery>();
        services.AddScoped<ISocialGroupQuery, SocialGroupQuery>();
    } 
}