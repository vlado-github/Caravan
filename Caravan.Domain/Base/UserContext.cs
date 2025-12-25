using Caravan.Domain.Shared.Enums;
using Caravan.Domain.Shared.Exceptions;
using Microsoft.AspNetCore.Http;

namespace Caravan.Domain.Base;

public class UserContext : IUserContext
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    public UserContext(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    public Guid UserId 
    { 
        get 
        {
            var claimValue = _httpContextAccessor.HttpContext.User.Claims.FirstOrDefault(
                c => c.Type == CustomClaimTypes.UserId)?.Value;
            if (string.IsNullOrEmpty(claimValue))
            {
                throw new RecordNotFoundException($"Claim type {CustomClaimTypes.UserId} is missing a value.");
            }
            
            return Guid.Parse(claimValue);  
        } 
    }

    public string? UserFullname
    {
        get 
        {
            var claimValue = _httpContextAccessor.HttpContext.User.Claims.FirstOrDefault(
                c => c.Type == CustomClaimTypes.UserFullname)?.Value;
            if (string.IsNullOrEmpty(claimValue))
            {
                throw new RecordNotFoundException($"Claim type {CustomClaimTypes.UserFullname} is missing a value.");
            }
            return claimValue;  
        }
    }
}