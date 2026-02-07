using Alba;
using Caravan.Tests.Base;
using Caravan.Domain.Base;
using Caravan.Domain.SocialGroupFeature.Schema.Documents;

namespace Caravan.Tests.IntegrationTests;

public class GetSocialGroupsListTests : IntegrationTestBase
{
    public GetSocialGroupsListTests(IntegrationTestFixture fixture) : base(fixture)
    {
    }

    [Fact]
    public async Task Get_GroupsList_Should_Return_FirstPage_WithCorrectPagination()
    {
        // Arrange
        var totalGroups = 7;
        var pageNumber = 1;
        var pageSize = 3;

        await SeedGroups(totalGroups);

        // Act
        var response = await Host.Scenario(config =>
        {
            config.Get.Url($"/socialgroup/list?pageNumber={pageNumber}&pageSize={pageSize}");
            config.StatusCodeShouldBeOk();
        });

        // Assert
        var result = await response.ReadAsJsonAsync<PagedResult<SocialGroup>>();
        Assert.NotNull(result);
        Assert.Equal(pageSize, result.PageSize);
        Assert.Equal(pageNumber, result.PageNumber);
        Assert.True(result.IsFirstPage);
        Assert.False(result.HasPreviousPage);
        Assert.True(result.HasNextPage);
        Assert.Equal(pageSize, result.Items.Count);
        Assert.All(result.Items, item => Assert.NotEqual(Guid.Empty, item.Id));
        Assert.All(result.Items, item => Assert.NotEmpty(item.Name));
    }

    [Fact]
    public async Task Get_GroupsList_Should_Return_MiddlePage_WithCorrectPagination()
    {
        // Arrange
        var totalGroups = 9;
        var pageNumber = 2;
        var pageSize = 3;

        await SeedGroups(totalGroups);

        // Act
        var response = await Host.Scenario(config =>
        {
            config.Get.Url($"/socialgroup/list?pageNumber={pageNumber}&pageSize={pageSize}");
            config.StatusCodeShouldBeOk();
        });

        // Assert
        var result = await response.ReadAsJsonAsync<PagedResult<SocialGroup>>();
        Assert.NotNull(result);
        Assert.Equal(pageSize, result.PageSize);
        Assert.Equal(pageNumber, result.PageNumber);
        Assert.False(result.IsFirstPage);
        Assert.True(result.HasPreviousPage);
        Assert.True(result.HasNextPage);
        Assert.False(result.IsLastPage);
    }

    [Fact]
    public async Task Get_GroupsList_Should_Return_LastPage_WithCorrectPagination()
    {
        // Arrange
        var totalGroups = 7;
        var pageNumber = 3;
        var pageSize = 3;

        await SeedGroups(totalGroups);

        // Act
        var response = await Host.Scenario(config =>
        {
            config.Get.Url($"/socialgroup/list?pageNumber={pageNumber}&pageSize={pageSize}");
            config.StatusCodeShouldBeOk();
        });

        // Assert
        var result = await response.ReadAsJsonAsync<PagedResult<SocialGroup>>();
        Assert.NotNull(result);
        Assert.Equal(pageSize, result.PageSize);
        Assert.Equal(pageNumber, result.PageNumber);
        Assert.False(result.IsFirstPage);
        Assert.True(result.HasPreviousPage);
        Assert.False(result.HasNextPage);
        Assert.True(result.IsLastPage);
    }

    private async Task SeedGroups(int count)
    {
        for (var i = 0; i < count; i++)
        {
            var group = new SocialGroup
            {
                Id = Guid.NewGuid(),
                Name = Seeder.Faker.Company.CompanyName(),
                CreatedById = UserContext.UserId,
                CreatedAt = DateTimeOffset.UtcNow
            };
            await Seeder.SeedDocument(group);
        }
    }
}
