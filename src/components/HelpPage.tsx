
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { 
  HelpCircle, 
  Search, 
  ChevronDown, 
  ChevronRight,
  Book, 
  MessageSquare, 
  Phone, 
  Mail, 
  ExternalLink,
  Lightbulb,
  Shield,
  CreditCard,
  Smartphone,
  Monitor,
  Settings,
  Play,
  Download,
  Users,
  Star,
  ArrowRight,
  Clock
} from 'lucide-react';
import { motion } from 'motion/react';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  tags: string[];
}

interface HelpCategory {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  articles: number;
}

export function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [openFAQs, setOpenFAQs] = useState<string[]>([]);

  const toggleFAQ = (id: string) => {
    setOpenFAQs(prev => 
      prev.includes(id) 
        ? prev.filter(faqId => faqId !== id)
        : [...prev, id]
    );
  };

  const helpCategories: HelpCategory[] = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      description: 'Learn the basics of using StreamVault',
      icon: Play,
      color: 'text-blue-500 bg-blue-100',
      articles: 12
    },
    {
      id: 'account-settings',
      title: 'Account & Settings',
      description: 'Manage your account and preferences',
      icon: Settings,
      color: 'text-green-500 bg-green-100',
      articles: 8
    },
    {
      id: 'video-playback',
      title: 'Video Playback',
      description: 'Troubleshoot playback issues',
      icon: Monitor,
      color: 'text-purple-500 bg-purple-100',
      articles: 15
    },
    {
      id: 'downloads',
      title: 'Downloads & Offline',
      description: 'Download videos for offline viewing',
      icon: Download,
      color: 'text-orange-500 bg-orange-100',
      articles: 6
    },
    {
      id: 'subscriptions',
      title: 'Subscriptions & Billing',
      description: 'Manage your subscription and payments',
      icon: CreditCard,
      color: 'text-red-500 bg-red-100',
      articles: 10
    },
    {
      id: 'mobile',
      title: 'Mobile App',
      description: 'Using StreamVault on mobile devices',
      icon: Smartphone,
      color: 'text-indigo-500 bg-indigo-100',
      articles: 9
    },
    {
      id: 'privacy',
      title: 'Privacy & Security',
      description: 'Keep your account safe and secure',
      icon: Shield,
      color: 'text-gray-500 bg-gray-100',
      articles: 7
    },
    {
      id: 'community',
      title: 'Community Guidelines',
      description: 'Rules and guidelines for our community',
      icon: Users,
      color: 'text-yellow-500 bg-yellow-100',
      articles: 5
    }
  ];

  const faqItems: FAQItem[] = [
    {
      id: '1',
      question: 'How do I create an account?',
      answer: 'To create an account, click the "Sign Up" button in the top right corner of the homepage. Fill in your email address, choose a secure password, and verify your email. You can also sign up using your Google or Facebook account for faster registration.',
      category: 'getting-started',
      tags: ['account', 'signup', 'registration']
    },
    {
      id: '2',
      question: 'How do I download videos for offline viewing?',
      answer: 'To download videos, look for the download icon below the video player or in the video options menu. Select your preferred quality and the video will be saved to your device. Downloaded videos are available in the "Downloads" section of your account and can be watched without an internet connection.',
      category: 'downloads',
      tags: ['download', 'offline', 'mobile']
    },
    {
      id: '3',
      question: 'Why is my video not playing?',
      answer: 'Video playback issues can be caused by several factors: slow internet connection, browser compatibility, or outdated plugins. Try refreshing the page, clearing your browser cache, updating your browser, or switching to a different browser. If the problem persists, check our system status page.',
      category: 'video-playback',
      tags: ['playback', 'streaming', 'troubleshooting']
    },
    {
      id: '4',
      question: 'How do I cancel my subscription?',
      answer: 'To cancel your subscription, go to Account Settings > Subscription. Click "Cancel Subscription" and follow the prompts. Your subscription will remain active until the end of your current billing period. You can reactivate your subscription at any time before it expires.',
      category: 'subscriptions',
      tags: ['cancel', 'subscription', 'billing']
    },
    {
      id: '5',
      question: 'Can I change my video quality?',
      answer: 'Yes! Click the settings gear icon in the video player and select "Quality". You can choose from Auto, 1080p, 720p, 480p, or 360p depending on your internet speed and preference. Auto quality adjusts automatically based on your connection speed.',
      category: 'video-playback',
      tags: ['quality', 'settings', 'streaming']
    },
    {
      id: '6',
      question: 'How do I reset my password?',
      answer: 'Click "Forgot Password" on the login page, enter your email address, and we\'ll send you a password reset link. Check your email (including spam folder) and click the link to create a new password. The reset link expires after 24 hours for security.',
      category: 'account-settings',
      tags: ['password', 'reset', 'security']
    },
    {
      id: '7',
      question: 'Is my personal information secure?',
      answer: 'Yes, we take your privacy seriously. We use industry-standard encryption to protect your data, never sell your personal information, and comply with GDPR and other privacy regulations. You can review our full Privacy Policy and manage your data preferences in your account settings.',
      category: 'privacy',
      tags: ['security', 'privacy', 'data']
    },
    {
      id: '8',
      question: 'How do I report inappropriate content?',
      answer: 'To report content that violates our community guidelines, click the flag icon on any video or use the "Report" option in the video menu. Provide details about the violation and our moderation team will review it within 24 hours. You can also block specific channels or users.',
      category: 'community',
      tags: ['report', 'moderation', 'community']
    }
  ];

  const filteredFAQs = faqItems.filter(faq => {
    const matchesSearch = searchQuery === '' || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <div className="flex items-center justify-center space-x-3 mb-4">
          <div className="p-3 bg-blue-500/20 rounded-full">
            <HelpCircle className="h-8 w-8 text-blue-500" />
          </div>
          <h1 className="text-3xl font-bold">Help Center</h1>
        </div>
        <p className="text-lg text-muted-foreground">
          Find answers to your questions and get the help you need
        </p>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="max-w-2xl mx-auto"
      >
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search for help articles, guides, and FAQs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 py-3 text-lg"
          />
        </div>
      </motion.div>

      {/* Help Categories */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Book className="h-5 w-5" />
              <span>Browse by Category</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {helpCategories.map((category, index) => {
                const IconComponent = category.icon;
                return (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="group cursor-pointer"
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    <Card className={`transition-all duration-200 hover:shadow-md ${
                      selectedCategory === category.id ? 'ring-2 ring-primary' : ''
                    }`}>
                      <CardContent className="p-4 text-center">
                        <div className={`w-12 h-12 rounded-full ${category.color} mx-auto mb-3 flex items-center justify-center`}>
                          <IconComponent className="h-6 w-6" />
                        </div>
                        <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                          {category.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          {category.description}
                        </p>
                        <Badge variant="secondary" className="text-xs">
                          {category.articles} articles
                        </Badge>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
            
            {selectedCategory !== 'all' && (
              <div className="mt-4 pt-4 border-t text-center">
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedCategory('all')}
                >
                  Show All Categories
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* FAQ Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Lightbulb className="h-5 w-5" />
                <span>Frequently Asked Questions</span>
              </div>
              <Badge variant="outline">
                {filteredFAQs.length} questions
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredFAQs.length === 0 ? (
              <div className="text-center py-12">
                <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No results found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search terms or browse by category
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredFAQs.map((faq, index) => (
                  <motion.div
                    key={faq.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Collapsible 
                      open={openFAQs.includes(faq.id)}
                      onOpenChange={() => toggleFAQ(faq.id)}
                    >
                      <CollapsibleTrigger asChild>
                        <Button
                          variant="ghost"
                          className="w-full justify-between p-4 h-auto text-left hover:bg-muted/50"
                        >
                          <span className="font-medium">{faq.question}</span>
                          {openFAQs.includes(faq.id) ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </Button>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="px-4 pb-4">
                        <div className="pt-2 border-t">
                          <p className="text-muted-foreground leading-relaxed mb-3">
                            {faq.answer}
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {faq.tags.map(tag => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Contact Support */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5" />
              <span>Still need help?</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full mx-auto flex items-center justify-center">
                  <MessageSquare className="h-6 w-6 text-blue-500" />
                </div>
                <h3 className="font-semibold">Live Chat</h3>
                <p className="text-sm text-muted-foreground">
                  Get instant help from our support team
                </p>
                <Button className="w-full">
                  Start Chat
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
              
              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-green-100 rounded-full mx-auto flex items-center justify-center">
                  <Mail className="h-6 w-6 text-green-500" />
                </div>
                <h3 className="font-semibold">Email Support</h3>
                <p className="text-sm text-muted-foreground">
                  Send us a detailed message
                </p>
                <Button variant="outline" className="w-full">
                  Send Email
                  <ExternalLink className="h-4 w-4 ml-2" />
                </Button>
              </div>
              
              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-purple-100 rounded-full mx-auto flex items-center justify-center">
                  <Phone className="h-6 w-6 text-purple-500" />
                </div>
                <h3 className="font-semibold">Phone Support</h3>
                <p className="text-sm text-muted-foreground">
                  Talk to our support team directly
                </p>
                <Button variant="outline" className="w-full">
                  Call Now
                  <Phone className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t text-center">
              <p className="text-sm text-muted-foreground mb-4">
                Our support team is available 24/7 to help you with any questions or issues.
              </p>
              <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span>4.9/5 satisfaction rating</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>Average response: 2 minutes</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

