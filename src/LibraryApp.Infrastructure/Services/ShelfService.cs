using LibraryApp.Application.DTOs;
using LibraryApp.Domain.Entities;
using LibraryApp.Domain.Interfaces;
using LibraryApp.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace LibraryApp.Infrastructure.Services;

public class ShelfService
{
    private readonly IRepository<Shelf> _shelfRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ApplicationDbContext _context;

    public ShelfService(IRepository<Shelf> shelfRepository, IUnitOfWork unitOfWork, ApplicationDbContext context)
    {
        _shelfRepository = shelfRepository;
        _unitOfWork = unitOfWork;
        _context = context;
    }

    public async Task<IEnumerable<ShelfDto>> GetAllShelvesAsync(Guid userId, bool includeBooks = false)
    {
        var query = _context.Shelves.Where(s => s.UserId == userId);

        if (includeBooks)
        {
            query = query.Include(s => s.Books)
                .ThenInclude(b => b.BookCategories)
                .ThenInclude(bc => bc.Category);
        }

        var shelves = await query.ToListAsync();

        return shelves.Select(s => MapToDto(s, includeBooks));
    }

    public async Task<ShelfDto?> GetShelfByIdAsync(Guid id, Guid userId)
    {
        var shelf = await _context.Shelves
            .Include(s => s.Books.OrderBy(b => b.Position))
                .ThenInclude(b => b.BookCategories)
                .ThenInclude(bc => bc.Category)
            .Include(s => s.Books)
                .ThenInclude(b => b.ReadingProgress)
            .FirstOrDefaultAsync(s => s.Id == id && s.UserId == userId);

        return shelf == null ? null : MapToDto(shelf, true);
    }

    public async Task<ShelfDto> CreateShelfAsync(CreateShelfRequest request, Guid userId)
    {
        var shelf = new Shelf
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            Name = request.Name,
            Location = request.Location,
            Row = request.Row,
            Description = request.Description,
            Color = request.Color,
            Capacity = request.Capacity
        };

        await _shelfRepository.AddAsync(shelf);
        await _unitOfWork.SaveChangesAsync();

        return (await GetShelfByIdAsync(shelf.Id, userId))!;
    }

    public async Task<ShelfDto?> UpdateShelfAsync(Guid id, UpdateShelfRequest request, Guid userId)
    {
        var shelves = await _shelfRepository.FindAsync(s => s.Id == id && s.UserId == userId);
        var shelf = shelves.FirstOrDefault();

        if (shelf == null) return null;

        shelf.Name = request.Name;
        shelf.Location = request.Location;
        shelf.Row = request.Row;
        shelf.Description = request.Description;
        shelf.Color = request.Color;
        shelf.Capacity = request.Capacity;

        await _shelfRepository.UpdateAsync(shelf);
        await _unitOfWork.SaveChangesAsync();

        return await GetShelfByIdAsync(id, userId);
    }

    public async Task<bool> DeleteShelfAsync(Guid id, Guid userId)
    {
        var shelves = await _shelfRepository.FindAsync(s => s.Id == id && s.UserId == userId);
        var shelf = shelves.FirstOrDefault();

        if (shelf == null) return false;

        await _shelfRepository.DeleteAsync(shelf);
        await _unitOfWork.SaveChangesAsync();

        return true;
    }

    private ShelfDto MapToDto(Shelf shelf, bool includeBooks)
    {
        var dto = new ShelfDto
        {
            Id = shelf.Id,
            Name = shelf.Name,
            Location = shelf.Location,
            Row = shelf.Row,
            Description = shelf.Description,
            Color = shelf.Color,
            Capacity = shelf.Capacity,
            BookCount = shelf.Books.Count,
            CreatedAt = shelf.CreatedAt,
            UpdatedAt = shelf.UpdatedAt
        };

        if (includeBooks)
        {
            dto.Books = shelf.Books.Select(b => new BookDto
            {
                Id = b.Id,
                Title = b.Title,
                Author = b.Author,
                ISBN = b.ISBN,
                Publisher = b.Publisher,
                PublicationYear = b.PublicationYear,
                PageCount = b.PageCount,
                Language = b.Language,
                Description = b.Description,
                CoverImageUrl = b.CoverImageUrl,
                ShelfId = b.ShelfId,
                Position = b.Position,
                Status = b.Status,
                Categories = b.BookCategories.Select(bc => bc.Category.Name).ToList(),
                ReadingProgress = b.ReadingProgress == null ? null : new ReadingProgressDto
                {
                    Id = b.ReadingProgress.Id,
                    CurrentPage = b.ReadingProgress.CurrentPage,
                    Status = b.ReadingProgress.Status,
                    StartedAt = b.ReadingProgress.StartedAt,
                    CompletedAt = b.ReadingProgress.CompletedAt,
                    Rating = b.ReadingProgress.Rating,
                    Notes = b.ReadingProgress.Notes
                },
                CreatedAt = b.CreatedAt,
                UpdatedAt = b.UpdatedAt
            }).ToList();
        }

        return dto;
    }
}
