using Caravan.Domain.Base;

namespace Caravan.Domain.SocialEventFeature.Events;

public record RsvpDeclined : EventBase
{
    public Guid Id { get; init; }
    public Guid UserId { get; init; }
}