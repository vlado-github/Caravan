using Marten.Pagination;
using Caravan.Domain.Base;
using Caravan.Domain.SocialEventFeature.Schema.Projections;
using Marten.Linq.SoftDeletes;

namespace Caravan.Domain.SocialEventFeature.Queries;

public partial class SocialEventQuery
{
    public async Task<PagedResult<SocialEventProfileDetails>> List(
        SocialEventQueryFilter filter,
        int pageNumber = 1, 
        int pageSize = 10)
    {
        var query = _querySession
            .Query<SocialEventProfileDetails>()
            .Filter(filter);
        if (filter.OmitPastEvents)
        {
            query = query.Where(x =>
                (x.StartTime >= DateTimeOffset.UtcNow && x.EndTime == null)
                || (x.StartTime < DateTimeOffset.UtcNow && x.EndTime >= DateTimeOffset.UtcNow));
        }
        
        var result = await query
            .OrderByDescending(x => x.StartTime)
            .ToPagedListAsync(pageNumber, pageSize);

        return new PagedResult<SocialEventProfileDetails>
        {
            Items = result.ToList(),
            Count = result.Count,
            PageNumber = result.PageNumber,
            PageSize = result.PageSize,
            PageCount = result.PageCount,
            TotalItemCount = result.TotalItemCount,
            HasNextPage = result.HasNextPage,
            HasPreviousPage = result.HasPreviousPage,
            IsFirstPage = result.IsFirstPage,
            IsLastPage = result.IsLastPage,
            FirstItemOnPage = result.FirstItemOnPage,
            LastItemOnPage = result.LastItemOnPage
        };
    }
}