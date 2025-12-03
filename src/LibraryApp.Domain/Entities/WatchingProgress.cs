using LibraryApp.Domain.Enums;

namespace LibraryApp.Domain.Entities;

public class WatchingProgress : BaseEntity
{
    public Guid MovieId { get; set; }
    public Movie Movie { get; set; } = null!;
    
    public WatchingStatus Status { get; set; }
    public int WatchCount { get; set; }
    public DateTime? FirstWatchedAt { get; set; }
    public DateTime? LastWatchedAt { get; set; }
}
