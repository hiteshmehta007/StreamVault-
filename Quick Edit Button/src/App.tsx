import React, { useState } from 'react'
import { Button } from './components/ui/button'
import { QuickEditPanel } from './components/QuickEditPanel'
import { Edit3, Play, MoreHorizontal } from 'lucide-react'

export default function App() {
  const [isEditPanelOpen, setIsEditPanelOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="mb-8">Streaming Content Manager</h1>
        
        {/* Mock video preview */}
        <div className="mb-8">
          <div className="aspect-video bg-black rounded-lg relative overflow-hidden mb-4">
            <div className="absolute inset-0 flex items-center justify-center">
              <Play className="w-16 h-16 text-white" />
            </div>
            <div className="absolute top-4 right-4">
              <Button 
                onClick={() => setIsEditPanelOpen(true)}
                className="bg-black/50 hover:bg-black/70 text-white border-white/20"
              >
                <Edit3 className="w-4 h-4 mr-2" />
                Quick Edit
              </Button>
            </div>
          </div>
          
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="mb-2">My Awesome Stream</h2>
              <p className="text-muted-foreground mb-4">
                This is a great streaming video with lots of content. Perfect for demonstrating 
                the quick edit functionality with all the advanced features.
              </p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>1.2M views</span>
                <span>•</span>
                <span>2 days ago</span>
                <span>•</span>
                <span>Public</span>
              </div>
            </div>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Feature overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 border rounded-lg">
            <h3 className="mb-2">Content Management</h3>
            <p className="text-sm text-muted-foreground">
              Edit titles, descriptions, tags, categories, and manage chapters with timestamps.
            </p>
          </div>
          <div className="p-6 border rounded-lg">
            <h3 className="mb-2">Media Controls</h3>
            <p className="text-sm text-muted-foreground">
              Upload thumbnails, trim videos, add highlights, and manage captions.
            </p>
          </div>
          <div className="p-6 border rounded-lg">
            <h3 className="mb-2">Visibility Settings</h3>
            <p className="text-sm text-muted-foreground">
              Control who can see your content with privacy and audience restrictions.
            </p>
          </div>
          <div className="p-6 border rounded-lg">
            <h3 className="mb-2">Scheduling</h3>
            <p className="text-sm text-muted-foreground">
              Schedule publish/unpublish times and track analytics performance.
            </p>
          </div>
          <div className="p-6 border rounded-lg">
            <h3 className="mb-2">Monetization</h3>
            <p className="text-sm text-muted-foreground">
              Manage ads, sponsorship tags, and affiliate marketing links.
            </p>
          </div>
          <div className="p-6 border rounded-lg">
            <h3 className="mb-2">Advanced Features</h3>
            <p className="text-sm text-muted-foreground">
              Handle copyright claims, pin comments, and manage collaborations.
            </p>
          </div>
        </div>

        <div className="mt-8 p-6 bg-muted rounded-lg">
          <h3 className="mb-2">Quick Edit Demo</h3>
          <p className="text-muted-foreground mb-4">
            Click the "Quick Edit" button on the video above to open the comprehensive editing panel. 
            The interface is organized into logical tabs for easy navigation and includes all the features 
            you requested plus some additional suggestions.
          </p>
          <Button onClick={() => setIsEditPanelOpen(true)}>
            <Edit3 className="w-4 h-4 mr-2" />
            Open Quick Edit Panel
          </Button>
        </div>
      </div>

      <QuickEditPanel 
        isOpen={isEditPanelOpen} 
        onClose={() => setIsEditPanelOpen(false)} 
      />
    </div>
  )
}