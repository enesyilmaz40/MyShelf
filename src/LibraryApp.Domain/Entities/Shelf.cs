namespace LibraryApp.Domain.Entities;

public class Shelf : BaseEntity
{
    public Guid UserId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Location { get; set; }
    public int? Row { get; set; }
    public string? Description { get; set; }
    public string? Color { get; set; }
    public int? Capacity { get; set; }

    // Navigation properties
    public User User { get; set; } = null!;
    public ICollection<Book> Books { get; set; } = new List<Book>();
}
