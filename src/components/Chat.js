import React, { useEffect, useState } from "react";
import { ListGroup, Card } from "react-bootstrap";

const Chat = () => {
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:4001/users")
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch(console.error);
  }, []);

  return (
    <div style={{ display: "flex", height: "90vh" }}>
      <Card style={{ width: "50%", borderRight: "1px solid #ccc" }}>
        <ListGroup variant="flush">
          {users.map((user) => (
            <ListGroup.Item key={user.id}>{user.name}</ListGroup.Item>
          ))}
        </ListGroup>

        <div
          style={{
            flex: 1,
            padding: "20px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{ flex: 1, overflowY: "auto" }}>
            {messages.map((msg, index) => (
              <p key={index}>
                <strong>{msg.sender}:</strong> {msg.text}
              </p>
            ))}
          </div>
          <div style={{ display: "flex" }}>
            <input
              type="text"
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              style={{ flex: 1, marginRight: "10px" }}
              placeholder="Type a message..."
            />
            <button>Send</button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Chat;
