using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace ChatApp.Models
{
    public class MessageModel
    {
        [BsonId]
        [BsonElement("_id"), BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }

        [BsonElement("user_id"), BsonRepresentation(BsonType.Int32)]
        public int UserId { get; set; }

        [BsonElement("user_name"), BsonRepresentation(BsonType.String)]
        public string? UserName { get; set; }

        [BsonElement("message_text"), BsonRepresentation(BsonType.String)]
        public string? MessageText { get; set; }

        [BsonElement("room_id"), BsonRepresentation(BsonType.String)]
        public string? RoomId { get; set; }

        [BsonElement("create_date"), BsonRepresentation(BsonType.DateTime)]
        public DateTime CreateDate { get; set; }
    }
}
