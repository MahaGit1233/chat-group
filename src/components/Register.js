import React, { useState } from "react";
import "./Register.css";
import { Alert, Button, Card, Form } from "react-bootstrap";
import { NavLink } from "react-router-dom";

const Register = () => {
  const [enteredName, setEnteredName] = useState("");
  const [enteredMail, setEnteredMail] = useState("");
  const [enteredPass, setEnteredPass] = useState("");
  const [error, setError] = useState("");
  const [isLogin, setIsLogin] = useState(false);

  const url = isLogin
    ? "http://localhost:4000/users/login"
    : "http://localhost:4000/users/signup";

  const toggleForm = () => {
    setIsLogin((prev) => !prev);
  };

  const nameChangeHandler = (event) => {
    setEnteredName(event.target.value);
  };

  const mailChangeHandler = (event) => {
    setEnteredMail(event.target.value);
  };

  const passChangeHandler = (event) => {
    setEnteredPass(event.target.value);
  };

  const formSubmitHandler = (event) => {
    event.preventDefault();

    if (!enteredName || !enteredMail || !enteredPass) {
      setError("All the fields are required to be filled");
      return;
    }

    fetch(url, {
      method: "POST",
      body: JSON.stringify({
        name: enteredName,
        email: enteredMail,
        password: enteredPass,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.ok) {
          console.log("User has successfully signed up");
          return res.json();
        } else {
          return res.json().then((data) => {
            console.log(data.error.message);
          });
        }
      })
      .catch((err) => {
        console.log(err.message);
      });

    setEnteredName("");
    setEnteredMail("");
    setEnteredPass("");
    setError("");
  };

  const signup = (
    <Form className="form" onSubmit={formSubmitHandler}>
      <h1>Register</h1>
      <Form.Group>
        <Form.Label className="formlabel">Name:</Form.Label>
        <Form.Control
          style={{ backgroundColor: "#efebeb" }}
          className="forminput"
          type="text"
          value={enteredName}
          onChange={nameChangeHandler}
          placeholder="Enter your name"
        />
      </Form.Group>
      <Form.Group>
        <Form.Label className="formlabel">Email Id:</Form.Label>
        <Form.Control
          style={{ backgroundColor: "#efebeb" }}
          className="forminput"
          type="email"
          value={enteredMail}
          onChange={mailChangeHandler}
          placeholder="Enter your mail Id"
        />
      </Form.Group>
      <Form.Group>
        <Form.Label className="formlabel">Password:</Form.Label>
        <Form.Control
          style={{ backgroundColor: "#efebeb" }}
          className="forminput"
          type="password"
          value={enteredPass}
          onChange={passChangeHandler}
          placeholder="Enter Password"
        />
      </Form.Group>
      {error && <Alert variant="danger">{error}</Alert>}
      <div className="formBtn">
        <Button type="submit" variant="outline-dark">
          Sign Up
        </Button>
      </div>
    </Form>
  );

  const login = (
    <Form className="form1" onSubmit={formSubmitHandler}>
      <Form.Group>
        <Form.Label className="formlabel">Email Id:</Form.Label>
        <Form.Control
          style={{ backgroundColor: "#efebeb" }}
          className="forminput"
          type="email"
          value={enteredMail}
          onChange={mailChangeHandler}
          placeholder="Enter your mail Id"
        />
      </Form.Group>
      <Form.Group>
        <Form.Label className="formlabel">Password:</Form.Label>
        <Form.Control
          style={{ backgroundColor: "#efebeb" }}
          className="forminput"
          type="password"
          value={enteredPass}
          onChange={passChangeHandler}
          placeholder="Enter your Password"
        />
      </Form.Group>
      <div className="formBtn">
        <div>
          <NavLink to="/forgot-password">Forgot Password??</NavLink>
        </div>
        <Button type="submit" variant="outline-dark">
          Login
        </Button>
      </div>
    </Form>
  );

  return (
    <Card className="card">
      <Card.Body className="cardbody">
        {!isLogin ? (
          <div className="body">
            <div className="bodyItems">
              <h1>Welcome!</h1>
              <h5>Sign up to create an account</h5>
              <Button onClick={toggleForm} variant="outline-dark">
                {isLogin
                  ? "Don't have an account? Sign up"
                  : " Already have an account? Login"}
              </Button>
            </div>
          </div>
        ) : (
          <div className="body1">
            <div className="bodyItems1">
              <h1>Welcome Back!</h1>
              <h5>Log In to proceed to your account</h5>
              <Button onClick={toggleForm} variant="outline-dark">
                {isLogin
                  ? "Don't have an account? Sign up"
                  : " Already have an account? Login"}
              </Button>
            </div>
          </div>
        )}
        <div className="signupform">{isLogin ? login : signup}</div>
      </Card.Body>
    </Card>
  );
};

export default Register;
