using Caravan.Domain.Base;
using Caravan.Domain.Shared.Exceptions;
using Caravan.Domain.SocialGroupFeature.Schema.Documents;
using FluentValidation;
using Marten;

namespace Caravan.Domain.SocialGroupFeature.Commands;

public class RevokeAdminInSocialGroupCommandValidator : AbstractValidator<RevokeAdminAccessForSocialGroupCommand>
{
    public RevokeAdminInSocialGroupCommandValidator()
    {
        RuleFor(x => x.UserId).NotEmpty();
        RuleFor(x => x.SocialGroupId).NotEmpty();
    }
}

public record RevokeAdminAccessForSocialGroupCommand(Guid UserId, Guid SocialGroupId);

public class RevokeAdminInSocialGroupCommandHandler
{
    public static async Task Handle(RevokeAdminAccessForSocialGroupCommand command, IDocumentStore store)
    {
        await using var session = store.LightweightSession();
        
        var membership = session
            .Query<SocialGroupMembership>()
            .SingleOrDefault(x => x.Id == command.SocialGroupId && x.UserId == command.UserId);
        if (membership == null)
        {
            return;
        }
        
        membership.IsAdmin = false;
        session.Store(membership);
        await session.SaveChangesAsync();
    }
}
