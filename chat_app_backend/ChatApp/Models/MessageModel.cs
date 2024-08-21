namespace ChatApp.Models
{
    public class MessageModel
    {
        public int UserId { get; set; }
        public string UserName { get; set; }
        public string MessageText { get; set; }
        public DateTime CreateDate { get; set; }
    }
}
