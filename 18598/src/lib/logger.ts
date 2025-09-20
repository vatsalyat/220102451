/**
 * Professional Logging Middleware
 * Reusable TypeScript module for frontend logging
 */

// Type definitions for the logging system
export type LogLevel = "debug" | "info" | "warn" | "error" | "fatal";

export type FrontendPackage = 
  | "api" 
  | "component" 
  | "hook" 
  | "page" 
  | "state" 
  | "style" 
  | "auth" 
  | "config" 
  | "middleware" 
  | "utils";

export interface LogRequest {
  stack: "frontend";
  level: LogLevel;
  package: FrontendPackage;
  message: string;
}

export interface LogResponse {
  logID: string;
  message: string;
}

export interface AuthCredentials {
  email: string;
  name: string;
  rollNo: string;
  accessCode: string;
  clientID: string;
  clientSecret: string;
}

export interface AuthResponse {
  token_type: "Bearer";
  access_token: string;
  expires_in: number;
}

// API Configuration
const API_BASE_URL = "http://20.244.56.144/evaluation-service";
const AUTH_ENDPOINT = `${API_BASE_URL}/auth`;
const LOGS_ENDPOINT = `${API_BASE_URL}/logs`;

/**
 * Main logging function - sends log to server
 * @param token Bearer token for authentication
 * @param level Log level (debug, info, warn, error, fatal)
 * @param pkg Frontend package where log originated
 * @param message Log message
 * @returns Promise with log response
 */
export async function logToServer(
  token: string,
  level: LogLevel,
  pkg: FrontendPackage,
  message: string
): Promise<LogResponse> {
  const logRequest: LogRequest = {
    stack: "frontend",
    level: level.toLowerCase() as LogLevel,
    package: pkg.toLowerCase() as FrontendPackage,
    message
  };

  try {
    const response = await fetch(LOGS_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(logRequest)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const logResponse: LogResponse = await response.json();
    console.log(`✅ Log sent successfully: ${logResponse.logID}`);
    return logResponse;
    
  } catch (error) {
    console.error("❌ Failed to send log:", error);
    throw error;
  }
}

/**
 * Authenticate with the server to get bearer token
 * @param credentials User credentials for authentication
 * @returns Promise with auth response containing token
 */
export async function authenticate(credentials: AuthCredentials): Promise<AuthResponse> {
  try {
    const response = await fetch(AUTH_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(credentials)
    });

    if (!response.ok) {
      throw new Error(`Authentication failed! status: ${response.status}`);
    }

    const authResponse: AuthResponse = await response.json();
    console.log("🔐 Authentication successful");
    return authResponse;
    
  } catch (error) {
    console.error("❌ Authentication failed:", error);
    throw error;
  }
}

/**
 * Utility function to create a logger instance with token
 * @param token Bearer token
 * @returns Object with logging methods
 */
export function createLogger(token: string) {
  return {
    debug: (pkg: FrontendPackage, message: string) => 
      logToServer(token, "debug", pkg, message),
    info: (pkg: FrontendPackage, message: string) => 
      logToServer(token, "info", pkg, message),
    warn: (pkg: FrontendPackage, message: string) => 
      logToServer(token, "warn", pkg, message),
    error: (pkg: FrontendPackage, message: string) => 
      logToServer(token, "error", pkg, message),
    fatal: (pkg: FrontendPackage, message: string) => 
      logToServer(token, "fatal", pkg, message),
  };
}