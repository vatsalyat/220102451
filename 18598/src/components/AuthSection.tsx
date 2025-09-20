import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { authenticate, type AuthCredentials } from "@/lib/logger";

interface AuthSectionProps {
  onAuthSuccess: (token: string) => void;
  isAuthenticated: boolean;
}

export function AuthSection({ onAuthSuccess, isAuthenticated }: AuthSectionProps) {
  const [credentials, setCredentials] = useState<AuthCredentials>({
    email: "",
    name: "",
    rollNo: "",
    accessCode: "",
    clientID: "",
    clientSecret: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (field: keyof AuthCredentials, value: string) => {
    setCredentials(prev => ({ ...prev, [field]: value }));
  };

  const handleAuthenticate = async () => {
    setIsLoading(true);
    try {
      const response = await authenticate(credentials);
      onAuthSuccess(response.access_token);
      toast({
        title: "🔐 Authentication Successful",
        description: "You can now send logs to the server",
        variant: "default"
      });
    } catch (error) {
      toast({
        title: "❌ Authentication Failed",
        description: "Please check your credentials and try again",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isAuthenticated) {
    return (
      <Card className="border-success">
        <CardHeader>
          <CardTitle className="text-success flex items-center gap-2">
            ✅ Authenticated Successfully
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            You are authenticated and ready to send logs to the server.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>🔐 Authentication Required</CardTitle>
        <p className="text-muted-foreground">
          Enter your credentials to authenticate with the evaluation server
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="your_email@abc.edu"
              value={credentials.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              placeholder="Your Name"
              value={credentials.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="rollNo">Roll Number</Label>
            <Input
              id="rollNo"
              placeholder="your_rollno"
              value={credentials.rollNo}
              onChange={(e) => handleInputChange("rollNo", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="accessCode">Access Code</Label>
            <Input
              id="accessCode"
              placeholder="your_access_code"
              value={credentials.accessCode}
              onChange={(e) => handleInputChange("accessCode", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="clientID">Client ID</Label>
            <Input
              id="clientID"
              placeholder="your_client_id"
              value={credentials.clientID}
              onChange={(e) => handleInputChange("clientID", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="clientSecret">Client Secret</Label>
            <Input
              id="clientSecret"
              type="password"
              placeholder="your_client_secret"
              value={credentials.clientSecret}
              onChange={(e) => handleInputChange("clientSecret", e.target.value)}
            />
          </div>
        </div>
        
        <Button 
          onClick={handleAuthenticate} 
          disabled={isLoading || !credentials.email}
          className="w-full"
        >
          {isLoading ? "Authenticating..." : "🔐 Authenticate"}
        </Button>
      </CardContent>
    </Card>
  );
}