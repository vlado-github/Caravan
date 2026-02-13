using Marten.Pagination;
using Caravan.Domain.Base;
using Caravan.Domain.SocialEventFeature.Schema.Projections;

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
                x.StartTime >= DateTimeOffset.UtcNow
                || (x.StartTime < DateTimeOffset.UtcNow && x.EndTime >= DateTimeOffset.UtcNow));
        }
        
        var result = await query
            .OrderBy(x => x.StartTime)
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

    public async Task<PagedResult<UserAttendingEvent>> ListAttendance(
        Guid userId, 
        int pageNumber = 1, 
        int pageSize = 10)
    {
        var result = await _querySession
                .Query<UserAttendingEvent>()
                .Where(x => x.UserId == userId 
                            && x.StartTime >= DateTimeOffset.UtcNow)
                .ToPagedListAsync(pageNumber, pageSize);
        
        return new PagedResult<UserAttendingEvent>
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