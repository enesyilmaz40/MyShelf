using LibraryApp.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace LibraryApp.Infrastructure.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users { get; set; }
    public DbSet<Book> Books { get; set; }
    public DbSet<Shelf> Shelves { get; set; }
    public DbSet<Category> Categories { get; set; }
    public DbSet<BookCategory> BookCategories { get; set; }
    public DbSet<ReadingProgress> ReadingProgresses { get; set; }
    
    // Movie entities
    public DbSet<Movie> Movies { get; set; }
    public DbSet<MovieCategory> MovieCategories { get; set; }
    public DbSet<WatchingProgress> WatchingProgresses { get; set; }
    
    // Social entities
    public DbSet<Friendship> Friendships { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // User configuration
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.Email).IsUnique();
            entity.Property(e => e.Email).IsRequired().HasMaxLength(255);
            entity.Property(e => e.PasswordHash).IsRequired();
            entity.Property(e => e.FirstName).IsRequired().HasMaxLength(100);
            entity.Property(e => e.LastName).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Bio).HasMaxLength(500);
            entity.Property(e => e.AvatarUrl).HasMaxLength(1000);
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
            entity.Property(e => e.UpdatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
        });

        // Book configuration
        modelBuilder.Entity<Book>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Title).IsRequired().HasMaxLength(500);
            entity.Property(e => e.Author).IsRequired().HasMaxLength(255);
            entity.Property(e => e.ISBN).HasMaxLength(20);
            entity.Property(e => e.Publisher).HasMaxLength(255);
            entity.Property(e => e.Language).HasMaxLength(50);
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
            entity.Property(e => e.UpdatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");

            entity.HasOne(e => e.User)
                .WithMany(u => u.Books)
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.Shelf)
                .WithMany(s => s.Books)
                .HasForeignKey(e => e.ShelfId)
                .OnDelete(DeleteBehavior.SetNull);

            entity.HasIndex(e => e.Title);
            entity.HasIndex(e => e.Author);
            entity.HasIndex(e => e.ISBN);
        });

        // Shelf configuration
        modelBuilder.Entity<Shelf>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Location).HasMaxLength(200);
            entity.Property(e => e.Color).HasMaxLength(50);
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
            entity.Property(e => e.UpdatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");

            entity.HasOne(e => e.User)
                .WithMany(u => u.Shelves)
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // Category configuration
        modelBuilder.Entity<Category>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Color).HasMaxLength(50);
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
            entity.Property(e => e.UpdatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");

            entity.HasOne(e => e.User)
                .WithMany(u => u.Categories)
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // BookCategory (Many-to-Many) configuration
        modelBuilder.Entity<BookCategory>(entity =>
        {
            entity.HasKey(bc => new { bc.BookId, bc.CategoryId });

            entity.HasOne(bc => bc.Book)
                .WithMany(b => b.BookCategories)
                .HasForeignKey(bc => bc.BookId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(bc => bc.Category)
                .WithMany(c => c.BookCategories)
                .HasForeignKey(bc => bc.CategoryId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // ReadingProgress configuration
        modelBuilder.Entity<ReadingProgress>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
            entity.Property(e => e.UpdatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");

            entity.HasOne(e => e.Book)
                .WithOne(b => b.ReadingProgress)
                .HasForeignKey<ReadingProgress>(e => e.BookId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.User)
                .WithMany()
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasIndex(e => new { e.BookId, e.UserId }).IsUnique();
        });

        // Movie configuration
        modelBuilder.Entity<Movie>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Title).IsRequired().HasMaxLength(500);
            entity.Property(e => e.Director).IsRequired().HasMaxLength(255);
            entity.Property(e => e.Language).HasMaxLength(50);
            entity.Property(e => e.PosterUrl).HasMaxLength(1000);
            entity.Property(e => e.ImdbId).HasMaxLength(20);
            entity.Property(e => e.AgeRating).HasMaxLength(10);
            entity.Property(e => e.Platform).HasMaxLength(100);
            entity.Property(e => e.PersonalRating).HasPrecision(3, 1);
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
            entity.Property(e => e.UpdatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");

            entity.HasOne(e => e.User)
                .WithMany(u => u.Movies)
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.Shelf)
                .WithMany(s => s.Movies)
                .HasForeignKey(e => e.ShelfId)
                .OnDelete(DeleteBehavior.SetNull);

            entity.HasIndex(e => e.Title);
            entity.HasIndex(e => e.Director);
        });

        // MovieCategory (Many-to-Many) configuration
        modelBuilder.Entity<MovieCategory>(entity =>
        {
            entity.HasKey(mc => new { mc.MovieId, mc.CategoryId });

            entity.HasOne(mc => mc.Movie)
                .WithMany(m => m.MovieCategories)
                .HasForeignKey(mc => mc.MovieId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(mc => mc.Category)
                .WithMany(c => c.MovieCategories)
                .HasForeignKey(mc => mc.CategoryId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // WatchingProgress configuration
        modelBuilder.Entity<WatchingProgress>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
            entity.Property(e => e.UpdatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");

            entity.HasOne(e => e.Movie)
                .WithOne(m => m.WatchingProgress)
                .HasForeignKey<WatchingProgress>(e => e.MovieId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasIndex(e => e.MovieId).IsUnique();
        });
        
        // Friendship configuration
        modelBuilder.Entity<Friendship>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
            entity.Property(e => e.UpdatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");

            entity.HasOne(e => e.Requester)
                .WithMany(u => u.SentFriendRequests)
                .HasForeignKey(e => e.RequesterId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.Addressee)
                .WithMany(u => u.ReceivedFriendRequests)
                .HasForeignKey(e => e.AddresseeId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasIndex(e => new { e.RequesterId, e.AddresseeId }).IsUnique();
        });
    }

    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        var entries = ChangeTracker.Entries()
            .Where(e => e.Entity is BaseEntity && (e.State == EntityState.Added || e.State == EntityState.Modified));

        foreach (var entry in entries)
        {
            var entity = (BaseEntity)entry.Entity;
            entity.UpdatedAt = DateTime.UtcNow;

            if (entry.State == EntityState.Added)
            {
                entity.CreatedAt = DateTime.UtcNow;
            }
        }

        return base.SaveChangesAsync(cancellationToken);
    }
}
