using Caravan.Domain.Base;
using Caravan.Domain.SocialGroupFeature.Schema.Documents;
using FluentValidation;
using Marten;

namespace Caravan.Domain.SocialGroupFeature.Commands;

public class CreateSocialGroupCommandValidator : AbstractValidator<CreateSocialGroupCommand>
{
    public CreateSocialGroupCommandValidator()
    {
        RuleFor(x => x.SocialGroupName).NotNull().NotEmpty();
    }
}

public record CreateSocialGroupCommand(string SocialGroupName);

public class CreateSocialGroupCommandHandler
{
    public static async Task<CommandResult> Handle(CreateSocialGroupCommand command, IDocumentStore store, IUserContext  userContext)
    {
        await using var session = store.LightweightSession();

        var socialGroup = new SocialGroup()
        {
            Name = command.SocialGroupName,
            CreatedById = userContext.UserId,
        };
        session.Store(socialGroup);
        
        var socialGroupMembership = new SocialGroupMembership()
        {
            SocialGroupId = socialGroup.Id,
            UserId = userContext.UserId,
            JoinedAt = DateTimeOffset.UtcNow,
            IsAdmin = true
        };
        session.Store(socialGroupMembership);
        
        await session.SaveChangesAsync();
        
        return new CommandResult(socialGroup.Id);
    }
}
