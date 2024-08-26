﻿using ChatApp.Models;
using ChatApp.Repositories;
using Microsoft.AspNetCore.SignalR;
using System.Collections.Concurrent;

namespace ChatApp.Hubs
{
    public class ChatHub : Hub
    {
        private readonly ILogger<ChatHub> _logger;
        private readonly MessageRepository _repository;

        private static ConcurrentDictionary<string, string> ConnectedUsers = new ConcurrentDictionary<string, string>();

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

            _repository.CreateMessage(messageModel);

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

            ConnectedUsers.TryAdd(Context.ConnectionId, userName);

            await Clients.All.SendAsync("ReceiveMessage", messageModel);
        }

        public async Task JoindSpecificChatRoom(string userName, int userId, string roomId)
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

            ConnectedUsers.TryAdd(Context.ConnectionId, userName);

            await Clients.Group(roomId).SendAsync("JoindSpecificChatRoom", messageModel);
        }

        public async Task SendMessageChatRoom(string UserName, int RandomUserId, string Message, string roomId)
        {
            _logger.LogInformation($"[{roomId}][Send Message] User {UserName}: {Message}");

            MessageModel MessageModel = new MessageModel
            {
                CreateDate = DateTime.Now,
                MessageText = Message,
                UserId = RandomUserId,
                UserName = UserName,
                RoomId = roomId
            };
            _logger.LogInformation(MessageModel.MessageText);
            await Clients.Group(roomId).SendAsync("ReceiveMessageChatRoom", MessageModel);
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            // Get the user name with the connection id
            var userName = Context.ConnectionId;

            if (ConnectedUsers.TryGetValue(Context.ConnectionId, out string findUsername))
            {
                userName = findUsername;
            }

            _logger.LogInformation($"[Disconnected] User Diconnected: {userName}");

            MessageModel MessageModel = new MessageModel
            {
                CreateDate = DateTime.Now,
                MessageText = userName + " left chat",
                UserId = 0,
                UserName = "system"
            };
            await Clients.All.SendAsync("ReceiveMessage", MessageModel);

            ConnectedUsers.TryRemove(Context.ConnectionId, out _);

            await base.OnDisconnectedAsync(exception);
        }
    }
}
