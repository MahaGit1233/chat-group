import React, { useEffect, useState } from "react";
import { ListGroup, Card, Form, Button } from "react-bootstrap";

const Chat = (props) => {
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:4001/chat")
      .then((res) => res.json())
      .then((data) => setUsers(data.users))
      .catch(console.error);
  }, []);

  const sendMessagesHandler = () => {
    fetch("http://localhost:4001/chat/messages", {
      method: "POST",
      body: JSON.stringify({ message: currentMessage }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to send message");
        }
      })
      .then((data) => {
        alert("Message sent successfully");
        console.log(data);
      })
      .catch((err) => {
        alert("Something went wrong");
      });
  };

  return (
    <div>
      <Button onClick={props.onLogout} variant="outline-dark">
        Logout
      </Button>
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
            <Form style={{ display: "flex" }}>
              <Form.Control
                type="text"
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                style={{ flex: 1, marginRight: "10px" }}
                placeholder="Type a message..."
              />
              <Button onClick={sendMessagesHandler} variant="outline-dark">
                Send
              </Button>
            </Form>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Chat;
