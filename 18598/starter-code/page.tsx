'use client';

import { useState, useEffect } from 'react';
import { logToServer, LogLevel, FrontendPackage } from '../../Logging Middleware/logger';

// Authentication types
interface AuthCredentials {
  email: string;
  name: string;
  rollNo: string;
  accessCode: string;
  clientID: string;
  clientSecret: string;
}

interface AuthResponse {
  token_type: "Bearer";
  access_token: string;
  expires_in: number;
}

// Log entry for display
interface LogEntry {
  id: string;
  timestamp: string;
  level: LogLevel;
  package: FrontendPackage;
  message: string;
  status: 'success' | 'error';
}

export default function HomePage() {
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Authentication function
  const authenticate = async (): Promise<void> => {
    setIsAuthenticating(true);
    
    const credentials: AuthCredentials = {
      email: process.env.NEXT_PUBLIC_EMAIL!,
      name: process.env.NEXT_PUBLIC_NAME!,
      rollNo: process.env.NEXT_PUBLIC_ROLL_NO!,
      accessCode: process.env.NEXT_PUBLIC_ACCESS_CODE!,
      clientID: process.env.NEXT_PUBLIC_CLIENT_ID!,
      clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET!,
    };

    try {
      const response = await fetch('http://20.244.56.144/evaluation-service/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        throw new Error(`Authentication failed: ${response.status}`);
      }

      const authResponse: AuthResponse = await response.json();
      setToken(authResponse.access_token);
      setIsAuthenticated(true);

      // Log successful authentication
      await logToServer(authResponse.access_token, 'info', 'auth', 'User successfully authenticated');
      
    } catch (error) {
      console.error('Authentication error:', error);
      alert('Authentication failed. Please check your credentials.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  // Send log function
  const sendLog = async (level: LogLevel, pkg: FrontendPackage, message: string) => {
    if (!token) {
      alert('Please authenticate first');
      return;
    }

    setIsLoading(true);
    const logEntry: LogEntry = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      level,
      package: pkg,
      message,
      status: 'success'
    };

    try {
      const response = await logToServer(token, level, pkg, message);
      console.log('Log sent successfully:', response);
      
      setLogs(prev => [logEntry, ...prev].slice(0, 10)); // Keep last 10 logs
      
    } catch (error) {
      console.error('Failed to send log:', error);
      logEntry.status = 'error';
      setLogs(prev => [logEntry, ...prev].slice(0, 10));
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-authenticate on mount
  useEffect(() => {
    authenticate();
  }, []);

  // Predefined log examples
  const logExamples = [
    { level: 'debug' as LogLevel, pkg: 'component' as FrontendPackage, message: 'Component rendered successfully' },
    { level: 'info' as LogLevel, pkg: 'page' as FrontendPackage, message: 'Page loaded and ready' },
    { level: 'warn' as LogLevel, pkg: 'api' as FrontendPackage, message: 'API response time exceeded threshold' },
    { level: 'error' as LogLevel, pkg: 'hook' as FrontendPackage, message: 'useEffect cleanup failed' },
    { level: 'fatal' as LogLevel, pkg: 'auth' as FrontendPackage, message: 'Critical authentication failure' },
  ];

  const getLogLevelColor = (level: LogLevel): string => {
    const colors = {
      debug: 'bg-gray-500',
      info: 'bg-blue-500',
      warn: 'bg-yellow-500',
      error: 'bg-red-500',
      fatal: 'bg-purple-500'
    };
    return colors[level];
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Frontend Logging Middleware Demo
          </h1>
          <p className="text-gray-600">
            Professional TypeScript logging with server integration
          </p>
          <div className="mt-4">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              isAuthenticated ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {isAuthenticated ? '🟢 Authenticated' : '🔴 Not Authenticated'}
            </span>
          </div>
        </header>

        {/* Authentication Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Authentication Status</h2>
          {isAuthenticated ? (
            <div className="text-green-600">
              ✅ Successfully authenticated with evaluation server
            </div>
          ) : (
            <div>
              <button
                onClick={authenticate}
                disabled={isAuthenticating}
                className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-4 py-2 rounded-md"
              >
                {isAuthenticating ? 'Authenticating...' : 'Authenticate'}
              </button>
            </div>
          )}
        </div>

        {/* Logging Demo Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Send Test Logs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {logExamples.map((example, index) => (
              <button
                key={index}
                onClick={() => sendLog(example.level, example.pkg, example.message)}
                disabled={!token || isLoading}
                className={`p-4 rounded-lg text-white font-medium disabled:opacity-50 hover:opacity-90 transition-opacity ${getLogLevelColor(example.level)}`}
              >
                <div className="text-sm uppercase font-bold mb-1">
                  {example.level}
                </div>
                <div className="text-xs">
                  {example.pkg} • {example.message}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Logs Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Logs</h2>
          {logs.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No logs sent yet. Click a button above to send a test log.
            </p>
          ) : (
            <div className="space-y-3">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className={`p-3 rounded-lg border-l-4 ${
                    log.status === 'success' 
                      ? 'border-green-500 bg-green-50' 
                      : 'border-red-500 bg-red-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded text-xs font-bold text-white ${getLogLevelColor(log.level)}`}>
                        {log.level.toUpperCase()}
                      </span>
                      <span className="text-sm text-gray-600">
                        {log.package}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gray-800">
                    {log.message}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}