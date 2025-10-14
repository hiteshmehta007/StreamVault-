import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  Download,
  ArrowLeft,
  CreditCard,
  Banknote,
  Users,
  Eye,
  Play,
  Gift
} from 'lucide-react';

interface UserChannel {
  id: string;
  name: string;
  handle: string;
}

interface EarningsProps {
  channel: UserChannel;
  onBack?: () => void;
}

export function Earnings({ channel, onBack }: EarningsProps) {
  const [timeRange, setTimeRange] = useState('28d');

  // Mock earnings data
  const earningsData = {
    totalRevenue: 3247.50,
    monthlyRevenue: 2847.50,
    lastMonthRevenue: 2314.25,
    revenueChange: 23.1,
    adRevenue: 2850.00,
    membershipRevenue: 297.50,
    superChatRevenue: 100.00,
    estimatedNextMonth: 3150.00,
    rpm: 2.14,
    cpm: 0.85,
    viewsMonetized: 89.2,
    monthlyBreakdown: [
      { month: 'Jan', revenue: 1850.00, adRevenue: 1650.00, memberships: 150.00, superChat: 50.00 },
      { month: 'Feb', revenue: 2100.00, adRevenue: 1900.00, memberships: 150.00, superChat: 50.00 },
      { month: 'Mar', revenue: 2314.25, adRevenue: 2100.00, memberships: 164.25, superChat: 50.00 },
      { month: 'Apr', revenue: 2847.50, adRevenue: 2550.00, memberships: 247.50, superChat: 50.00 },
    ],
    paymentHistory: [
      { date: '2024-04-01', amount: 2314.25, status: 'Paid', method: 'Bank Transfer' },
      { date: '2024-03-01', amount: 2100.00, status: 'Paid', method: 'Bank Transfer' },
      { date: '2024-02-01', amount: 1850.00, status: 'Paid', method: 'Bank Transfer' },
    ]
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getChangeIcon = (change: number) => {
    return change >= 0 ? (
      <TrendingUp className="h-4 w-4 text-green-600" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-600" />
    );
  };

  const getChangeColor = (change: number) => {
    return change >= 0 ? 'text-green-600' : 'text-red-600';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Paid':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Paid</Badge>;
      case 'Pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {onBack && (
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <div>
            <h1 className="text-3xl font-bold">Earnings</h1>
            <p className="text-muted-foreground">{channel.name} • Revenue & Monetization</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="28d">Last 28 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="365d">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Revenue Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(earningsData.totalRevenue)}</div>
            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
              {getChangeIcon(earningsData.revenueChange)}
              <span className={getChangeColor(earningsData.revenueChange)}>
                {earningsData.revenueChange > 0 ? '+' : ''}{earningsData.revenueChange}%
              </span>
              <span>from last period</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">RPM</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${earningsData.rpm}</div>
            <div className="text-xs text-muted-foreground">Revenue per thousand views</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Views Monetized</CardTitle>
            <Play className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{earningsData.viewsMonetized}%</div>
            <div className="text-xs text-muted-foreground">Of total views</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Est. Next Month</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(earningsData.estimatedNextMonth)}</div>
            <div className="text-xs text-green-600">+10.6% projected growth</div>
          </CardContent>
        </Card>
      </div>

      {/* Earnings Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <div className="w-full overflow-x-auto">
          <TabsList className="inline-flex w-full min-w-fit">
            <TabsTrigger value="overview" className="flex-1 min-w-0">
              <span className="truncate">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="revenue-streams" className="flex-1 min-w-0">
              <span className="truncate">Revenue Streams</span>
            </TabsTrigger>
            <TabsTrigger value="payments" className="flex-1 min-w-0">
              <span className="truncate">Payment History</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex-1 min-w-0">
              <span className="truncate">Settings</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Revenue Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {earningsData.monthlyBreakdown.map((month, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{month.month}</div>
                        <div className="text-sm text-muted-foreground">
                          Ad: {formatCurrency(month.adRevenue)} • 
                          Members: {formatCurrency(month.memberships)} • 
                          Chat: {formatCurrency(month.superChat)}
                        </div>
                      </div>
                      <div className="text-lg font-bold">{formatCurrency(month.revenue)}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenue Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Play className="h-5 w-5 text-blue-600" />
                    <span className="font-medium">Ad Revenue</span>
                  </div>
                  <span className="text-xl font-bold">{formatCurrency(earningsData.adRevenue)}</span>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-purple-600" />
                    <span className="font-medium">Channel Memberships</span>
                  </div>
                  <span className="text-xl font-bold">{formatCurrency(earningsData.membershipRevenue)}</span>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Gift className="h-5 w-5 text-green-600" />
                    <span className="font-medium">Super Chat</span>
                  </div>
                  <span className="text-xl font-bold">{formatCurrency(earningsData.superChatRevenue)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="revenue-streams" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Active Revenue Streams</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Play className="h-5 w-5 text-blue-600" />
                    <div>
                      <div className="font-medium">YouTube Ad Revenue</div>
                      <div className="text-sm text-muted-foreground">Monetized videos</div>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">Active</Badge>
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Users className="h-5 w-5 text-purple-600" />
                    <div>
                      <div className="font-medium">Channel Memberships</div>
                      <div className="text-sm text-muted-foreground">Monthly recurring revenue</div>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">Active</Badge>
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Gift className="h-5 w-5 text-green-600" />
                    <div>
                      <div className="font-medium">Super Chat & Super Thanks</div>
                      <div className="text-sm text-muted-foreground">Live stream donations</div>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">Active</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenue Optimization Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                  <div className="font-medium text-blue-800 dark:text-blue-200">Increase Upload Frequency</div>
                  <div className="text-sm text-blue-600 dark:text-blue-300">
                    Regular uploads can boost ad revenue by 15-25%
                  </div>
                </div>
                
                <div className="p-3 bg-purple-50 dark:bg-purple-950 rounded-lg">
                  <div className="font-medium text-purple-800 dark:text-purple-200">Promote Memberships</div>
                  <div className="text-sm text-purple-600 dark:text-purple-300">
                    Mention membership perks in your videos
                  </div>
                </div>
                
                <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                  <div className="font-medium text-green-800 dark:text-green-200">Engage During Live Streams</div>
                  <div className="text-sm text-green-600 dark:text-green-300">
                    Active interaction increases Super Chat donations
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="payments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {earningsData.paymentHistory.map((payment, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <CreditCard className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{formatCurrency(payment.amount)}</div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(payment.date).toLocaleDateString()} • {payment.method}
                        </div>
                      </div>
                    </div>
                    {getStatusBadge(payment.status)}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Payment Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Payment Method</div>
                    <div className="text-sm text-muted-foreground">Bank Transfer</div>
                  </div>
                  <Button variant="outline" size="sm">Change</Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Payment Threshold</div>
                    <div className="text-sm text-muted-foreground">$100 minimum</div>
                  </div>
                  <Button variant="outline" size="sm">Adjust</Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Tax Information</div>
                    <div className="text-sm text-muted-foreground">US Tax Form submitted</div>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">Complete</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Monetization Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Ad Revenue Sharing</div>
                    <div className="text-sm text-muted-foreground">55% creator share</div>
                  </div>
                  <Badge variant="secondary">Standard</Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Channel Membership Pricing</div>
                    <div className="text-sm text-muted-foreground">$4.99/month</div>
                  </div>
                  <Button variant="outline" size="sm">Edit</Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Super Chat</div>
                    <div className="text-sm text-muted-foreground">Enabled for live streams</div>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">Active</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}