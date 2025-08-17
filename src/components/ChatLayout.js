import React, { useEffect, useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import Chat from "./Chat";
import CreateGroupForm from "./CreateGroupForm";

const ChatLayout = (props) => {
  const [showGroupFrom, setShowGroupForm] = useState(false);
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);

  const token = localStorage.getItem("token");

  const showGroupFormHandler = () => {
    setShowGroupForm(true);
  };

  const closeGroupFormHandler = () => {
    setShowGroupForm(false);
  };

  useEffect(() => {
    fetch("http://localhost:4001/groups", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch the groups");
        }
        return res.json();
      })
      .then((data) => {
        console.log(data);
        setGroups(data.groups);
      })
      .catch((err) => {
        alert(err);
      });
  }, []);

  const deleteGroupsHandler = async (groupId) => {
    try {
      const response = await fetch(`http://localhost:4001/groups/${groupId}`, {
        method: "DELETE",
        headers: {
          Authorization: token,
        },
      });

      const data = await response.json();
      alert(data.message);

      if (response.ok) {
        setGroups((prev) => prev.filter((group) => group.id !== groupId));
      }
    } catch (error) {
      alert(error);
    }
  };

  return (
    <div>
      <Button onClick={props.onLogout} variant="outline-dark">
        Logout
      </Button>
      <div style={{ display: "flex", gap: "0.2rem", height: "94vh" }}>
        <Container
          style={{
            border: "1px solid blue",
            width: "15%",
            backgroundColor: "whitesmoke",
            borderRadius: "5px",
          }}
        >
          <h4>Groups</h4>
          {groups.map((group) => (
            <div style={{ display: "flex" }}>
              <li
                style={{
                  fontFamily: "cursive",
                  width: "100%",
                  textDecoration: "underline",
                  listStyleType: "none",
                  paddingTop: "5px",
                }}
                onClick={() => {
                  setSelectedGroup(group);
                }}
              >
                {group.name}
              </li>
              <Button
                onClick={() => deleteGroupsHandler(group.id)}
                variant="outline-dark"
                style={{ border: "none" }}
              >
                🗑
              </Button>
            </div>
          ))}
          <Button
            onClick={showGroupFormHandler}
            style={{ marginTop: "15px", border: "none" }}
            variant="outline-primary"
          >
            Create Group +
          </Button>
        </Container>
        <Container
          style={{
            border: "1px solid red",
            width: "85%",
            backgroundColor: "whitesmoke",
            borderRadius: "5px",
          }}
        >
          <Row>
            <Col>
              {selectedGroup ? (
                <Chat group={selectedGroup} />
              ) : (
                <p>Select a group to start chatting</p>
              )}
            </Col>
          </Row>
        </Container>
        {showGroupFrom && <CreateGroupForm onClose={closeGroupFormHandler} />}
      </div>
    </div>
  );
};

export default ChatLayout;
