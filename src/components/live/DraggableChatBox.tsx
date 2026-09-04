"use client";

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageCircle,
  Send,
  Smile,
  Gift,
  Heart,
  ThumbsUp,
  Award,
  Star,
  Shield,
  Zap,
  TrendingUp,
  GripVertical,
  X,
  Minimize2,
  Maximize2
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '../ui/resizable';

interface Comment {
  id: string;
  user: {
    name: string;
    avatar: string;
    verified?: boolean;
    badges?: string[];
  };
  message: string;
  timestamp: Date;
  likes: number;
  type?: 'message' | 'gift' | 'follow' | 'subscription';
  gift?: {
    name: string;
    value: number;
    emoji: string;
  };
}

interface DraggableChatBoxProps {
  comments: Comment[];
  onSendComment: (message: string) => void;
  onAddReaction: (emoji: string) => void;
  isFullscreen: boolean;
  onClose?: () => void;
  onMinimize?: () => void;
}

export function DraggableChatBox({
  comments,
  onSendComment,
  onAddReaction,
  isFullscreen,
  onClose,
  onMinimize
}: DraggableChatBoxProps) {
  const [newComment, setNewComment] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: window.innerWidth - 420, y: 100 });
  const [isMinimized, setIsMinimized] = useState(false);
  const [chatHeight, setChatHeight] = useState(500);
  const [chatWidth, setChatWidth] = useState(400);

  const chatRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<HTMLDivElement>(null);
  const commentsEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll comments
  useEffect(() => {
    if (commentsEndRef.current) {
      commentsEndRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'end'
      });
    }
  }, [comments]);

  // Handle dragging
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!dragRef.current || isMinimized) return;

    setIsDragging(true);
    const startX = e.clientX - position.x;
    const startY = e.clientY - position.y;

    const handleMouseMove = (e: MouseEvent) => {
      const newX = e.clientX - startX;
      const newY = e.clientY - startY;

      // Constrain to viewport
      const maxX = window.innerWidth - chatWidth;
      const maxY = window.innerHeight - (isMinimized ? 60 : chatHeight);

      setPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY))
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [position, chatWidth, chatHeight, isMinimized]);

  // Handle send comment
  const handleSendComment = () => {
    if (!newComment.trim()) return;
    onSendComment(newComment);
    setNewComment('');
  };

  // Handle minimize/maximize
  const handleMinimize = () => {
    setIsMinimized(!isMinimized);
    onMinimize?.();
  };

  if (!isFullscreen) return null;

  return (
    <motion.div
      ref={chatRef}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{
        opacity: 1,
        scale: 1,
        x: position.x,
        y: position.y,
        width: isMinimized ? 300 : chatWidth,
        height: isMinimized ? 60 : chatHeight
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
        scale: { duration: 0.2 }
      }}
      className={`fixed z-50 bg-black/80 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden ${
        isDragging ? 'cursor-grabbing' : 'cursor-grab'
      }`}
      style={{
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.1)'
      }}
    >
      {/* Header */}
      <div
        ref={dragRef}
        onMouseDown={handleMouseDown}
        className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-b border-white/10 cursor-grab active:cursor-grabbing"
      >
        <div className="flex items-center space-x-2">
          <GripVertical className="w-4 h-4 text-white/60" />
          <MessageCircle className="w-5 h-5 text-purple-400" />
          <span className="text-white font-semibold text-sm">
            {isMinimized ? `Chat (${comments.length})` : 'Live Chat'}
          </span>
          {!isMinimized && (
            <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 border-purple-400/30 text-xs">
              {comments.length}
            </Badge>
          )}
        </div>

        <div className="flex items-center space-x-1">
          <Button
            onClick={handleMinimize}
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 text-white/60 hover:text-white hover:bg-white/10"
          >
            {isMinimized ? <Maximize2 className="w-3 h-3" /> : <Minimize2 className="w-3 h-3" />}
          </Button>
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 text-white/60 hover:text-red-400 hover:bg-red-500/20"
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {/* Minimized State */}
      {isMinimized && (
        <div className="p-2">
          <div className="flex items-center justify-between text-xs text-white/80">
            <span>{comments.length} messages</span>
            <div className="flex items-center space-x-1">
              <TrendingUp className="w-3 h-3" />
              <span>Live</span>
            </div>
          </div>
        </div>
      )}

      {/* Chat Content */}
      {!isMinimized && (
        <ResizablePanelGroup direction="vertical" className="h-full">
          {/* Messages Panel */}
          <ResizablePanel defaultSize={75} minSize={40}>
            <div className="flex flex-col h-full">
              {/* Messages */}
              <div className="flex-1 overflow-hidden">
                <div className="h-full instagram-chat-container live-chat-scrollbar smooth-scroll px-3 py-2 space-y-2">
                  <AnimatePresence>
                    {comments.slice(-30).map((comment) => (
                      <motion.div
                        key={comment.id}
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        className={`chat-message-enter p-2 rounded-lg transition-all duration-200 hover:bg-white/5 ${
                          comment.type === 'gift' ? 'bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-400/30' :
                          comment.type === 'follow' ? 'bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-400/30' :
                          'bg-white/5 border border-white/10'
                        }`}
                      >
                        <div className="flex items-start space-x-2">
                          <div className="relative">
                            <Avatar className="w-6 h-6 ring-1 ring-white/20">
                              <AvatarImage src={comment.user.avatar} />
                              <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs">
                                {comment.user.name[0]}
                              </AvatarFallback>
                            </Avatar>
                            {comment.user.verified && (
                              <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center">
                                <Shield className="w-1.5 h-1.5 text-white" />
                              </div>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-1 mb-0.5">
                              <span className="font-semibold text-white text-xs truncate">
                                {comment.user.name}
                              </span>

                              {comment.user.badges?.map((badge) => (
                                <Badge
                                  key={badge}
                                  variant="secondary"
                                  className={`text-xs px-1 py-0 ${
                                    badge === 'moderator' ? 'bg-green-500/20 text-green-300 border-green-400/30' :
                                    badge === 'subscriber' ? 'bg-purple-500/20 text-purple-300 border-purple-400/30' :
                                    badge === 'vip' ? 'bg-yellow-500/20 text-yellow-300 border-yellow-400/30' :
                                    badge === 'streamer' ? 'bg-red-500/20 text-red-300 border-red-400/30' :
                                    'bg-gray-500/20 text-gray-300 border-gray-400/30'
                                  }`}
                                >
                                  {badge === 'moderator' && <Shield className="w-2 h-2 mr-0.5" />}
                                  {badge === 'subscriber' && <Star className="w-2 h-2 mr-0.5" />}
                                  {badge === 'vip' && <Award className="w-2 h-2 mr-0.5" />}
                                  {badge === 'streamer' && <Zap className="w-2 h-2 mr-0.5" />}
                                  {badge}
                                </Badge>
                              ))}

                              <span className="text-xs text-gray-400">
                                {comment.timestamp.toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                            </div>

                            {comment.type === 'gift' && comment.gift && (
                              <div className="mb-1 p-1.5 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded border border-yellow-400/30">
                                <div className="flex items-center space-x-1.5">
                                  <span className="text-lg">{comment.gift.emoji}</span>
                                  <div>
                                    <p className="text-yellow-300 font-semibold text-xs">{comment.gift.name}</p>
                                    <p className="text-yellow-400 text-xs">${comment.gift.value}</p>
                                  </div>
                                </div>
                              </div>
                            )}

                            <p className="text-gray-200 text-xs break-words leading-relaxed">
                              {comment.message}
                            </p>

                            {comment.likes > 0 && (
                              <div className="flex items-center mt-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-5 px-1.5 text-xs bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10"
                                >
                                  <Heart className="w-2.5 h-2.5 mr-0.5 text-pink-400" />
                                  {comment.likes}
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  <div ref={commentsEndRef} />
                </div>
              </div>
            </div>
          </ResizablePanel>

          <ResizableHandle className="h-1 bg-white/20 hover:bg-white/30 transition-colors" />

          {/* Input Panel */}
          <ResizablePanel defaultSize={25} minSize={20}>
            <div className="p-3 border-t border-white/10">
              {/* Quick Reactions */}
              <div className="flex items-center justify-center space-x-1 mb-2">
                {['❤️', '😂', '👏', '🔥', '😍', '🎉'].map((emoji) => (
                  <Button
                    key={emoji}
                    onClick={() => onAddReaction(emoji)}
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full"
                  >
                    <span className="text-sm">{emoji}</span>
                  </Button>
                ))}
              </div>

              {/* Chat Input */}
              <div className="flex space-x-2">
                <div className="flex-1 relative">
                  <Input
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Send a message..."
                    className="bg-white/5 border-white/20 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400/20 rounded-lg pr-16 text-sm h-8"
                    onKeyPress={(e) => e.key === 'Enter' && handleSendComment()}
                    maxLength={200}
                  />
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-0.5">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-5 w-5 p-0 text-gray-400 hover:text-white"
                    >
                      <Smile className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-5 w-5 p-0 text-gray-400 hover:text-white"
                    >
                      <Gift className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                <Button
                  onClick={handleSendComment}
                  disabled={!newComment.trim()}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 rounded-lg px-3 h-8"
                >
                  <Send className="w-3 h-3" />
                </Button>
              </div>

              <div className="flex items-center justify-between mt-1 text-xs text-gray-400">
                <span>{newComment.length}/200</span>
                <div className="flex items-center space-x-1">
                  <TrendingUp className="w-2.5 h-2.5" />
                  <span>Live</span>
                </div>
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      )}
    </motion.div>
  );
}
