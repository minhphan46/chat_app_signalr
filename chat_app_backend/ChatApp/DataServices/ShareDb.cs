using ChatApp.Models;
using System.Collections.Concurrent;

namespace ChatApp.DataServices
{
    public class ShareDb
    {
        private readonly ConcurrentDictionary<string, UserConnection> _connection = new();

        public ConcurrentDictionary<string, UserConnection> connections => _connection;
    }
}
