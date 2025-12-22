using Caravan.Domain.SocialGroupFeature.Schema.Documents;
using Marten;

namespace Caravan.Domain.SocialGroupFeature.Schema.Indexes;

public static class SocialGroupIndexes
{
    public static void AddSocialGroupIndexes(this StoreOptions options)
    {
        options.Schema.For<SocialGroup>().Duplicate(x => x.Name);
        options.Schema.For<SocialGroupMembership>().Identity(x => new { x.SocialGroupId, x.UserId });
    }
}