namespace Caravan.Domain.Base;

public interface IUserContext
{
    Guid UserId { get; }
    string? UserFullname { get; }
}