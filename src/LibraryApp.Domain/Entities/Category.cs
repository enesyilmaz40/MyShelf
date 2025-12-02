namespace LibraryApp.Domain.Entities;

public class Category : BaseEntity
{
    public Guid UserId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Color { get; set; }

    // Navigation properties
    public User User { get; set; } = null!;
    public ICollection<BookCategory> BookCategories { get; set; } = new List<BookCategory>();
}
