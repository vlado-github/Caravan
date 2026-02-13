using Caravan.Domain.Shared.Enums;

namespace Caravan.Domain.SocialEventFeature.Schema.Projections;

public class UserAttendingEvent
{
    public string Id { get; set; } = default!; // "{UserId}:{EventId}"
    public Guid UserId { get; set; }
    public Guid EventId { get; set; }
    public string Title { get; set; } = default!;
    public DateTimeOffset StartTime { get; set; }
    public AttendanceStatus AttendanceStatus { get; set; }
}