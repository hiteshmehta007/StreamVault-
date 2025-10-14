import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent } from './ui/tabs';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Settings, User, Palette, Bell, Shield, HelpCircle, Globe } from 'lucide-react';
import { LanguageSelector } from './LanguageSelector';
import { useTranslation } from '../hooks/useTranslation';

interface SettingsPageProps {
  onNavigate?: (page: string) => void;
}

export function SettingsPage({ onNavigate }: SettingsPageProps) {
  const _onNavigate = onNavigate || (() => {});
  const { t } = useTranslation();

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Left Column - Settings Card */}
        <div className="lg:col-span-1">
          <div className="sticky top-6">
            {/* Settings Profile Card */}
            <Card className="w-[100px] h-[80px] flex-shrink-0">
              <CardHeader className="text-center p-1 h-full flex items-center justify-center">
                <div className="flex flex-col items-center space-y-1">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-xs">
                      <Settings className="h-3 w-3" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-center">
                    <CardTitle className="text-xs leading-none mb-0.5">{t('settings')}</CardTitle>
                    <CardDescription className="text-[10px] leading-none">Manage preferences</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
            
            {/* Account Recovery Code System */}
            <Card className="mt-6">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-amber-600" />
                  <span>Account Recovery Code</span>
                </CardTitle>
                <CardDescription>
                  Secure backup access for account recovery and emergency authentication
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                {/* What is Recovery Code - Info Section */}
                <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-200/50">
                  <div className="flex items-start space-x-3">
                    <div className="text-blue-600 text-lg mt-0.5">ℹ️</div>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm text-blue-900 dark:text-blue-100">
                        What is a Recovery Code?
                      </h4>
                      <p className="text-xs text-blue-800 dark:text-blue-200 leading-relaxed">
                        A recovery code is a unique, encrypted backup key that allows you to regain access to your account 
                        if you lose your primary authentication methods (password, 2FA device, etc.). It serves as your 
                        emergency access route and should be treated with the same security as your password.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Recovery Code Display */}
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 rounded-lg p-4 border border-amber-200/50">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-xs font-medium text-amber-800 dark:text-amber-200">
                        Active & Valid
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30 px-2 py-1 rounded">
                        Expires: 6 days left
                      </span>
                    </div>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-900 p-4 rounded border-2 border-dashed border-amber-300 dark:border-amber-700">
                    <div className="text-center space-y-2">
                      <div className="font-mono text-xl font-bold text-amber-900 dark:text-amber-100 tracking-wider">
                        A7K9-M3X2-P8Q5-N1R6
                      </div>
                      <div className="flex items-center justify-center space-x-4 text-xs text-amber-700 dark:text-amber-300">
                        <span className="flex items-center space-x-1">
                          <span>🔒</span>
                          <span>AES-256 Encrypted</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <span>🔐</span>
                          <span>One-Time Use</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <span>⏰</span>
                          <span>Time-Limited</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-4">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-xs border-amber-300 text-amber-700 hover:bg-amber-50 dark:border-amber-700 dark:text-amber-300 dark:hover:bg-amber-950/30"
                    >
                      <span className="mr-2">📋</span>
                      Copy Code
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-xs border-amber-300 text-amber-700 hover:bg-amber-50 dark:border-amber-700 dark:text-amber-300 dark:hover:bg-amber-950/30"
                    >
                      <span className="mr-2">💾</span>
                      Save as File
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-xs border-amber-300 text-amber-700 hover:bg-amber-50 dark:border-amber-700 dark:text-amber-300 dark:hover:bg-amber-950/30"
                    >
                      <span className="mr-2">�️</span>
                      Print Code
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-xs border-green-300 text-green-700 hover:bg-green-50 dark:border-green-700 dark:text-green-300 dark:hover:bg-green-950/30"
                    >
                      <span className="mr-2">🔄</span>
                      Generate New
                    </Button>
                  </div>
                </div>

                {/* Critical Security Warning */}
                <div className="bg-red-50 dark:bg-red-950/20 p-4 rounded-lg border border-red-200/50">
                  <div className="flex items-start space-x-3">
                    <div className="text-red-600 text-lg mt-0.5">⚠️</div>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm text-red-900 dark:text-red-100">
                        Critical Security Warning
                      </h4>
                      <div className="space-y-1 text-xs text-red-800 dark:text-red-200">
                        <p>• <strong>Expires in 7 days:</strong> This code will become invalid after the expiration date</p>
                        <p>• <strong>One-time use only:</strong> Code becomes permanently invalid after a single use</p>
                        <p>• <strong>No recovery for lost codes:</strong> If lost, you must generate a new one while still logged in</p>
                        <p>• <strong>Account security:</strong> Anyone with this code can access your account - treat it like your password</p>
                        <p>• <strong>Emergency only:</strong> Use only when all other access methods have failed</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right Column - Settings Content */}
        <div className="lg:col-span-2">
          {/* Quick Actions */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-2">
                <Button variant="ghost" className="flex-1 min-w-fit justify-start">
                  <User className="h-4 w-4 mr-2" />
                  Account Settings
                </Button>
                <Button variant="ghost" className="flex-1 min-w-fit justify-start">
                  <Palette className="h-4 w-4 mr-2" />
                  Appearance
                </Button>
                <Button variant="ghost" className="flex-1 min-w-fit justify-start">
                  <Bell className="h-4 w-4 mr-2" />
                  Notifications
                </Button>
                <Button variant="ghost" className="flex-1 min-w-fit justify-start">
                  <Shield className="h-4 w-4 mr-2" />
                  Privacy & Security
                </Button>
                <Button variant="ghost" className="flex-1 min-w-fit justify-start">
                  <HelpCircle className="h-4 w-4 mr-2" />
                  Help & Support
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Settings Tabs */}
          <Tabs defaultValue="profile" className="w-full">

            <TabsContent value="profile" className="mt-6 space-y-6">
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center space-x-2">
                    <User className="h-5 w-5" />
                    <span>Profile Management</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Profile Update Demo Section */}
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-lg p-5 border border-blue-200/50 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2">🚀 Profile Update Demo</h3>
                        <p className="text-sm text-blue-600 dark:text-blue-300 leading-relaxed">
                          Test the enhanced profile update form with all your requested features
                        </p>
                      </div>
                      <Button
                        onClick={() => _onNavigate('profile-update-demo')}
                        className="bg-blue-600 hover:bg-blue-700 text-white shrink-0"
                        size="sm"
                      >
                        <User className="h-4 w-4 mr-2" />
                        Try Profile Update
                      </Button>
                    </div>
                  </div>

                  {/* Creator Profile Landing Section */}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-lg p-5 border border-green-200/50 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-2">🎯 Creator Profile Setup</h3>
                        <p className="text-sm text-green-600 dark:text-green-300 leading-relaxed">
                          Complete creator profile management with social links and branding
                        </p>
                      </div>
                      <Button
                        onClick={() => _onNavigate('creator-profile-landing')}
                        className="bg-green-600 hover:bg-green-700 text-white shrink-0"
                        size="sm"
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Setup Creator Profile
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="appearance" className="mt-6 space-y-6">
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center space-x-2">
                    <Palette className="h-5 w-5" />
                    <span>Appearance Settings</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground mb-4">Theme and display settings will be available here.</p>
                  <div className="space-y-4">
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-medium mb-2">Theme Preferences</h4>
                      <p className="text-sm text-muted-foreground">Light, dark, or system theme options</p>
                    </div>
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-medium mb-2">Display Settings</h4>
                      <p className="text-sm text-muted-foreground">Font size, layout density, and color schemes</p>
                    </div>
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-medium mb-2 flex items-center space-x-2">
                        <Globe className="h-4 w-4" />
                        <span>Language & Region</span>
                      </h4>
                      <p className="text-sm text-muted-foreground mb-3">Select your preferred language for the interface</p>
                      <LanguageSelector 
                        variant="select" 
                        showFlag={true} 
                        showNativeName={true}
                        placeholder="Choose your language"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="mt-6 space-y-6">
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center space-x-2">
                    <Bell className="h-5 w-5" />
                    <span>Notification Preferences</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground mb-4">Notification settings will be available here.</p>
                  <div className="space-y-4">
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-medium mb-2">Email Notifications</h4>
                      <p className="text-sm text-muted-foreground">New videos, comments, and updates</p>
                    </div>
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-medium mb-2">Push Notifications</h4>
                      <p className="text-sm text-muted-foreground">Real-time alerts and recommendations</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="privacy" className="mt-6 space-y-6">
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="h-5 w-5" />
                    <span>Privacy & Security</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground mb-4">Privacy and security settings will be available here.</p>
                  <div className="space-y-4">
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-medium mb-2">Account Security</h4>
                      <p className="text-sm text-muted-foreground">Two-factor authentication and password settings</p>
                    </div>
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-medium mb-2">Data Privacy</h4>
                      <p className="text-sm text-muted-foreground">Control what data is collected and shared</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}