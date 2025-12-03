using LibraryApp.Application.DTOs;
using LibraryApp.Infrastructure.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace LibraryApp.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class ProfilesController : ControllerBase
{
    private readonly ProfileService _profileService;

    public ProfilesController(ProfileService profileService)
    {
        _profileService = profileService;
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

    [HttpGet("{userId}")]
    public async Task<ActionResult<ProfileDto>> GetProfile(Guid userId)
    {
        var viewerId = GetUserId();
        var profile = await _profileService.GetProfileAsync(userId, viewerId);
        
        if (profile == null)
            return NotFound();

        return Ok(profile);
    }

    [HttpGet("me")]
    public async Task<ActionResult<ProfileDto>> GetMyProfile()
    {
        var userId = GetUserId();
        var profile = await _profileService.GetProfileAsync(userId);
        
        if (profile == null)
            return NotFound();

        return Ok(profile);
    }

    [HttpPut("me")]
    public async Task<ActionResult<ProfileDto>> UpdateProfile([FromBody] UpdateProfileRequest request)
    {
        var userId = GetUserId();
        var profile = await _profileService.UpdateProfileAsync(userId, request);
        
        if (profile == null)
            return NotFound();

        return Ok(profile);
    }
}
