using System.Net;
using Alba;
using Caravan.Tests.Base;
using Caravan.Domain.Base;
using Caravan.Domain.Shared.Enums;
using Caravan.Domain.SocialEventFeature.Commands;
using Caravan.Domain.SocialEventFeature.Schema.Aggregates;
using Caravan.Domain.SocialEventFeature.Schema.Projections;

namespace Caravan.Tests.IntegrationTests;

public class CreateSocialEventCommandTests : IntegrationTestBase
{
    public CreateSocialEventCommandTests(IntegrationTestFixture fixture) : base(fixture)
    {
    }

    [Fact]
    public async Task Create_SocialEvent_Should_Succeed()
    {
        //Arrange
        var command = new CreateSocialEventCommand(
            Title: Seeder.Faker.Lorem.Sentence(3),
            Description: Seeder.Faker.Lorem.Paragraph(),
            Type: EventType.OnSite,
            SocialGroupId: null,
            StartTime: DateTimeOffset.UtcNow.AddDays(10),
            EndTime: DateTimeOffset.UtcNow.AddDays(10).AddHours(2),
            Venue: Seeder.Faker.Address.FullAddress(),
            TicketCirculationCount: 100
        );

        //Act
        var createResponse = await Host.Scenario(config =>
        {
            config.Post.Json(command).ToUrl("/socialevent");
            config.StatusCodeShouldBeOk();
        });

        //Assert
        var createResult = await createResponse.ReadAsJsonAsync<CommandResult>();
        Assert.NotNull(createResult);
        Assert.NotEqual(Guid.Empty, createResult.Id);

        //Act
        var getResponse = await Host.Scenario(config =>
        {
            config.Get.Url($"/socialevent/{createResult.Id}");
            config.StatusCodeShouldBeOk();
        });

        //Assert
        var result = await getResponse.ReadAsJsonAsync<SocialEventProfileDetails>();
        Assert.NotNull(result);
        Assert.Equal(command.Title, result.Title);
        Assert.Equal(command.Description, result.Description);
        Assert.Equal(command.Type, result.Type);
        Assert.Equal(command.StartTime, result.StartTime);
        Assert.Equal(command.EndTime, result.EndTime);
        Assert.Equal(command.Venue, result.Venue);
        Assert.Equal(command.TicketCirculationCount, result.TicketCirculationCount);
    }
    
    [Fact]
    public async Task Create_SocialEvent_WithWrongEndTime_Should_Fail()
    {
        //Arrange
        //Arrange
        var command = new CreateSocialEventCommand(
            Title: Seeder.Faker.Lorem.Sentence(3),
            Description: Seeder.Faker.Lorem.Paragraph(),
            Type: EventType.OnSite,
            SocialGroupId: null,
            StartTime: DateTimeOffset.UtcNow.AddDays(10),
            EndTime: DateTimeOffset.UtcNow,
            Venue: Seeder.Faker.Address.FullAddress(),
            TicketCirculationCount: 100
        );

        //Act & Assert
        await Host.Scenario(config =>
        {
            config.Post.Json(command).ToUrl("/socialevent");
            config.StatusCodeShouldBe(HttpStatusCode.BadRequest);
        });
    }
}