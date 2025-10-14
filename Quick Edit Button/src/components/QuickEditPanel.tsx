import React, { useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { SUPPORTED_LANGUAGES, type Language } from './LanguageSelector'
import { Switch } from './ui/switch'
import { Label } from './ui/label'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Slider } from './ui/slider'
import { Badge } from './ui/badge'
import { Separator } from './ui/separator'
import { ScrollArea } from './ui/scroll-area'
import { 
  Edit3, 
  Image, 
  Settings, 
  Clock, 
  Shield, 
  MessageSquare, 
  DollarSign, 
  AlertTriangle,
  ExternalLink,
  BarChart3,
  List,
  Subtitles,
  Share,
  Users,
  Eye,
  EyeOff,
  Globe,
  Lock,
  Scissors,
  Star,
  Tag,
  Calendar,
  Volume,
  VolumeX,
  Play,
  X
} from 'lucide-react'

interface QuickEditPanelProps {
  isOpen: boolean
  onClose: () => void
}

export function QuickEditPanel({ isOpen, onClose }: QuickEditPanelProps) {
  const [title, setTitle] = useState("My Awesome Stream")
  const [description, setDescription] = useState("This is a great streaming video with lots of content...")
  const [tags, setTags] = useState(["gaming", "tutorial", "live"])
  const [visibility, setVisibility] = useState("public")
  const [startCut, setStartCut] = useState([0])
  const [endCut, setEndCut] = useState([300])
  const [newTag, setNewTag] = useState("")

  if (!isOpen) return null

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()])
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl h-[90vh] flex flex-col overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 flex-shrink-0">
          <CardTitle className="flex items-center gap-2">
            <Edit3 className="w-5 h-5" />
            Quick Edit
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <CardContent className="pb-6">
              <Tabs defaultValue="content" className="w-full">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="media">Media</TabsTrigger>
                <TabsTrigger value="visibility">Visibility</TabsTrigger>
                <TabsTrigger value="timing">Timing</TabsTrigger>
                <TabsTrigger value="monetization">Money</TabsTrigger>
                <TabsTrigger value="advanced">Advanced</TabsTrigger>
              </TabsList>

              {/* Content Tab */}
              <TabsContent value="content" className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="mt-1 min-h-[100px]"
                    />
                  </div>

                  <div>
                    <Label>Tags</Label>
                    <div className="flex flex-wrap gap-2 mt-2 mb-2">
                      {tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                          <Tag className="w-3 h-3" />
                          {tag}
                          <button
                            onClick={() => removeTag(tag)}
                            className="ml-1 hover:text-destructive"
                            aria-label={`Remove ${tag} tag`}
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        placeholder="Add new tag"
                        onKeyPress={(e) => e.key === 'Enter' && addTag()}
                      />
                      <Button onClick={addTag} variant="outline">Add</Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="gaming">Gaming</SelectItem>
                          <SelectItem value="education">Education</SelectItem>
                          <SelectItem value="entertainment">Entertainment</SelectItem>
                          <SelectItem value="music">Music</SelectItem>
                          <SelectItem value="technology">Technology</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="language">Language</Label>
                      <Select>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent className="max-h-60">
                          {SUPPORTED_LANGUAGES.map((language: Language) => (
                            <SelectItem key={language.code} value={language.code}>
                              {language.flag} {language.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label>Chapters & Timestamps</Label>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center gap-2 p-2 border rounded">
                        <List className="w-4 h-4" />
                        <span className="flex-1">0:00 - Introduction</span>
                        <Button variant="ghost" size="sm">Edit</Button>
                      </div>
                      <div className="flex items-center gap-2 p-2 border rounded">
                        <List className="w-4 h-4" />
                        <span className="flex-1">2:30 - Main Content</span>
                        <Button variant="ghost" size="sm">Edit</Button>
                      </div>
                      <Button variant="outline" size="sm" className="w-full">
                        <List className="w-4 h-4 mr-1" />
                        Add Chapter
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Media Tab */}
              <TabsContent value="media" className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label>Thumbnail</Label>
                    <div className="mt-2 grid grid-cols-3 gap-2">
                      <div className="aspect-video bg-muted rounded border-2 border-primary flex items-center justify-center">
                        <Image className="w-6 h-6" />
                      </div>
                      <div className="aspect-video bg-muted rounded border flex items-center justify-center cursor-pointer">
                        <Image className="w-6 h-6" />
                      </div>
                      <div className="aspect-video bg-muted rounded border flex items-center justify-center cursor-pointer">
                        <Image className="w-6 h-6" />
                      </div>
                    </div>
                    <Button variant="outline" className="w-full mt-2">
                      <Image className="w-4 h-4 mr-2" />
                      Upload Custom Thumbnail
                    </Button>
                  </div>

                  <Separator />

                  <div>
                    <Label>Trim Video</Label>
                    <div className="mt-4 space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="flex items-center gap-2">
                            <Scissors className="w-4 h-4" />
                            Start Cut
                          </span>
                          <span>{startCut[0]}s</span>
                        </div>
                        <Slider
                          value={startCut}
                          onValueChange={setStartCut}
                          max={300}
                          step={1}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="flex items-center gap-2">
                            <Scissors className="w-4 h-4" />
                            End Cut
                          </span>
                          <span>{endCut[0]}s</span>
                        </div>
                        <Slider
                          value={endCut}
                          onValueChange={setEndCut}
                          max={300}
                          step={1}
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <Label>Highlight Moments</Label>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center gap-2 p-2 border rounded">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span className="flex-1">Epic moment at 1:45</span>
                        <Button variant="ghost" size="sm">Edit</Button>
                      </div>
                      <Button variant="outline" size="sm" className="w-full">
                        <Star className="w-4 h-4 mr-1" />
                        Add Highlight
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <Label>Captions & Subtitles</Label>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Subtitles className="w-4 h-4" />
                          <span>Auto-generated (English)</span>
                        </div>
                        <Switch />
                      </div>
                      <Button variant="outline" size="sm" className="w-full">
                        <Subtitles className="w-4 h-4 mr-1" />
                        Upload SRT File
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Visibility Tab */}
              <TabsContent value="visibility" className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label>Visibility</Label>
                    <div className="mt-2 grid grid-cols-3 gap-2">
                      <Button
                        variant={visibility === 'public' ? 'default' : 'outline'}
                        onClick={() => setVisibility('public')}
                        className="flex items-center gap-2"
                      >
                        <Globe className="w-4 h-4" />
                        Public
                      </Button>
                      <Button
                        variant={visibility === 'unlisted' ? 'default' : 'outline'}
                        onClick={() => setVisibility('unlisted')}
                        className="flex items-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        Unlisted
                      </Button>
                      <Button
                        variant={visibility === 'private' ? 'default' : 'outline'}
                        onClick={() => setVisibility('private')}
                        className="flex items-center gap-2"
                      >
                        <Lock className="w-4 h-4" />
                        Private
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <Label>Audience Restrictions</Label>
                    <div className="mt-2 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Shield className="w-4 h-4" />
                          <span>Age Restriction (18+)</span>
                        </div>
                        <Switch />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          <span>Subscribers Only</span>
                        </div>
                        <Switch />
                      </div>
                      <div>
                        <Label htmlFor="region">Region Restrictions</Label>
                        <Select>
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Available worldwide" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="worldwide">Available worldwide</SelectItem>
                            <SelectItem value="blocked-regions">Block specific regions</SelectItem>
                            <SelectItem value="allowed-regions">Allow specific regions only</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <Label>Embed Settings</Label>
                    <div className="mt-2 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Share className="w-4 h-4" />
                          <span>Allow Embedding</span>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Play className="w-4 h-4" />
                          <span>Show Player Controls</span>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Timing Tab */}
              <TabsContent value="timing" className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label>Publish Schedule</Label>
                    <div className="mt-2 space-y-3">
                      <div className="flex items-center gap-2">
                        <Button variant="outline" className="flex-1">
                          <Calendar className="w-4 h-4 mr-2" />
                          Schedule Publish
                        </Button>
                        <Button variant="outline" className="flex-1">
                          <Clock className="w-4 h-4 mr-2" />
                          Schedule Unpublish
                        </Button>
                      </div>
                      <div className="p-3 bg-muted rounded border">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="w-4 h-4" />
                          <span>Currently scheduled:</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Publish: Dec 25, 2024 at 9:00 AM EST
                        </p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <Label>Analytics Tracking</Label>
                    <div className="mt-2 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <BarChart3 className="w-4 h-4" />
                          <span>Enable Analytics</span>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <Button variant="outline" className="w-full">
                        <BarChart3 className="w-4 h-4 mr-2" />
                        View Performance Metrics
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Monetization Tab */}
              <TabsContent value="monetization" className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label>Ad Settings</Label>
                    <div className="mt-2 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4" />
                          <span>Enable Mid-roll Ads</span>
                        </div>
                        <Switch />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4" />
                          <span>Sponsorship Tags</span>
                        </div>
                        <Switch />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <Label>Affiliate Links</Label>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center gap-2 p-2 border rounded">
                        <ExternalLink className="w-4 h-4" />
                        <span className="flex-1">Product Link 1</span>
                        <Button variant="ghost" size="sm">Edit</Button>
                      </div>
                      <Button variant="outline" size="sm" className="w-full">
                        <ExternalLink className="w-4 h-4 mr-1" />
                        Add Affiliate Link
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Advanced Tab */}
              <TabsContent value="advanced" className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label>Comments</Label>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center gap-2 p-2 border rounded">
                        <MessageSquare className="w-4 h-4" />
                        <span className="flex-1">Pinned: "Thanks for watching!"</span>
                        <Button variant="ghost" size="sm">Edit</Button>
                      </div>
                      <Button variant="outline" size="sm" className="w-full">
                        <MessageSquare className="w-4 h-4 mr-1" />
                        Pin Comment
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <Label>Copyright & Claims</Label>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center gap-2 p-2 border rounded border-yellow-200 bg-yellow-50">
                        <AlertTriangle className="w-4 h-4 text-yellow-600" />
                        <span className="flex-1">1 copyright claim detected</span>
                        <Button variant="ghost" size="sm">Review</Button>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Volume className="w-4 h-4 mr-1" />
                          Replace Audio
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          <VolumeX className="w-4 h-4 mr-1" />
                          Mute Section
                        </Button>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <Label>Collaboration</Label>
                    <div className="mt-2 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          <span>Allow Editor Access</span>
                        </div>
                        <Switch />
                      </div>
                      <Button variant="outline" size="sm" className="w-full">
                        <Users className="w-4 h-4 mr-1" />
                        Manage Collaborators
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

              <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button>
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </ScrollArea>
        </div>
      </Card>
    </div>
  )
}