using LibraryApp.Application.DTOs;
using LibraryApp.Domain.Entities;
using LibraryApp.Domain.Enums;
using LibraryApp.Domain.Interfaces;
using LibraryApp.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace LibraryApp.Infrastructure.Services;

public class FriendshipService
{
    private readonly ApplicationDbContext _context;
    private readonly IUnitOfWork _unitOfWork;

    public FriendshipService(ApplicationDbContext context, IUnitOfWork unitOfWork)
    {
        _context = context;
        _unitOfWork = unitOfWork;
    }

    public async Task<IEnumerable<FriendDto>> GetFriendsAsync(Guid userId)
    {
        var friendships = await _context.Friendships
            .Include(f => f.Requester)
            .Include(f => f.Addressee)
            .Where(f => (f.RequesterId == userId || f.AddresseeId == userId) && 
                       f.Status == FriendshipStatus.Accepted)
            .ToListAsync();

        return friendships.Select(f =>
        {
            var friend = f.RequesterId == userId ? f.Addressee : f.Requester;
            return new FriendDto
            {
                UserId = friend.Id,
                Name = $"{friend.FirstName} {friend.LastName}",
                Email = friend.Email,
                Bio = friend.Bio,
                AvatarUrl = friend.AvatarUrl,
                FriendsSince = f.AcceptedAt ?? f.CreatedAt
            };
        });
    }

    public async Task<IEnumerable<FriendshipDto>> GetPendingRequestsAsync(Guid userId)
    {
        var requests = await _context.Friendships
            .Include(f => f.Requester)
            .Include(f => f.Addressee)
            .Where(f => f.AddresseeId == userId && f.Status == FriendshipStatus.Pending)
            .ToListAsync();

        return requests.Select(MapToDto);
    }

    public async Task<FriendshipDto> SendFriendRequestAsync(Guid requesterId, Guid addresseeId)
    {
        // Check if already friends or request exists
        var existing = await _context.Friendships
            .FirstOrDefaultAsync(f =>
                (f.RequesterId == requesterId && f.AddresseeId == addresseeId) ||
                (f.RequesterId == addresseeId && f.AddresseeId == requesterId));

        if (existing != null)
        {
            throw new InvalidOperationException("Friend request already exists or you are already friends");
        }

        var friendship = new Friendship
        {
            RequesterId = requesterId,
            AddresseeId = addresseeId,
            Status = FriendshipStatus.Pending
        };

        _context.Friendships.Add(friendship);
        await _unitOfWork.SaveChangesAsync();

        return (await GetFriendshipByIdAsync(friendship.Id))!;
    }

    public async Task<FriendshipDto?> AcceptFriendRequestAsync(Guid requestId, Guid userId)
    {
        var friendship = await _context.Friendships
            .Include(f => f.Requester)
            .Include(f => f.Addressee)
            .FirstOrDefaultAsync(f => f.Id == requestId && f.AddresseeId == userId);

        if (friendship == null) return null;

        friendship.Status = FriendshipStatus.Accepted;
        friendship.AcceptedAt = DateTime.UtcNow;

        await _unitOfWork.SaveChangesAsync();

        return MapToDto(friendship);
    }

    public async Task<bool> RejectFriendRequestAsync(Guid requestId, Guid userId)
    {
        var friendship = await _context.Friendships
            .FirstOrDefaultAsync(f => f.Id == requestId && f.AddresseeId == userId);

        if (friendship == null) return false;

        friendship.Status = FriendshipStatus.Rejected;
        await _unitOfWork.SaveChangesAsync();

        return true;
    }

    public async Task<bool> RemoveFriendAsync(Guid userId, Guid friendId)
    {
        var friendship = await _context.Friendships
            .FirstOrDefaultAsync(f =>
                ((f.RequesterId == userId && f.AddresseeId == friendId) ||
                 (f.RequesterId == friendId && f.AddresseeId == userId)) &&
                f.Status == FriendshipStatus.Accepted);

        if (friendship == null) return false;

        _context.Friendships.Remove(friendship);
        await _unitOfWork.SaveChangesAsync();

        return true;
    }

    public async Task<IEnumerable<UserSearchDto>> SearchUsersAsync(Guid currentUserId, string searchTerm)
    {
        var users = await _context.Users
            .Where(u => u.Id != currentUserId &&
                       (u.FirstName.ToLower().Contains(searchTerm.ToLower()) ||
                        u.LastName.ToLower().Contains(searchTerm.ToLower()) ||
                        u.Email.ToLower().Contains(searchTerm.ToLower())))
            .Take(20)
            .ToListAsync();

        var friendships = await _context.Friendships
            .Where(f => (f.RequesterId == currentUserId || f.AddresseeId == currentUserId))
            .ToListAsync();

        return users.Select(u => new UserSearchDto
        {
            Id = u.Id,
            Name = $"{u.FirstName} {u.LastName}",
            Email = u.Email,
            Bio = u.Bio,
            AvatarUrl = u.AvatarUrl,
            IsFriend = friendships.Any(f =>
                ((f.RequesterId == currentUserId && f.AddresseeId == u.Id) ||
                 (f.AddresseeId == currentUserId && f.RequesterId == u.Id)) &&
                f.Status == FriendshipStatus.Accepted),
            HasPendingRequest = friendships.Any(f =>
                ((f.RequesterId == currentUserId && f.AddresseeId == u.Id) ||
                 (f.AddresseeId == currentUserId && f.RequesterId == u.Id)) &&
                f.Status == FriendshipStatus.Pending)
        });
    }

    private async Task<FriendshipDto?> GetFriendshipByIdAsync(Guid id)
    {
        var friendship = await _context.Friendships
            .Include(f => f.Requester)
            .Include(f => f.Addressee)
            .FirstOrDefaultAsync(f => f.Id == id);

        return friendship != null ? MapToDto(friendship) : null;
    }

    private FriendshipDto MapToDto(Friendship friendship)
    {
        return new FriendshipDto
        {
            Id = friendship.Id,
            RequesterId = friendship.RequesterId,
            RequesterName = $"{friendship.Requester.FirstName} {friendship.Requester.LastName}",
            RequesterAvatar = friendship.Requester.AvatarUrl,
            AddresseeId = friendship.AddresseeId,
            AddresseeName = $"{friendship.Addressee.FirstName} {friendship.Addressee.LastName}",
            AddresseeAvatar = friendship.Addressee.AvatarUrl,
            Status = friendship.Status,
            AcceptedAt = friendship.AcceptedAt,
            CreatedAt = friendship.CreatedAt
        };
    }
}
