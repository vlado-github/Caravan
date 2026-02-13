using Caravan.Domain.SocialEventFeature.Events;
using JasperFx.Events;
using JasperFx.Events.Grouping;
using Marten;
using Marten.Events.Projections;

namespace Caravan.Domain.SocialEventFeature.Schema.Projections;

public class UserAttendanceSchedule : MultiStreamProjection<UserAttendingEvent, string>
{
    public UserAttendanceSchedule()
    {
        Identity<RsvpSubmitted>(e => $"{e.UserId}:{e.Id}");
        Identity<RsvpDeclined>(e => $"{e.UserId}:{e.Id}");
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

    public bool ShouldDelete(IEvent<RsvpDeclined> eventData) => true;
}
