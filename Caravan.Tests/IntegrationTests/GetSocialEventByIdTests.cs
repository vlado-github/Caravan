using Alba;
using Caravan.Tests.Base;
using Caravan.Domain.SocialEventFeature.Schema.Aggregates;
using Caravan.Domain.SocialEventFeature.Schema.Projections;

namespace Caravan.Tests.IntegrationTests;

public class GetSocialEventByIdTests : IntegrationTestBase
{
    public GetSocialEventByIdTests(IntegrationTestFixture fixture) : base(fixture)
    {
    }

    [Fact]
    public async Task Get_SocialEvent_ById_Should_Succeed()
    {
        //Arrange
        var streamId = Guid.NewGuid();
        await Seeder.SeedStream<SocialEvent>(streamId);
        var aggregate = await Seeder.GetStream<SocialEvent>(streamId);

        //Act
        var response = await Host.Scenario(config =>
        {
            config.Get.Url($"/socialevent/{streamId}");
            config.StatusCodeShouldBeOk();
        });

        //Assert
        var result = await response.ReadAsJsonAsync<SocialEventProfileDetails>();
        Assert.NotNull(result);
        Assert.NotEqual(Guid.Empty, result.Id);
        Assert.Equal(aggregate.Title, result.Title);
        Assert.Equal(aggregate.Description, result.Description);
        Assert.Equal(aggregate.Type, result.Type);
        Assert.Equal(aggregate.StartTime, result.StartTime);
        Assert.Equal(aggregate.EndTime, result.EndTime);
        Assert.Equal(aggregate.Venue, result.Venue);
        Assert.Equal(aggregate.TicketCirculationCount, result.TicketCirculationCount);
    }
}