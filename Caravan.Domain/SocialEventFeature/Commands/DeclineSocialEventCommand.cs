using Caravan.Domain.Base;
using Caravan.Domain.Shared.Enums;
using Caravan.Domain.SocialEventFeature.Events;
using Caravan.Domain.SocialEventFeature.Schema.Aggregates;
using FluentValidation;
using Wolverine.Marten;

namespace Caravan.Domain.SocialEventFeature.Commands;

public class DeclineSocialEventCommandValidator : AbstractValidator<DeclineSocialEventCommand>
{
    public DeclineSocialEventCommandValidator()
    {
        RuleFor(x => x.SocialEventId).NotEmpty();
    }
}

public record DeclineSocialEventCommand(Guid SocialEventId);

public static class DeclineSocialEventCommandHandler
{
    [AggregateHandler]
    public static IEnumerable<object> Handle(
        DeclineSocialEventCommand command, 
        [WriteAggregate] SocialEvent socialEvent, 
        IUserContext userContext)
    {
        if (socialEvent.Status != EventStatus.Published)
            throw new InvalidOperationException("Can only attend published events");

        yield return new RsvpDeclined()
        {
            Id = command.SocialEventId, 
            UserId = userContext.UserId,
        };
    }
}