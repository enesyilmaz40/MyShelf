using LibraryApp.Domain.Enums;

namespace LibraryApp.Application.DTOs;

public record MovieDto
{
    public Guid Id { get; init; }
    public string Title { get; init; } = string.Empty;
    public string? OriginalTitle { get; init; }
    public string Director { get; init; } = string.Empty;
    public int? Year { get; init; }
    public int? Duration { get; init; }
    public string Language { get; init; } = string.Empty;
    public string? PosterUrl { get; init; }
    public string? ImdbId { get; init; }
    public string? AgeRating { get; init; }
    public string? Description { get; init; }
    public decimal? PersonalRating { get; init; }
    public string? Notes { get; init; }
    public MovieStatus Status { get; init; }
    public MovieFormat? Format { get; init; }
    public string? Platform { get; init; }
    public Guid? ShelfId { get; init; }
    public string? ShelfName { get; init; }
    public int? Position { get; init; }
    public List<string> Categories { get; init; } = new();
    public WatchingProgressDto? WatchingProgress { get; init; }
    public DateTime CreatedAt { get; init; }
    public DateTime UpdatedAt { get; init; }
}

public record CreateMovieRequest
{
    public string Title { get; init; } = string.Empty;
    public string? OriginalTitle { get; init; }
    public string Director { get; init; } = string.Empty;
    public int? Year { get; init; }
    public int? Duration { get; init; }
    public string Language { get; init; } = "Turkish";
    public string? PosterUrl { get; init; }
    public string? ImdbId { get; init; }
    public string? AgeRating { get; init; }
    public string? Description { get; init; }
    public decimal? PersonalRating { get; init; }
    public string? Notes { get; init; }
    public MovieStatus Status { get; init; }
    public MovieFormat? Format { get; init; }
    public string? Platform { get; init; }
    public Guid? ShelfId { get; init; }
    public List<Guid> CategoryIds { get; init; } = new();
}

public record UpdateMovieRequest
{
    public string Title { get; init; } = string.Empty;
    public string? OriginalTitle { get; init; }
    public string Director { get; init; } = string.Empty;
    public int? Year { get; init; }
    public int? Duration { get; init; }
    public string Language { get; init; } = "Turkish";
    public string? PosterUrl { get; init; }
    public string? ImdbId { get; init; }
    public string? AgeRating { get; init; }
    public string? Description { get; init; }
    public decimal? PersonalRating { get; init; }
    public string? Notes { get; init; }
    public MovieStatus Status { get; init; }
    public MovieFormat? Format { get; init; }
    public string? Platform { get; init; }
    public Guid? ShelfId { get; init; }
    public int? Position { get; init; }
    public List<Guid> CategoryIds { get; init; } = new();
}

public record WatchingProgressDto
{
    public Guid Id { get; init; }
    public WatchingStatus Status { get; init; }
    public int WatchCount { get; init; }
    public DateTime? FirstWatchedAt { get; init; }
    public DateTime? LastWatchedAt { get; init; }
}

public record UpdateWatchingProgressRequest
{
    public WatchingStatus Status { get; init; }
    public int WatchCount { get; init; }
    public DateTime? FirstWatchedAt { get; init; }
    public DateTime? LastWatchedAt { get; init; }
}
