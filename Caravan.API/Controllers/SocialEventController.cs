using Caravan.Domain.Base;
using Caravan.Domain.Shared.Enums;
using Caravan.Domain.SocialEventFeature.Commands;
using Caravan.Domain.SocialEventFeature.Queries;
using Caravan.Domain.SocialEventFeature.Schema.Aggregates;
using Caravan.Domain.SocialEventFeature.Schema.Projections;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Wolverine;

namespace Caravan.API.Controllers;

[ApiController]
[Route("[controller]")]
public class SocialEventController : ControllerBase
{
    private readonly IMessageBus _bus;
    private readonly ISocialEventQuery  _query;
    private readonly IUserContext _userContext;
    
    public SocialEventController(IMessageBus bus, ISocialEventQuery query, IUserContext userContext)
    {
        _bus = bus;
        _query = query;
        _userContext = userContext;
    }
    
    [Authorize]
    [HttpPost]
    public async Task<CommandResult> CreateSocialEvent(CreateSocialEventCommand command)
    {
        return await _bus.InvokeAsync<CommandResult>(command);
    }
    
    [Authorize]
    [HttpPut("publish")]
    public async Task PublishSocialEvent(PublishSocialEventCommand command)
    {
        await _bus.InvokeAsync<CommandResult>(command);
    }
    
    [Authorize]
    [HttpPut("reschedule")]
    public async Task RescheduleSocialEvent(RescheduleSocialEventCommand command)
    {
        await _bus.InvokeAsync<CommandResult>(command);
    }
    
    [Authorize]
    [HttpPut("cancel")]
    public async Task CancelSocialEvent(CancelSocialEventCommand command)
    {
        await _bus.InvokeAsync<CommandResult>(command);
    }
    
    [Authorize]
    [HttpPut("archive")]
    public async Task ArchiveSocialEvent(ArchiveSocialEventCommand command)
    {
        await _bus.InvokeAsync<CommandResult>(command);
    }
    
    [HttpGet("{id:guid}")]
    public async Task<SocialEvent> GetSocialEvent([FromRoute] Guid id)
    {
        return await _query.GetById(id);
    }
    
    [HttpGet("list")]
    public async Task<PagedResult<SocialEventProfileDetails>> GetSocialEvents(
        [FromQuery] int pageNumber, 
        [FromQuery] int pageSize)
    {
        return await _query.List(new SocialEventQueryFilter()
        {
            Status = EventStatus.Published
        }, pageNumber, pageSize);
    }
    
    [Authorize]
    [HttpGet("drafts")]
    public async Task<PagedResult<SocialEventProfileDetails>> GetDraftedSocialEvents(
        [FromQuery] int pageNumber, 
        [FromQuery] int pageSize)
    {
        return await _query.List(new SocialEventQueryFilter()
        {
            Status = EventStatus.Draft,
            CreatedByUserId = _userContext.UserId
        }, pageNumber, pageSize);
    }
}