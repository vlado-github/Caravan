namespace Caravan.Domain.SocialGroupFeature.Queries;

public interface ISocialGroupQuery
{
    Task<bool> IsAdmin(Guid socialGroupId, Guid userId);
    Task<bool> IsMember(Guid socialGroupId, Guid userId);
}