namespace LibraryApp.Domain.Entities;

public class MovieCategory
{
    public Guid MovieId { get; set; }
    public Movie Movie { get; set; } = null!;
    
    public Guid CategoryId { get; set; }
    public Category Category { get; set; } = null!;
}
