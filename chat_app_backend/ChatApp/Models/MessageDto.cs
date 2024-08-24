namespace ChatApp.Models
{
    public class MessageDto
    {
        public int UserId { get; set; }

        public string? UserName { get; set; }

        public string? MessageText { get; set; }

        public string? RoomId { get; set; }
    }
}
