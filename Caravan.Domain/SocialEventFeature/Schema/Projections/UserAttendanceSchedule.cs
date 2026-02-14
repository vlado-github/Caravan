using Caravan.Domain.Shared.Enums;
using Caravan.Domain.SocialEventFeature.Events;
using JasperFx.Events;
using Marten.Events.Projections;

namespace Caravan.Domain.SocialEventFeature.Schema.Projections;

public class UserAttendanceSchedule : MultiStreamProjection<UserAttendingEvent, string>
{
    public UserAttendanceSchedule()
    {
        Identity<RsvpSubmitted>(e => $"{e.UserId}:{e.Id}");
        Identity<RsvpDeclined>(e => $"{e.UserId}:{e.Id}");
        Identity<SocialEventRescheduled>(e => $"{e.RescheduledBy}:{e.Id}");
    }

    public void Apply(UserAttendingEvent view, IEvent<RsvpSubmitted> eventData)
    {
        var e = eventData.Data;
        view.UserId = e.UserId;
        view.EventId = e.Id;
        view.Title = e.Title;
        view.StartTime = e.StartTime;
        view.AttendanceStatus = e.AttendanceStatus;
    }
    
    public void Apply(UserAttendingEvent view, IEvent<SocialEventRescheduled> eventData)
    {
        var e = eventData.Data;
        view.EventId = e.Id;
        view.StartTime = e.StartTime;
    }

    public bool ShouldDelete(IEvent<RsvpDeclined> eventData) => true;
}

public class UserAttendingEvent
{
    public string Id { get; set; } = default!; // "{UserId}:{EventId}"
    public Guid UserId { get; set; }
    public Guid EventId { get; set; }
    public string Title { get; set; } = default!;
    public DateTimeOffset StartTime { get; set; }
    public AttendanceStatus AttendanceStatus { get; set; }
}
