using Alba;
using Alba.Security;
using Bogus;
using Caravan.Domain.Base;
using Marten;
using Microsoft.Extensions.DependencyInjection;
using NSubstitute;

namespace Caravan.Tests.Base;

public class IntegrationTestFixture : IAsyncLifetime
{
    public IAlbaHost Host = null!;
    public DataSeeder Seeder { get; private set; }
    public IUserContext MockedUserContext;
    private AuthenticationStub _securityStub;

    public IntegrationTestFixture()
    {
        MockedUserContext = Substitute.For<IUserContext>();
        var userId = Guid.NewGuid();
        var userFullname = new Faker().Person.FullName;
        
        MockedUserContext.UserId.Returns(userId);
        MockedUserContext.UserFullname.Returns(userFullname);
        
        _securityStub = new AuthenticationStub()
            .With("sub", userId.ToString())
            .WithName(userFullname);
    }
    
    public async Task InitializeAsync()
    {
        Host = await AlbaHost.For<global::Program>(x =>
        {
            x.ConfigureServices((context, services) =>
            {
                // add mocked dependencies
                services.AddSingleton<IUserContext>(MockedUserContext);
            });
        }, _securityStub);
        Seeder = new DataSeeder(Host.Services.GetRequiredService<IDocumentStore>());
    }

    public async Task DisposeAsync()
    {
        await Seeder.DisposeAsync();
        await Host.DisposeAsync();
    }
}