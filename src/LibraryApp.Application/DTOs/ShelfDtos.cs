namespace LibraryApp.Application.DTOs;

public class ShelfDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Location { get; set; }
    public int? Row { get; set; }
    public string? Description { get; set; }
    public string? Color { get; set; }
    public int? Capacity { get; set; }
    public int BookCount { get; set; }
    public List<BookDto> Books { get; set; } = new();
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class CreateShelfRequest
{
    public string Name { get; set; } = string.Empty;
    public string? Location { get; set; }
    public int? Row { get; set; }
    public string? Description { get; set; }
    public string? Color { get; set; }
    public int? Capacity { get; set; }
}

public class UpdateShelfRequest
{
    public string Name { get; set; } = string.Empty;
    public string? Location { get; set; }
    public int? Row { get; set; }
    public string? Description { get; set; }
    public string? Color { get; set; }
    public int? Capacity { get; set; }
}
