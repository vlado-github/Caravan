using Caravan.Domain.Shared.Exceptions;
using Caravan.Domain.SocialEventFeature.Schema.Aggregates;
using Caravan.Domain.SocialEventFeature.Schema.Projections;
using Caravan.Domain.SocialGroupFeature.Schema.Documents;
using Marten;

namespace Caravan.Domain.SocialEventFeature.Queries;

public partial class SocialEventQuery
{
    public async Task<SocialEvent> GetById(Guid id, Guid? userId)
    {
        var socialEvent = await _querySession.Events.AggregateStreamAsync<SocialEvent>(id);
        
        if (socialEvent == null)
        {
            throw new RecordNotFoundException(id);
        }
        
        if (socialEvent.SocialGroupId.HasValue)
        {
            var socialGroup = await _querySession
                .Query<SocialGroup>()
                .SingleAsync(x => x.Id == socialEvent.SocialGroupId.Value);
            socialEvent.SocialGroupName = socialGroup.Name;

            if (userId != null)
            {
                var membership = await _querySession
                    .Query<SocialGroupMembership>()
                    .SingleOrDefaultAsync(x => x.SocialGroupId == socialEvent.SocialGroupId.Value
                                               && x.UserId == userId);
                socialEvent.IsSocialGroupMember = membership != null;
            }
        }
        
        var attendance = await _querySession
            .Query<UserAttendingEvent>()
            .SingleOrDefaultAsync(x => x.EventId == id && x.UserId == userId);
        socialEvent.AttendanceStatus = attendance?.AttendanceStatus;

        return socialEvent;
    }
}