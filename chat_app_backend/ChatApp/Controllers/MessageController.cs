using ChatApp.Hubs;
using ChatApp.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace ChatApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MessageController : ControllerBase
    {
        private readonly IHubContext<ChatHub> _hub;
        public MessageController(IHubContext<ChatHub> hub)
        {
            _hub = hub;
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
    }
}
