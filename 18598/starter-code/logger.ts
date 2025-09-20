/**
 * Professional Logging Middleware for Frontend Applications
 * Standalone TypeScript module for server-side logging integration
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

// API Configuration
const LOGS_ENDPOINT = "http://20.244.56.144/evaluation-service/logs";

/**
 * Main logging function - sends log to evaluation server
 * @param token Bearer token for authentication
 * @param level Log level (debug, info, warn, error, fatal)
 * @param pkg Frontend package where log originated
 * @param message Log message content
 * @returns Promise with server response containing logID
 */
export async function logToServer(
  token: string,
  level: LogLevel,
  pkg: FrontendPackage,
  message: string
): Promise<LogResponse> {
  // Input validation
  if (!token || typeof token !== 'string') {
    throw new Error('Valid bearer token is required');
  }

  if (!message || typeof message !== 'string') {
    throw new Error('Log message is required');
  }

  // Construct request payload
  const logRequest: LogRequest = {
    stack: "frontend",
    level: level.toLowerCase() as LogLevel,
    package: pkg.toLowerCase() as FrontendPackage,
    message: message.trim()
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
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const logResponse: LogResponse = await response.json();
    
    // Optional: Console log for development
    console.log(`✅ Log sent successfully: ${logResponse.logID}`);
    
    return logResponse;
    
  } catch (error) {
    console.error("❌ Failed to send log to server:", error);
    throw error;
  }
}

/**
 * Utility function to create a logger instance with token
 * @param token Bearer token for authentication
 * @returns Object with logging methods for each level
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