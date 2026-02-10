using Caravan.Domain.Base;
using Caravan.Domain.SocialGroupFeature.Commands;
using Caravan.Domain.SocialGroupFeature.Queries;
using Caravan.Domain.SocialGroupFeature.Schema.Documents;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Wolverine;

namespace Caravan.API.Controllers;

[Authorize]
[ApiController]
[Route("[controller]")]
public class SocialGroupController : ControllerBase
{
    private readonly IMessageBus _bus;
    private readonly ISocialGroupQuery  _query;
    private readonly IUserContext _userContext;

    public SocialGroupController(IMessageBus bus, ISocialGroupQuery query, IUserContext userContext)
    {
        _bus = bus;
        _query = query;
        _userContext = userContext;
    }

    [HttpGet("list")]
    public async Task<PagedResult<SocialGroup>> GetSocialGroups(
        [FromQuery] int pageNumber,
        [FromQuery] int pageSize)
    {
        return await _query.List(_userContext.UserId, pageNumber, pageSize);
    }
    
    [HttpGet("selection")]
    public async Task<PagedResult<SocialGroup>> GetSocialGroupsSelection(
        [FromQuery] int pageNumber, 
        [FromQuery] int pageSize,
        [FromQuery] string? searchTerm = null)
    {
        return await _query.ListSelection(_userContext.UserId, pageNumber, pageSize, searchTerm);
    }

    [HttpPost]
    public async Task<CommandResult> CreateSocialGroup(CreateSocialGroupCommand command)
    {
        return await _bus.InvokeAsync<CommandResult>(command);
    }
    
    [HttpPut]
    public async Task<CommandResult> UpdateSocialGroup(UpdateSocialGroupCommand command)
    {
        return await _bus.InvokeAsync<CommandResult>(command);
    }
    
    [HttpPost("join")]
    public async Task<CommandResult> JoinSocialGroup(JoinSocialGroupCommand command)
    {
        return await _bus.InvokeAsync<CommandResult>(command);
    }
    
    [HttpPost("leave")]
    public async Task<CommandResult> LeaveSocialGroup(LeaveSocialGroupCommand command)
    {
        return await _bus.InvokeAsync<CommandResult>(command);
    }
    
    [HttpPost("add-admin")]
    public async Task<CommandResult> AddAdminToSocialGroup(AddAdminToSocialGroupCommand command)
    {
        //todo: permission check if (!_query.IsAdmin())
        return await _bus.InvokeAsync<CommandResult>(command);
    }
    
    [HttpPost("revoke-admin")]
    public async Task<CommandResult> RevokeAdminAccessForSocialGroup(RevokeAdminAccessForSocialGroupCommand command)
    {
        //todo: permission check if (!_query.IsAdmin())
        return await _bus.InvokeAsync<CommandResult>(command);
    }
}