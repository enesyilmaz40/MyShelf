using LibraryApp.Application.DTOs;
using LibraryApp.Domain.Entities;
using LibraryApp.Domain.Interfaces;
using LibraryApp.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace LibraryApp.Infrastructure.Services;

public class MovieService
{
    private readonly ApplicationDbContext _context;
    private readonly IUnitOfWork _unitOfWork;

    public MovieService(ApplicationDbContext context, IUnitOfWork unitOfWork)
    {
        _context = context;
        _unitOfWork = unitOfWork;
    }

    public async Task<IEnumerable<MovieDto>> GetAllMoviesAsync(Guid userId, string? searchTerm = null, Guid? shelfId = null)
    {
        var query = _context.Movies
            .Include(m => m.Shelf)
            .Include(m => m.MovieCategories)
                .ThenInclude(mc => mc.Category)
            .Include(m => m.WatchingProgress)
            .Where(m => m.UserId == userId);

        if (!string.IsNullOrWhiteSpace(searchTerm))
        {
            var lowerSearch = searchTerm.ToLower();
            query = query.Where(m => m.Title.ToLower().Contains(lowerSearch) || 
                                    m.Director.ToLower().Contains(lowerSearch));
        }

        if (shelfId.HasValue)
        {
            query = query.Where(m => m.ShelfId == shelfId.Value);
        }

        var movies = await query.ToListAsync();

        return movies.Select(MapToDto);
    }

    public async Task<MovieDto?> GetMovieByIdAsync(Guid id, Guid userId)
    {
        var movie = await _context.Movies
            .Include(m => m.Shelf)
            .Include(m => m.MovieCategories)
                .ThenInclude(mc => mc.Category)
            .Include(m => m.WatchingProgress)
            .FirstOrDefaultAsync(m => m.Id == id && m.UserId == userId);

        return movie != null ? MapToDto(movie) : null;
    }

    public async Task<MovieDto> CreateMovieAsync(Guid userId, CreateMovieRequest request)
    {
        var movie = new Movie
        {
            Title = request.Title,
            OriginalTitle = request.OriginalTitle,
            Director = request.Director,
            Year = request.Year,
            Duration = request.Duration,
            Language = request.Language,
            PosterUrl = request.PosterUrl,
            ImdbId = request.ImdbId,
            AgeRating = request.AgeRating,
            Description = request.Description,
            PersonalRating = request.PersonalRating,
            Notes = request.Notes,
            Status = request.Status,
            Format = request.Format,
            Platform = request.Platform,
            ShelfId = request.ShelfId,
            UserId = userId
        };

        _context.Movies.Add(movie);

        // Add categories
        if (request.CategoryIds.Any())
        {
            foreach (var categoryId in request.CategoryIds)
            {
                movie.MovieCategories.Add(new MovieCategory
                {
                    MovieId = movie.Id,
                    CategoryId = categoryId
                });
            }
        }

        // Create initial watching progress
        movie.WatchingProgress = new WatchingProgress
        {
            MovieId = movie.Id,
            Status = Domain.Enums.WatchingStatus.NotStarted,
            WatchCount = 0
        };

        await _unitOfWork.SaveChangesAsync();

        return (await GetMovieByIdAsync(movie.Id, userId))!;
    }

    public async Task<MovieDto?> UpdateMovieAsync(Guid id, Guid userId, UpdateMovieRequest request)
    {
        var movie = await _context.Movies
            .Include(m => m.MovieCategories)
            .FirstOrDefaultAsync(m => m.Id == id && m.UserId == userId);

        if (movie == null) return null;

        movie.Title = request.Title;
        movie.OriginalTitle = request.OriginalTitle;
        movie.Director = request.Director;
        movie.Year = request.Year;
        movie.Duration = request.Duration;
        movie.Language = request.Language;
        movie.PosterUrl = request.PosterUrl;
        movie.ImdbId = request.ImdbId;
        movie.AgeRating = request.AgeRating;
        movie.Description = request.Description;
        movie.PersonalRating = request.PersonalRating;
        movie.Notes = request.Notes;
        movie.Status = request.Status;
        movie.Format = request.Format;
        movie.Platform = request.Platform;
        movie.ShelfId = request.ShelfId;
        movie.Position = request.Position;

        // Update categories
        movie.MovieCategories.Clear();
        if (request.CategoryIds.Any())
        {
            foreach (var categoryId in request.CategoryIds)
            {
                movie.MovieCategories.Add(new MovieCategory
                {
                    MovieId = movie.Id,
                    CategoryId = categoryId
                });
            }
        }

        await _unitOfWork.SaveChangesAsync();

        return await GetMovieByIdAsync(id, userId);
    }

    public async Task<bool> DeleteMovieAsync(Guid id, Guid userId)
    {
        var movie = await _context.Movies
            .FirstOrDefaultAsync(m => m.Id == id && m.UserId == userId);

        if (movie == null) return false;

        _context.Movies.Remove(movie);
        await _unitOfWork.SaveChangesAsync();

        return true;
    }

    public async Task<WatchingProgressDto?> UpdateWatchingProgressAsync(Guid movieId, Guid userId, UpdateWatchingProgressRequest request)
    {
        var movie = await _context.Movies
            .Include(m => m.WatchingProgress)
            .FirstOrDefaultAsync(m => m.Id == movieId && m.UserId == userId);

        if (movie == null) return null;

        if (movie.WatchingProgress == null)
        {
            movie.WatchingProgress = new WatchingProgress
            {
                MovieId = movieId
            };
        }

        movie.WatchingProgress.Status = request.Status;
        movie.WatchingProgress.WatchCount = request.WatchCount;
        movie.WatchingProgress.FirstWatchedAt = request.FirstWatchedAt;
        movie.WatchingProgress.LastWatchedAt = request.LastWatchedAt;

        await _unitOfWork.SaveChangesAsync();

        return MapWatchingProgressToDto(movie.WatchingProgress);
    }

    private MovieDto MapToDto(Movie movie)
    {
        return new MovieDto
        {
            Id = movie.Id,
            Title = movie.Title,
            OriginalTitle = movie.OriginalTitle,
            Director = movie.Director,
            Year = movie.Year,
            Duration = movie.Duration,
            Language = movie.Language,
            PosterUrl = movie.PosterUrl,
            ImdbId = movie.ImdbId,
            AgeRating = movie.AgeRating,
            Description = movie.Description,
            PersonalRating = movie.PersonalRating,
            Notes = movie.Notes,
            Status = movie.Status,
            Format = movie.Format,
            Platform = movie.Platform,
            ShelfId = movie.ShelfId,
            ShelfName = movie.Shelf?.Name,
            Position = movie.Position,
            Categories = movie.MovieCategories.Select(mc => mc.Category.Name).ToList(),
            WatchingProgress = movie.WatchingProgress != null ? MapWatchingProgressToDto(movie.WatchingProgress) : null,
            CreatedAt = movie.CreatedAt,
            UpdatedAt = movie.UpdatedAt
        };
    }

    private WatchingProgressDto MapWatchingProgressToDto(WatchingProgress progress)
    {
        return new WatchingProgressDto
        {
            Id = progress.Id,
            Status = progress.Status,
            WatchCount = progress.WatchCount,
            FirstWatchedAt = progress.FirstWatchedAt,
            LastWatchedAt = progress.LastWatchedAt
        };
    }
}
