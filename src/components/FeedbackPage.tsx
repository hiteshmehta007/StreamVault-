
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { 
  MessageSquare, 
  Send, 
  Star, 

  Lightbulb,
  Bug,
  Heart,
  Smile,
  Frown,
  Meh
} from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'motion/react';

interface FeedbackPageProps {
  onSubmit?: (feedback: any) => void;
}

export function FeedbackPage({ onSubmit }: FeedbackPageProps) {
  const [feedbackType, setFeedbackType] = useState<'general' | 'feature' | 'bug' | 'compliment'>('general');
  const [rating, setRating] = useState<number>(0);
  const [satisfaction, setSatisfaction] = useState<'happy' | 'neutral' | 'sad' | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const feedbackTypes = [
    { id: 'general', label: 'General Feedback', icon: MessageSquare, color: 'bg-blue-500' },
    { id: 'feature', label: 'Feature Request', icon: Lightbulb, color: 'bg-yellow-500' },
    { id: 'bug', label: 'Bug Report', icon: Bug, color: 'bg-red-500' },
    { id: 'compliment', label: 'Compliment', icon: Heart, color: 'bg-pink-500' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !description.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const feedbackData = {
        type: feedbackType,
        rating,
        satisfaction,
        title: title.trim(),
        description: description.trim(),
        email: email.trim(),
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (onSubmit) {
        onSubmit(feedbackData);
      }

      toast.success('Thank you for your feedback! We appreciate your input.');
      
      // Reset form
      setTitle('');
      setDescription('');
      setEmail('');
      setRating(0);
      setSatisfaction(null);
      setFeedbackType('general');
      
    } catch (error) {
      toast.error('Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <div className="flex items-center justify-center space-x-3 mb-4">
          <div className="p-3 bg-green-500/20 rounded-full">
            <MessageSquare className="h-8 w-8 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold">Send Feedback</h1>
        </div>
        <p className="text-lg text-muted-foreground">
          Help us improve StreamVault by sharing your thoughts and suggestions
        </p>
      </motion.div>

      {/* Feedback Type Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5" />
              <span>What type of feedback do you have?</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {feedbackTypes.map((type, index) => (
                <motion.div
                  key={type.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Card 
                    className={`cursor-pointer transition-all duration-300 ${
                      feedbackType === type.id 
                        ? 'ring-2 ring-primary shadow-lg' 
                        : 'hover:shadow-md'
                    }`}
                    onClick={() => setFeedbackType(type.id as any)}
                  >
                    <CardContent className="p-4 text-center">
                      <div className={`${type.color} w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3`}>
                        <type.icon className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="font-semibold text-sm">{type.label}</h3>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Satisfaction Rating */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>How satisfied are you with StreamVault?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center space-x-8 mb-6">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSatisfaction('sad')}
                className={`p-4 rounded-full transition-colors ${
                  satisfaction === 'sad' 
                    ? 'bg-red-500 text-white' 
                    : 'bg-red-100 text-red-500 hover:bg-red-200'
                }`}
              >
                <Frown className="h-8 w-8" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSatisfaction('neutral')}
                className={`p-4 rounded-full transition-colors ${
                  satisfaction === 'neutral' 
                    ? 'bg-yellow-500 text-white' 
                    : 'bg-yellow-100 text-yellow-500 hover:bg-yellow-200'
                }`}
              >
                <Meh className="h-8 w-8" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSatisfaction('happy')}
                className={`p-4 rounded-full transition-colors ${
                  satisfaction === 'happy' 
                    ? 'bg-green-500 text-white' 
                    : 'bg-green-100 text-green-500 hover:bg-green-200'
                }`}
              >
                <Smile className="h-8 w-8" />
              </motion.button>
            </div>

            {/* Star Rating */}
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-3">Rate your overall experience</p>
              <div className="flex items-center justify-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <motion.button
                    key={star}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.8 }}
                    onClick={() => setRating(star)}
                    className="transition-colors"
                  >
                    <Star 
                      className={`h-8 w-8 ${
                        star <= rating 
                          ? 'text-yellow-500 fill-yellow-500' 
                          : 'text-gray-300 hover:text-yellow-400'
                      }`}
                    />
                  </motion.button>
                ))}
              </div>
              {rating > 0 && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm text-muted-foreground mt-2"
                >
                  You rated us {rating} out of 5 stars
                </motion.p>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Feedback Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Tell us more</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium mb-2">
                  Title <span className="text-red-500">*</span>
                </label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Brief summary of your feedback"
                  required
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Please provide detailed feedback..."
                  rows={6}
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email (optional)
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  We'll only use this to follow up on your feedback if needed
                </p>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="capitalize">
                    {feedbackType} feedback
                  </Badge>
                  {rating > 0 && (
                    <Badge variant="outline" className="flex items-center space-x-1">
                      <Star className="h-3 w-3" />
                      <span>{rating}/5</span>
                    </Badge>
                  )}
                </div>

                <Button 
                  type="submit" 
                  disabled={isSubmitting || !title.trim() || !description.trim()}
                  className="flex items-center space-x-2"
                >
                  {isSubmitting ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                  <span>{isSubmitting ? 'Sending...' : 'Send Feedback'}</span>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      {/* Contact Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <Card className="bg-muted/50">
          <CardContent className="p-6 text-center">
            <p className="text-sm text-muted-foreground">
              Need immediate help? Contact us at{' '}
              <a href="mailto:support@streamvault.com" className="text-primary hover:underline">
                support@streamvault.com
              </a>{' '}
              or visit our Help Center for quick answers.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

