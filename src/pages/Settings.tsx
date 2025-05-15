import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Save, 
  User, 
  Lock, 
  Mail, 
  Bell, 
  PaintBucket, 
  Palette, 
  Globe, 
  Languages, 
  Shield, 
  Smartphone 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { showToast } from "@/lib/toastManager";
import { useTheme } from "@/components/ThemeProvider";
import { pageTransition, slideUp } from "@/lib/animations";

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<string>("profile");
  
  // Form states
  const [profileForm, setProfileForm] = useState({
    firstName: "Admin",
    lastName: "User",
    email: "admin@plink.com",
    phone: "(555) 123-4567",
    bio: "System administrator for Plink platform."
  });
  
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    marketingEmails: false,
    activitySummary: true,
    securityAlerts: true
  });
  
  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: theme,
    accentColor: "blue",
    fontSize: "medium",
    reduceMotion: false,
    sidebarCollapsed: false
  });
  
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    sessionTimeout: "30",
    loginAlerts: true,
    ipRestriction: false
  });
  
  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    showToast({
      title: "Profile Updated",
      description: "Your profile information has been updated successfully.",
      variant: "success"
    });
  };
  
  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    showToast({
      title: "Password Updated",
      description: "Your password has been changed successfully.",
      variant: "success"
    });
  };
  
  const handleNotificationUpdate = () => {
    showToast({
      title: "Notification Settings Updated",
      description: "Your notification preferences have been saved.",
      variant: "success"
    });
  };
  
  const handleAppearanceUpdate = () => {
    setTheme(appearanceSettings.theme as "light" | "dark" | "system");
    
    showToast({
      title: "Appearance Settings Updated",
      description: "Your appearance preferences have been saved.",
      variant: "success"
    });
  };
  
  const handleSecurityUpdate = () => {
    showToast({
      title: "Security Settings Updated",
      description: "Your security preferences have been saved.",
      variant: "success"
    });
  };
  
  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <Card className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <CardHeader className="p-6 border-b border-gray-100 dark:border-gray-700">
          <CardTitle>Settings</CardTitle>
        </CardHeader>
        
        <CardContent className="p-6">
          <Tabs defaultValue="profile" onValueChange={setActiveTab}>
            <TabsList className="mb-8 grid grid-cols-2 md:grid-cols-5 gap-2">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="h-4 w-4" /> Profile
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-2">
                <Bell className="h-4 w-4" /> Notifications
              </TabsTrigger>
              <TabsTrigger value="appearance" className="flex items-center gap-2">
                <PaintBucket className="h-4 w-4" /> Appearance
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-2">
                <Shield className="h-4 w-4" /> Security
              </TabsTrigger>
              <TabsTrigger value="advanced" className="flex items-center gap-2">
                <Smartphone className="h-4 w-4" /> Advanced
              </TabsTrigger>
            </TabsList>
            
            {/* Profile Settings */}
            <TabsContent value="profile">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-medium text-textDark dark:text-white mb-4">Personal Information</h3>
                  <form onSubmit={handleProfileUpdate}>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name</Label>
                          <Input 
                            id="firstName" 
                            value={profileForm.firstName} 
                            onChange={(e) => setProfileForm({
                              ...profileForm,
                              firstName: e.target.value
                            })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input 
                            id="lastName" 
                            value={profileForm.lastName} 
                            onChange={(e) => setProfileForm({
                              ...profileForm,
                              lastName: e.target.value
                            })}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input 
                          id="email" 
                          type="email" 
                          value={profileForm.email} 
                          onChange={(e) => setProfileForm({
                            ...profileForm,
                            email: e.target.value
                          })}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input 
                          id="phone" 
                          value={profileForm.phone} 
                          onChange={(e) => setProfileForm({
                            ...profileForm,
                            phone: e.target.value
                          })}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea 
                          id="bio" 
                          value={profileForm.bio} 
                          onChange={(e) => setProfileForm({
                            ...profileForm,
                            bio: e.target.value
                          })}
                          rows={4}
                        />
                      </div>
                      
                      <Button type="submit" className="mt-2">
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </Button>
                    </div>
                  </form>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-textDark dark:text-white mb-4">Password</h3>
                  <form onSubmit={handlePasswordUpdate}>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <Input id="currentPassword" type="password" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input id="newPassword" type="password" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <Input id="confirmPassword" type="password" />
                      </div>
                      
                      <Button type="submit" className="mt-2">
                        <Lock className="h-4 w-4 mr-2" />
                        Update Password
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            </TabsContent>
            
            {/* Notification Settings */}
            <TabsContent value="notifications">
              <div>
                <h3 className="text-lg font-medium text-textDark dark:text-white mb-4">Notification Preferences</h3>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-base font-medium text-textDark dark:text-white">Email Notifications</h4>
                      <p className="text-sm text-textLight dark:text-gray-400">Receive notifications via email</p>
                    </div>
                    <Switch 
                      checked={notificationSettings.emailNotifications} 
                      onCheckedChange={(checked) => setNotificationSettings({
                        ...notificationSettings,
                        emailNotifications: checked
                      })}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-base font-medium text-textDark dark:text-white">Push Notifications</h4>
                      <p className="text-sm text-textLight dark:text-gray-400">Receive notifications in-app and on mobile</p>
                    </div>
                    <Switch 
                      checked={notificationSettings.pushNotifications} 
                      onCheckedChange={(checked) => setNotificationSettings({
                        ...notificationSettings,
                        pushNotifications: checked
                      })}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-base font-medium text-textDark dark:text-white">Marketing Emails</h4>
                      <p className="text-sm text-textLight dark:text-gray-400">Receive promotional emails and offers</p>
                    </div>
                    <Switch 
                      checked={notificationSettings.marketingEmails} 
                      onCheckedChange={(checked) => setNotificationSettings({
                        ...notificationSettings,
                        marketingEmails: checked
                      })}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-base font-medium text-textDark dark:text-white">Activity Summary</h4>
                      <p className="text-sm text-textLight dark:text-gray-400">Receive weekly summary of platform activity</p>
                    </div>
                    <Switch 
                      checked={notificationSettings.activitySummary} 
                      onCheckedChange={(checked) => setNotificationSettings({
                        ...notificationSettings,
                        activitySummary: checked
                      })}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-base font-medium text-textDark dark:text-white">Security Alerts</h4>
                      <p className="text-sm text-textLight dark:text-gray-400">Receive alerts about security events</p>
                    </div>
                    <Switch 
                      checked={notificationSettings.securityAlerts} 
                      onCheckedChange={(checked) => setNotificationSettings({
                        ...notificationSettings,
                        securityAlerts: checked
                      })}
                    />
                  </div>
                  
                  <Button onClick={handleNotificationUpdate} className="mt-4">
                    <Save className="h-4 w-4 mr-2" />
                    Save Preferences
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            {/* Appearance Settings */}
            <TabsContent value="appearance">
              <div>
                <h3 className="text-lg font-medium text-textDark dark:text-white mb-4">Appearance Settings</h3>
                <div className="space-y-6">
                  <div className="space-y-3">
                    <Label htmlFor="theme">Theme</Label>
                    <RadioGroup 
                      value={appearanceSettings.theme} 
                      onValueChange={(value) => setAppearanceSettings({
                        ...appearanceSettings,
                        theme: value
                      })}
                      className="flex space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="light" id="theme-light" />
                        <Label htmlFor="theme-light">Light</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="dark" id="theme-dark" />
                        <Label htmlFor="theme-dark">Dark</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="system" id="theme-system" />
                        <Label htmlFor="theme-system">System</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-3">
                    <Label htmlFor="accentColor">Accent Color</Label>
                    <Select 
                      value={appearanceSettings.accentColor} 
                      onValueChange={(value) => setAppearanceSettings({
                        ...appearanceSettings,
                        accentColor: value
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select an accent color" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="blue">Blue</SelectItem>
                        <SelectItem value="purple">Purple</SelectItem>
                        <SelectItem value="green">Green</SelectItem>
                        <SelectItem value="red">Red</SelectItem>
                        <SelectItem value="orange">Orange</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-3">
                    <Label htmlFor="fontSize">Font Size</Label>
                    <Select 
                      value={appearanceSettings.fontSize} 
                      onValueChange={(value) => setAppearanceSettings({
                        ...appearanceSettings,
                        fontSize: value
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a font size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">Small</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="large">Large</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-base font-medium text-textDark dark:text-white">Reduce Motion</h4>
                      <p className="text-sm text-textLight dark:text-gray-400">Decrease animation effects throughout the interface</p>
                    </div>
                    <Switch 
                      checked={appearanceSettings.reduceMotion} 
                      onCheckedChange={(checked) => setAppearanceSettings({
                        ...appearanceSettings,
                        reduceMotion: checked
                      })}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-base font-medium text-textDark dark:text-white">Sidebar Collapsed by Default</h4>
                      <p className="text-sm text-textLight dark:text-gray-400">Start with sidebar collapsed to maximize screen space</p>
                    </div>
                    <Switch 
                      checked={appearanceSettings.sidebarCollapsed} 
                      onCheckedChange={(checked) => setAppearanceSettings({
                        ...appearanceSettings,
                        sidebarCollapsed: checked
                      })}
                    />
                  </div>
                  
                  <Button onClick={handleAppearanceUpdate} className="mt-4">
                    <Palette className="h-4 w-4 mr-2" />
                    Save Appearance
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            {/* Security Settings */}
            <TabsContent value="security">
              <div>
                <h3 className="text-lg font-medium text-textDark dark:text-white mb-4">Security Settings</h3>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-base font-medium text-textDark dark:text-white">Two-Factor Authentication</h4>
                      <p className="text-sm text-textLight dark:text-gray-400">Add an extra layer of security to your account</p>
                    </div>
                    <Switch 
                      checked={securitySettings.twoFactorAuth} 
                      onCheckedChange={(checked) => setSecuritySettings({
                        ...securitySettings,
                        twoFactorAuth: checked
                      })}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-3">
                    <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                    <Select 
                      value={securitySettings.sessionTimeout} 
                      onValueChange={(value) => setSecuritySettings({
                        ...securitySettings,
                        sessionTimeout: value
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a timeout duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                        <SelectItem value="120">2 hours</SelectItem>
                        <SelectItem value="240">4 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-base font-medium text-textDark dark:text-white">Login Alerts</h4>
                      <p className="text-sm text-textLight dark:text-gray-400">Receive email alerts for new login attempts</p>
                    </div>
                    <Switch 
                      checked={securitySettings.loginAlerts} 
                      onCheckedChange={(checked) => setSecuritySettings({
                        ...securitySettings,
                        loginAlerts: checked
                      })}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-base font-medium text-textDark dark:text-white">IP Restriction</h4>
                      <p className="text-sm text-textLight dark:text-gray-400">Limit access to specific IP addresses</p>
                    </div>
                    <Switch 
                      checked={securitySettings.ipRestriction} 
                      onCheckedChange={(checked) => setSecuritySettings({
                        ...securitySettings,
                        ipRestriction: checked
                      })}
                    />
                  </div>
                  
                  <Button onClick={handleSecurityUpdate} className="mt-4">
                    <Shield className="h-4 w-4 mr-2" />
                    Save Security Settings
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            {/* Advanced Settings */}
            <TabsContent value="advanced">
              <div>
                <h3 className="text-lg font-medium text-textDark dark:text-white mb-4">Advanced Settings</h3>
                <div className="space-y-6">
                  <div className="space-y-3">
                    <Label htmlFor="language">Language</Label>
                    <Select defaultValue="en">
                      <SelectTrigger>
                        <SelectValue placeholder="Select a language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="de">German</SelectItem>
                        <SelectItem value="zh">Chinese</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-3">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select defaultValue="utc">
                      <SelectTrigger>
                        <SelectValue placeholder="Select a timezone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="utc">UTC (Coordinated Universal Time)</SelectItem>
                        <SelectItem value="est">EST (Eastern Standard Time)</SelectItem>
                        <SelectItem value="cst">CST (Central Standard Time)</SelectItem>
                        <SelectItem value="mst">MST (Mountain Standard Time)</SelectItem>
                        <SelectItem value="pst">PST (Pacific Standard Time)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-3">
                    <Label htmlFor="dateFormat">Date Format</Label>
                    <Select defaultValue="mdy">
                      <SelectTrigger>
                        <SelectValue placeholder="Select a date format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mdy">MM/DD/YYYY</SelectItem>
                        <SelectItem value="dmy">DD/MM/YYYY</SelectItem>
                        <SelectItem value="ymd">YYYY/MM/DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-base font-medium text-textDark dark:text-white">Data Export</h4>
                      <p className="text-sm text-textLight dark:text-gray-400">Export all your data from Plink</p>
                    </div>
                    <Button variant="outline">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="7 10 12 15 17 10"></polyline>
                        <line x1="12" y1="15" x2="12" y2="3"></line>
                      </svg>
                      <span className="ml-2">Export Data</span>
                    </Button>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-base font-medium text-danger">Danger Zone</h4>
                      <p className="text-sm text-textLight dark:text-gray-400">Permanently delete your account and all data</p>
                    </div>
                    <Button variant="destructive">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 6h18"></path>
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                        <line x1="10" y1="11" x2="10" y2="17"></line>
                        <line x1="14" y1="11" x2="14" y2="17"></line>
                      </svg>
                      <span className="ml-2">Delete Account</span>
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  );
}
