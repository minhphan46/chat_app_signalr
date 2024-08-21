const MessageContainer = ({ messages }) => (
  <div>
    {messages.map((msg, index) => (
      <table striped bordered>
        <tr key={index}>
          <td>
            {msg.username} - {msg.msg}
          </td>
        </tr>
      </table>
    ))}
  </div>
);

export default MessageContainer;
