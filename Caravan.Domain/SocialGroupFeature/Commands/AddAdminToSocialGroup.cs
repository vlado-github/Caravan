using Caravan.Domain.Base;
using Caravan.Domain.SocialGroupFeature.Schema.Documents;
using FluentValidation;
using Marten;

namespace Caravan.Domain.SocialGroupFeature.Commands;

public class AddAdminToSocialGroupCommandValidator : AbstractValidator<AddAdminToSocialGroupCommand>
{
    public AddAdminToSocialGroupCommandValidator()
    {
        RuleFor(x => x.UserId).NotEmpty();
        RuleFor(x => x.SocialGroupId).NotEmpty();
    }
}

public record AddAdminToSocialGroupCommand(Guid UserId, Guid SocialGroupId);

public class AddAdminToSocialGroupCommandHandler
{
    public static async Task<CommandResult> Handle(AddAdminToSocialGroupCommand command, IDocumentStore store)
    {
        await using var session = store.LightweightSession();
        
        var membership = session
            .Query<SocialGroupMembership>()
            .SingleOrDefault(x => x.Id == command.SocialGroupId && x.UserId == command.UserId);
        if (membership != null)
        {
            membership.IsAdmin = true;
        }
        else
        {
            membership = new SocialGroupMembership()
            {
                SocialGroupId = command.SocialGroupId,
                UserId = command.UserId,
                JoinedAt = DateTimeOffset.UtcNow,
                IsAdmin = true
            };
        }

        session.Store(membership);
        await session.SaveChangesAsync();
        
        return new CommandResult(membership.Id);
    }
}
