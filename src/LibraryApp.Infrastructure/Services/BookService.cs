using LibraryApp.Application.DTOs;
using LibraryApp.Domain.Entities;
using LibraryApp.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;
using LibraryApp.Infrastructure.Data;

namespace LibraryApp.Infrastructure.Services;

public class BookService
{
    private readonly IRepository<Book> _bookRepository;
    private readonly IRepository<BookCategory> _bookCategoryRepository;
    private readonly IRepository<Category> _categoryRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ApplicationDbContext _context;

    public BookService(
        IRepository<Book> bookRepository,
        IRepository<BookCategory> bookCategoryRepository,
        IRepository<Category> categoryRepository,
        IUnitOfWork unitOfWork,
        ApplicationDbContext context)
    {
        _bookRepository = bookRepository;
        _bookCategoryRepository = bookCategoryRepository;
        _categoryRepository = categoryRepository;
        _unitOfWork = unitOfWork;
        _context = context;
    }

    public async Task<IEnumerable<BookDto>> GetAllBooksAsync(Guid userId, string? searchTerm = null, Guid? shelfId = null)
    {
        var query = _context.Books
            .Include(b => b.Shelf)
            .Include(b => b.BookCategories)
                .ThenInclude(bc => bc.Category)
            .Include(b => b.ReadingProgress)
            .Where(b => b.UserId == userId);

        if (!string.IsNullOrWhiteSpace(searchTerm))
        {
            var lowerSearchTerm = searchTerm.ToLower();
            query = query.Where(b => b.Title.ToLower().Contains(lowerSearchTerm) || b.Author.ToLower().Contains(lowerSearchTerm));
        }

        if (shelfId.HasValue)
        {
            query = query.Where(b => b.ShelfId == shelfId.Value);
        }

        var books = await query.ToListAsync();

        return books.Select(MapToDto);
    }

    public async Task<BookDto?> GetBookByIdAsync(Guid id, Guid userId)
    {
        var book = await _context.Books
            .Include(b => b.Shelf)
            .Include(b => b.BookCategories)
                .ThenInclude(bc => bc.Category)
            .Include(b => b.ReadingProgress)
            .FirstOrDefaultAsync(b => b.Id == id && b.UserId == userId);

        return book == null ? null : MapToDto(book);
    }

    public async Task<BookDto> CreateBookAsync(CreateBookRequest request, Guid userId)
    {
        var book = new Book
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            Title = request.Title,
            Author = request.Author,
            ISBN = request.ISBN,
            Publisher = request.Publisher,
            PublicationYear = request.PublicationYear,
            PageCount = request.PageCount,
            Language = request.Language,
            Description = request.Description,
            CoverImageUrl = request.CoverImageUrl,
            ShelfId = request.ShelfId,
            Status = request.Status
        };

        await _bookRepository.AddAsync(book);
        await _unitOfWork.SaveChangesAsync();

        // Add categories
        if (request.CategoryIds.Any())
        {
            foreach (var categoryId in request.CategoryIds)
            {
                await _bookCategoryRepository.AddAsync(new BookCategory
                {
                    BookId = book.Id,
                    CategoryId = categoryId
                });
            }
            await _unitOfWork.SaveChangesAsync();
        }

        return (await GetBookByIdAsync(book.Id, userId))!;
    }

    public async Task<BookDto?> UpdateBookAsync(Guid id, UpdateBookRequest request, Guid userId)
    {
        var book = await _context.Books
            .Include(b => b.BookCategories)
            .FirstOrDefaultAsync(b => b.Id == id && b.UserId == userId);

        if (book == null) return null;

        book.Title = request.Title;
        book.Author = request.Author;
        book.ISBN = request.ISBN;
        book.Publisher = request.Publisher;
        book.PublicationYear = request.PublicationYear;
        book.PageCount = request.PageCount;
        book.Language = request.Language;
        book.Description = request.Description;
        book.CoverImageUrl = request.CoverImageUrl;
        book.ShelfId = request.ShelfId;
        book.Position = request.Position;
        book.Status = request.Status;

        await _bookRepository.UpdateAsync(book);

        // Update categories
        var existingCategories = book.BookCategories.ToList();
        foreach (var bc in existingCategories)
        {
            await _bookCategoryRepository.DeleteAsync(bc);
        }

        foreach (var categoryId in request.CategoryIds)
        {
            await _bookCategoryRepository.AddAsync(new BookCategory
            {
                BookId = book.Id,
                CategoryId = categoryId
            });
        }

        await _unitOfWork.SaveChangesAsync();

        return await GetBookByIdAsync(id, userId);
    }

    public async Task<bool> DeleteBookAsync(Guid id, Guid userId)
    {
        var book = await _bookRepository.FindAsync(b => b.Id == id && b.UserId == userId);
        var bookToDelete = book.FirstOrDefault();

        if (bookToDelete == null) return false;

        await _bookRepository.DeleteAsync(bookToDelete);
        await _unitOfWork.SaveChangesAsync();

        return true;
    }

    private BookDto MapToDto(Book book)
    {
        return new BookDto
        {
            Id = book.Id,
            Title = book.Title,
            Author = book.Author,
            ISBN = book.ISBN,
            Publisher = book.Publisher,
            PublicationYear = book.PublicationYear,
            PageCount = book.PageCount,
            Language = book.Language,
            Description = book.Description,
            CoverImageUrl = book.CoverImageUrl,
            ShelfId = book.ShelfId,
            ShelfName = book.Shelf?.Name,
            Position = book.Position,
            Status = book.Status,
            Categories = book.BookCategories.Select(bc => bc.Category.Name).ToList(),
            ReadingProgress = book.ReadingProgress == null ? null : new ReadingProgressDto
            {
                Id = book.ReadingProgress.Id,
                CurrentPage = book.ReadingProgress.CurrentPage,
                Status = book.ReadingProgress.Status,
                StartedAt = book.ReadingProgress.StartedAt,
                CompletedAt = book.ReadingProgress.CompletedAt,
                Rating = book.ReadingProgress.Rating,
                Notes = book.ReadingProgress.Notes
            },
            CreatedAt = book.CreatedAt,
            UpdatedAt = book.UpdatedAt
        };
    }
}
