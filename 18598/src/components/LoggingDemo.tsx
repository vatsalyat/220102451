import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { logToServer, type LogLevel, type FrontendPackage } from "@/lib/logger";

interface LogEntry {
  id: string;
  timestamp: string;
  level: LogLevel;
  package: FrontendPackage;
  message: string;
  status: "success" | "error";
}

interface LoggingDemoProps {
  token: string | null;
}

const LOG_EXAMPLES = [
  { level: "debug" as LogLevel, package: "utils" as FrontendPackage, message: "Debug trace: Processing user input validation" },
  { level: "info" as LogLevel, package: "component" as FrontendPackage, message: "User interface rendered successfully" },
  { level: "warn" as LogLevel, package: "api" as FrontendPackage, message: "API response time exceeded 2 seconds" },
  { level: "error" as LogLevel, package: "auth" as FrontendPackage, message: "Failed to refresh authentication token" },
  { level: "fatal" as LogLevel, package: "page" as FrontendPackage, message: "Critical error: Application crashed unexpectedly" },
];

export function LoggingDemo({ token }: LoggingDemoProps) {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const { toast } = useToast();

  const sendLog = async (level: LogLevel, pkg: FrontendPackage, message: string) => {
    if (!token) {
      toast({
        title: "❌ No Authentication Token",
        description: "Please authenticate first",
        variant: "destructive"
      });
      return;
    }

    const logKey = `${level}-${pkg}`;
    setIsLoading(logKey);

    try {
      const response = await logToServer(token, level, pkg, message);
      
      const newLog: LogEntry = {
        id: response.logID,
        timestamp: new Date().toLocaleTimeString(),
        level,
        package: pkg,
        message,
        status: "success"
      };

      setLogs(prev => [newLog, ...prev].slice(0, 10)); // Keep last 10 logs
      
      toast({
        title: "✅ Log Sent Successfully",
        description: `${level.toUpperCase()} log sent to server`,
        variant: "default"
      });
      
    } catch (error) {
      const newLog: LogEntry = {
        id: `error-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        level,
        package: pkg,
        message,
        status: "error"
      };

      setLogs(prev => [newLog, ...prev].slice(0, 10));
      
      toast({
        title: "❌ Log Failed",
        description: "Failed to send log to server",
        variant: "destructive"
      });
    } finally {
      setIsLoading(null);
    }
  };

  const getLogLevelColor = (level: LogLevel) => {
    const colors = {
      debug: "bg-log-debug",
      info: "bg-log-info",
      warn: "bg-log-warn",
      error: "bg-log-error",
      fatal: "bg-log-fatal"
    };
    return colors[level];
  };

  const getLogLevelIcon = (level: LogLevel) => {
    const icons = {
      debug: "🔍",
      info: "ℹ️",
      warn: "⚠️",
      error: "❌",
      fatal: "💀"
    };
    return icons[level];
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>🚀 Logging Demonstration</CardTitle>
          <p className="text-muted-foreground">
            Test the logging middleware by sending different types of logs to the server
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {LOG_EXAMPLES.map((example, index) => (
              <Button
                key={index}
                variant="outline"
                className="h-auto p-4 flex flex-col items-start gap-2"
                onClick={() => sendLog(example.level, example.package, example.message)}
                disabled={!token || isLoading === `${example.level}-${example.package}`}
              >
                <div className="flex items-center gap-2 w-full">
                  <span>{getLogLevelIcon(example.level)}</span>
                  <Badge className={getLogLevelColor(example.level)}>
                    {example.level.toUpperCase()}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {example.package}
                  </Badge>
                </div>
                <p className="text-xs text-left text-muted-foreground">
                  {example.message}
                </p>
                {isLoading === `${example.level}-${example.package}` && (
                  <span className="text-xs">Sending...</span>
                )}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {logs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>📝 Recent Logs</CardTitle>
            <p className="text-muted-foreground">
              Last {logs.length} log entries sent to the server
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className={`p-3 rounded-lg border ${
                    log.status === "success" ? "border-success/20 bg-success/5" : "border-destructive/20 bg-destructive/5"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span>{getLogLevelIcon(log.level)}</span>
                      <Badge className={getLogLevelColor(log.level)}>
                        {log.level.toUpperCase()}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {log.package}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{log.timestamp}</span>
                    </div>
                    <Badge variant={log.status === "success" ? "default" : "destructive"}>
                      {log.status === "success" ? "✅ Sent" : "❌ Failed"}
                    </Badge>
                  </div>
                  <p className="text-sm">{log.message}</p>
                  {log.status === "success" && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Log ID: {log.id}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}