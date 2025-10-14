import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Progress } from './ui/progress';
import { motion, AnimatePresence } from 'motion/react';
import { SUPPORTED_LANGUAGES, type Language } from './LanguageSelector';
import { 
  ArrowLeft, 
  ChevronLeft, 
  ChevronRight, 
  Users, 
  Image, 
  Link, 
  Mail, 
  Hash, 
  X,
  Check,
  Sparkles,
  Camera,
  Palette,
  Video,
  Globe,
  Lightbulb,
  Target,
  Instagram,
  Twitter,
  Youtube,
  Phone
} from 'lucide-react';
import { toast } from 'sonner';

interface CreateChannelPageProps {
  onBack: () => void;
  onChannelCreated?: (channelData: any) => void;
}

export function CreateChannelPage({ onBack, onChannelCreated }: CreateChannelPageProps) {
  // Basic Identity
  const [channelName, setChannelName] = useState('');
  const [channelHandle, setChannelHandle] = useState('');

  // Debug logging
  console.log('CreateChannelPage rendered:', { channelName, channelHandle });

  // Add explicit click handlers for debugging
  const handleChannelNameFocus = () => {
    console.log('Channel name input focused');
  };

  const handleChannelHandleFocus = () => {
    console.log('Channel handle input focused');
  };
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [bannerImage, setBannerImage] = useState<File | null>(null);
  
  // Preview URLs for uploaded images
  const [profilePreview, setProfilePreview] = useState<string>('');
  const [bannerPreview, setBannerPreview] = useState<string>('');
  
  // Branding & Description
  const [channelDescription, setChannelDescription] = useState('');
  const [channelCategory, setChannelCategory] = useState('');
  const [channelTags, setChannelTags] = useState<string[]>([]);
  const [channelLanguage, setChannelLanguage] = useState('');
  const [currentTag, setCurrentTag] = useState('');
  
  // Content Strategy
  const [contentType, setContentType] = useState('');
  const [uploadFrequency, setUploadFrequency] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  
  // Social & Contact
  const [socialInstagram, setSocialInstagram] = useState('');
  const [socialTwitter, setSocialTwitter] = useState('');
  const [socialYouTube, setSocialYouTube] = useState('');
  const [socialTikTok, setSocialTikTok] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  
  // Step management
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  // Cleanup preview URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      if (profilePreview) {
        URL.revokeObjectURL(profilePreview);
      }
      if (bannerPreview) {
        URL.revokeObjectURL(bannerPreview);
      }
    };
  }, [profilePreview, bannerPreview]);

  const handleAddTag = () => {
    if (currentTag.trim() && channelTags.length < 5 && !channelTags.includes(currentTag.trim())) {
      setChannelTags([...channelTags, currentTag.trim()]);
      setCurrentTag('');
      toast.success('Tag added successfully!');
    } else if (channelTags.length >= 5) {
      toast.error('Maximum 5 tags allowed');
    } else if (channelTags.includes(currentTag.trim())) {
      toast.error('Tag already exists');
    } else {
      toast.error('Please enter a valid tag');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setChannelTags(channelTags.filter(tag => tag !== tagToRemove));
    toast.success('Tag removed');
  };

  const handleProfilePictureUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        if (file.size <= 5 * 1024 * 1024) { // 5MB limit
          setProfilePicture(file);
          // Create preview URL
          const previewUrl = URL.createObjectURL(file);
          setProfilePreview(previewUrl);
          toast.success(`Profile picture "${file.name}" selected`);
        } else {
          toast.error('File size must be less than 5MB');
        }
      } else {
        toast.error('Please select a valid image file');
      }
    }
  };

  const handleBannerImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        if (file.size <= 10 * 1024 * 1024) { // 10MB limit
          setBannerImage(file);
          // Create preview URL
          const previewUrl = URL.createObjectURL(file);
          setBannerPreview(previewUrl);
          toast.success(`Banner image "${file.name}" selected`);
        } else {
          toast.error('File size must be less than 10MB');
        }
      } else {
        toast.error('Please select a valid image file');
      }
    }
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        if (!channelName.trim()) {
          toast.error('Channel name is required');
          return false;
        }
        if (!channelHandle.trim()) {
          toast.error('Channel handle is required');
          return false;
        }
        if (channelHandle.length < 3) {
          toast.error('Channel handle must be at least 3 characters');
          return false;
        }
        return true;
      case 2:
        if (!channelDescription.trim()) {
          toast.error('Channel description is required');
          return false;
        }
        if (channelDescription.length < 50) {
          toast.error('Description should be at least 50 characters for better discovery');
          return false;
        }
        if (!channelCategory) {
          toast.error('Please select a category');
          return false;
        }
        if (!channelLanguage) {
          toast.error('Please select a primary language');
          return false;
        }
        return true;
      case 3:
        if (!contentType) {
          toast.error('Please select your content type');
          return false;
        }
        if (!uploadFrequency) {
          toast.error('Please select your upload frequency');
          return false;
        }
        if (!targetAudience) {
          toast.error('Please select your target audience');
          return false;
        }
        return true;
      case 4:
        // Social links are optional, so no validation needed
        return true;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
        // Smooth scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        handleSubmit();
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      // Smooth scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = () => {
    const channelData = {
      name: channelName.trim(),
      handle: channelHandle.trim(),
      description: channelDescription.trim(),
      category: channelCategory,
      language: channelLanguage,
      tags: channelTags,
      profilePicture,
      bannerImage,
      contentType,
      uploadFrequency,
      targetAudience,
      socialLinks: {
        instagram: socialInstagram,
        twitter: socialTwitter,
        youtube: socialYouTube,
        tiktok: socialTikTok
      },
      contactEmail
    };

    toast.success(`🎉 Channel "${channelName}" (@${channelHandle}) created successfully!`);
    
    if (onChannelCreated) {
      onChannelCreated(channelData);
    }

    // Navigate back or to channel dashboard
    setTimeout(() => {
      onBack();
    }, 2000);
  };

  const progressPercentage = (currentStep / totalSteps) * 100;

  const stepTitles = [
    { 
      icon: Camera, 
      title: "Basic Identity", 
      subtitle: "Set up your channel name, handle, and profile images" 
    },
    { 
      icon: Palette, 
      title: "Branding & Description", 
      subtitle: "Describe your content and choose your category" 
    },
    { 
      icon: Video, 
      title: "Content Strategy", 
      subtitle: "Define your content type, schedule, and target audience" 
    },
    { 
      icon: Globe, 
      title: "Social & Contact", 
      subtitle: "Connect your social media and contact information" 
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/98 backdrop-blur-md border-b shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <Button variant="ghost" size="sm" onClick={onBack} className="hover:bg-muted/80 transition-colors">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
              <div>
                <h1 className="text-3xl font-bold flex items-center gap-3 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  <Users className="h-8 w-8 text-primary" />
                  Create Your Channel
                </h1>
                <p className="text-base text-muted-foreground mt-1 font-medium">
                  Step {currentStep} of {totalSteps}: {stepTitles[currentStep - 1].title}
                </p>
                <p className="text-sm text-muted-foreground/80 mt-0.5">
                  {stepTitles[currentStep - 1].subtitle}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-xl font-bold text-primary">
                  {Math.round(progressPercentage)}%
                </div>
                <div className="text-xs text-muted-foreground font-medium">
                  Complete
                </div>
              </div>
              <div className="w-32">
                <Progress value={progressPercentage} className="h-3" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Step Navigation Pills */}
          <div className="flex justify-center mb-10">
            <div className="flex space-x-2 bg-muted/50 p-2 rounded-full shadow-lg">
              {stepTitles.map((step, index) => {
                const StepIcon = step.icon;
                const stepNumber = index + 1;
                const isActive = currentStep === stepNumber;
                const isCompleted = currentStep > stepNumber;
                
                return (
                  <Button
                    key={stepNumber}
                    variant={isActive ? "default" : isCompleted ? "secondary" : "ghost"}
                    size="sm"
                    className={`relative transition-all duration-200 ${
                      isActive ? 'shadow-lg scale-105' : ''
                    } ${isCompleted ? 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900 dark:text-green-300' : ''}`}
                    onClick={() => setCurrentStep(stepNumber)}
                  >
                    {isCompleted ? (
                      <Check className="h-4 w-4 mr-2" />
                    ) : (
                      <StepIcon className="h-4 w-4 mr-2" />
                    )}
                    <span className="hidden md:inline font-medium">{step.title}</span>
                    <span className="md:hidden font-bold">{stepNumber}</span>
                  </Button>
                );
              })}
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="shadow-xl border-0 bg-card/50 backdrop-blur">
                <CardContent className="p-10">
                  {/* Step 1: Basic Identity */}
                  {currentStep === 1 && (
                    <div className="space-y-12">
                      <div className="text-center max-w-3xl mx-auto">
                        <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full mb-8 shadow-lg">
                          <Camera className="h-12 w-12 text-primary" />
                        </div>
                        <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                          Basic Identity
                        </h2>
                        <p className="text-xl text-muted-foreground leading-relaxed mb-8">
                          Let's start with the basics of your channel. These details help viewers recognize and find your content across the platform.
                        </p>
                        <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                          <p className="text-sm text-blue-700 dark:text-blue-300 flex items-center justify-center gap-2 font-medium">
                            <Sparkles className="h-5 w-5" />
                            <strong>Pro Tip:</strong> Choose a memorable name and handle that represents your content style and is easy to remember
                          </p>
                        </div>
                      </div>

                      {/* Channel Name and Handle */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="space-y-4">
                          <Label htmlFor="channelName" className="text-xl font-bold flex items-center gap-3">
                            Channel Name (Debug: {channelName || 'empty'})
                            <span className="text-red-500 text-lg">•</span>
                          </Label>
                          <Input
                            id="channelName"
                            type="text"
                            placeholder="e.g., TechTalk with Sarah, Gaming Hub, Cooking Adventures"
                            value={channelName}
                            onChange={(e) => {
                              console.log('Channel name change:', e.target.value);
                              setChannelName(e.target.value);
                            }}
                            onFocus={handleChannelNameFocus}
                            className="text-lg py-5 border-2 focus:border-primary transition-all duration-200 bg-background/50"
                            style={{ pointerEvents: 'auto', zIndex: 1 }}
                            autoComplete="off"
                            disabled={false}
                          />
                          <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg border">
                            <p className="text-sm text-muted-foreground">
                              💡 <strong>This will be displayed as your channel's main name</strong><br/>
                              Choose something memorable that reflects your content style and personality
                            </p>
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <Label htmlFor="channelHandle" className="text-xl font-bold flex items-center gap-3">
                            Username/Handle
                            <span className="text-red-500 text-lg">•</span>
                          </Label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground text-lg font-semibold z-10">@</span>
                            <Input
                              id="channelHandle"
                              type="text"
                              placeholder="yourchannelname"
                              value={channelHandle}
                              onChange={(e) => {
                                const cleanValue = e.target.value.replace(/[^a-zA-Z0-9_]/g, '');
                                console.log('Channel handle change:', cleanValue);
                                setChannelHandle(cleanValue);
                              }}
                              onFocus={handleChannelHandleFocus}
                              className="pl-8 text-lg py-5 border-2 focus:border-primary transition-all duration-200 bg-background/50"
                              style={{ pointerEvents: 'auto', zIndex: 1 }}
                              autoComplete="off"
                              disabled={false}
                            />
                          </div>
                          <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg border">
                            <p className="text-sm text-muted-foreground">
                              🔗 <strong>Your unique identifier on the platform</strong><br/>
                              Only letters, numbers, and underscores allowed • No spaces • Minimum 3 characters
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Visual Branding Section */}
                      <div className="space-y-8">
                        <div className="text-center">
                          <h3 className="text-2xl font-bold mb-4 flex items-center justify-center gap-2">
                            <Image className="h-6 w-6 text-primary" />
                            Visual Branding
                          </h3>
                          <p className="text-lg text-muted-foreground">Add images to make your channel stand out and look professional</p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                          <div className="space-y-4">
                            <Label className="text-lg font-semibold flex items-center gap-2">
                              Profile Picture
                              <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full font-medium">Recommended</span>
                            </Label>
                            <div className="border-2 border-dashed border-muted-foreground/25 rounded-xl p-10 text-center hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 group cursor-pointer">
                              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                                <Image className="h-10 w-10 text-primary" />
                              </div>
                              <label htmlFor="profilePicture" className="cursor-pointer">
                                <span className="text-lg font-semibold text-foreground block mb-3">
                                  {profilePicture ? profilePicture.name : 'Click to upload profile picture'}
                                </span>
                                <span className="text-sm text-muted-foreground">
                                  JPG, PNG up to 5MB • Square format works best
                                </span>
                              </label>
                              <Input
                                id="profilePicture"
                                type="file"
                                accept="image/*"
                                onChange={handleProfilePictureUpload}
                                className="hidden"
                              />
                            </div>
                            <p className="text-xs text-muted-foreground bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg border">
                              👤 This appears next to your videos and comments throughout the platform
                            </p>
                          </div>

                          <div className="space-y-4">
                            <Label className="text-lg font-semibold flex items-center gap-2">
                              Banner Image
                              <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-3 py-1 rounded-full font-medium">Optional</span>
                            </Label>
                            <div className="border-2 border-dashed border-muted-foreground/25 rounded-xl overflow-hidden hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 group cursor-pointer relative">
                              {bannerPreview ? (
                                <div className="relative">
                                  <img 
                                    src={bannerPreview} 
                                    alt="Banner preview" 
                                    className="w-full h-32 sm:h-40 object-cover"
                                  />
                                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="text-white font-medium">Click to change</span>
                                  </div>
                                </div>
                              ) : (
                                <div className="p-10 text-center">
                                  <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                                    <Image className="h-10 w-10 text-primary" />
                                  </div>
                                  <span className="text-lg font-semibold text-foreground block mb-3">
                                    Click to upload banner image
                                  </span>
                                  <span className="text-sm text-muted-foreground">
                                    JPG, PNG up to 10MB • Wide format recommended
                                  </span>
                                </div>
                              )}
                              <label htmlFor="bannerImage" className="absolute inset-0 cursor-pointer z-10" />
                            </div>
                            <Input
                              id="bannerImage"
                              type="file"
                              accept="image/*"
                              onChange={handleBannerImageUpload}
                              className="hidden"
                            />
                            <p className="text-xs text-muted-foreground bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg border">
                              🖼️ Displayed at the top of your channel page as a header
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Branding & Description */}
                  {currentStep === 2 && (
                    <div className="space-y-12">
                      <div className="text-center max-w-4xl mx-auto">
                        <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full mb-8 shadow-lg">
                          <Palette className="h-12 w-12 text-primary" />
                        </div>
                        <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                          Branding & Description
                        </h2>
                        <p className="text-xl text-muted-foreground leading-relaxed mb-8">
                          Tell viewers what makes your channel unique and help them discover your content
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl border">
                          <div className="text-center">
                            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                              <Hash className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                            </div>
                            <p className="text-base font-semibold mb-2">Clear Description</p>
                            <p className="text-sm text-muted-foreground">Explain your content and value</p>
                          </div>
                          <div className="text-center">
                            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                              <Globe className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                            </div>
                            <p className="text-base font-semibold mb-2">Choose Category</p>
                            <p className="text-sm text-muted-foreground">Help with discovery</p>
                          </div>
                          <div className="text-center">
                            <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                              <Sparkles className="h-8 w-8 text-green-600 dark:text-green-400" />
                            </div>
                            <p className="text-base font-semibold mb-2">Add Keywords</p>
                            <p className="text-sm text-muted-foreground">Boost searchability</p>
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      <div className="space-y-6">
                        <Label htmlFor="channelDescription" className="text-xl font-bold flex items-center gap-3">
                          Channel Description
                          <span className="text-red-500 text-lg">•</span>
                        </Label>
                        <div className="relative">
                          <Textarea
                            id="channelDescription"
                            placeholder="Welcome to my channel! Here I share...

• What topics do you cover?
• How often do you upload?
• What makes your content unique?

Example: 'Tech reviews, tutorials, and industry insights. New videos every Tuesday and Friday. I break down complex topics into easy-to-understand guides for beginners and professionals alike.'"
                            value={channelDescription}
                            onChange={(e) => setChannelDescription(e.target.value)}
                            rows={8}
                            className="text-base resize-none border-2 focus:border-primary transition-all duration-200 pr-20 bg-background/50"
                            maxLength={500}
                          />
                          <div className="absolute bottom-4 right-4 text-sm text-muted-foreground bg-background/90 px-3 py-1 rounded-full border">
                            {channelDescription.length}/500
                          </div>
                        </div>
                        <div className="bg-amber-50 dark:bg-amber-900/20 p-6 rounded-xl border border-amber-200 dark:border-amber-800">
                          <p className="text-sm text-amber-700 dark:text-amber-300 flex items-start gap-3">
                            <Lightbulb className="h-5 w-5 mt-0.5 flex-shrink-0" />
                            <span><strong>Writing tip:</strong> Start with what you create, mention your upload schedule, and highlight what makes your content special. This helps viewers decide to subscribe!</span>
                          </p>
                        </div>
                      </div>

                      {/* Category and Language */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-5">
                          <Label htmlFor="channelCategory" className="text-xl font-bold flex items-center gap-3">
                            Category
                            <span className="text-red-500 text-lg">•</span>
                          </Label>
                          <Select value={channelCategory} onValueChange={setChannelCategory}>
                            <SelectTrigger className="text-lg py-5 border-2 focus:border-primary bg-background/50">
                              <SelectValue placeholder="Choose the best category for your content" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="gaming">🎮 Gaming</SelectItem>
                              <SelectItem value="education">📚 Education</SelectItem>
                              <SelectItem value="entertainment">🎭 Entertainment</SelectItem>
                              <SelectItem value="music">🎵 Music</SelectItem>
                              <SelectItem value="technology">💻 Technology</SelectItem>
                              <SelectItem value="lifestyle">✨ Lifestyle</SelectItem>
                              <SelectItem value="cooking">🍳 Cooking</SelectItem>
                              <SelectItem value="travel">✈️ Travel</SelectItem>
                              <SelectItem value="fitness">💪 Fitness</SelectItem>
                              <SelectItem value="news">📰 News</SelectItem>
                              <SelectItem value="comedy">😂 Comedy</SelectItem>
                              <SelectItem value="other">💼 Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <p className="text-sm text-muted-foreground bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg border">
                            🎯 Helps viewers find your content in the right section of the platform
                          </p>
                        </div>
                        
                        <div className="space-y-5">
                          <Label htmlFor="channelLanguage" className="text-xl font-bold flex items-center gap-3">
                            Primary Language
                            <span className="text-red-500 text-lg">•</span>
                          </Label>
                          <Select value={channelLanguage} onValueChange={setChannelLanguage}>
                            <SelectTrigger className="text-lg py-5 border-2 focus:border-primary bg-background/50">
                              <SelectValue placeholder="What language will you primarily use?" />
                            </SelectTrigger>
                            <SelectContent className="max-h-60">
                              {SUPPORTED_LANGUAGES.map((language: Language) => (
                                <SelectItem key={language.code} value={language.code}>
                                  {language.flag} {language.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <p className="text-sm text-muted-foreground bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg border">
                            🗣️ Helps match you with the right audience worldwide
                          </p>
                        </div>
                      </div>

                      {/* Tags */}
                      <div className="space-y-5">
                        <Label className="text-xl font-bold flex items-center gap-3">
                          Keywords & Tags
                          <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-3 py-1 rounded-full font-medium">Optional</span>
                        </Label>
                        <div className="flex gap-3">
                          <Input
                            placeholder="e.g., gaming, tutorial, beginner-friendly, reviews, tips"
                            value={currentTag}
                            onChange={(e) => setCurrentTag(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                            className="text-base py-4 border-2 focus:border-primary transition-all duration-200 bg-background/50"
                          />
                          <Button 
                            onClick={handleAddTag} 
                            type="button"
                            className="px-6 py-4"
                            disabled={!currentTag.trim() || channelTags.length >= 5}
                          >
                            Add Tag
                          </Button>
                        </div>
                        <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-xl border border-green-200 dark:border-green-800">
                          <p className="text-sm text-green-700 dark:text-green-300 flex items-start gap-3">
                            <Hash className="h-5 w-5 mt-0.5 flex-shrink-0" />
                            <span><strong>SEO tip:</strong> Use specific keywords your target audience might search for. Include your content type (tutorials, reviews), skill level (beginner, advanced), and main topics.</span>
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-3 mt-4">
                          {channelTags.map((tag, index) => (
                            <Badge key={index} variant="secondary" className="px-4 py-2 text-sm bg-primary/10 text-primary border border-primary/20 flex items-center gap-2">
                              {tag}
                              <button
                                onClick={() => handleRemoveTag(tag)}
                                className="hover:bg-primary/20 rounded-full p-0.5 transition-colors"
                                aria-label={`Remove ${tag} tag`}
                                title={`Remove ${tag} tag`}
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                        {channelTags.length > 0 && (
                          <p className="text-xs text-muted-foreground">
                            {channelTags.length}/5 tags added
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Step 3: Content Strategy */}
                  {currentStep === 3 && (
                    <div className="space-y-12">
                      <div className="text-center max-w-4xl mx-auto">
                        <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full mb-8 shadow-lg">
                          <Video className="h-12 w-12 text-primary" />
                        </div>
                        <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                          Content Strategy
                        </h2>
                        <p className="text-xl text-muted-foreground leading-relaxed mb-8">
                          Define your content approach and help us understand your target audience
                        </p>
                        <div className="bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 p-8 rounded-xl border border-green-200 dark:border-green-800">
                          <p className="text-sm text-green-700 dark:text-green-300 flex items-center justify-center gap-3 font-medium">
                            <Video className="h-5 w-5" />
                            <strong>Strategy tip:</strong> Consistency in content type and upload schedule helps build a loyal audience
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        <div className="space-y-5">
                          <Label className="text-xl font-bold flex items-center gap-3">
                            Content Type
                            <span className="text-red-500 text-lg">•</span>
                          </Label>
                          <Select value={contentType} onValueChange={setContentType}>
                            <SelectTrigger className="text-lg py-5 border-2 focus:border-primary bg-background/50">
                              <SelectValue placeholder="What do you create?" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="tutorials">📚 Tutorials & How-to</SelectItem>
                              <SelectItem value="reviews">⭐ Reviews & Recommendations</SelectItem>
                              <SelectItem value="entertainment">🎬 Entertainment & Fun</SelectItem>
                              <SelectItem value="vlogs">📹 Vlogs & Personal</SelectItem>
                              <SelectItem value="gaming">🎮 Gaming Content</SelectItem>
                              <SelectItem value="music">🎵 Music & Performance</SelectItem>
                              <SelectItem value="news">📰 News & Commentary</SelectItem>
                              <SelectItem value="educational">🎓 Educational Content</SelectItem>
                              <SelectItem value="lifestyle">✨ Lifestyle & Wellness</SelectItem>
                              <SelectItem value="other">💼 Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-5">
                          <Label className="text-xl font-bold flex items-center gap-3">
                            Upload Schedule
                            <span className="text-red-500 text-lg">•</span>
                          </Label>
                          <Select value={uploadFrequency} onValueChange={setUploadFrequency}>
                            <SelectTrigger className="text-lg py-5 border-2 focus:border-primary bg-background/50">
                              <SelectValue placeholder="How often will you upload?" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="daily">📅 Daily</SelectItem>
                              <SelectItem value="multiple-weekly">📆 Multiple times per week</SelectItem>
                              <SelectItem value="weekly">🗓️ Weekly</SelectItem>
                              <SelectItem value="bi-weekly">📋 Bi-weekly</SelectItem>
                              <SelectItem value="monthly">📊 Monthly</SelectItem>
                              <SelectItem value="irregular">🎯 Irregular/As needed</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-5">
                          <Label className="text-xl font-bold flex items-center gap-3">
                            Target Audience
                            <span className="text-red-500 text-lg">•</span>
                          </Label>
                          <Select value={targetAudience} onValueChange={setTargetAudience}>
                            <SelectTrigger className="text-lg py-5 border-2 focus:border-primary bg-background/50">
                              <SelectValue placeholder="Who are you creating for?" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="kids">👶 Kids (Under 13)</SelectItem>
                              <SelectItem value="teens">🧑‍🎓 Teens (13-17)</SelectItem>
                              <SelectItem value="young-adults">👨‍💼 Young Adults (18-25)</SelectItem>
                              <SelectItem value="adults">👩‍💼 Adults (26-40)</SelectItem>
                              <SelectItem value="mature">👴 Mature (40+)</SelectItem>
                              <SelectItem value="all-ages">👨‍👩‍👧‍👦 All Ages</SelectItem>
                              <SelectItem value="professionals">💼 Professionals</SelectItem>
                              <SelectItem value="hobbyists">🎨 Hobbyists</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="bg-blue-50 dark:bg-blue-900/20 p-8 rounded-xl border border-blue-200 dark:border-blue-800">
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                          <Target className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                          Why This Matters
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-blue-700 dark:text-blue-300">
                          <div>
                            <p><strong>Content Type:</strong> Helps us recommend your videos to viewers who enjoy similar content</p>
                          </div>
                          <div>
                            <p><strong>Upload Schedule:</strong> Sets expectations for your audience and helps with channel growth</p>
                          </div>
                          <div>
                            <p><strong>Target Audience:</strong> Ensures your content reaches the right demographic</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 4: Social Links & Contact */}
                  {currentStep === 4 && (
                    <div className="space-y-12">
                      <div className="text-center max-w-4xl mx-auto">
                        <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full mb-8 shadow-lg">
                          <Globe className="h-12 w-12 text-primary" />
                        </div>
                        <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                          Social Links & Contact
                        </h2>
                        <p className="text-xl text-muted-foreground leading-relaxed mb-8">
                          Connect your other social media profiles and make it easy for viewers to reach you
                        </p>
                        <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-8 rounded-xl border border-purple-200 dark:border-purple-800">
                          <p className="text-sm text-purple-700 dark:text-purple-300 flex items-center justify-center gap-3 font-medium">
                            <Link className="h-5 w-5" />
                            <strong>Cross-platform tip:</strong> Linking your social accounts helps build a comprehensive online presence and grows your audience across platforms
                          </p>
                        </div>
                      </div>

                      {/* Social Media Links */}
                      <div className="space-y-8">
                        <h3 className="text-2xl font-bold flex items-center gap-3">
                          <Hash className="h-6 w-6 text-primary" />
                          Social Media Profiles
                          <span className="text-sm font-normal text-muted-foreground">(All Optional)</span>
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-4">
                            <Label className="text-lg font-semibold flex items-center gap-3">
                              <Instagram className="h-5 w-5 text-pink-500" />
                              Instagram
                            </Label>
                            <div className="relative">
                              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground font-medium">@</span>
                              <Input
                                placeholder="yourusername"
                                value={socialInstagram}
                                onChange={(e) => setSocialInstagram(e.target.value)}
                                className="pl-10 text-lg py-4 border-2 focus:border-primary transition-all duration-200 bg-background/50"
                              />
                            </div>
                          </div>

                          <div className="space-y-4">
                            <Label className="text-lg font-semibold flex items-center gap-3">
                              <Twitter className="h-5 w-5 text-blue-500" />
                              Twitter/X
                            </Label>
                            <div className="relative">
                              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground font-medium">@</span>
                              <Input
                                placeholder="yourusername"
                                value={socialTwitter}
                                onChange={(e) => setSocialTwitter(e.target.value)}
                                className="pl-10 text-lg py-4 border-2 focus:border-primary transition-all duration-200 bg-background/50"
                              />
                            </div>
                          </div>

                          <div className="space-y-4">
                            <Label className="text-lg font-semibold flex items-center gap-3">
                              <Youtube className="h-5 w-5 text-red-500" />
                              YouTube
                            </Label>
                            <Input
                              placeholder="Your YouTube channel URL or handle"
                              value={socialYouTube}
                              onChange={(e) => setSocialYouTube(e.target.value)}
                              className="text-lg py-4 border-2 focus:border-primary transition-all duration-200 bg-background/50"
                            />
                          </div>

                          <div className="space-y-4">
                            <Label className="text-lg font-semibold flex items-center gap-3">
                              <Phone className="h-5 w-5 text-gray-700" />
                              TikTok
                            </Label>
                            <div className="relative">
                              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground font-medium">@</span>
                              <Input
                                placeholder="yourusername"
                                value={socialTikTok}
                                onChange={(e) => setSocialTikTok(e.target.value)}
                                className="pl-10 text-lg py-4 border-2 focus:border-primary transition-all duration-200 bg-background/50"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Contact Information */}
                      <div className="space-y-6">
                        <h3 className="text-2xl font-bold flex items-center gap-3">
                          <Mail className="h-6 w-6 text-primary" />
                          Contact Information
                        </h3>
                        
                        <div className="space-y-4">
                          <Label className="text-lg font-semibold flex items-center gap-3">
                            Business Email
                            <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-3 py-1 rounded-full font-medium">Optional</span>
                          </Label>
                          <Input
                            type="email"
                            placeholder="business@example.com"
                            value={contactEmail}
                            onChange={(e) => setContactEmail(e.target.value)}
                            className="text-lg py-4 border-2 focus:border-primary transition-all duration-200 bg-background/50"
                          />
                          <p className="text-sm text-muted-foreground bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg border">
                            💌 For business inquiries, collaborations, and professional communications
                          </p>
                        </div>
                      </div>

                      {/* Final Confirmation */}
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-8 rounded-xl border border-green-200 dark:border-green-800">
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-green-700 dark:text-green-300">
                          <Check className="h-6 w-6" />
                          Ready to Launch!
                        </h3>
                        <p className="text-green-700 dark:text-green-300 mb-4">
                          You're all set! Once you click "Create Channel," your new channel will be live and ready for content.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <p><strong>✓ Channel Identity:</strong> {channelName} (@{channelHandle})</p>
                            <p><strong>✓ Category:</strong> {channelCategory || 'Not specified'}</p>
                          </div>
                          <div>
                            <p><strong>✓ Content Type:</strong> {contentType || 'Not specified'}</p>
                            <p><strong>✓ Upload Schedule:</strong> {uploadFrequency || 'Not specified'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Navigation Buttons */}
                  <div className="flex justify-between items-center pt-12 border-t">
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={handlePrevious}
                      disabled={currentStep === 1}
                      className="px-8 py-3 text-base"
                    >
                      <ChevronLeft className="h-5 w-5 mr-2" />
                      Previous
                    </Button>

                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-muted-foreground font-medium">
                        Step {currentStep} of {totalSteps}
                      </span>
                      <Button
                        size="lg"
                        onClick={handleNext}
                        className="px-8 py-3 text-base font-semibold"
                      >
                        {currentStep === totalSteps ? (
                          <>
                            <Sparkles className="h-5 w-5 mr-2" />
                            Create Channel
                          </>
                        ) : (
                          <>
                            Next
                            <ChevronRight className="h-5 w-5 ml-2" />
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}