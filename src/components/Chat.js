import React, { useEffect, useState } from "react";
import { ListGroup, Card, Form, Button } from "react-bootstrap";

const Chat = (props) => {
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");

  const token = localStorage.getItem("token");
  const loggedInUserId = localStorage.getItem("userId");

  useEffect(() => {
    fetch("http://localhost:4001/chat", {
      method: "GET",
      headers: {
        Authorization: token,
      },
    })
      .then((res) => res.json())
      .then((data) => setUsers(data.users))
      .catch(console.error);

    fetchMessages();
  }, []);

  const fetchMessages = () => {
    fetch("http://localhost:4001/chat/messages", {
      method: "GET",
      headers: {
        Authorization: token,
      },
    })
      .then((res) => res.json())
      .then((data) => setMessages(data.messages || []))
      .catch((err) => alert(err.message));
  };

  const sendMessagesHandler = () => {
    fetch("http://localhost:4001/chat/messages", {
      method: "POST",
      body: JSON.stringify({ message: currentMessage }),
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to send message");
        }
        return res.json();
      })
      .then((data) => {
        alert(data.message);
        console.log(data);
        fetchMessages();
      })
      .catch((err) => {
        alert(err.message);
      });
    setCurrentMessage("");
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
              <ListGroup.Item key={user.id}>
                {user.id === JSON.parse(loggedInUserId) ? "you" : user.name}{" "}
                joined
              </ListGroup.Item>
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
              {messages &&
                messages.map((msg, index) => (
                  <p key={index}>
                    <strong>
                      {msg.user.id === JSON.parse(loggedInUserId)
                        ? "you"
                        : msg.user.name}
                      :
                    </strong>{" "}
                    {msg.message}
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
