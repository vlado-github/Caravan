using Alba;
using Caravan.Domain.Base;

namespace Caravan.Tests.Base;

public abstract class IntegrationTestBase : IClassFixture<IntegrationTestFixture>, IAsyncLifetime
{
    protected readonly IAlbaHost Host;
    protected readonly DataSeeder Seeder;
    protected readonly IUserContext UserContext;

    protected IntegrationTestBase(IntegrationTestFixture fixture)
    {
        Host = fixture.Host;
        Seeder = fixture.Seeder;
        UserContext = fixture.MockedUserContext;
    }

    public Task InitializeAsync() => Task.CompletedTask;

    public Task DisposeAsync() => Seeder.CleanupAsync();
}