using Caravan.Domain.Base;
using Caravan.Domain.Shared.Exceptions;
using Caravan.Domain.SocialGroupFeature.Schema.Documents;
using FluentValidation;
using Marten;

namespace Caravan.Domain.SocialGroupFeature.Commands;

public class UpdateSocialGroupCommandValidator : AbstractValidator<UpdateSocialGroupCommand>
{
    public UpdateSocialGroupCommandValidator()
    {
        RuleFor(x => x.ModifiedByUserId).NotEmpty();
        RuleFor(x => x.SocialGroupName).NotNull().NotEmpty();
    }
}

public record UpdateSocialGroupCommand(Guid ModifiedByUserId, Guid SocialGroupId, string SocialGroupName);

public class UpdateSocialGroupCommandHandler
{
    public static async Task<CommandResult> Handle(UpdateSocialGroupCommand command, IDocumentStore store)
    {
        await using var session = store.LightweightSession();
        
        var socialGroup = session
            .Query<SocialGroup>()
            .SingleOrDefault(x => x.Id == command.SocialGroupId);
        if (socialGroup == null)
        {
            throw new RecordNotFoundException(command.SocialGroupId);
        }

        socialGroup.Name = command.SocialGroupName;
        socialGroup.ModifiedById = command.ModifiedByUserId;
        socialGroup.ModifiedAt = DateTimeOffset.UtcNow;
        
        session.Store(socialGroup);
        await session.SaveChangesAsync();
        
        return new CommandResult(socialGroup.Id);
    }
}
