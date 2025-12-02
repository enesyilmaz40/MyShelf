using LibraryApp.Domain.Enums;

namespace LibraryApp.Domain.Entities;

public class ReadingProgress : BaseEntity
{
    public Guid BookId { get; set; }
    public Guid UserId { get; set; }
    public int CurrentPage { get; set; }
    public ReadingStatus Status { get; set; } = ReadingStatus.NotStarted;
    public DateTime? StartedAt { get; set; }
    public DateTime? CompletedAt { get; set; }
    public int? Rating { get; set; }
    public string? Notes { get; set; }

    // Navigation properties
    public Book Book { get; set; } = null!;
    public User User { get; set; } = null!;
}
