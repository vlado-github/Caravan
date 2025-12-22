using Caravan.Domain.Base;
using Caravan.Domain.SocialGroupFeature.Schema.Documents;
using FluentValidation;
using Marten;

namespace Caravan.Domain.SocialGroupFeature.Commands;

public class CreateSocialGroupCommandValidator : AbstractValidator<CreateSocialGroupCommand>
{
    public CreateSocialGroupCommandValidator()
    {
        RuleFor(x => x.CreatedByUserId).NotEmpty();
        RuleFor(x => x.SocialGroupName).NotNull().NotEmpty();
    }
}

public record CreateSocialGroupCommand(Guid CreatedByUserId, string SocialGroupName);

public class CreateSocialGroupCommandHandler
{
    public static async Task<CommandResult> Handle(CreateSocialGroupCommand command, IDocumentStore store)
    {
        await using var session = store.LightweightSession();

        var socialGroup = new SocialGroup()
        {
            Name = command.SocialGroupName,
            CreatedById = command.CreatedByUserId
        };
        session.Store(socialGroup);
        
        var socialGroupMembership = new SocialGroupMembership()
        {
            SocialGroupId = socialGroup.Id,
            UserId = command.CreatedByUserId,
            JoinedAt = DateTimeOffset.UtcNow,
            IsAdmin = true
        };
        session.Store(socialGroupMembership);
        
        await session.SaveChangesAsync();
        
        return new CommandResult(socialGroup.Id);
    }
}
