import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  BarChart3, 
  Eye, 
  Users, 
  Clock, 
  TrendingUp, 
  TrendingDown,
  Download,
  ArrowLeft,
  Smartphone,
  Monitor,
  Tablet
} from 'lucide-react';

interface UserChannel {
  id: string;
  name: string;
  handle: string;
  subscribers: number;
  totalViews: number;
  totalVideos: number;
}

interface ChannelAnalyticsProps {
  channel: UserChannel;
  onBack?: () => void;
}

export function ChannelAnalytics({ channel, onBack }: ChannelAnalyticsProps) {
  const [timeRange, setTimeRange] = useState('28d');
  const [selectedTab, setSelectedTab] = useState('overview');

  // Mock analytics data
  const analyticsData = {
    overview: {
      totalViews: 145230,
      totalWatchTime: 3250,
      totalSubscribers: channel.subscribers,
      averageViewDuration: 4.2,
      viewsChange: timeRange === '7d' ? 12.5 : timeRange === '28d' ? 23.8 : 45.2,
      subscribersChange: timeRange === '7d' ? 8.3 : timeRange === '28d' ? 15.7 : 32.1,
      watchTimeChange: timeRange === '7d' ? 15.2 : timeRange === '28d' ? 19.4 : 28.9
    },
    demographics: {
      ageGroups: [
        { range: '18-24', percentage: 35 },
        { range: '25-34', percentage: 28 },
        { range: '35-44', percentage: 20 },
        { range: '45-54', percentage: 12 },
        { range: '55+', percentage: 5 }
      ],
      countries: [
        { name: 'United States', percentage: 45 },
        { name: 'Canada', percentage: 15 },
        { name: 'United Kingdom', percentage: 12 },
        { name: 'Australia', percentage: 8 },
        { name: 'Germany', percentage: 6 },
        { name: 'Others', percentage: 14 }
      ],
      devices: [
        { type: 'Mobile', percentage: 65, icon: Smartphone },
        { type: 'Desktop', percentage: 25, icon: Monitor },
        { type: 'Tablet', percentage: 8, icon: Tablet },
        { type: 'TV', percentage: 2, icon: Monitor }
      ]
    },
    topVideos: [
      { 
        id: 1, 
        title: 'How to Build a React App from Scratch', 
        views: 45230, 
        impressions: 125000,
        ctr: 4.8,
        avgViewDuration: 5.2,
        publishDate: '2024-01-15' 
      },
      { 
        id: 2, 
        title: 'JavaScript ES6 Features Explained', 
        views: 32150, 
        impressions: 98000,
        ctr: 3.9,
        avgViewDuration: 4.7,
        publishDate: '2024-01-10' 
      },
      { 
        id: 3, 
        title: 'CSS Grid vs Flexbox: Complete Guide', 
        views: 28900, 
        impressions: 87500,
        ctr: 4.2,
        avgViewDuration: 6.1,
        publishDate: '2024-01-05' 
      }
    ]
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.floor(minutes % 60);
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
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
            <h1 className="text-3xl font-bold">Channel Analytics</h1>
            <p className="text-muted-foreground">{channel.name} • @{channel.handle}</p>
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
            Export Data
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(analyticsData.overview.totalViews)}</div>
            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
              {getChangeIcon(analyticsData.overview.viewsChange)}
              <span className={getChangeColor(analyticsData.overview.viewsChange)}>
                {analyticsData.overview.viewsChange > 0 ? '+' : ''}{analyticsData.overview.viewsChange}%
              </span>
              <span>vs previous period</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Watch Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.overview.totalWatchTime}h</div>
            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
              {getChangeIcon(analyticsData.overview.watchTimeChange)}
              <span className={getChangeColor(analyticsData.overview.watchTimeChange)}>
                {analyticsData.overview.watchTimeChange > 0 ? '+' : ''}{analyticsData.overview.watchTimeChange}%
              </span>
              <span>vs previous period</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Subscribers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(analyticsData.overview.totalSubscribers)}</div>
            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
              {getChangeIcon(analyticsData.overview.subscribersChange)}
              <span className={getChangeColor(analyticsData.overview.subscribersChange)}>
                {analyticsData.overview.subscribersChange > 0 ? '+' : ''}{analyticsData.overview.subscribersChange}%
              </span>
              <span>vs previous period</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. View Duration</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatDuration(analyticsData.overview.averageViewDuration)}</div>
            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-green-600">+2.3%</span>
              <span>vs previous period</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <div className="w-full overflow-x-auto">
          <TabsList className="inline-flex w-full min-w-fit">
            <TabsTrigger value="overview" className="flex-1 min-w-0">
              <span className="truncate">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="audience" className="flex-1 min-w-0">
              <span className="truncate">Audience</span>
            </TabsTrigger>
            <TabsTrigger value="content" className="flex-1 min-w-0">
              <span className="truncate">Content</span>
            </TabsTrigger>
            <TabsTrigger value="revenue" className="flex-1 min-w-0">
              <span className="truncate">Revenue</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <span className="font-medium">Total Channel Views</span>
                  <span className="text-xl font-bold">{formatNumber(analyticsData.overview.totalViews)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <span className="font-medium">Total Watch Time</span>
                  <span className="text-xl font-bold">{analyticsData.overview.totalWatchTime} hours</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <span className="font-medium">Videos Published</span>
                  <span className="text-xl font-bold">{channel.totalVideos}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Growth Trends</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Views Growth</span>
                    <span className={`font-medium ${getChangeColor(analyticsData.overview.viewsChange)}`}>
                      {analyticsData.overview.viewsChange > 0 ? '+' : ''}{analyticsData.overview.viewsChange}%
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${Math.min(Math.abs(analyticsData.overview.viewsChange), 100)}%` }}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subscriber Growth</span>
                    <span className={`font-medium ${getChangeColor(analyticsData.overview.subscribersChange)}`}>
                      {analyticsData.overview.subscribersChange > 0 ? '+' : ''}{analyticsData.overview.subscribersChange}%
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ width: `${Math.min(Math.abs(analyticsData.overview.subscribersChange), 100)}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="audience" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Age Demographics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {analyticsData.demographics.ageGroups.map((group, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm">{group.range}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-muted rounded-full h-2">
                        <div 
                          className="bg-purple-600 h-2 rounded-full" 
                          style={{ width: `${group.percentage}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium w-10">{group.percentage}%</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Geographic Distribution</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {analyticsData.demographics.countries.map((country, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm">{country.name}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-muted rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${(country.percentage / 45) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium w-10">{country.percentage}%</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Device Usage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {analyticsData.demographics.devices.map((device, index) => {
                    const IconComponent = device.icon;
                    return (
                      <div key={index} className="text-center p-4 border rounded-lg">
                        <IconComponent className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                        <div className="text-2xl font-bold">{device.percentage}%</div>
                        <div className="text-sm text-muted-foreground">{device.type}</div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Videos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.topVideos.map((video, index) => (
                  <div key={video.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium flex-1">{video.title}</h4>
                      <Badge variant="secondary">#{index + 1}</Badge>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Views</span>
                        <div className="font-medium">{formatNumber(video.views)}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Impressions</span>
                        <div className="font-medium">{formatNumber(video.impressions)}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">CTR</span>
                        <div className="font-medium">{video.ctr}%</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Avg Duration</span>
                        <div className="font-medium">{formatDuration(video.avgViewDuration)}</div>
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-muted-foreground">
                      Published {new Date(video.publishDate).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                  <span className="font-medium">Total Revenue</span>
                  <span className="text-2xl font-bold text-green-600">$3,247</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Ad Revenue</span>
                    <span className="font-medium">$2,850</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Channel Memberships</span>
                    <span className="font-medium">$297</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Super Chat</span>
                    <span className="font-medium">$100</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenue Trends</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">+23.5%</div>
                  <div className="text-sm text-muted-foreground">Revenue growth this period</div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>RPM (Revenue per Mille)</span>
                    <span className="font-medium">$2.14</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>CPM (Cost per Mille)</span>
                    <span className="font-medium">$0.85</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}