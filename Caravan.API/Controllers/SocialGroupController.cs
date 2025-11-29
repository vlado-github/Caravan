using Caravan.Domain.Base;
using Caravan.Domain.SocialGroupFeature.Commands;
using Caravan.Domain.SocialGroupFeature.Queries;
using Microsoft.AspNetCore.Mvc;
using Wolverine;

namespace Caravan.API.Controllers;

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
    
    [HttpPost]
    public async Task<CommandResult> JoinSocialGroup(JoinSocialGroupCommand command)
    {
        return await _bus.InvokeAsync<CommandResult>(command);
    }
    
    [HttpPost]
    public async Task<CommandResult> LeaveSocialGroup(LeaveSocialGroupCommand command)
    {
        return await _bus.InvokeAsync<CommandResult>(command);
    }
    
    [HttpPost]
    public async Task<CommandResult> AddAdminToSocialGroup(AddAdminToSocialGroupCommand command)
    {
        //todo: permission check if (!_query.IsAdmin())
        return await _bus.InvokeAsync<CommandResult>(command);
    }
    
    [HttpPost]
    public async Task<CommandResult> RevokeAdminAccessForSocialGroup(RevokeAdminAccessForSocialGroupCommand command)
    {
        //todo: permission check if (!_query.IsAdmin())
        return await _bus.InvokeAsync<CommandResult>(command);
    }
}