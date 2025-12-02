using LibraryApp.Application.DTOs;
using LibraryApp.Infrastructure.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace LibraryApp.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class ShelvesController : ControllerBase
{
    private readonly ShelfService _shelfService;

    public ShelvesController(ShelfService shelfService)
    {
        _shelfService = shelfService;
    }

    private Guid GetUserId()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        return Guid.Parse(userId!);
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ShelfDto>>> GetAllShelves([FromQuery] bool includeBooks = false)
    {
        try
        {
            var shelves = await _shelfService.GetAllShelvesAsync(GetUserId(), includeBooks);
            return Ok(shelves);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ShelfDto>> GetShelf(Guid id)
    {
        try
        {
            var shelf = await _shelfService.GetShelfByIdAsync(id, GetUserId());
            if (shelf == null)
            {
                return NotFound(new { message = "Shelf not found" });
            }
            return Ok(shelf);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost]
    public async Task<ActionResult<ShelfDto>> CreateShelf([FromBody] CreateShelfRequest request)
    {
        try
        {
            var shelf = await _shelfService.CreateShelfAsync(request, GetUserId());
            return CreatedAtAction(nameof(GetShelf), new { id = shelf.Id }, shelf);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<ShelfDto>> UpdateShelf(Guid id, [FromBody] UpdateShelfRequest request)
    {
        try
        {
            var shelf = await _shelfService.UpdateShelfAsync(id, request, GetUserId());
            if (shelf == null)
            {
                return NotFound(new { message = "Shelf not found" });
            }
            return Ok(shelf);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteShelf(Guid id)
    {
        try
        {
            var result = await _shelfService.DeleteShelfAsync(id, GetUserId());
            if (!result)
            {
                return NotFound(new { message = "Shelf not found" });
            }
            return Ok(new { message = "Shelf deleted successfully" });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}
