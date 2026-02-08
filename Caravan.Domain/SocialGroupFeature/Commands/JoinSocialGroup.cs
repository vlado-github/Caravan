using Caravan.Domain.Base;
using Caravan.Domain.SocialGroupFeature.Schema.Documents;
using FluentValidation;
using Marten;

namespace Caravan.Domain.SocialGroupFeature.Commands;

public class JoinSocialGroupCommandValidator : AbstractValidator<JoinSocialGroupCommand>
{
    public JoinSocialGroupCommandValidator()
    {
        RuleFor(x => x.SocialGroupId).NotEmpty();
    }
}

public record JoinSocialGroupCommand(Guid SocialGroupId);

public class JoinSocialGroupCommandHandler
{
    public static async Task<CommandResult> Handle(JoinSocialGroupCommand command, IDocumentStore store, IUserContext userContext)
    {
        await using var session = store.LightweightSession();
        
        var membership = session
            .Query<SocialGroupMembership>()
            .SingleOrDefault(x => x.SocialGroupId == command.SocialGroupId && x.UserId == userContext.UserId);
        if (membership != null)
        {
            return new CommandResult(membership.Id);
        }
       
        membership = new SocialGroupMembership()
        {
            SocialGroupId = command.SocialGroupId,
            UserId = userContext.UserId,
            JoinedAt = DateTimeOffset.UtcNow,
            IsAdmin = false
        };

        session.Store(membership);
        await session.SaveChangesAsync();
        
        return new CommandResult(membership.Id);
    }
}
