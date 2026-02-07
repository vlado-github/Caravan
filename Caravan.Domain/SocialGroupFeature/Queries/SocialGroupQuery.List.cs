using Caravan.Domain.Base;
using Caravan.Domain.SocialGroupFeature.Schema.Documents;
using Marten;
using Marten.Pagination;

namespace Caravan.Domain.SocialGroupFeature.Queries;

public partial class SocialGroupQuery
{
    public async Task<PagedResult<SocialGroup>> List(Guid userId, int pageNumber = 1, int pageSize = 10)
    {
        var memberships = await _querySession
            .Query<SocialGroupMembership>()
            .Where(x => x.UserId == userId)
            .Select(x => x.SocialGroupId)
            .ToListAsync();
        
        var result = await _querySession
            .Query<SocialGroup>()
            .Where(x => x.CreatedById == userId || memberships.Contains(x.Id))
            .OrderByDescending(x => x.CreatedAt)
            .ToPagedListAsync(pageNumber, pageSize);
        

        return new PagedResult<SocialGroup>
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
