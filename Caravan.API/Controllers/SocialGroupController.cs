using Caravan.Domain.Base;
using Caravan.Domain.SocialGroupFeature.Commands;
using Caravan.Domain.SocialGroupFeature.Queries;
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
    
    public SocialGroupController(IMessageBus bus, ISocialGroupQuery query)
    {
        _bus = bus;
        _query = query;
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