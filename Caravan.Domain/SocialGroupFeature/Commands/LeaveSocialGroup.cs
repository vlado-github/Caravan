using Caravan.Domain.Base;
using Caravan.Domain.Shared.Exceptions;
using Caravan.Domain.SocialGroupFeature.Schema.Documents;
using FluentValidation;
using Marten;

namespace Caravan.Domain.SocialGroupFeature.Commands;

public class LeaveSocialGroupCommandValidator : AbstractValidator<LeaveSocialGroupCommand>
{
    public LeaveSocialGroupCommandValidator()
    {
        RuleFor(x => x.UserId).NotEmpty();
        RuleFor(x => x.SocialGroupId).NotEmpty();
    }
}

public record LeaveSocialGroupCommand(Guid UserId, Guid SocialGroupId);

public class LeaveSocialGroupCommandHandler
{
    public static async Task Handle(LeaveSocialGroupCommand command, IDocumentStore store)
    {
        await using var session = store.LightweightSession();
        
        var membership = session
            .Query<SocialGroupMembership>()
            .SingleOrDefault(x => x.Id == command.SocialGroupId && x.UserId == command.UserId);
        if (membership == null)
        {
            return;
        }

        session.Delete(membership);
        await session.SaveChangesAsync();
    }
}
