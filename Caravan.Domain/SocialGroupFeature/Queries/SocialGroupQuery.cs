using Caravan.Domain.SocialGroupFeature.Schema.Documents;
using Marten;

namespace Caravan.Domain.SocialGroupFeature.Queries;

public partial class SocialGroupQuery : ISocialGroupQuery
{
    private readonly IQuerySession _querySession;

    public SocialGroupQuery(IQuerySession querySession)
    {
        _querySession = querySession;
    }
    
    public Task<bool> IsAdmin(Guid socialGroupId, Guid userId)
    {
        return _querySession.Query<SocialGroupMembership>()
            .AnyAsync(x => x.UserId == userId && x.SocialGroupId == socialGroupId && x.IsAdmin); 
    }

    public Task<bool> IsMember(Guid socialGroupId, Guid userId)
    {
        return _querySession.Query<SocialGroupMembership>()
            .AnyAsync(x => x.UserId == userId && x.SocialGroupId == socialGroupId);
    }
}