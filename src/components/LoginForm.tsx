import React, { FormEventHandler, useState } from "react";
import { Alert, Button, Container, Form, Spinner } from "react-bootstrap";
import * as axios from "axios";
import apiClient from "../api/axiosConfig.ts";
import { useAuth } from "../hooks/useAuth.ts";
import { UserInfo } from "../context/authContextDefs.ts";

const LoginForm: React.FC = () => {
  // --- State Variables ---
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { login } = useAuth();

  // --- Handle Form Submission ---
  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await apiClient.post<{
        access: string;
        refresh?: string;
        user: UserInfo;
      }>("/auth/login", {
        email: email,
        password: password,
      });

      // --- Handle Successful Login ---
      if (
        response.status === 200 &&
        response.data.access &&
        response.data.user
      ) {
        login(response.data.access, response.data.user);
      } else {
        setError("Login failed. Unexpected response from server.");
        console.error("Unexpected login response:", response);
      }
    } catch (err) {
      // --- Handle Errors (Using Axios type guard) ---
      console.error("Login error:", err);
      let errorMessage =
        "Login failed. Please check your credentials and try again.";

      if (axios.isAxiosError(err)) {
        if (err.response) {
          console.error("Error response data:", err.response.data);
          const data = err.response.data;
          if (
            data &&
            data.non_field_errors &&
            Array.isArray(data.non_field_errors)
          ) {
            errorMessage = data.non_field_errors.join(" ");
          } else if (data && typeof data.detail === "string") {
            errorMessage = data.detail;
          } else if (typeof data === "string") {
            errorMessage = data;
          }
        } else if (err.request) {
          errorMessage = "Login failed. No response from server.";
        }
      } else if (err instanceof Error) {
        errorMessage = `Login failed: ${err.message}`;
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
