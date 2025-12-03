using LibraryApp.Domain.Enums;

namespace LibraryApp.Domain.Entities;

public class Movie : BaseEntity
{
    // Basic Information
    public string Title { get; set; } = string.Empty;
    public string? OriginalTitle { get; set; }
    public string Director { get; set; } = string.Empty;
    public int? Year { get; set; }
    public int? Duration { get; set; } // in minutes
    public string Language { get; set; } = "Turkish";
    
    // Visual and Metadata
    public string? PosterUrl { get; set; }
    public string? ImdbId { get; set; }
    public string? AgeRating { get; set; } // 7+, 13+, 18+
    
    // Content
    public string? Description { get; set; }
    public decimal? PersonalRating { get; set; } // 1-10
    public string? Notes { get; set; }
    
    // Ownership
    public MovieStatus Status { get; set; }
    public MovieFormat? Format { get; set; }
    public string? Platform { get; set; }
    
    // Relationships
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;
    
    public Guid? ShelfId { get; set; }
    public Shelf? Shelf { get; set; }
    public int? Position { get; set; }
    
    public ICollection<MovieCategory> MovieCategories { get; set; } = new List<MovieCategory>();
    public WatchingProgress? WatchingProgress { get; set; }
}
