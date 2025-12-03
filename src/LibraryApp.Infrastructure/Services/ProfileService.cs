using LibraryApp.Application.DTOs;
using LibraryApp.Domain.Interfaces;
using LibraryApp.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace LibraryApp.Infrastructure.Services;

public class ProfileService
{
    private readonly ApplicationDbContext _context;
    private readonly IUnitOfWork _unitOfWork;

    public ProfileService(ApplicationDbContext context, IUnitOfWork unitOfWork)
    {
        _context = context;
        _unitOfWork = unitOfWork;
    }

    public async Task<ProfileDto?> GetProfileAsync(Guid userId, Guid? viewerId = null)
    {
        var user = await _context.Users
            .Include(u => u.Books)
            .Include(u => u.Movies)
            .Include(u => u.SentFriendRequests)
            .Include(u => u.ReceivedFriendRequests)
            .FirstOrDefaultAsync(u => u.Id == userId);

        if (user == null) return null;

        // Check privacy
        if (!user.IsPublicProfile && viewerId.HasValue && viewerId != userId)
        {
            // Check if viewer is friend
            var areFriends = await _context.Friendships
                .AnyAsync(f =>
                    ((f.RequesterId == userId && f.AddresseeId == viewerId) ||
                     (f.AddresseeId == userId && f.RequesterId == viewerId)) &&
                    f.Status == Domain.Enums.FriendshipStatus.Accepted);

            if (!areFriends) return null;
        }

        return new ProfileDto
        {
            Id = user.Id,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Email = user.Email,
            Bio = user.Bio,
            AvatarUrl = user.AvatarUrl,
            IsPublicProfile = user.IsPublicProfile,
            BookCount = user.Books.Count,
            MovieCount = user.Movies.Count,
            FriendCount = user.SentFriendRequests
                .Count(f => f.Status == Domain.Enums.FriendshipStatus.Accepted) +
                user.ReceivedFriendRequests
                .Count(f => f.Status == Domain.Enums.FriendshipStatus.Accepted),
            MemberSince = user.CreatedAt
        };
    }

    public async Task<ProfileDto?> UpdateProfileAsync(Guid userId, UpdateProfileRequest request)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
        if (user == null) return null;

        user.FirstName = request.FirstName;
        user.LastName = request.LastName;
        user.Bio = request.Bio;
        user.AvatarUrl = request.AvatarUrl;
        user.IsPublicProfile = request.IsPublicProfile;

        await _unitOfWork.SaveChangesAsync();

        return await GetProfileAsync(userId);
    }
}
