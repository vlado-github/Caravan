using Caravan.Domain.Base;

namespace Caravan.Domain.SocialGroupFeature.Schema.Documents;

public class SocialGroupMembership : DocumentBase
{
    public Guid SocialGroupId { get; set; }
    public Guid UserId { get; set; }
    public DateTimeOffset JoinedAt { get; set; }
    public bool IsAdmin { get; set; } = false;
}