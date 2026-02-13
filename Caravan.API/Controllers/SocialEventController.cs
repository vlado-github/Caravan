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

[Authorize]
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
    
    [HttpPost]
    public async Task<CommandResult> CreateSocialEvent([FromBody] CreateSocialEventCommand command)
    {
        return await _bus.InvokeAsync<CommandResult>(command);
    }
    
    [HttpPut("publish")]
    public async Task PublishSocialEvent(PublishSocialEventCommand command)
    {
        await _bus.InvokeAsync<CommandResult>(command);
    }
    
    [HttpPut("reschedule")]
    public async Task RescheduleSocialEvent(RescheduleSocialEventCommand command)
    {
        await _bus.InvokeAsync<CommandResult>(command);
    }
    
    [HttpPut("cancel")]
    public async Task CancelSocialEvent(CancelSocialEventCommand command)
    {
        await _bus.InvokeAsync<CommandResult>(command);
    }
    
    [HttpPut("archive")]
    public async Task ArchiveSocialEvent(ArchiveSocialEventCommand command)
    {
        await _bus.InvokeAsync<CommandResult>(command);
    }
    
    [HttpPost("attend")]
    public async Task<CommandResult> AttendSocialEvent([FromBody] AttendSocialEventCommand command)
    {
        return await _bus.InvokeAsync<CommandResult>(command);
    }
    
    [AllowAnonymous]
    [HttpGet("{id:guid}")]
    public async Task<SocialEvent> GetSocialEvent([FromRoute] Guid id)
    {
        _ = _userContext.TryGetUserId(out var userId);
        return await _query.GetById(id, userId);
    }
    
    [AllowAnonymous]
    [HttpGet("list")]
    public async Task<PagedResult<SocialEventProfileDetails>> GetSocialEvents(
        [FromQuery] int pageNumber, 
        [FromQuery] int pageSize,
        [FromQuery] string? searchTerm = null)
    {
        return await _query.List(new SocialEventQueryFilter()
        {
            Status = EventStatus.Published,
            OmitPastEvents = true,
            Search = searchTerm,
        }, pageNumber, pageSize);
    }
    
    [HttpGet("drafts")]
    public async Task<PagedResult<SocialEventProfileDetails>> GetDraftedSocialEvents(
        [FromQuery] int pageNumber, 
        [FromQuery] int pageSize)
    {
        return await _query.List(new SocialEventQueryFilter()
        {
            CreatedByUserId = _userContext.UserId
        }, pageNumber, pageSize);
    }
}