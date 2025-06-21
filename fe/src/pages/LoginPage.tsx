import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { TextField } from "../components/TextField";
import { Button } from "../components/Button";
import styles from "./LoginPage.module.scss";

export const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );
  const [isLoading, setIsLoading] = useState(false);

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  //   useEffect(() => {
  //     if (isAuthenticated) {
  //       navigate("/dashboard");
  //     }
  //   }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
      await login(email, password);
    } catch (error: any) {
      setErrors({
        email: error.message.includes("email") ? error.message : undefined,
        password: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemoCredentials = (type: "admin" | "staff") => {
    if (type === "admin") {
      setEmail("admin@store.com");
      setPassword("Admin123");
    } else {
      setEmail("staff@store.com");
      setPassword("Staff123");
    }
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginContainer}>
        <div className={styles.header}>
          <h1>Store Review System</h1>
        </div>

        <form onSubmit={handleSubmit} className={styles.loginForm}>
          <TextField
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            fullWidth
            error={!!errors.email}
            errorText={errors.email}
            disabled={isLoading}
            autoComplete="email"
          />

          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
            fullWidth
            error={!!errors.password}
            errorText={errors.password}
            disabled={isLoading}
            loading={isLoading}
            autoComplete="current-password"
          />

          <Button
            type="submit"
            variant="primary"
            size="large"
            fullWidth
            loading={isLoading}
            disabled={isLoading}
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </Button>
        </form>

        <div className={styles.demoSection}>
          <h3>Demo Credentials:</h3>
          <div className={styles.demoButtons}>
            <Button
              variant="outlined"
              size="small"
              onClick={() => fillDemoCredentials("admin")}
              disabled={isLoading}
            >
              Fill Admin
            </Button>
            <Button
              variant="outlined"
              size="small"
              onClick={() => fillDemoCredentials("staff")}
              disabled={isLoading}
            >
              Fill Staff
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
