import { useState } from "react";
import { AuthSection } from "@/components/AuthSection";
import { LoggingDemo } from "@/components/LoggingDemo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const Index = () => {
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleAuthSuccess = (authToken: string) => {
    setToken(authToken);
    setIsAuthenticated(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 max-w-6xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h2 className="text-xl font-bold">LoggerPro</h2>
              <Badge variant="secondary">v1.0.0</Badge>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant={isAuthenticated ? "default" : "outline"}>
                {isAuthenticated ? "🟢 Connected" : "🔴 Disconnected"}
              </Badge>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="mb-6">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-accent to-info bg-clip-text text-transparent">
              Frontend Logging Middleware
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Professional TypeScript logging middleware with authentication, server integration, 
              and real-time monitoring capabilities for modern web applications.
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            <Badge variant="outline">TypeScript</Badge>
            <Badge variant="outline">React</Badge>
            <Badge variant="outline">REST API</Badge>
            <Badge variant="outline">Authentication</Badge>
            <Badge variant="outline">Real-time Logging</Badge>
          </div>
        </div>

        {/* Features Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                <span className="text-2xl">🔐</span>
              </div>
              <CardTitle className="text-lg">Secure Authentication</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Bearer token authentication with secure credential management and automatic session handling.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                <span className="text-2xl">📊</span>
              </div>
              <CardTitle className="text-lg">Real-time Logging</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Five log levels (debug, info, warn, error, fatal) with instant server communication and response tracking.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                <span className="text-2xl">⚡</span>
              </div>
              <CardTitle className="text-lg">Production Ready</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                TypeScript middleware with proper error handling, type safety, and modular architecture.
              </p>
            </CardContent>
          </Card>
        </div>

        <Separator className="mb-12" />

        {/* Technical Specifications */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">⚙️</span>
              Technical Architecture
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                  Middleware Core
                </h3>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• <code className="bg-muted px-1 rounded">logToServer()</code> - Main logging function</li>
                  <li>• <code className="bg-muted px-1 rounded">authenticate()</code> - Bearer token management</li>
                  <li>• <code className="bg-muted px-1 rounded">createLogger()</code> - Logger instance factory</li>
                  <li>• TypeScript interfaces for type safety</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-accent rounded-full"></span>
                  API Integration
                </h3>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• REST API communication</li>
                  <li>• Structured JSON payloads</li>
                  <li>• Error handling & response validation</li>
                  <li>• Automatic token refresh support</li>
                </ul>
              </div>
            </div>
            
            <div className="bg-muted/50 p-4 rounded-lg border">
              <h4 className="font-semibold mb-2 text-sm">🚀 Implementation Guide</h4>
              <p className="text-sm text-muted-foreground">
                Ready for Next.js integration. Copy the middleware module to your project, 
                configure environment variables, and start logging with full type safety.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Live Demo Section */}
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Live Demo</h2>
            <p className="text-muted-foreground">
              Test the logging middleware in action with real server communication
            </p>
          </div>

          {/* Authentication Section */}
          <AuthSection 
            onAuthSuccess={handleAuthSuccess}
            isAuthenticated={isAuthenticated}
          />

          {/* Logging Demo Section */}
          <LoggingDemo token={token} />
        </div>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t">
          <div className="text-center text-sm text-muted-foreground">
            <p>Built with React, TypeScript, and Tailwind CSS</p>
            <p className="mt-1">Professional logging middleware for modern web applications</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;
