
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { 
  Flag, 
  Send, 
  AlertTriangle, 
  Bug, 
  Shield, 
  Video,
  User
} from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'motion/react';

interface ReportPageProps {
  onSubmit?: (report: any) => void;
}

export function ReportPage({ onSubmit }: ReportPageProps) {
  const [reportType, setReportType] = useState<'technical' | 'content' | 'user' | 'security'>('technical');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'critical'>('medium');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [stepsToReproduce, setStepsToReproduce] = useState('');
  const [expectedBehavior, setExpectedBehavior] = useState('');
  const [actualBehavior, setActualBehavior] = useState('');
  const [userAgent, setUserAgent] = useState(navigator.userAgent);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const reportTypes = [
    { 
      id: 'technical', 
      label: 'Technical Issue', 
      description: 'Bugs, errors, or performance problems',
      icon: Bug, 
      color: 'bg-red-500' 
    },
    { 
      id: 'content', 
      label: 'Content Issue', 
      description: 'Video quality, audio, or content problems',
      icon: Video, 
      color: 'bg-orange-500' 
    },
    { 
      id: 'user', 
      label: 'User Behavior', 
      description: 'Inappropriate behavior or harassment',
      icon: User, 
      color: 'bg-yellow-500' 
    },
    { 
      id: 'security', 
      label: 'Security Concern', 
      description: 'Privacy or security vulnerabilities',
      icon: Shield, 
      color: 'bg-purple-500' 
    }
  ];

  const priorityLevels = [
    { id: 'low', label: 'Low', color: 'bg-green-100 text-green-800', description: 'Minor issue, no immediate impact' },
    { id: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-800', description: 'Moderate impact on functionality' },
    { id: 'high', label: 'High', color: 'bg-orange-100 text-orange-800', description: 'Significant impact, needs attention' },
    { id: 'critical', label: 'Critical', color: 'bg-red-100 text-red-800', description: 'Severe issue, immediate action required' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !description.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const reportData = {
        type: reportType,
        priority,
        title: title.trim(),
        description: description.trim(),
        stepsToReproduce: stepsToReproduce.trim(),
        expectedBehavior: expectedBehavior.trim(),
        actualBehavior: actualBehavior.trim(),
        userAgent,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        reportId: `REP-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (onSubmit) {
        onSubmit(reportData);
      }

      toast.success(`Report submitted successfully! Reference ID: ${reportData.reportId}`);
      
      // Reset form
      setTitle('');
      setDescription('');
      setStepsToReproduce('');
      setExpectedBehavior('');
      setActualBehavior('');
      setPriority('medium');
      setReportType('technical');
      
    } catch (error) {
      toast.error('Failed to submit report. Please try again.');
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
          <div className="p-3 bg-red-500/20 rounded-full">
            <Flag className="h-8 w-8 text-red-500" />
          </div>
          <h1 className="text-3xl font-bold">Report an Issue</h1>
        </div>
        <p className="text-lg text-muted-foreground">
          Help us identify and fix problems to improve your experience
        </p>
      </motion.div>

      {/* Issue Type Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5" />
              <span>What type of issue are you reporting?</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reportTypes.map((type, index) => (
                <motion.div
                  key={type.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card 
                    className={`cursor-pointer transition-all duration-300 ${
                      reportType === type.id 
                        ? 'ring-2 ring-primary shadow-lg' 
                        : 'hover:shadow-md'
                    }`}
                    onClick={() => setReportType(type.id as any)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <div className={`${type.color} w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0`}>
                          <type.icon className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-sm mb-1">{type.label}</h3>
                          <p className="text-xs text-muted-foreground">{type.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Priority Level */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>How urgent is this issue?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {priorityLevels.map((level, index) => (
                <motion.button
                  key={level.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setPriority(level.id as any)}
                  className={`p-3 rounded-lg text-left transition-all duration-200 ${
                    priority === level.id 
                      ? 'ring-2 ring-primary shadow-md' 
                      : 'hover:shadow-sm'
                  }`}
                >
                  <Badge className={`${level.color} mb-2`}>
                    {level.label}
                  </Badge>
                  <p className="text-xs text-muted-foreground">{level.description}</p>
                </motion.button>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Report Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Issue Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium mb-2">
                  Issue Title <span className="text-red-500">*</span>
                </label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Brief description of the issue"
                  required
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium mb-2">
                  Detailed Description <span className="text-red-500">*</span>
                </label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Please describe the issue in detail..."
                  rows={4}
                  required
                />
              </div>

              {reportType === 'technical' && (
                <>
                  <div>
                    <label htmlFor="steps" className="block text-sm font-medium mb-2">
                      Steps to Reproduce
                    </label>
                    <Textarea
                      id="steps"
                      value={stepsToReproduce}
                      onChange={(e) => setStepsToReproduce(e.target.value)}
                      placeholder="1. Go to...&#10;2. Click on...&#10;3. Notice that..."
                      rows={4}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="expected" className="block text-sm font-medium mb-2">
                        Expected Behavior
                      </label>
                      <Textarea
                        id="expected"
                        value={expectedBehavior}
                        onChange={(e) => setExpectedBehavior(e.target.value)}
                        placeholder="What should happen?"
                        rows={3}
                      />
                    </div>

                    <div>
                      <label htmlFor="actual" className="block text-sm font-medium mb-2">
                        Actual Behavior
                      </label>
                      <Textarea
                        id="actual"
                        value={actualBehavior}
                        onChange={(e) => setActualBehavior(e.target.value)}
                        placeholder="What actually happens?"
                        rows={3}
                      />
                    </div>
                  </div>
                </>
              )}

              <div>
                <label htmlFor="userAgent" className="block text-sm font-medium mb-2">
                  Browser Information
                </label>
                <Input
                  id="userAgent"
                  value={userAgent}
                  onChange={(e) => setUserAgent(e.target.value)}
                  className="text-xs"
                  readOnly
                />
                <p className="text-xs text-muted-foreground mt-1">
                  This helps us understand your browser and system configuration
                </p>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="capitalize">
                    {reportType} issue
                  </Badge>
                  <Badge 
                    variant="outline" 
                    className={priorityLevels.find(p => p.id === priority)?.color}
                  >
                    {priority} priority
                  </Badge>
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
                  <span>{isSubmitting ? 'Submitting...' : 'Submit Report'}</span>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      {/* Emergency Contact */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <Card className="border-red-200 bg-red-50/50 dark:bg-red-950/20">
          <CardContent className="p-6">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
              <div>
                <h3 className="font-semibold text-red-700 dark:text-red-400 mb-2">
                  Critical Security Issues
                </h3>
                <p className="text-sm text-red-600 dark:text-red-300">
                  If you've discovered a security vulnerability, please report it directly to{' '}
                  <a 
                    href="mailto:security@streamvault.com" 
                    className="font-medium underline hover:no-underline"
                  >
                    security@streamvault.com
                  </a>{' '}
                  for immediate attention.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

