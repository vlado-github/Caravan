namespace Caravan.Domain.Base;

public interface IUserContext
{
    Guid UserId { get; }
    string? UserFullname { get; }
    bool TryGetUserId(out Guid? userId);
}