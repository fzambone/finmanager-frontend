import React, { FormEventHandler, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Button, Container, Form, Spinner } from "react-bootstrap";
import * as axios from "axios";
import apiClient from "../api/axiosConfig.ts";

const LoginForm: React.FC = () => {
  // --- State Variables ---
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  // --- Handle Form Submission ---
  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await apiClient.post("/auth/login", {
        email: email,
        password: password,
      });

      // --- Handle Successful Login ---
      if (response.status === 200 && response.data.access) {
        console.log("Login successful", response.data);

        localStorage.setItem("accessToken", response.data.access);

        if (response.data.refresh) {
          localStorage.setItem("refreshToken", response.data.refresh);
        }

        if (response.data.user) {
          localStorage.setItem("user", JSON.stringify(response.data.user));
        }

        navigate("/");
      } else {
        setError("Login failed. Unexpected response from server.");
        console.error("Unexpected login response:", response);
      }
    } catch (err) {
      console.error("Login error:", err);
      let errorMessage =
        "Login failed. Please check your credentials and try again.";

      if (axios.isAxiosError(err)) {
        if (err.response) {
          console.error("Error response data:", err.response.data);
          console.error("Error response status:", err.response.status);

          if (err.response.data && err.response.data.non_field_errors) {
            errorMessage = err.response.data.non_field_errors.join(" ");
          } else if (typeof err.response.data === "string") {
            errorMessage = err.response.data;
          } else if (err.response.data && err.response.data.detail) {
            errorMessage = err.response.data.detail;
          }
        } else if (err.request) {
          console.error("Error request:", err.request);
          errorMessage =
            "Login failed. Please check your credentials and try again.";
        }
      } else if (err instanceof Error) {
        console.error("Non-Axios error message:", err.message);
        errorMessage = "Login failed: ${err.message}";
      } else {
        errorMessage = "An unexpected error occurred during login.";
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // --- Render the form ---
  return (
    <Container className={"mt-5"}>
      <h2>Login</h2>
      <Form onSubmit={handleSubmit}>
        {/* Display error message if 'error' state is not null */}
        {error && <Alert variant={"danger"}>{error}</Alert>}

        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type={"email"}
            placeholder={"Enter email"}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
          />
        </Form.Group>

        <Form.Group className={"mb-3"} controlId={"formBasicPassword"}>
          <Form.Label>Password</Form.Label>
          <Form.Control
            type={"password"}
            placeholder={"Password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
          />
        </Form.Group>

        <Button variant="primary" type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />{" "}
              Loading...
            </>
          ) : (
            "Login"
          )}
        </Button>
      </Form>
    </Container>
  );
};

export default LoginForm;
