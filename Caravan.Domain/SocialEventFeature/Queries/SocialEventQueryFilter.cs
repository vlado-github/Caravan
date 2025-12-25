using Caravan.Domain.Shared.Enums;
using Caravan.Domain.SocialEventFeature.Schema.Aggregates;
using Caravan.Domain.SocialEventFeature.Schema.Projections;
using Marten.Linq;

namespace Caravan.Domain.SocialEventFeature.Queries;

public class SocialEventQueryFilter
{
    public string? SearchTitle { get; set; } = null;
    public string? SearchDescription { get; set; } = null;
    public string? SearchVenue { get; set; } = null;
    public Guid? SocialGroupId { get; set; } = null;
    public Guid? CreatedByUserId { get; set; } = null;
    public EventType? Type { get; set; } = null;
    public EventStatus? Status { get; set; } = null;
    
}

internal static class SocialEventQueryFilterHelper
{
    public static IQueryable<SocialEventProfileDetails> Filter(
        this IMartenQueryable<SocialEventProfileDetails> query, 
        SocialEventQueryFilter filter)
    {
        IQueryable<SocialEventProfileDetails> queryBuilder = query;
        if (!string.IsNullOrEmpty(filter.SearchTitle))
        {
            queryBuilder = queryBuilder.Where(x => x.Title.Contains(filter.SearchTitle));
        }
        if (!string.IsNullOrEmpty(filter.SearchDescription))
        {
            queryBuilder = queryBuilder.Where(x => x.Description.Contains(filter.SearchDescription));
        }
        if (!string.IsNullOrEmpty(filter.SearchVenue))
        {
            queryBuilder = queryBuilder.Where(x => x.Venue.Contains(filter.SearchVenue));
        }
        if (filter.SocialGroupId != null)
        {
            queryBuilder = queryBuilder.Where(x => x.SocialGroupId == filter.SocialGroupId);
        }
        if (filter.CreatedByUserId != null)
        {
            queryBuilder = queryBuilder.Where(x => x.CreatedByUserId == filter.CreatedByUserId);
        }
        if (filter.Type != null)
        {
            queryBuilder = queryBuilder.Where(x => x.Type == filter.Type);
        }
        if (filter.Status != null)
        {
            queryBuilder = queryBuilder.Where(x => x.Status == filter.Status);
        }

        return queryBuilder;
    }
}