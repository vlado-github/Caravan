using System.Net;
using Alba;
using Caravan.Domain.Base;
using Caravan.Tests.Base;
using Caravan.Domain.Shared.Enums;
using Caravan.Domain.SocialEventFeature.Commands;
using Caravan.Domain.SocialEventFeature.Events;
using Caravan.Domain.SocialEventFeature.Schema.Aggregates;
using Caravan.Domain.SocialEventFeature.Schema.Projections;

namespace Caravan.Tests.IntegrationTests;

public class CancelSocialEventCommandTests : IntegrationTestBase
{
    public CancelSocialEventCommandTests(IntegrationTestFixture fixture) : base(fixture)
    {
    }

    [Fact]
    public async Task Cancel_PublishedSocialEvent_Should_Succeed()
    {
        //Arrange
        var streamId = Guid.NewGuid();
        await Seeder.SeedStream<SocialEvent>(streamId, new List<EventBase>()
        {
            new SocialEventPublished()
            {
                Id = streamId
            }
        });
        var aggregate = await Seeder.GetStream<SocialEvent>(streamId);
        var command = new CancelSocialEventCommand(streamId);

        //Act
        await Host.Scenario(config =>
        {
            config.Put.Json(command).ToUrl("/socialevent/cancel");
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
        Assert.Equal(aggregate.StartTime, result.StartTime);
        Assert.Equal(aggregate.EndTime, result.EndTime);
        Assert.Equal(aggregate.Venue, result.Venue);
        Assert.Equal(EventStatus.Cancelled, result.Status);
        Assert.Equal(aggregate.TicketCirculationCount, result.TicketCirculationCount);
    }
    
    [Fact]
    public async Task Cancel_ArchivedSocialEvent_Should_Fail()
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
        var command = new CancelSocialEventCommand(streamId);

        //Act & Assert
        await Host.Scenario(config =>
        {
            config.Put.Json(command).ToUrl("/socialevent/cancel");
            config.StatusCodeShouldBe(HttpStatusCode.BadRequest);
        });
    }
}