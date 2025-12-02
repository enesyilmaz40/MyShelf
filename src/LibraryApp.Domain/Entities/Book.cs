using LibraryApp.Domain.Enums;

namespace LibraryApp.Domain.Entities;

public class Book : BaseEntity
{
    public Guid UserId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Author { get; set; } = string.Empty;
    public string? ISBN { get; set; }
    public string? Publisher { get; set; }
    public int? PublicationYear { get; set; }
    public int? PageCount { get; set; }
    public string Language { get; set; } = "Turkish";
    public string? Description { get; set; }
    public string? CoverImageUrl { get; set; }
    public Guid? ShelfId { get; set; }
    public int? Position { get; set; }
    public BookStatus Status { get; set; } = BookStatus.Owned;

    // Navigation properties
    public User User { get; set; } = null!;
    public Shelf? Shelf { get; set; }
    public ICollection<BookCategory> BookCategories { get; set; } = new List<BookCategory>();
    public ReadingProgress? ReadingProgress { get; set; }
}
