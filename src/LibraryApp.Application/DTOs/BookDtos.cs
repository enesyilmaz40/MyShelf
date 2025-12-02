using LibraryApp.Domain.Enums;

namespace LibraryApp.Application.DTOs;

public class BookDto
{
    public Guid Id { get; set; }
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
    public string? ShelfName { get; set; }
    public int? Position { get; set; }
    public BookStatus Status { get; set; }
    public List<string> Categories { get; set; } = new();
    public ReadingProgressDto? ReadingProgress { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class CreateBookRequest
{
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
    public BookStatus Status { get; set; } = BookStatus.Owned;
    public List<Guid> CategoryIds { get; set; } = new();
}

public class UpdateBookRequest
{
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
    public BookStatus Status { get; set; }
    public List<Guid> CategoryIds { get; set; } = new();
}


