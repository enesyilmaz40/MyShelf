using LibraryApp.Application.DTOs;
using LibraryApp.Infrastructure.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace LibraryApp.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class BooksController : ControllerBase
{
    private readonly BookService _bookService;

    public BooksController(BookService bookService)
    {
        _bookService = bookService;
    }

    private Guid GetUserId()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        return Guid.Parse(userId!);
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<BookDto>>> GetAllBooks([FromQuery] string? search, [FromQuery] Guid? shelfId)
    {
        try
        {
            var books = await _bookService.GetAllBooksAsync(GetUserId(), search, shelfId);
            return Ok(books);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<BookDto>> GetBook(Guid id)
    {
        try
        {
            var book = await _bookService.GetBookByIdAsync(id, GetUserId());
            if (book == null)
            {
                return NotFound(new { message = "Book not found" });
            }
            return Ok(book);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost]
    public async Task<ActionResult<BookDto>> CreateBook([FromBody] CreateBookRequest request)
    {
        try
        {
            var book = await _bookService.CreateBookAsync(request, GetUserId());
            return CreatedAtAction(nameof(GetBook), new { id = book.Id }, book);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<BookDto>> UpdateBook(Guid id, [FromBody] UpdateBookRequest request)
    {
        try
        {
            var book = await _bookService.UpdateBookAsync(id, request, GetUserId());
            if (book == null)
            {
                return NotFound(new { message = "Book not found" });
            }
            return Ok(book);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteBook(Guid id)
    {
        try
        {
            var result = await _bookService.DeleteBookAsync(id, GetUserId());
            if (!result)
            {
                return NotFound(new { message = "Book not found" });
            }
            return Ok(new { message = "Book deleted successfully" });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}
