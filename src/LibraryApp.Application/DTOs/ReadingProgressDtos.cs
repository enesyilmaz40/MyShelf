using LibraryApp.Domain.Enums;

namespace LibraryApp.Application.DTOs;

public class ReadingProgressDto
{
    public Guid Id { get; set; }
    public int CurrentPage { get; set; }
    public ReadingStatus Status { get; set; }
    public DateTime? StartedAt { get; set; }
    public DateTime? CompletedAt { get; set; }
    public int? Rating { get; set; }
    public string? Notes { get; set; }
}

public class UpdateReadingProgressRequest
{
    public int CurrentPage { get; set; }
    public ReadingStatus Status { get; set; }
    public int? Rating { get; set; }
    public string? Notes { get; set; }
}
