using ChatApp.DataServices;
using ChatApp.Models;
using Microsoft.AspNetCore.SignalR;

namespace ChatApp.Hubs
{
    public class ChatHub : Hub
    {
        private readonly ShareDb _shareDb;

        public ChatHub(ShareDb shareDb)
        {
            _shareDb = shareDb;
        }

        public async Task JoinChat(UserConnection connection)
        {
            await Clients.All.SendAsync("ReceiveMessage", "admin", $"{connection.Username} has joined.");
        }

        public async Task JoindSpecificChatRoom(UserConnection connection)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, connection.ChatRoom);

            _shareDb.connections[Context.ConnectionId] = connection;

            await Clients.Group(connection.ChatRoom)
                .SendAsync("JoindSpecificChatRoom", "admin", $"{connection.Username} has joined {connection.ChatRoom}.");
        }

        public async Task SendMessage(string message)
        {
            if (_shareDb.connections.TryGetValue(Context.ConnectionId, out UserConnection connection))
            {
                await Clients.Group(connection.ChatRoom)
                    .SendAsync("ReceiveSpecificMessage", connection.Username, message);
            }
        }
    }
}
