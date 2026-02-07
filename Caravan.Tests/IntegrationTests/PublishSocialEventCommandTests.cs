using Alba;
using Caravan.Tests.Base;
using Caravan.Domain.Shared.Enums;
using Caravan.Domain.SocialEventFeature.Commands;
using Caravan.Domain.SocialEventFeature.Schema.Aggregates;
using Caravan.Domain.SocialEventFeature.Schema.Projections;

namespace Caravan.Tests.IntegrationTests;

public class PublishSocialEventCommandTests : IntegrationTestBase
{
    public PublishSocialEventCommandTests(IntegrationTestFixture fixture) : base(fixture)
    {
    }

    [Fact]
    public async Task Publish_SocialEvent_Should_Succeed()
    {
        //Arrange
        var streamId = Guid.NewGuid();
        await Seeder.SeedStream<SocialEvent>(streamId);
        var aggregate = await Seeder.GetStream<SocialEvent>(streamId);
        var command = new PublishSocialEventCommand(streamId);

        //Act
        await Host.Scenario(config =>
        {
            config.Put.Json(command).ToUrl("/socialevent/publish");
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
        Assert.Equal(EventStatus.Published, result.Status);
        Assert.Equal(aggregate.TicketCirculationCount, result.TicketCirculationCount);
    }
}