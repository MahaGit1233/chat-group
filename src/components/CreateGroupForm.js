import ReactDOM from "react-dom";
import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import "./CreateGroupForm.css";
import "./Register.css";

const Backdrop = (props) => {
  const [groupName, setGroupName] = useState("");

  const token = localStorage.getItem("token");

  const groupNameHandler = (event) => {
    setGroupName(event.target.value);
  };

  const formSubmitHandler = async (event) => {
    event.preventDefault();

    const GroupDetails = {
      name: groupName,
    };

    if (!groupName) {
      alert("Please Mention the Group Name");
    }

    const response = await fetch("http://localhost:4001/groups", {
      method: "POST",
      body: JSON.stringify(GroupDetails),
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });

    const data = await response.json();
    console.log(data);

    setGroupName("");
    props.onClose();
  };

  return (
    <div className="backdrop">
      <Form onSubmit={formSubmitHandler}>
        <Form.Group>
          <Form.Label className="formlabel">Group Name:</Form.Label>
          <Form.Control
            type="text"
            value={groupName}
            onChange={groupNameHandler}
            placeholder="Enter the group name"
            className="forminput"
          />
        </Form.Group>
        <div style={{ display: "flex", justifyContent: "end", gap: "3%" }}>
          <Button onClick={props.onClose} variant="outline-light">
            Cancel
          </Button>
          <Button type="submit" variant="outline-light">
            Create
          </Button>
        </div>
      </Form>
    </div>
  );
};

const CreateGroupForm = (props) => {
  return (
    <React.Fragment>
      {ReactDOM.createPortal(
        <Backdrop onClose={props.onClose} />,
        document.getElementById("backdrop-root")
      )}
    </React.Fragment>
  );
};

export default CreateGroupForm;
