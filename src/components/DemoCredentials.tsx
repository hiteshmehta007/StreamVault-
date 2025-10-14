
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Copy, Eye, EyeOff, Info } from 'lucide-react';
import { toast } from 'sonner';

const demoAccounts = [
  {
    email: 'demo@streamvault.com',
    password: 'demo123456',
    username: 'DemoUser',
    description: 'Fresh account with active recovery code',
    recoveryCode: 'ABCD1234EFGH5678',
    status: 'Active Recovery Code'
  },
  {
    email: 'test@streamvault.com',
    password: 'test123456',
    username: 'TestUser',
    description: 'Test account with recovery code',
    recoveryCode: 'WXYZ9876IJKL4321',
    status: 'Active Recovery Code'
  },
  {
    email: 'admin@streamvault.com',
    password: 'admin123456',
    username: 'AdminUser',
    description: 'Account with expired recovery code (8+ days old)',
    recoveryCode: null,
    status: 'Recovery Code Expired'
  }
];

interface DemoCredentialsProps {
  onAccountSelect?: (email: string, password: string) => void;
}

export function DemoCredentials({ onAccountSelect }: DemoCredentialsProps) {
  const [showPasswords, setShowPasswords] = useState(false);
  const [showRecoveryCodes, setShowRecoveryCodes] = useState(false);

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${type} copied to clipboard`);
  };

  const formatRecoveryCode = (code: string) => {
    return code.replace(/(.{4})/g, '$1-').slice(0, -1);
  };

  return (
    <Card className="mb-6 border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-blue-800 dark:text-blue-200">
          <Info className="h-5 w-5" />
          <span>Demo Accounts - Test Credentials</span>
        </CardTitle>
        <p className="text-sm text-blue-700 dark:text-blue-300">
          Use these pre-configured accounts to test the platform features including the recovery code system.
        </p>
        <div className="flex justify-center mt-2">
          <Badge variant="secondary" className="bg-gradient-to-r from-purple-100 to-blue-100 text-purple-800 dark:from-purple-900 dark:to-blue-900 dark:text-purple-200">
            🎉 New: Create Channel to unlock Creator Dashboard, Analytics & Earnings!
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-4 mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowPasswords(!showPasswords)}
            className="flex items-center space-x-2"
          >
            {showPasswords ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            <span>{showPasswords ? 'Hide' : 'Show'} Passwords</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowRecoveryCodes(!showRecoveryCodes)}
            className="flex items-center space-x-2"
          >
            {showRecoveryCodes ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            <span>{showRecoveryCodes ? 'Hide' : 'Show'} Recovery Codes</span>
          </Button>
        </div>

        <div className="grid gap-4">
          {demoAccounts.map((account, index) => (
            <div key={index} className="border rounded-lg p-4 bg-background">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-medium">{account.username}</h4>
                  <p className="text-sm text-muted-foreground">{account.description}</p>
                </div>
                <Badge 
                  variant={account.recoveryCode ? "default" : "secondary"}
                  className="ml-2"
                >
                  {account.status}
                </Badge>
              </div>

              <div className="space-y-3">
                {/* Email */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium">Email:</span>
                    <code className="ml-2 px-2 py-1 bg-muted rounded text-sm">
                      {account.email}
                    </code>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(account.email, 'Email')}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>

                {/* Password */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium">Password:</span>
                    <code className="ml-2 px-2 py-1 bg-muted rounded text-sm">
                      {showPasswords ? account.password : '••••••••••'}
                    </code>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(account.password, 'Password')}
                    disabled={!showPasswords}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>

                {/* Recovery Code */}
                {account.recoveryCode && (
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium">Recovery Code:</span>
                      <code className="ml-2 px-2 py-1 bg-muted rounded text-sm font-mono">
                        {showRecoveryCodes 
                          ? formatRecoveryCode(account.recoveryCode)
                          : '••••-••••-••••-••••'
                        }
                      </code>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(account.recoveryCode!, 'Recovery Code')}
                      disabled={!showRecoveryCodes}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                )}

                {/* Quick Login Button */}
                {onAccountSelect && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onAccountSelect(account.email, account.password)}
                    className="w-full mt-2"
                  >
                    Quick Login as {account.username}
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            <strong>Note:</strong> These are demo accounts for testing purposes. In a production environment, 
            passwords would be hashed and recovery codes would be encrypted. The recovery code feature 
            automatically removes codes after 7 days for security.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

