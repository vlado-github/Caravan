using Caravan.Domain.Base;

namespace Caravan.Domain.SocialGroupFeature.Schema.Documents;

public class SocialGroup : DocumentBase
{
    public string Name { get; set; }
    
    #region audit records
    
    public Guid CreatedById { get; init; }
    public DateTimeOffset CreatedAt { get; init; } = DateTimeOffset.UtcNow;
    public Guid? ModifiedById { get; set; } = null;
    public DateTimeOffset? ModifiedAt { get; set; }

    #endregion audit records
}