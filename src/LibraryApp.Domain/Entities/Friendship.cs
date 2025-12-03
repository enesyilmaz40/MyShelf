using LibraryApp.Domain.Enums;

namespace LibraryApp.Domain.Entities;

public class Friendship : BaseEntity
{
    public Guid RequesterId { get; set; }
    public User Requester { get; set; } = null!;
    
    public Guid AddresseeId { get; set; }
    public User Addressee { get; set; } = null!;
    
    public FriendshipStatus Status { get; set; }
    public DateTime? AcceptedAt { get; set; }
}
