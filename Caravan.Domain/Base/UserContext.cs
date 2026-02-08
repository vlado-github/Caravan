using Caravan.Domain.Shared.Enums;
using Microsoft.AspNetCore.Http;

namespace Caravan.Domain.Base;

public class UserContext : IUserContext
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    public UserContext(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    public bool TryGetUserId(out Guid? userId)
    {
        try
        {
            userId = UserId;
        }
        catch (ArgumentNullException ex)
        {
            userId = null;
            return false;
        }

        return true;
    }

    public Guid UserId 
    { 
        get 
        {
            var claimValue = _httpContextAccessor.HttpContext.User.Claims.FirstOrDefault(
                c => c.Type == CustomClaimTypes.UserId)?.Value;
            if (string.IsNullOrEmpty(claimValue))
            {
                throw new ArgumentNullException(nameof(CustomClaimTypes.UserId), $"Claim type {CustomClaimTypes.UserId} is missing a value.");
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
                throw new ArgumentNullException(nameof(CustomClaimTypes.UserId), $"Claim type {CustomClaimTypes.UserFullname} is missing a value.");
            }
            return claimValue;  
        }
    }
}