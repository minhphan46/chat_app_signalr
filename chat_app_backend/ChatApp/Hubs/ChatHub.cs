using ChatApp.Models;
using ChatApp.Repositories;
using ChatApp.Utils;
using Microsoft.AspNetCore.SignalR;
using System.Collections.Concurrent;

namespace ChatApp.Hubs
{
    public class ChatHub : Hub
    {
        private readonly ILogger<ChatHub> _logger;
        private readonly MessageRepository _repository;

        // Key: ConnectionId, Value: UserModel
        private static ConcurrentDictionary<string, UserModel> ConnectedUsers = new ConcurrentDictionary<string, UserModel>();
        // New dictionary to map userId to connectionId
        private static ConcurrentDictionary<int, string> UserConnections = new ConcurrentDictionary<int, string>();
        // New dictionary to map userId to publicKey
        private static ConcurrentDictionary<int, string> UserPublicKey = new ConcurrentDictionary<int, string>();

        public ChatHub(ILogger<ChatHub> logger, MessageRepository repository)
        {
            _logger = logger;
            _repository = repository;
        }

        public async Task SendUserMessage(string UserName, int RandomUserId, string Message)
        {
            _logger.LogInformation($"[All][Send Message] User {UserName}: {Message}");

            MessageModel messageModel = new MessageModel
            {
                UserId = RandomUserId,
                UserName = UserName,
                MessageText = Message,
                CreateDate = DateTime.Now
            };

            // _repository.CreateMessage(messageModel);

            await Clients.All.SendAsync("ReceiveMessage", messageModel);
        }

        public async Task JoinUser(string userName, int userId)
        {
            _logger.LogInformation($"[All][Join] Id: {userId}, User: {userName}");

            MessageModel messageModel = new MessageModel
            {
                CreateDate = DateTime.Now,
                MessageText = userName + " joined chat",
                UserId = 0,
                UserName = "system"
            };

            UserModel userModel = new UserModel
            {
                UserId = userId,
                UserName = userName,
                RoomId = null,
                ConnectionId = Context.ConnectionId,
            };

            ConnectedUsers.TryAdd(Context.ConnectionId, userModel);
            UserConnections.TryAdd(userId, Context.ConnectionId);

            await Clients.All.SendAsync("ReceiveMessage", messageModel);
        }

        public async Task SendMessageToUser(int TargetUserId, string UserName, int RandomUserId, string Message)
        {
            _logger.LogInformation($"Send to TargetUserId: {TargetUserId}");
            if (UserConnections.TryGetValue(TargetUserId, out string? connectionId))
            {
                _logger.LogInformation($"[Private][Send Message] User {UserName} to User {TargetUserId}: {Message}");

                MessageModel messageModel = new MessageModel
                {
                    CreateDate = DateTime.Now,
                    MessageText = Message,
                    UserId = RandomUserId,
                    UserName = UserName // or specify the sender's user name
                };

                await Clients.Client(connectionId).SendAsync("ReceiveMessage", messageModel);
            }
            else
            {
                _logger.LogWarning($"[Private][Send Message] UserId {TargetUserId} is not connected.");
            }
        }

        public async Task JoindSpecificChatRoom(string userName, int userId, string roomId, string publickey)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, roomId);

            _logger.LogInformation($"[{roomId}][Join] Id: {userId}, User: {userName}");

            MessageModel messageModel = new MessageModel
            {
                CreateDate = DateTime.Now,
                MessageText = userName + $" joined {roomId}.",
                UserId = 0,
                UserName = "system",
                RoomId = roomId
            };

            // send message user join
            await Clients.Group(roomId).SendAsync("ReceiveMessageChatRoom", messageModel);

            // get first user in the room
            var firstUser = ConnectedUsers.Values.FirstOrDefault(x => x.RoomId == roomId);
            // if has user in the room => send public key to new user and send public key of new user to old user
            // if not => save public key to UserPublicKey
            _logger.LogInformation($"First User: {firstUser} + {publickey}");
            if (firstUser != null)
            {
                _logger.LogInformation($"Send public key to: {firstUser.UserId}: {UserPublicKey[firstUser.UserId]}");
                await Clients.Client(Context.ConnectionId).SendAsync("ReceivePublicKey", UserPublicKey[firstUser.UserId]);
                _logger.LogInformation($"Send public key to: {firstUser}: {publickey}");
                await Clients.Client(firstUser.ConnectionId).SendAsync("ReceivePublicKey", publickey);
            }
            else
            {
                UserPublicKey.TryAdd(userId, publickey);
            }

            // add user to connected user
            UserModel userModel = new UserModel
            {
                UserId = userId,
                UserName = userName,
                RoomId = roomId,
                ConnectionId = Context.ConnectionId,
            };

            ConnectedUsers.TryAdd(Context.ConnectionId, userModel);
        }

        public async Task SendMessageChatRoom(string UserName, int RandomUserId, string Message, string roomId)
        {
            _logger.LogInformation($"[{roomId}][Send Message] User {UserName}: {Message}");

            MessageModel messageModel = new MessageModel
            {
                CreateDate = DateTime.Now,
                MessageText = Message,
                UserId = RandomUserId,
                UserName = UserName,
                RoomId = roomId
            };

            // _repository.CreateMessage(messageModel);

            await Clients.Group(roomId).SendAsync("ReceiveMessageChatRoom", messageModel);
        }

        public async Task SendMessageToUserInRoom(int TargetUserId, string UserName, int RandomUserId, string Message, string roomId)
        {
            if (UserConnections.TryGetValue(TargetUserId, out string? connectionId))
            {
                _logger.LogInformation($"[{roomId}][Private][Send Message] User {UserName} to User {TargetUserId}: {Message}");

                MessageModel messageModel = new MessageModel
                {
                    CreateDate = DateTime.Now,
                    MessageText = Message,
                    UserId = RandomUserId,
                    UserName = UserName,
                    RoomId = roomId
                };

                await Clients.Client(connectionId).SendAsync("ReceiveMessageChatRoom", messageModel);
            }
            else
            {
                _logger.LogWarning($"[{roomId}][Private][Send Message] UserId {TargetUserId} is not connected.");
            }
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            // Get the user name with the connection id
            UserModel? user = null;

            if (ConnectedUsers.TryGetValue(Context.ConnectionId, out UserModel? findUser))
            {
                user = findUser;
            }

            _logger.LogInformation($"[Disconnected] User Diconnected: {user.UserName ?? ""}");

            MessageModel MessageModel = new MessageModel
            {
                CreateDate = DateTime.Now,
                MessageText = user.UserName + " left chat",
                UserId = 0,
                UserName = "system"
            };

            if (user.RoomId != null && user.RoomId != "")
            {
                await Clients.Group(user.RoomId).SendAsync("ReceiveMessageChatRoom", MessageModel);
            }
            else
            {
                await Clients.All.SendAsync("ReceiveMessage", MessageModel);
            }

            ConnectedUsers.TryRemove(Context.ConnectionId, out _);
            UserConnections.TryRemove(user.UserId, out _);
            UserPublicKey.TryRemove(user.UserId, out _);

            await base.OnDisconnectedAsync(exception);
        }
    }
}
