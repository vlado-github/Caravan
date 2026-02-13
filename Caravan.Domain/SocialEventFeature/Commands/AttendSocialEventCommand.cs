using Caravan.Domain.Shared.Enums;
using Caravan.Domain.SocialEventFeature.Events;
using Caravan.Domain.SocialEventFeature.Schema.Aggregates;
using Caravan.Domain.SocialEventFeature.Schema.Projections;
using FluentValidation;
using Wolverine.Marten;

namespace Caravan.Domain.SocialEventFeature.Commands;

public class AttendSocialEventCommandValidator : AbstractValidator<AttendSocialEventCommand>
{
    public AttendSocialEventCommandValidator()
    {
        RuleFor(x => x.SocialEventId).NotEmpty();
        RuleFor(x => x.UserId).NotEmpty();
    }
}

public record AttendSocialEventCommand(Guid SocialEventId, Guid UserId, string Title, DateTimeOffset StartTime);

public static class AttendSocialEventCommandHandler
{
    [AggregateHandler]
    public static IEnumerable<object> Handle(AttendSocialEventCommand command, [WriteAggregate] SocialEvent socialEvent)
    {
        if (socialEvent.Status != EventStatus.Published)
            throw new InvalidOperationException("Can only attend published events");

        yield return new UserAttendingEvent()
        {
            Id = $"{command.UserId}:{command.SocialEventId}", 
            EventId = command.SocialEventId, 
            UserId = command.UserId,
            Title = command.Title,
            StartTime = command.StartTime
        };
    }
}