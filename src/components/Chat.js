import React, { useEffect, useState } from "react";
import { ListGroup, Card, Form, Button } from "react-bootstrap";
import AddMembersForm from "./AddMembersForm";

const Chat = (props) => {
  const [members, setMembers] = useState([]);
  const [showMembers, setShowMembers] = useState(false);
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [showAddMemberForm, setShowAddMemberForm] = useState(false);

  const token = localStorage.getItem("token");
  const loggedInUserId = localStorage.getItem("userId");
  const userFromLs = JSON.parse(localStorage.getItem("user"));

  const showAddMemberFormHandler = () => {
    setShowAddMemberForm(true);
  };

  const closeAddMemberForm = () => {
    setShowAddMemberForm(false);
  };

  const saveMessagesToLocal = (msgs) => {
    const newMessages = msgs.slice(-10);
    localStorage.setItem(
      `chatMessages_${props.group.id}`,
      JSON.stringify(newMessages)
    );
  };

  const fetchNewMessages = (cachedMessages) => {
    const lastId = cachedMessages.length
      ? cachedMessages[cachedMessages.length - 1].id
      : 0;

    fetch(
      `http://localhost:4001/groups/${props.group.id}/messages?afterId=${lastId}`,
      {
        method: "GET",
        headers: { Authorization: token },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        const updated = [...cachedMessages, ...(data.messages || [])];
        const recent = updated.slice(-10);
        setMessages(recent);
        saveMessagesToLocal(recent);
      })
      .catch((err) => alert(err.message));
  };

  useEffect(() => {
    fetch(`http://localhost:4001/groups/${props.group.id}/members`, {
      method: "GET",
      headers: {
        Authorization: token,
      },
    })
      .then((res) => res.json())
      .then((data) => setMembers(data.members))
      .catch(console.error);

    const newMsg =
      JSON.parse(localStorage.getItem(`chatMessages_${props.group.id}`)) || [];
    setMessages(newMsg);
    fetchNewMessages(newMsg);
  }, []);

  const deleteMembersHandler = async (memberId) => {
    try {
      const response = await fetch(
        `http://localhost:4001/groups/${props.group.id}/members/${memberId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: token,
          },
        }
      );

      const data = await response.json();
      alert(data.message);

      if (response.ok) {
        setMembers((prev) => prev.filter((member) => member.id !== memberId));
      }
    } catch (error) {
      alert(error);
    }
  };

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
    fetch(`http://localhost:4001/groups/${props.group.id}/messages`, {
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
        const newMsgs = [
          ...messages,
          {
            id: data.id,
            message: currentMessage,
            user: { id: userFromLs.id, name: userFromLs.name },
          },
        ];
        setMessages(newMsgs.slice(-10));
        saveMessagesToLocal(newMsgs);
      })
      .catch((err) => {
        alert(err.message);
      });
    setCurrentMessage("");
  };

  const promoteToAdmin = async (memberId) => {
    try {
      const response = await fetch(
        `http://localhost:4001/groups/${props.group.id}/promote`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({ memberId }),
        }
      );

      const data = await response.json();
      alert(data.message);

      if (response.ok) {
        setMembers((prev) =>
          prev.map((m) =>
            m.User.id === memberId ? { ...m, role: "admin" } : m
          )
        );
      }
    } catch (error) {
      alert(error);
    }
  };

  return (
    <div>
      {showAddMemberForm && (
        <AddMembersForm onClose={closeAddMemberForm} group={props.group} />
      )}
      <div
        style={{
          display: "flex",
          height: "94vh",
          // border: "1px solid pink",
        }}
      >
        <Card
          style={{
            borderRight: "1px solid #ccc",
            backgroundColor: "whitesmoke",
            height: "91vh",
            width: "100%",
            // border: "1px dashed yellow",
            marginTop: "1%",
            marginLeft: "0%",
          }}
        >
          <div style={{ display: "flex", justifyContent: "end", gap: "5px" }}>
            <Button variant="outline-dark" onClick={showAddMemberFormHandler}>
              Add Member
            </Button>
            <Button
              variant="outline-dark"
              onClick={() => setShowMembers((prev) => !prev)}
            >
              See Members
            </Button>
          </div>
          {showMembers && (
            <ListGroup flush>
              {members &&
                members.map((member) => (
                  <ListGroup.Item
                    key={member.id}
                    style={{ backgroundColor: "whitesmoke" }}
                  >
                    {member.id === JSON.parse(loggedInUserId)
                      ? "you"
                      : member.User.name}{" "}
                    ({member.role})
                    {members.find(
                      (m) => m.User.id === JSON.parse(loggedInUserId)
                    )?.role === "admin" &&
                      member.role === "member" && (
                        <Button
                          onClick={() => promoteToAdmin(member.User.id)}
                          variant="outline-dark"
                          style={{ border: "none" }}
                        >
                          Promote to Admin
                        </Button>
                      )}
                    {members.find(
                      (m) => m.User.id === JSON.parse(loggedInUserId)
                    )?.role === "admin" &&
                      member.role === "member" && (
                        <Button
                          onClick={() => deleteMembersHandler(member.User.id)}
                          style={{ border: "none" }}
                          variant="outline-dark"
                        >
                          🗑
                        </Button>
                      )}
                  </ListGroup.Item>
                ))}
            </ListGroup>
          )}

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
