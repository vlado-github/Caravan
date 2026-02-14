using Caravan.Domain.Base;
using Caravan.Domain.Shared.Enums;
using Caravan.Domain.SocialEventFeature.Events;
using Caravan.Domain.SocialEventFeature.Schema.Aggregates;
using FluentValidation;
using Wolverine.Marten;

namespace Caravan.Domain.SocialEventFeature.Commands;

public class AttendSocialEventCommandValidator : AbstractValidator<AttendSocialEventCommand>
{
    public AttendSocialEventCommandValidator()
    {
        RuleFor(x => x.SocialEventId).NotEmpty();
        RuleFor(x => x.Title).NotNull().NotEmpty();
        RuleFor(x => x.StartTime).NotNull().NotEmpty();
        RuleFor(x => x.AttendanceStatus).NotNull();
    }
}

public record AttendSocialEventCommand(
    Guid SocialEventId, 
    string Title, 
    DateTimeOffset StartTime, 
    AttendanceStatus AttendanceStatus = AttendanceStatus.Attending);

public static class AttendSocialEventCommandHandler
{
    [AggregateHandler]
    public static IEnumerable<object> Handle(
        AttendSocialEventCommand command, 
        [WriteAggregate] SocialEvent socialEvent, 
        IUserContext userContext)
    {
        if (socialEvent.Status != EventStatus.Published)
            throw new InvalidOperationException("Can only attend published events");

        yield return new RsvpSubmitted()
        {
            Id = command.SocialEventId, 
            UserId = userContext.UserId,
            AttendanceStatus = command.AttendanceStatus,
            Title = command.Title,
            StartTime = command.StartTime
        };
    }
}