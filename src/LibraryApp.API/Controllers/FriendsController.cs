using LibraryApp.Application.DTOs;
using LibraryApp.Infrastructure.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace LibraryApp.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class FriendsController : ControllerBase
{
    private readonly FriendshipService _friendshipService;

    public FriendsController(FriendshipService friendshipService)
    {
        _friendshipService = friendshipService;
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
    public async Task<ActionResult<IEnumerable<FriendDto>>> GetFriends()
    {
        var userId = GetUserId();
        var friends = await _friendshipService.GetFriendsAsync(userId);
        return Ok(friends);
    }

    [HttpGet("requests")]
    public async Task<ActionResult<IEnumerable<FriendshipDto>>> GetPendingRequests()
    {
        var userId = GetUserId();
        var requests = await _friendshipService.GetPendingRequestsAsync(userId);
        return Ok(requests);
    }

    [HttpGet("search")]
    public async Task<ActionResult<IEnumerable<UserSearchDto>>> SearchUsers([FromQuery] string query)
    {
        var userId = GetUserId();
        var users = await _friendshipService.SearchUsersAsync(userId, query);
        return Ok(users);
    }

    [HttpPost("{addresseeId}")]
    public async Task<ActionResult<FriendshipDto>> SendFriendRequest(Guid addresseeId)
    {
        var userId = GetUserId();
        
        try
        {
            var friendship = await _friendshipService.SendFriendRequestAsync(userId, addresseeId);
            return Ok(friendship);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPut("requests/{requestId}/accept")]
    public async Task<ActionResult<FriendshipDto>> AcceptFriendRequest(Guid requestId)
    {
        var userId = GetUserId();
        var friendship = await _friendshipService.AcceptFriendRequestAsync(requestId, userId);
        
        if (friendship == null)
            return NotFound();

        return Ok(friendship);
    }

    [HttpPut("requests/{requestId}/reject")]
    public async Task<IActionResult> RejectFriendRequest(Guid requestId)
    {
        var userId = GetUserId();
        var success = await _friendshipService.RejectFriendRequestAsync(requestId, userId);
        
        if (!success)
            return NotFound();

        return NoContent();
    }

    [HttpDelete("{friendId}")]
    public async Task<IActionResult> RemoveFriend(Guid friendId)
    {
        var userId = GetUserId();
        var success = await _friendshipService.RemoveFriendAsync(userId, friendId);
        
        if (!success)
            return NotFound();

        return NoContent();
    }
}
