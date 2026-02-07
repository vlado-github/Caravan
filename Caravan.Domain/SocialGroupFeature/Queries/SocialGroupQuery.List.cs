using Caravan.Domain.Base;
using Caravan.Domain.SocialGroupFeature.Schema.Documents;
using Marten.Pagination;

namespace Caravan.Domain.SocialGroupFeature.Queries;

public partial class SocialGroupQuery
{
    public async Task<PagedResult<SocialGroup>> List(int pageNumber = 1, int pageSize = 10)
    {
        var result = await _querySession
            .Query<SocialGroup>()
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
