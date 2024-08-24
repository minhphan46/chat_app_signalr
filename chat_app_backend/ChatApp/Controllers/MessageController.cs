using ChatApp.DataServices;
using ChatApp.Hubs;
using ChatApp.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using MongoDB.Driver;

namespace ChatApp.Controllers
{
    [Route("api/messages")]
    [ApiController]
    public class MessageController : ControllerBase
    {
        private readonly IHubContext<ChatHub> _hub;
        private readonly IMongoCollection<MessageModel>? _messages;
        public MessageController(IHubContext<ChatHub> hub, DbService dbService)
        {
            _hub = hub;
            _messages = dbService.Database?.GetCollection<MessageModel>("MessageModel");
        }

        [HttpGet("[action]")]
        public async Task<IActionResult> SendMessage(string MessageText, int UserId, string UserName)
        {
            MessageModel MessageModel = new MessageModel
            {
                CreateDate = DateTime.Now,
                MessageText = MessageText,
                UserId = UserId,
                UserName = UserName
            };

            await _hub.Clients.All.SendAsync("ReceiveMessage", MessageModel);
            return Ok();
        }

        [HttpGet]
        public async Task<IEnumerable<MessageModel>> GetAllMessages()
        {
            return await _messages.Find(FilterDefinition<MessageModel>.Empty).ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<MessageModel>> GetMessageById(string id)
        {
            var filter = Builders<MessageModel>.Filter.Eq(x => x.Id, id);
            var messages = _messages.Find(filter).FirstOrDefault();
            return messages is not null ? Ok(messages) : NotFound();
        }

        [HttpPost]
        public async Task<ActionResult> CreateMessage(MessageDto messageDto)
        {
            var message = new MessageModel()
            {
                UserId = messageDto.UserId,
                UserName = messageDto.UserName,
                MessageText = messageDto.MessageText,
                RoomId = messageDto.RoomId,
                CreateDate = DateTime.Now
            };

            await _messages.InsertOneAsync(message);
            return CreatedAtAction(nameof(CreateMessage), new { id = message.Id }, message);
        }

        [HttpPut]
        public async Task<ActionResult> UpdateMessage(MessageModel message)
        {
            var filter = Builders<MessageModel>.Filter.Eq(x => x.Id, message.Id);

            await _messages.ReplaceOneAsync(filter, message);
            return Ok(message);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteMessage(String id)
        {
            var filter = Builders<MessageModel>.Filter.Eq(x => x.Id, id);

            await _messages.DeleteOneAsync(filter);
            return Ok();
        }
    }
}
