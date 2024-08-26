using ChatApp.Hubs;
using ChatApp.Models;
using ChatApp.Repositories;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace ChatApp.Controllers
{
    [Route("api/messages")]
    [ApiController]
    public class MessageController : ControllerBase
    {
        private readonly IHubContext<ChatHub> _hub;
        private readonly MessageRepository _repository;
        public MessageController(IHubContext<ChatHub> hub, MessageRepository repository)
        {
            _hub = hub;
            _repository = repository;
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

        // GET: /api/messages?filterOn=roomId&filterQuery=123&sortBy=Name&isAscending=true&pageNumber=1&pageSize=10
        [HttpGet]
        public async Task<IEnumerable<MessageModel>> GetAllMessages(
            [FromQuery] string? filterOn, [FromQuery] string? filterQuery,
            [FromQuery] string? sortBy, [FromQuery] bool? isAscending,
            [FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10
        )
        {
            return await _repository.GetAllMessages(filterOn, filterQuery, sortBy, isAscending ?? true, pageNumber, pageSize);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<MessageModel>> GetMessageById(string id)
        {
            var messages = await _repository.GetMessageById(id);
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

            await _repository.CreateMessage(message);
            return CreatedAtAction(nameof(CreateMessage), new { id = message.Id }, message);
        }

        [HttpPut]
        public async Task<ActionResult> UpdateMessage(MessageModel message)
        {
            await _repository.UpdateMessage(message);
            return Ok(message);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteMessage(String id)
        {
            await _repository.DeleteMessage(id);
            return Ok();
        }
    }
}
