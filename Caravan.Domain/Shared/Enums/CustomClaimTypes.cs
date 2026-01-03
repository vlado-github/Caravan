using System.Security.Claims;

namespace Caravan.Domain.Shared.Enums;

public class CustomClaimTypes
{
    public const string UserId = ClaimTypes.NameIdentifier;
    public const string UserFullname = "name";
}