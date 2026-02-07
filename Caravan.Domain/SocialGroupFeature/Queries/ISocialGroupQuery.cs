using Caravan.Domain.Base;
using Caravan.Domain.SocialGroupFeature.Schema.Documents;

namespace Caravan.Domain.SocialGroupFeature.Queries;

public interface ISocialGroupQuery
{
    Task<bool> IsAdmin(Guid socialGroupId, Guid userId);
    Task<bool> IsMember(Guid socialGroupId, Guid userId);
    Task<PagedResult<SocialGroup>> List(Guid userId, int pageNumber = 1, int pageSize = 10);
}