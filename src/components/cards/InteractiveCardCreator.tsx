import { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { InteractiveCard } from '../../contexts/InteractiveCardContext';
import { 
  CreditCard, 
  Plus, 
  X, 
  Video, 
  Link, 
  Users, 
  PlayCircle,
  ExternalLink,
  Eye,
  Clock,
  Palette,
  Settings,
  Save,
  Trash2,
  Copy
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import '../../styles/interactive-cards.css';



interface InteractiveCardCreatorProps {
  open: boolean;
  onClose: () => void;
  onSave: (cards: InteractiveCard[]) => void;
  videoId?: string;
  videoDuration?: number;
}

export function InteractiveCardCreator({ 
  open, 
  onClose, 
  onSave, 
  // videoId = 'demo-video', // Reserved for video association
  videoDuration = 300 
}: InteractiveCardCreatorProps) {
  const [cards, setCards] = useState<InteractiveCard[]>([]);
  const [activeCard, setActiveCard] = useState<InteractiveCard | null>(null);
  const [activeTab, setActiveTab] = useState('cards');
  const [previewTime, setPreviewTime] = useState(0);

  // Sample data for demonstration
  const sampleVideos = [
    { id: '1', title: 'React Hooks Tutorial', thumbnail: 'https://picsum.photos/320/180?random=1' },
    { id: '2', title: 'TypeScript Patterns', thumbnail: 'https://picsum.photos/320/180?random=2' },
    { id: '3', title: 'CSS Grid Layout', thumbnail: 'https://picsum.photos/320/180?random=3' }
  ];

  const samplePlaylists = [
    { id: '1', title: 'Web Development Basics', videoCount: 12 },
    { id: '2', title: 'Advanced JavaScript', videoCount: 8 },
    { id: '3', title: 'React Projects', videoCount: 15 }
  ];

  const sampleChannels = [
    { id: '1', name: 'TechEdu Channel', subscribers: '125K' },
    { id: '2', name: 'CodeMaster Pro', subscribers: '89K' },
    { id: '3', name: 'WebDev Academy', subscribers: '203K' }
  ];

  const createNewCard = () => {
    const newCard: InteractiveCard = {
      id: `card-${Date.now()}`,
      type: 'video',
      title: '',
      description: '',
      startTime: previewTime,
      endTime: Math.min(previewTime + 30, videoDuration),
      position: 'top-right',
      style: {
        backgroundColor: '#ffffff',
        textColor: '#1f2937',
        borderColor: '#3b82f6'
      }
    };
    setCards([...cards, newCard]);
    setActiveCard(newCard);
    setActiveTab('editor');
  };

  const updateCard = (updatedCard: InteractiveCard) => {
    setCards(cards.map(card => card.id === updatedCard.id ? updatedCard : card));
    setActiveCard(updatedCard);
  };

  const deleteCard = (cardId: string) => {
    setCards(cards.filter(card => card.id !== cardId));
    if (activeCard?.id === cardId) {
      setActiveCard(null);
    }
    toast.success('Card deleted successfully');
  };

  const duplicateCard = (card: InteractiveCard) => {
    const duplicatedCard = {
      ...card,
      id: `card-${Date.now()}`,
      title: `${card.title} (Copy)`,
      startTime: Math.min(card.startTime + 10, videoDuration - 10)
    };
    setCards([...cards, duplicatedCard]);
    toast.success('Card duplicated successfully');
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  // Function to calculate contrast ratio for accessibility
  const getContrastRatio = (color1: string, color2: string) => {
    const getLuminance = (color: string) => {
      const hex = color.replace('#', '');
      const r = parseInt(hex.substr(0, 2), 16) / 255;
      const g = parseInt(hex.substr(2, 2), 16) / 255;
      const b = parseInt(hex.substr(4, 2), 16) / 255;
      
      const srgb = [r, g, b].map(c => {
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
      });
      
      return 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2];
    };

    const lum1 = getLuminance(color1);
    const lum2 = getLuminance(color2);
    const bright = Math.max(lum1, lum2);
    const dark = Math.min(lum1, lum2);
    
    return (bright + 0.05) / (dark + 0.05);
  };

  const checkContrast = (bgColor: string, textColor: string) => {
    const ratio = getContrastRatio(bgColor, textColor);
    if (ratio >= 7) return { level: 'excellent', message: 'Excellent contrast for readability' };
    if (ratio >= 4.5) return { level: 'good', message: 'Good contrast for normal text' };
    if (ratio >= 3) return { level: 'fair', message: 'Acceptable contrast but could be improved' };
    return { level: 'poor', message: 'Poor contrast - readability may be compromised' };
  };

  const getThemeFromColors = (bg: string, text: string) => {
    // Map color combinations to theme names for solid background detection
    const colorMap: { [key: string]: string } = {
      '#ffffff-#1f2937': 'light',
      '#1f2937-#ffffff': 'dark',
      '#dbeafe-#1e40af': 'blue',
      '#dcfce7-#166534': 'green',
      '#fee2e2-#dc2626': 'red',
      '#f3e8ff-#7c3aed': 'purple',
      '#fef3c7-#92400e': 'yellow',
      '#f1f5f9-#334155': 'slate'
    };
    
    const key = `${bg.toLowerCase()}-${text.toLowerCase()}`;
    return colorMap[key] || 'light'; // Default to light theme
  };

  const getCardsAtTime = (time: number) => {
    return cards.filter(card => time >= card.startTime && time <= card.endTime);
  };

  const handleSave = () => {
    if (cards.length === 0) {
      toast.error('Please add at least one card before saving');
      return;
    }

    const invalidCards = cards.filter(card => !card.title.trim() || !card.description.trim());
    if (invalidCards.length > 0) {
      toast.error('Please fill in title and description for all cards');
      return;
    }

    onSave(cards);
    toast.success(`${cards.length} interactive card(s) saved successfully!`);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-black/60 via-black/70 to-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4 animate-fade-in overflow-y-auto scrollbar-hide">
      {/* Floating particles background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="particle particle-1"></div>
        <div className="particle particle-2"></div>
        <div className="particle particle-3"></div>
        <div className="particle particle-4"></div>
        <div className="particle particle-5"></div>
      </div>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="w-full max-w-6xl h-[90vh] max-h-[800px] bg-gradient-to-br from-white via-gray-50 to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 rounded-xl shadow-2xl ring-1 ring-black/5 dark:ring-white/10 overflow-y-auto scrollbar-hide animate-float glass-card neon-glow"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200/60 dark:border-slate-700/60 bg-gradient-to-r from-blue-50/80 via-indigo-50/60 to-purple-50/40 dark:from-slate-800/90 dark:via-slate-700/80 dark:to-slate-800/70 backdrop-blur-sm relative overflow-hidden">
          {/* Animated header background */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
          
          <div className="flex items-center gap-3 relative z-10">
            <div className="p-3 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/80 dark:to-blue-800/60 rounded-xl shadow-sm ring-1 ring-blue-200/50 dark:ring-blue-700/50 animate-pulse-glow magnetic">
              <CreditCard className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient">Interactive Card Studio</h2>
              <p className="text-slate-600 dark:text-slate-300">Create engaging cards with enhanced readability</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClose}
            className="relative hover:bg-gradient-to-br from-red-50 to-pink-50 dark:hover:from-red-900/20 dark:hover:to-pink-900/20 transition-all duration-300 group overflow-hidden transform hover:scale-110 active:scale-95 ripple-effect magnetic"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-red-400/20 to-pink-400/20 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300"></div>
            <X className="h-5 w-5 relative z-10" />
          </Button>
        </div>

        <div className="flex flex-1 min-h-0">
          {/* Left Panel - Card List & Timeline */}
          <div className="w-1/3 min-w-0 border-r border-slate-200/60 dark:border-slate-700/60 bg-gradient-to-b from-slate-50/90 via-gray-50/70 to-slate-100/80 dark:from-slate-800/90 dark:via-slate-750/80 dark:to-slate-800/70 overflow-y-auto scrollbar-hide backdrop-blur-sm">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
              <TabsList className="grid w-full grid-cols-2 m-4">
                <TabsTrigger value="cards" className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Cards ({cards.length})
                </TabsTrigger>
                <TabsTrigger value="timeline" className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Timeline
                </TabsTrigger>
              </TabsList>

              <TabsContent value="cards" className="px-4 pb-4 space-y-3">
                <Button 
                  onClick={createNewCard} 
                  className="w-full relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-600 hover:from-blue-700 hover:via-blue-800 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300 ring-1 ring-blue-500/30 hover:ring-blue-400/50 btn-enhance ripple-effect magnetic neon-glow group"
                  size="lg"
                >
                  {/* Button shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
                  <Plus className="h-4 w-4 mr-2 animate-pulse-glow relative z-10" />
                  <span className="relative z-10">Add New Card</span>
                </Button>

                <AnimatePresence>
                  {cards.map((card, index) => (
                    <motion.div
                      key={card.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card 
                        className={`cursor-pointer transition-all hover:shadow-md ${
                          activeCard?.id === card.id ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-950/20' : ''
                        }`}
                        onClick={() => setActiveCard(card)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <Badge variant={card.type === 'video' ? 'default' : card.type === 'playlist' ? 'secondary' : card.type === 'channel' ? 'destructive' : 'outline'}>
                              {card.type}
                            </Badge>
                            <div className="flex gap-1">
                              <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); duplicateCard(card); }}>
                                <Copy className="h-3 w-3" />
                              </Button>
                              <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); deleteCard(card.id); }}>
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          <h4 className="font-semibold text-sm mb-1">{card.title || 'Untitled Card'}</h4>
                          <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                            {card.description || 'No description'}
                          </p>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>{formatTime(card.startTime)} - {formatTime(card.endTime)}</span>
                            <span className="capitalize">{card.position.replace('-', ' ')}</span>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {cards.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    <CreditCard className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No cards created yet</p>
                    <p className="text-sm">Click "Add New Card" to get started</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="timeline" className="px-4 pb-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="preview-time">Preview Time: {formatTime(previewTime)}</Label>
                    <input
                      id="preview-time"
                      type="range"
                      min="0"
                      max={videoDuration}
                      value={previewTime}
                      onChange={(e) => setPreviewTime(Number(e.target.value))}
                      className="w-full mt-2"
                      aria-label={`Preview time: ${formatTime(previewTime)}`}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h4 className="font-semibold mb-3">Active Cards at {formatTime(previewTime)}</h4>
                    {getCardsAtTime(previewTime).map(card => (
                      <div key={card.id} className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg mb-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-sm">{card.title}</span>
                          <Badge variant="outline" className="text-xs">{card.type}</Badge>
                        </div>
                      </div>
                    ))}
                    {getCardsAtTime(previewTime).length === 0 && (
                      <p className="text-muted-foreground text-sm">No cards active at this time</p>
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Panel - Editor */}
          <div className="flex-1 min-w-0 overflow-y-auto scrollbar-hide bg-gradient-to-br from-white/95 via-slate-50/80 to-gray-100/60 dark:from-slate-900/95 dark:via-slate-800/80 dark:to-slate-900/90">
            {activeCard ? (
              <div className="p-6 space-y-6 flex-1 overflow-y-auto scrollbar-hide">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold">Edit Card</h3>
                  <Button onClick={() => setActiveCard(null)} variant="outline" size="sm">
                    <X className="h-4 w-4 mr-2" />
                    Close Editor
                  </Button>
                </div>

                <Tabs defaultValue="content" className="w-full">
                  <TabsList className="inline-flex h-10 items-center justify-center rounded-xl bg-muted/50 backdrop-blur-sm border border-border/20 p-1 shadow-sm w-full">
                    <TabsTrigger 
                      value="content" 
                      className="inline-flex items-center justify-center whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm flex-1"
                    >
                      Content
                    </TabsTrigger>
                    <TabsTrigger 
                      value="target" 
                      className="inline-flex items-center justify-center whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm flex-1"
                    >
                      Target
                    </TabsTrigger>
                    <TabsTrigger 
                      value="timing" 
                      className="inline-flex items-center justify-center whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm flex-1"
                    >
                      Timing
                    </TabsTrigger>
                    <TabsTrigger 
                      value="style" 
                      className="inline-flex items-center justify-center whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm flex-1"
                    >
                      Style
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="content" className="space-y-4 mt-6 overflow-y-auto scrollbar-hide max-h-[400px] pr-2 scroll-smooth">
                    <div>
                      <Label htmlFor="title">Card Title *</Label>
                      <Input
                        id="title"
                        value={activeCard.title}
                        onChange={(e) => updateCard({ ...activeCard, title: e.target.value })}
                        placeholder="Enter card title..."
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Description *</Label>
                      <Textarea
                        id="description"
                        value={activeCard.description}
                        onChange={(e) => updateCard({ ...activeCard, description: e.target.value })}
                        placeholder="Enter card description..."
                        className="mt-1"
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="position">Card Position</Label>
                      <Select
                        value={activeCard.position}
                        onValueChange={(value: any) => updateCard({ ...activeCard, position: value })}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="top-left">Top Left</SelectItem>
                          <SelectItem value="top-right">Top Right</SelectItem>
                          <SelectItem value="bottom-left">Bottom Left</SelectItem>
                          <SelectItem value="bottom-right">Bottom Right</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TabsContent>

                  <TabsContent value="target" className="space-y-4 mt-6 overflow-y-auto scrollbar-hide max-h-[400px] pr-2 scroll-smooth">
                    <div>
                      <Label htmlFor="type">Card Type</Label>
                      <Select
                        value={activeCard.type}
                        onValueChange={(value: any) => updateCard({ ...activeCard, type: value, targetId: '', targetUrl: '' })}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="video">
                            <div className="flex items-center gap-2">
                              <Video className="h-4 w-4" />
                              Video
                            </div>
                          </SelectItem>
                          <SelectItem value="playlist">
                            <div className="flex items-center gap-2">
                              <PlayCircle className="h-4 w-4" />
                              Playlist
                            </div>
                          </SelectItem>
                          <SelectItem value="channel">
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4" />
                              Channel
                            </div>
                          </SelectItem>
                          <SelectItem value="url">
                            <div className="flex items-center gap-2">
                              <ExternalLink className="h-4 w-4" />
                              External URL
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {activeCard.type === 'video' && (
                      <div>
                        <Label>Select Video</Label>
                        <div className="grid grid-cols-1 gap-2 mt-2">
                          {sampleVideos.map(video => (
                            <div
                              key={video.id}
                              onClick={() => updateCard({ ...activeCard, targetId: video.id })}
                              className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                                activeCard.targetId === video.id ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20' : 'hover:bg-slate-50 dark:hover:bg-slate-800'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <img src={video.thumbnail} alt={video.title} className="w-16 h-9 object-cover rounded" />
                                <span className="text-sm font-medium">{video.title}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {activeCard.type === 'playlist' && (
                      <div>
                        <Label>Select Playlist</Label>
                        <div className="space-y-2 mt-2">
                          {samplePlaylists.map(playlist => (
                            <div
                              key={playlist.id}
                              onClick={() => updateCard({ ...activeCard, targetId: playlist.id })}
                              className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                                activeCard.targetId === playlist.id ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20' : 'hover:bg-slate-50 dark:hover:bg-slate-800'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-medium">{playlist.title}</span>
                                <Badge variant="secondary">{playlist.videoCount} videos</Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {activeCard.type === 'channel' && (
                      <div>
                        <Label>Select Channel</Label>
                        <div className="space-y-2 mt-2">
                          {sampleChannels.map(channel => (
                            <div
                              key={channel.id}
                              onClick={() => updateCard({ ...activeCard, targetId: channel.id })}
                              className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                                activeCard.targetId === channel.id ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20' : 'hover:bg-slate-50 dark:hover:bg-slate-800'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-medium">{channel.name}</span>
                                <Badge variant="outline">{channel.subscribers} subscribers</Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {activeCard.type === 'url' && (
                      <div>
                        <Label htmlFor="targetUrl">External URL</Label>
                        <Input
                          id="targetUrl"
                          value={activeCard.targetUrl || ''}
                          onChange={(e) => updateCard({ ...activeCard, targetUrl: e.target.value })}
                          placeholder="https://example.com"
                          className="mt-1"
                        />
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="timing" className="space-y-4 mt-6 overflow-y-auto scrollbar-hide max-h-[400px] pr-2 scroll-smooth">
                    <div>
                      <Label htmlFor="startTime">Start Time: {formatTime(activeCard.startTime)}</Label>
                      <input
                        id="startTime"
                        type="range"
                        min="0"
                        max={videoDuration}
                        value={activeCard.startTime}
                        onChange={(e) => updateCard({ 
                          ...activeCard, 
                          startTime: Number(e.target.value),
                          endTime: Math.max(Number(e.target.value) + 5, activeCard.endTime)
                        })}
                        className="w-full mt-2"
                        aria-label={`Start time: ${formatTime(activeCard.startTime)}`}
                      />
                    </div>
                    <div>
                      <Label htmlFor="endTime">End Time: {formatTime(activeCard.endTime)}</Label>
                      <input
                        id="endTime"
                        type="range"
                        min={activeCard.startTime + 5}
                        max={videoDuration}
                        value={activeCard.endTime}
                        onChange={(e) => updateCard({ ...activeCard, endTime: Number(e.target.value) })}
                        className="w-full mt-2"
                        aria-label={`End time: ${formatTime(activeCard.endTime)}`}
                      />
                    </div>
                    <div className="p-4 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg">
                      <p className="text-sm text-yellow-800 dark:text-yellow-200">
                        <strong>Duration:</strong> {formatTime(activeCard.endTime - activeCard.startTime)}
                      </p>
                      <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                        Cards should be displayed for at least 5 seconds for better user experience
                      </p>
                    </div>
                  </TabsContent>

                  <TabsContent value="style" className="space-y-4 mt-6 overflow-y-auto scrollbar-hide max-h-[400px] pr-2 scroll-smooth">
                    <div className="space-y-6 pb-4">
                      {/* Color Presets */}
                      <div>
                        <Label className="text-sm font-medium mb-3 block">Quick Color Themes</Label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {[
                            { name: 'Light', bg: '#ffffff', text: '#1f2937', border: '#3b82f6', theme: 'light' },
                            { name: 'Dark', bg: '#1f2937', text: '#ffffff', border: '#60a5fa', theme: 'dark' },
                            { name: 'Blue', bg: '#dbeafe', text: '#1e40af', border: '#3b82f6', theme: 'blue' },
                            { name: 'Green', bg: '#dcfce7', text: '#166534', border: '#22c55e', theme: 'green' },
                            { name: 'Purple', bg: '#f3e8ff', text: '#7c3aed', border: '#a855f7', theme: 'purple' },
                            { name: 'Red', bg: '#fee2e2', text: '#dc2626', border: '#ef4444', theme: 'red' },
                            { name: 'Yellow', bg: '#fef3c7', text: '#92400e', border: '#f59e0b', theme: 'yellow' },
                            { name: 'Slate', bg: '#f1f5f9', text: '#334155', border: '#64748b', theme: 'slate' }
                          ].map((theme) => (
                            <button
                              key={theme.name}
                              onClick={() => updateCard({
                                ...activeCard,
                                style: {
                                  backgroundColor: theme.bg,
                                  textColor: theme.text,
                                  borderColor: theme.border
                                }
                              })}
                              className="theme-button"
                              data-theme={theme.theme}
                            >
                              <div className="text-xs font-medium">{theme.name}</div>
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      {/* Custom Colors */}
                      <div>
                        <Label className="text-sm font-medium mb-3 block">Custom Colors</Label>
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <Label htmlFor="backgroundColor" className="text-xs text-muted-foreground">Background</Label>
                            <div className="mt-1 p-1 border rounded-lg bg-white dark:bg-slate-800">
                              <input
                                id="backgroundColor"
                                type="color"
                                value={activeCard.style.backgroundColor}
                                onChange={(e) => updateCard({
                                  ...activeCard,
                                  style: { ...activeCard.style, backgroundColor: e.target.value }
                                })}
                                className="w-full h-8 rounded border-0 cursor-pointer"
                                aria-label="Background color picker"
                              />
                            </div>
                            <div className="text-xs text-center mt-1 font-mono text-muted-foreground">
                              {activeCard.style.backgroundColor}
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="textColor" className="text-xs text-muted-foreground">Text Color</Label>
                            <div className="mt-1 p-1 border rounded-lg bg-white dark:bg-slate-800">
                              <input
                                id="textColor"
                                type="color"
                                value={activeCard.style.textColor}
                                onChange={(e) => updateCard({
                                  ...activeCard,
                                  style: { ...activeCard.style, textColor: e.target.value }
                                })}
                                className="w-full h-8 rounded border-0 cursor-pointer"
                                aria-label="Text color picker"
                              />
                            </div>
                            <div className="text-xs text-center mt-1 font-mono text-muted-foreground">
                              {activeCard.style.textColor}
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="borderColor" className="text-xs text-muted-foreground">Border Color</Label>
                            <div className="mt-1 p-1 border rounded-lg bg-white dark:bg-slate-800">
                              <input
                                id="borderColor"
                                type="color"
                                value={activeCard.style.borderColor}
                                onChange={(e) => updateCard({
                                  ...activeCard,
                                  style: { ...activeCard.style, borderColor: e.target.value }
                                })}
                                className="w-full h-8 rounded border-0 cursor-pointer"
                                aria-label="Border color picker"
                              />
                            </div>
                            <div className="text-xs text-center mt-1 font-mono text-muted-foreground">
                              {activeCard.style.borderColor}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Contrast Checker */}
                      {(() => {
                        const contrast = checkContrast(activeCard.style.backgroundColor, activeCard.style.textColor);
                        const isGoodContrast = contrast.level === 'excellent' || contrast.level === 'good';
                        
                        return (
                          <div className={`p-4 border rounded-lg ${
                            isGoodContrast 
                              ? 'contrast-good' 
                              : contrast.level === 'fair'
                              ? 'contrast-warning'
                              : 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800'
                          }`}>
                            <div className="flex items-start gap-2">
                              <Eye className={`h-4 w-4 mt-0.5 flex-shrink-0 ${
                                isGoodContrast 
                                  ? 'text-green-600 dark:text-green-400' 
                                  : contrast.level === 'fair'
                                  ? 'text-amber-600 dark:text-amber-400'
                                  : 'text-red-600 dark:text-red-400'
                              }`} />
                              <div>
                                <p className={`text-sm font-medium ${
                                  isGoodContrast 
                                    ? 'text-green-800 dark:text-green-200' 
                                    : contrast.level === 'fair'
                                    ? 'text-amber-800 dark:text-amber-200'
                                    : 'text-red-800 dark:text-red-200'
                                }`}>
                                  {isGoodContrast ? '✓ Great Contrast!' : contrast.level === 'fair' ? '⚠ Fair Contrast' : '⚠ Poor Contrast'}
                                </p>
                                <p className={`text-xs mt-1 ${
                                  isGoodContrast 
                                    ? 'text-green-700 dark:text-green-300' 
                                    : contrast.level === 'fair'
                                    ? 'text-amber-700 dark:text-amber-300'
                                    : 'text-red-700 dark:text-red-300'
                                }`}>
                                  {contrast.message}
                                  {!isGoodContrast && ' Try using high contrast themes above.'}
                                </p>
                                <div className="mt-2 text-xs font-mono opacity-75">
                                  Contrast Ratio: {getContrastRatio(activeCard.style.backgroundColor, activeCard.style.textColor).toFixed(2)}:1
                                  {getContrastRatio(activeCard.style.backgroundColor, activeCard.style.textColor) >= 4.5 ? ' (WCAG AA ✓)' : ' (Below WCAG AA)'}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                    
                    {/* Preview */}
                    <div>
                      <Label>Preview</Label>
                      <div className="mt-2 p-6 bg-gradient-to-br from-white via-slate-50/50 to-gray-100/30 dark:from-slate-900/95 dark:via-slate-800/80 dark:to-slate-900/90 rounded-xl border border-slate-200/60 dark:border-slate-700/60 shadow-inner ring-1 ring-slate-100/50 dark:ring-slate-700/30">
                        <div className="mb-3">
                          <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">Card Preview</Label>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">This is how your card will appear on the video</p>
                        </div>
                        <div className="flex justify-center">
                          <div
                            className="enhanced-card-preview"
                            data-theme={getThemeFromColors(activeCard.style.backgroundColor, activeCard.style.textColor)}
                          >
                            <div>
                              <h4>
                                {activeCard.title || 'Interactive Card Title'}
                              </h4>
                              <p>
                                {activeCard.description || 'Click to learn more about this amazing content. This card will appear during your video.'}
                              </p>
                              <div className="mt-3 flex items-center justify-between">
                                <Badge 
                                  variant="secondary" 
                                  className="text-xs px-2 py-1 badge-preview"
                                >
                                  {activeCard.type.toUpperCase()}
                                </Badge>
                                <div className="text-xs opacity-75 flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {formatTime(activeCard.startTime)}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-center text-muted-foreground">
                <div>
                  <Settings className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">No Card Selected</h3>
                  <p>Select a card from the left panel or create a new one to start editing</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-slate-200/60 dark:border-slate-700/60 bg-gradient-to-r from-slate-50/90 via-gray-100/70 to-slate-100/80 dark:from-slate-800/90 dark:via-slate-750/80 dark:to-slate-800/70 backdrop-blur-sm">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Eye className="h-4 w-4" />
            <span>{cards.length} card(s) created</span>
          </div>
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={onClose}
              className="relative overflow-hidden hover:bg-gradient-to-br from-gray-50 to-slate-50 dark:hover:from-slate-800 dark:hover:to-slate-700 transition-all duration-300 btn-enhance magnetic ripple-effect group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-gray-400/20 to-slate-400/20 rounded scale-0 group-hover:scale-100 transition-transform duration-300"></div>
              <span className="relative z-10">Cancel</span>
            </Button>
            <Button 
              onClick={handleSave} 
              className="relative overflow-hidden bg-gradient-to-r from-green-600 via-green-700 to-emerald-600 hover:from-green-700 hover:via-green-800 hover:to-emerald-700 shadow-lg hover:shadow-2xl transition-all duration-500 ring-1 ring-green-500/30 hover:ring-green-400/50 btn-enhance ripple-effect neon-glow group"
            >
              {/* Button shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
              
              {/* Ripple circles */}
              <div className="absolute inset-0 rounded-xl overflow-hidden">
                <div className="absolute top-1/2 left-1/2 w-0 h-0 bg-white/20 rounded-full group-hover:w-96 group-hover:h-96 transition-all duration-700 ease-out -translate-x-1/2 -translate-y-1/2"></div>
              </div>
              
              <span className="relative z-10 flex items-center">
                <Save className="h-4 w-4 mr-2 animate-pulse-glow" />
                Save Cards
              </span>
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}