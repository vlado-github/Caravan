using Bogus;
using Marten;
using Caravan.Domain.Base;
using Caravan.Domain.Shared.Enums;
using Caravan.Domain.Shared.Exceptions;
using Caravan.Domain.SocialEventFeature.Events;
using Caravan.Domain.SocialEventFeature.Schema.Aggregates;
using Caravan.Domain.SocialGroupFeature.Schema.Documents;

namespace Caravan.Tests.Base;


public class DataSeeder : IAsyncDisposable
{
    private readonly IDocumentStore _store;
    private readonly Faker _faker;
    private IList<Guid> _streamIdsToRemove;
    private IList<Guid> _documentIdsToRemove;

    public DataSeeder(IDocumentStore store)
    {
        _store = store;
        _faker = new Faker();
        _streamIdsToRemove = new List<Guid>();
        _documentIdsToRemove = new List<Guid>();
    }

    public Faker Faker => _faker;

    public async Task<TAggregate> GetStream<TAggregate>(Guid streamId)
    where TAggregate : class
    {
        await using var session = _store.QuerySession();
        var aggregate = await session.Events.AggregateStreamAsync<TAggregate>(streamId);
        if (aggregate == null)
        {
            throw new RecordNotFoundException(streamId);   
        }
        return aggregate;
    }

    public async Task SeedStream<TAggregate>(Guid streamId, IList<EventBase>? additionalEvents = null)
    {
        var events = new List<EventBase>();
        if (typeof(TAggregate) == typeof(SocialEvent))
        {
            events.Add(    
                new SocialEventDrafted()
                {
                    Title = _faker.Lorem.Sentence(3),
                    Description = _faker.Lorem.Paragraph(),
                    Type = EventType.OnSite,
                    SocialGroupId = null,
                    StartTime = DateTimeOffset.UtcNow.AddDays(10),
                    EndTime = DateTimeOffset.UtcNow.AddDays(10).AddHours(2),
                    Venue = _faker.Address.FullAddress(),
                    TicketCirculationCount = _faker.Random.Int(50, 5000),
                });
            if (additionalEvents != null)
            {
                events.AddRange(additionalEvents);
            }
        }
        
        await using var session = _store.LightweightSession();
        var stream = session.Events.StartStream<SocialEvent>(streamId, events);
        await session.SaveChangesAsync();
        _streamIdsToRemove.Add(stream.Id);
    }

    public async Task SeedDocument<TDocument>(TDocument document) where TDocument : DocumentBase
    {
        await using var session = _store.LightweightSession();
        session.Store(document);
        await session.SaveChangesAsync();
        _documentIdsToRemove.Add(document.Id);
    }

    public async Task CleanupAsync()
    {
        await using var session = _store.LightweightSession();
        foreach (var streamId in _streamIdsToRemove)
        {
            session.Events.ArchiveStream(streamId);
        }

        if (_documentIdsToRemove.Count > 0)
        {
            session.DeleteWhere<SocialGroup>(x => _documentIdsToRemove.Contains(x.Id));
        }

        await session.SaveChangesAsync();

        _streamIdsToRemove.Clear();
        _documentIdsToRemove.Clear();
    }

    public async ValueTask DisposeAsync()
    {
        await CleanupAsync();
    }
}