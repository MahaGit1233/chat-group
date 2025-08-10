import React, { useState } from "react";
import "./Register.css";
import { Alert, Button, Card, Form } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";

const Register = () => {
  const [enteredName, setEnteredName] = useState("");
  const [enteredMail, setEnteredMail] = useState("");
  const [enteredPass, setEnteredPass] = useState("");
  const [enteredPhone, setEnteredPhone] = useState("");
  const [error, setError] = useState("");
  const [isLogin, setIsLogin] = useState(false);

  const navigate = useNavigate();

  const url = isLogin
    ? "http://localhost:4001/users/login"
    : "http://localhost:4001/users/signup";

  const singupDetails = {
    name: enteredName,
    email: enteredMail,
    password: enteredPass,
    phone: enteredPhone,
  };

  const loginDetails = { email: enteredMail, password: enteredPass };

  const detalis = isLogin ? loginDetails : singupDetails;

  const toggleForm = () => {
    setIsLogin((prev) => !prev);
  };

  const nameChangeHandler = (event) => {
    setEnteredName(event.target.value);
  };

  const mailChangeHandler = (event) => {
    setEnteredMail(event.target.value);
  };

  const phoneChangeHandler = (event) => {
    setEnteredPhone(event.target.value);
  };

  const passChangeHandler = (event) => {
    setEnteredPass(event.target.value);
  };

  const formSubmitHandler = (event) => {
    event.preventDefault();

    if (!enteredMail || !enteredPass) {
      setError("All the fields are required to be filled");
      return;
    }

    fetch(url, {
      method: "POST",
      body: JSON.stringify(detalis),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.ok) {
          console.log(
            isLogin
              ? "User has successfully Logged in"
              : "User has successfully signed up"
          );
          alert(
            isLogin
              ? "User has successfully Logged in"
              : "User has successfully signed up"
          );
          {
            isLogin && navigate("/chat");
          }
          return res.json();
        } else {
          return res.json().then((data) => {
            console.log(data.message);
            alert(data.message);
            localStorage.setItem("user", JSON.stringify(data.user)); // store logged-in user
            localStorage.setItem("token", data.token);
          });
        }
      })
      .catch((err) => {
        console.log(err.message);
        alert(err.message);
      });

    setEnteredName("");
    setEnteredMail("");
    setEnteredPass("");
    setEnteredPhone("");
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
        <Form.Label className="formlabel">Phone Number:</Form.Label>
        <Form.Control
          style={{ backgroundColor: "#efebeb" }}
          className="forminput"
          type="number"
          value={enteredPhone}
          onChange={phoneChangeHandler}
          placeholder="Enter your ph.no"
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
