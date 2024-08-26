using ChatApp.DataServices;
using ChatApp.Models;
using MongoDB.Driver;

namespace ChatApp.Repositories
{
    public class MessageRepository
    {
        private readonly IMongoCollection<MessageModel>? _messages;

        public MessageRepository(DbService dbService)
        {
            _messages = dbService.Database?.GetCollection<MessageModel>("MessageModel");
        }

        public async Task<IEnumerable<MessageModel>> GetAllMessages(string? filterOn, string? filterQuery, string? sortBy, bool isAscending = true, int pageNumber = 1, int pageSize = 10)
        {
            // Filter
            var filter = Builders<MessageModel>.Filter.Empty;
            if (!string.IsNullOrWhiteSpace(filterOn))
            {
                filter = Builders<MessageModel>.Filter.Eq(filterOn, filterQuery);
            }

            // Sort
            var sort = Builders<MessageModel>.Sort.Ascending("CreateDate");

            if (!string.IsNullOrWhiteSpace(sortBy))
            {
                sort = isAscending ? Builders<MessageModel>.Sort.Ascending(sortBy) : Builders<MessageModel>.Sort.Descending(sortBy);
            }

            var skipResults = (pageNumber - 1) * pageSize;

            return await _messages.Find(filter).Sort(sort).Skip(skipResults).Limit(pageSize).ToListAsync();
        }

        public async Task<MessageModel> GetMessageById(string id)
        {
            var filter = Builders<MessageModel>.Filter.Eq(x => x.Id, id);
            return await _messages.Find(filter).FirstOrDefaultAsync();
        }

        public async Task<MessageModel> CreateMessage(MessageModel message)
        {
            await _messages.InsertOneAsync(message);
            return message;
        }

        public async Task<MessageModel> UpdateMessage(MessageModel message)
        {
            var filter = Builders<MessageModel>.Filter.Eq(x => x.Id, message.Id);

            await _messages.ReplaceOneAsync(filter, message);

            return message;
        }

        public async Task DeleteMessage(string id)
        {
            var filter = Builders<MessageModel>.Filter.Eq(x => x.Id, id);

            await _messages.DeleteOneAsync(filter);
        }
    }
}
