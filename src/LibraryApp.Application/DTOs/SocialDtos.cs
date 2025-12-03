using LibraryApp.Domain.Enums;

namespace LibraryApp.Application.DTOs;

public record FriendshipDto
{
    public Guid Id { get; init; }
    public Guid RequesterId { get; init; }
    public string RequesterName { get; init; } = string.Empty;
    public string? RequesterAvatar { get; init; }
    public Guid AddresseeId { get; init; }
    public string AddresseeName { get; init; } = string.Empty;
    public string? AddresseeAvatar { get; init; }
    public FriendshipStatus Status { get; init; }
    public DateTime? AcceptedAt { get; init; }
    public DateTime CreatedAt { get; init; }
}

public record FriendDto
{
    public Guid UserId { get; init; }
    public string Name { get; init; } = string.Empty;
    public string Email { get; init; } = string.Empty;
    public string? Bio { get; init; }
    public string? AvatarUrl { get; init; }
    public DateTime FriendsSince { get; init; }
}

public record UserSearchDto
{
    public Guid Id { get; init; }
    public string Name { get; init; } = string.Empty;
    public string Email { get; init; } = string.Empty;
    public string? Bio { get; init; }
    public string? AvatarUrl { get; init; }
    public bool IsFriend { get; init; }
    public bool HasPendingRequest { get; init; }
}

public record ProfileDto
{
    public Guid Id { get; init; }
    public string FirstName { get; init; } = string.Empty;
    public string LastName { get; init; } = string.Empty;
    public string Email { get; init; } = string.Empty;
    public string? Bio { get; init; }
    public string? AvatarUrl { get; init; }
    public bool IsPublicProfile { get; init; }
    public int BookCount { get; init; }
    public int MovieCount { get; init; }
    public int FriendCount { get; init; }
    public DateTime MemberSince { get; init; }
}

public record UpdateProfileRequest
{
    public string FirstName { get; init; } = string.Empty;
    public string LastName { get; init; } = string.Empty;
    public string? Bio { get; init; }
    public string? AvatarUrl { get; init; }
    public bool IsPublicProfile { get; init; }
}
