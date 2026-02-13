using Caravan.Domain.Base;
using Caravan.Domain.Shared.Enums;

namespace Caravan.Domain.SocialEventFeature.Events;

public record RsvpSubmitted : EventBase
{
    public Guid Id { get; init; }
    public Guid UserId { get; init; }
    public AttendanceStatus AttendanceStatus { get; init; }
    public string Title { get; init; }
    public DateTimeOffset StartTime { get; init; }
}