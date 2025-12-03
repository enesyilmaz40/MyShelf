using LibraryApp.Application.DTOs;
using LibraryApp.Infrastructure.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace LibraryApp.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class MoviesController : ControllerBase
{
    private readonly MovieService _movieService;

    public MoviesController(MovieService movieService)
    {
        _movieService = movieService;
    }

    private Guid GetUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
        {
            throw new UnauthorizedAccessException("Invalid user ID");
        }
        return userId;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<MovieDto>>> GetMovies([FromQuery] string? search, [FromQuery] Guid? shelfId)
    {
        var userId = GetUserId();
        var movies = await _movieService.GetAllMoviesAsync(userId, search, shelfId);
        return Ok(movies);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<MovieDto>> GetMovie(Guid id)
    {
        var userId = GetUserId();
        var movie = await _movieService.GetMovieByIdAsync(id, userId);
        
        if (movie == null)
            return NotFound();

        return Ok(movie);
    }

    [HttpPost]
    public async Task<ActionResult<MovieDto>> CreateMovie([FromBody] CreateMovieRequest request)
    {
        var userId = GetUserId();
        var movie = await _movieService.CreateMovieAsync(userId, request);
        return CreatedAtAction(nameof(GetMovie), new { id = movie.Id }, movie);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<MovieDto>> UpdateMovie(Guid id, [FromBody] UpdateMovieRequest request)
    {
        var userId = GetUserId();
        var movie = await _movieService.UpdateMovieAsync(id, userId, request);
        
        if (movie == null)
            return NotFound();

        return Ok(movie);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteMovie(Guid id)
    {
        var userId = GetUserId();
        var success = await _movieService.DeleteMovieAsync(id, userId);
        
        if (!success)
            return NotFound();

        return NoContent();
    }

    [HttpPut("{id}/watching-progress")]
    public async Task<ActionResult<WatchingProgressDto>> UpdateWatchingProgress(
        Guid id, 
        [FromBody] UpdateWatchingProgressRequest request)
    {
        var userId = GetUserId();
        var progress = await _movieService.UpdateWatchingProgressAsync(id, userId, request);
        
        if (progress == null)
            return NotFound();

        return Ok(progress);
    }
}
