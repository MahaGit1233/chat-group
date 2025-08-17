import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";

const AddMembersForm = (props) => {
  const [users, setUsers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchUsers();
  }, []);

  const membersChangeHandler = (event) => {
    const options = event.target.options;
    const selected = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selected.push(options[i].value);
      }
    }
    setSelectedMembers(selected);
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:4001/chat", {
        method: "GET",
        headers: {
          Authorization: token,
        },
      });

      const data = await response.json();
      setUsers(data.users || []);
    } catch (error) {
      alert(error);
    }
  };

  const formSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(
        `http://localhost:4001/groups/${props.group.id}/members`,
        {
          method: "POST",
          body: JSON.stringify({ members: selectedMembers }),
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );

      const data = await response.json();

      setSelectedMembers([]);
    } catch (error) {
      alert(error);
    }
  };

  return (
    <Form onSubmit={formSubmitHandler}>
      <Form.Group>
        <Form.Label>Members: </Form.Label>
        <Form.Select
          multiple
          value={selectedMembers}
          onChange={membersChangeHandler}
        >
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </Form.Select>
      </Form.Group>
      <Button onClick={props.onClose} variant="outline-dark">
        Close
      </Button>
      {""}
      <Button type="submit" variant="outline-dark">
        Add
      </Button>
    </Form>
  );
};

export default AddMembersForm;
