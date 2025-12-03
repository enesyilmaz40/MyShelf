namespace LibraryApp.Domain.Entities;

public class User : BaseEntity
{
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string? RefreshToken { get; set; }
    public DateTime? RefreshTokenExpiryTime { get; set; }
    
    // Profile fields
    public string? Bio { get; set; }
    public string? AvatarUrl { get; set; }
    public bool IsPublicProfile { get; set; } = true;

    // Navigation properties
    public ICollection<Book> Books { get; set; } = new List<Book>();
    public ICollection<Movie> Movies { get; set; } = new List<Movie>();
    public ICollection<Shelf> Shelves { get; set; } = new List<Shelf>();
    public ICollection<Category> Categories { get; set; } = new List<Category>();
    
    // Friendships
    public ICollection<Friendship> SentFriendRequests { get; set; } = new List<Friendship>();
    public ICollection<Friendship> ReceivedFriendRequests { get; set; } = new List<Friendship>();
}
