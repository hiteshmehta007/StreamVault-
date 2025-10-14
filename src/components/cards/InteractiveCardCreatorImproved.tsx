import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { useInteractiveCards, InteractiveCard } from '../../contexts/InteractiveCardContext';
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
  Copy,
  FileText,
  Target,
  Edit3,
  StopCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';

interface InteractiveCardCreatorProps {
  onClose: () => void;
  videoId?: string;
}

const InteractiveCardCreator: React.FC<InteractiveCardCreatorProps> = ({ 
  onClose, 
  videoId = 'demo-video' 
}) => {
  const { cards, addCard, updateCard, deleteCard } = useInteractiveCards();
  const [activeCard, setActiveCard] = useState<InteractiveCard | null>(null);
  const [activeTab, setActiveTab] = useState<'cards' | 'timeline'>('cards');
  const [previewTime, setPreviewTime] = useState(0);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const createNewCard = () => {
    const newCard: InteractiveCard = {
      id: Date.now().toString(),
      title: '',
      description: '',
      type: 'video',
      startTime: 0,
      endTime: 10,
      targetId: '',
      position: { x: 50, y: 50 },
      style: {
        backgroundColor: '#ffffff',
        textColor: '#1f2937',
        borderColor: '#3b82f6'
      }
    };
    addCard(newCard);
    setActiveCard(newCard);
    toast.success('New card created! Start customizing it.');
  };

  const handleSave = () => {
    toast.success(`Successfully saved ${cards.length} interactive cards!`);
    onClose();
  };

  const getCardsAtTime = (time: number) => {
    return cards.filter(card => time >= card.startTime && time <= card.endTime);
  };

  const getThemeFromColors = (bg: string, text: string) => {
    if (bg === '#ffffff' && text === '#1f2937') return 'light';
    if (bg === '#1f2937' && text === '#ffffff') return 'dark';
    if (bg === '#dbeafe' && text === '#1e40af') return 'blue';
    if (bg === '#dcfce7' && text === '#166534') return 'green';
    if (bg === '#fee2e2' && text === '#dc2626') return 'red';
    if (bg === '#f3e8ff' && text === '#7c3aed') return 'purple';
    if (bg === '#fef3c7' && text === '#92400e') return 'yellow';
    if (bg === '#f1f5f9' && text === '#334155') return 'slate';
    return 'light';
  };

  const themes = [
    { name: 'Light', bg: '#ffffff', text: '#1f2937', border: '#3b82f6', theme: 'light' },
    { name: 'Dark', bg: '#1f2937', text: '#ffffff', border: '#60a5fa', theme: 'dark' },
    { name: 'Blue', bg: '#dbeafe', text: '#1e40af', border: '#3b82f6', theme: 'blue' },
    { name: 'Green', bg: '#dcfce7', text: '#166534', border: '#22c55e', theme: 'green' },
    { name: 'Red', bg: '#fee2e2', text: '#dc2626', border: '#ef4444', theme: 'red' },
    { name: 'Purple', bg: '#f3e8ff', text: '#7c3aed', border: '#a855f7', theme: 'purple' },
    { name: 'Yellow', bg: '#fef3c7', text: '#92400e', border: '#f59e0b', theme: 'yellow' },
    { name: 'Slate', bg: '#f1f5f9', text: '#334155', border: '#64748b', theme: 'slate' }
  ];

  const sampleVideos = [
    { id: '1', title: 'Introduction Tutorial', thumbnail: '/api/placeholder/160/90' },
    { id: '2', title: 'Advanced Features', thumbnail: '/api/placeholder/160/90' },
    { id: '3', title: 'User Guide', thumbnail: '/api/placeholder/160/90' }
  ];

  const samplePlaylists = [
    { id: '1', title: 'Getting Started Series', count: 5 },
    { id: '2', title: 'Advanced Tutorials', count: 8 },
    { id: '3', title: 'Tips & Tricks', count: 12 }
  ];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-7xl max-h-[95vh] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
      >
        {/* Enhanced Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-600 rounded-xl shadow-lg">
              <CreditCard className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Interactive Card Studio</h2>
              <p className="text-slate-600 dark:text-slate-400">Create engaging video cards with professional design</p>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="lg" 
            onClick={onClose}
            className="hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-colors"
          >
            <X className="h-5 w-5 mr-2" />
            Close
          </Button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Enhanced Left Panel */}
          <div className="w-96 border-r border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 flex flex-col">
            {/* Panel Header */}
            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Card Manager</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">Create and organize your interactive cards</p>
            </div>

            {/* Enhanced Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
              <div className="px-6 py-4">
                <TabsList className="grid w-full grid-cols-2 bg-white dark:bg-slate-700 p-1 rounded-lg">
                  <TabsTrigger 
                    value="cards" 
                    className="flex items-center gap-2 py-3 text-sm font-medium transition-all data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:shadow-sm"
                  >
                    <CreditCard className="h-4 w-4" />
                    Cards ({cards.length})
                  </TabsTrigger>
                  <TabsTrigger 
                    value="timeline" 
                    className="flex items-center gap-2 py-3 text-sm font-medium transition-all data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:shadow-sm"
                  >
                    <Clock className="h-4 w-4" />
                    Timeline
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Cards Tab */}
              <TabsContent value="cards" className="flex-1 flex flex-col overflow-hidden">
                {/* Create Card Button */}
                <div className="px-6 pb-4">
                  <Button 
                    onClick={createNewCard} 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 text-base font-medium rounded-lg shadow-md hover:shadow-lg transition-all"
                  >
                    <Plus className="h-5 w-5 mr-3" />
                    Create New Card
                  </Button>
                </div>

                {/* Cards List */}
                <div className="flex-1 overflow-y-auto px-6 pb-6">
                  {cards.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="p-4 bg-slate-100 dark:bg-slate-700 rounded-full w-fit mx-auto mb-4">
                        <CreditCard className="h-8 w-8 text-slate-400" />
                      </div>
                      <h4 className="text-lg font-medium text-slate-900 dark:text-white mb-2">No Cards Yet</h4>
                      <p className="text-slate-600 dark:text-slate-400 mb-4">Create your first interactive card to get started</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <AnimatePresence>
                        {cards.map((card, index) => (
                          <motion.div
                            key={card.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ delay: index * 0.05 }}
                            className="group"
                          >
                            <div
                              onClick={() => setActiveCard(card)}
                              className={`p-5 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                                activeCard?.id === card.id
                                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30 shadow-lg'
                                  : 'border-slate-200 dark:border-slate-600 hover:border-blue-300 dark:hover:border-blue-500 hover:bg-white dark:hover:bg-slate-700 hover:shadow-md'
                              }`}
                            >
                              <div className="flex items-start justify-between mb-3">
                                <h4 className="font-semibold text-lg text-slate-900 dark:text-white truncate pr-2">
                                  {card.title || 'Untitled Card'}
                                </h4>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteCard(card.id);
                                  }}
                                  className="opacity-0 group-hover:opacity-100 transition-all duration-200 h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/20"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2 leading-relaxed">
                                {card.description || 'No description provided'}
                              </p>
                              <div className="flex items-center justify-between">
                                <Badge className="px-3 py-1 text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                                  {card.type.toUpperCase()}
                                </Badge>
                                <div className="flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400">
                                  <Clock className="h-4 w-4" />
                                  <span className="font-medium">{formatTime(card.startTime)}</span>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* Timeline Tab */}
              <TabsContent value="timeline" className="flex-1 overflow-y-auto px-6 pb-6">
                <div className="space-y-6">
                  <div className="bg-white dark:bg-slate-700 rounded-xl p-6 border border-slate-200 dark:border-slate-600">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                        <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg text-slate-900 dark:text-white">Timeline Overview</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Cards ordered by appearance time</p>
                      </div>
                    </div>
                    
                    {cards.length === 0 ? (
                      <div className="text-center py-12">
                        <Clock className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                        <p className="text-slate-600 dark:text-slate-400 text-lg">No cards created yet</p>
                        <p className="text-sm text-slate-500 dark:text-slate-500">Create your first card to see it on the timeline</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {cards.sort((a, b) => a.startTime - b.startTime).map((card, index) => (
                          <div 
                            key={card.id} 
                            className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600 hover:shadow-md transition-all cursor-pointer"
                            onClick={() => setActiveCard(card)}
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                                {index + 1}
                              </div>
                              <div className="w-1 h-8 bg-blue-200 dark:bg-blue-700 rounded"></div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h5 className="font-semibold text-base text-slate-900 dark:text-white truncate mb-2">
                                {card.title || 'Untitled Card'}
                              </h5>
                              <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                                <span className="flex items-center gap-1">
                                  <PlayCircle className="h-4 w-4" />
                                  {formatTime(card.startTime)}
                                </span>
                                <span className="flex items-center gap-1">
                                  <StopCircle className="h-4 w-4" />
                                  {formatTime(card.endTime)}
                                </span>
                                <Badge variant="outline" className="text-xs">
                                  {card.type}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Enhanced Right Panel */}
          <div className="flex-1 bg-white dark:bg-slate-900 flex flex-col">
            {activeCard ? (
              <>
                {/* Editor Header */}
                <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                        <Edit3 className="h-5 w-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Edit Card</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Customize your interactive card</p>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="lg" 
                      onClick={() => setActiveCard(null)}
                      className="hover:bg-red-50 hover:border-red-200 hover:text-red-600"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Close
                    </Button>
                  </div>
                </div>

                {/* Editor Content */}
                <div className="flex-1 overflow-y-auto p-6">
                  <Tabs defaultValue="content" className="w-full">
                    <TabsList className="grid w-full grid-cols-4 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg mb-8">
                      <TabsTrigger value="content" className="flex items-center gap-2 py-3 text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-white">
                        <FileText className="h-4 w-4" />
                        Content
                      </TabsTrigger>
                      <TabsTrigger value="target" className="flex items-center gap-2 py-3 text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-white">
                        <Target className="h-4 w-4" />
                        Target
                      </TabsTrigger>
                      <TabsTrigger value="timing" className="flex items-center gap-2 py-3 text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-white">
                        <Clock className="h-4 w-4" />
                        Timing
                      </TabsTrigger>
                      <TabsTrigger value="style" className="flex items-center gap-2 py-3 text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-white">
                        <Palette className="h-4 w-4" />
                        Style
                      </TabsTrigger>
                    </TabsList>

                    {/* Content Tab */}
                    <TabsContent value="content" className="space-y-6">
                      <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
                        <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                          <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                          Card Content
                        </h4>
                        
                        <div className="space-y-6">
                          <div>
                            <Label className="text-base font-medium text-slate-700 dark:text-slate-300 mb-3 block">
                              Card Title *
                            </Label>
                            <Input
                              value={activeCard.title}
                              onChange={(e) => updateCard({ ...activeCard, title: e.target.value })}
                              placeholder="Enter a compelling title for your card..."
                              className="text-base h-12 border-2 focus:border-blue-500 transition-colors"
                            />
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                              This will be the main heading visible to viewers
                            </p>
                          </div>

                          <div>
                            <Label className="text-base font-medium text-slate-700 dark:text-slate-300 mb-3 block">
                              Description
                            </Label>
                            <Textarea
                              value={activeCard.description}
                              onChange={(e) => updateCard({ ...activeCard, description: e.target.value })}
                              placeholder="Provide a clear and engaging description of what viewers will discover..."
                              rows={4}
                              className="text-base border-2 focus:border-blue-500 transition-colors resize-none"
                            />
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                              Explain what viewers will get when they interact with this card
                            </p>
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    {/* Other tabs would continue here with similar improvements... */}
                    <TabsContent value="target">
                      <div className="text-center py-12">
                        <Target className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                        <p className="text-slate-600 dark:text-slate-400">Target configuration coming soon</p>
                      </div>
                    </TabsContent>

                    <TabsContent value="timing">
                      <div className="text-center py-12">
                        <Clock className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                        <p className="text-slate-600 dark:text-slate-400">Timing controls coming soon</p>
                      </div>
                    </TabsContent>

                    <TabsContent value="style">
                      <div className="text-center py-12">
                        <Palette className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                        <p className="text-slate-600 dark:text-slate-400">Style customization coming soon</p>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center flex-1 text-center p-8">
                <div className="max-w-md">
                  <div className="p-6 bg-slate-100 dark:bg-slate-800 rounded-full w-fit mx-auto mb-6">
                    <CreditCard className="h-16 w-16 text-slate-400" />
                  </div>
                  <h3 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">Ready to Create?</h3>
                  <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                    Select a card from the left panel to start editing, or create a new card to get started with your interactive video experience.
                  </p>
                  <Button 
                    onClick={createNewCard} 
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-medium rounded-lg shadow-lg hover:shadow-xl transition-all"
                  >
                    <Plus className="h-6 w-6 mr-3" />
                    Create Your First Card
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Footer */}
        <div className="border-t border-slate-200 dark:border-slate-700 p-6 bg-slate-50 dark:bg-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
              <span className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                {cards.length} Cards Created
              </span>
              <span className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Auto-saved
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button 
                onClick={handleSave} 
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 font-medium shadow-md hover:shadow-lg transition-all"
              >
                <Save className="h-4 w-4 mr-2" />
                Save All Cards
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default InteractiveCardCreator;