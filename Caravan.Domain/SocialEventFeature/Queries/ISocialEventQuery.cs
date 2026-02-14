using Caravan.Domain.Base;
using Caravan.Domain.SocialEventFeature.Schema.Aggregates;
using Caravan.Domain.SocialEventFeature.Schema.Projections;

namespace Caravan.Domain.SocialEventFeature.Queries;

public interface ISocialEventQuery
{
    Task<SocialEvent> GetById(Guid streamId, Guid? userId);
    
    Task<PagedResult<SocialEventProfileDetails>> List(
        SocialEventQueryFilter filter, 
        int pageNumber = 0, 
        int pageSize = 10);

    Task<PagedResult<UserAttendingEvent>> ListAttendance(
        Guid userId,
        int pageNumber = 1,
        int pageSize = 10);
}