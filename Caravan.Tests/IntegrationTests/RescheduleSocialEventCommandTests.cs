using System.Net;
using Alba;
using Caravan.Domain.Base;
using Caravan.Tests.Base;
using Caravan.Domain.SocialEventFeature.Commands;
using Caravan.Domain.SocialEventFeature.Events;
using Caravan.Domain.SocialEventFeature.Schema.Aggregates;
using Caravan.Domain.SocialEventFeature.Schema.Projections;

namespace Caravan.Tests.IntegrationTests;

public class RescheduleSocialEventCommandTests : IntegrationTestBase
{
    public RescheduleSocialEventCommandTests(IntegrationTestFixture fixture) : base(fixture)
    {
    }

    [Fact]
    public async Task Reschedule_SocialEvent_Should_Succeed()
    {
        //Arrange
        var streamId = Guid.NewGuid();
        await Seeder.SeedStream<SocialEvent>(streamId);
        var aggregate = await Seeder.GetStream<SocialEvent>(streamId);
        var command = new RescheduleSocialEventCommand(streamId,
            DateTimeOffset.UtcNow.AddDays(10),
            DateTimeOffset.UtcNow.AddDays(11));

        //Act
        await Host.Scenario(config =>
        {
            config.Put.Json(command).ToUrl("/socialevent/reschedule");
            config.StatusCodeShouldBeOk();
        });

        var getResponse = await Host.Scenario(config =>
        {
            config.Get.Url($"/socialevent/{streamId}");
            config.StatusCodeShouldBeOk();
        });

        //Assert
        var result = await getResponse.ReadAsJsonAsync<SocialEventProfileDetails>();
        Assert.NotNull(result);
        Assert.Equal(aggregate.Title, result.Title);
        Assert.Equal(aggregate.Description, result.Description);
        Assert.Equal(aggregate.Type, result.Type);
        Assert.Equal(command.StartTime, result.StartTime);
        Assert.Equal(command.EndTime, result.EndTime);
        Assert.Equal(aggregate.Venue, result.Venue);
        Assert.Equal(aggregate.Status, result.Status);
        Assert.Equal(aggregate.TicketCirculationCount, result.TicketCirculationCount);
    }
    
    [Fact]
    public async Task Reschedule_SocialEvent_WithWrongEndTime_Should_Fail()
    {
        //Arrange
        var streamId = Guid.NewGuid();
        await Seeder.SeedStream<SocialEvent>(streamId);
        var command = new RescheduleSocialEventCommand(streamId,
            DateTimeOffset.UtcNow.AddDays(11),
            DateTimeOffset.UtcNow);

        //Act & Assert
        await Host.Scenario(config =>
        {
            config.Put.Json(command).ToUrl("/socialevent/reschedule");
            config.StatusCodeShouldBe(HttpStatusCode.BadRequest);
        });
    }
    
    [Fact]
    public async Task Reschedule_CancelledSocialEvent_Should_Fail()
    {
        //Arrange
        var streamId = Guid.NewGuid();
        await Seeder.SeedStream<SocialEvent>(streamId, new List<EventBase>()
        {
            new SocialEventCancelled()
            {
                Id = streamId
            }
        });
        var command = new RescheduleSocialEventCommand(streamId,
            DateTimeOffset.UtcNow.AddDays(10),
            DateTimeOffset.UtcNow.AddDays(11));

        //Act & Assert
        await Host.Scenario(config =>
        {
            config.Put.Json(command).ToUrl("/socialevent/reschedule");
            config.StatusCodeShouldBe(HttpStatusCode.BadRequest);
        });
    }
    
    [Fact]
    public async Task Reschedule_ArchivedSocialEvent_Should_Fail()
    {
        //Arrange
        var streamId = Guid.NewGuid();
        await Seeder.SeedStream<SocialEvent>(streamId, new List<EventBase>()
        {
            new SocialEventArchived()
            {
                Id = streamId
            }
        });
        var command = new RescheduleSocialEventCommand(streamId,
            DateTimeOffset.UtcNow.AddDays(10),
            DateTimeOffset.UtcNow.AddDays(11));

        //Act & Assert
        await Host.Scenario(config =>
        {
            config.Put.Json(command).ToUrl("/socialevent/reschedule");
            config.StatusCodeShouldBe(HttpStatusCode.BadRequest);
        });
    }
}