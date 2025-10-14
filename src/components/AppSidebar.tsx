import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from './ui/sidebar';
import {
  Home,
  History,
  ListVideo,
  Clock,
  Heart,
  Download,
  Settings,
  Play,
  TrendingUp,
  MessageSquare,
  Flag,
  HelpCircle,
  FileText,
  Users,
  Plus,
  BarChart3,
  DollarSign,
  Upload,
  Edit3,
  Globe,
  Smartphone,
} from 'lucide-react';
import { Avatar, AvatarFallback } from './ui/avatar';
import { ThemeToggle } from './ThemeToggle';
import { ColorSelector } from './ColorSelector';
import { LanguageSelector } from './LanguageSelector';
import { SidebarSubscriptions } from './SidebarSubscriptions';
import { SidebarMusicPlayer } from './SidebarMusicPlayer';
import { motion } from 'motion/react';
import { useTranslation } from '../hooks/useTranslation';

interface AppSidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  user?: any;
  onProfileClick: () => void;
  onSettingsClick?: () => void;
  onChannelClick?: (channelId: string) => void;
  onCreateChannel?: () => void;
}

export function AppSidebar({ currentPage, onPageChange, user, onProfileClick, onSettingsClick, onChannelClick, onCreateChannel }: AppSidebarProps) {
  const { t } = useTranslation();
  
  const mainNavItems = [
    {
      title: t('home'),
      icon: Home,
      page: 'home',
    },
    {
      title: 'Reels',
      icon: Smartphone,
      page: 'reels',
    },
    {
      title: t('trending'),
      icon: TrendingUp,
      page: 'trending',
    },
    {
      title: 'Community',
      icon: Users,
      page: 'community',
    },
  ];

  const libraryItems = [
    {
      title: t('history'),
      icon: History,
      page: 'history',
    },
    {
      title: t('playlists'),
      icon: ListVideo,
      page: 'playlists',
    },
    {
      title: t('watchLater'),
      icon: Clock,
      page: 'watchlater',
    },
    {
      title: t('liked'),
      icon: Heart,
      page: 'liked',
    },
    {
      title: t('downloads'),
      icon: Download,
      page: 'downloads',
    },
  ];

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground hover:scale-105 transition-transform duration-300">
                <motion.div 
                  className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground"
                  whileHover={{ 
                    scale: 1.1,
                    rotate: 360,
                    boxShadow: "0 0 20px rgba(59, 130, 246, 0.5)"
                  }}
                  transition={{ duration: 0.5 }}
                >
                  <Play className="size-4" />
                </motion.div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <motion.span 
                    className="truncate font-semibold"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    StreamVault
                  </motion.span>
                  <motion.span 
                    className="truncate text-xs"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    Premium Streaming
                  </motion.span>
                </div>
              </SidebarMenuButton>
            </motion.div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item, index) => (
                <SidebarMenuItem key={item.page}>
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ 
                      delay: 0.1 * index + 0.5,
                      duration: 0.4,
                      ease: [0.25, 0.46, 0.45, 0.94]
                    }}
                    whileHover={{ x: 5 }}
                  >
                    <SidebarMenuButton
                      onClick={() => onPageChange(item.page)}
                      isActive={currentPage === item.page}
                      tooltip={item.title}
                      className="relative overflow-hidden group"
                    >
                      <motion.div
                        animate={currentPage === item.page ? { 
                          scale: [1, 1.2, 1],
                          rotate: [0, 180, 360]
                        } : {}}
                        transition={{ duration: 0.6 }}
                      >
                        <item.icon className="size-4" />
                      </motion.div>
                      <span className="transition-all duration-300 group-hover:translate-x-1">
                        {item.title}
                      </span>
                      {currentPage === item.page && (
                        <motion.div
                          className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r"
                          layoutId="activeIndicator"
                          transition={{ duration: 0.3 }}
                        />
                      )}
                      <motion.div
                        className="absolute inset-0 bg-primary/10 rounded opacity-0"
                        whileHover={{ opacity: 1 }}
                        transition={{ duration: 0.2 }}
                      />
                    </SidebarMenuButton>
                  </motion.div>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        {/* Creator Tools Section */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <motion.div 
                  className="px-2 py-1.5 text-xs font-medium text-sidebar-foreground/70"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  {t('createChannel')}
                </motion.div>
              </SidebarMenuItem>
              
              {user?.channel ? (
                // Show creator dashboard options for users with channels
                <>
                  <SidebarMenuItem>
                    <motion.div
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ 
                        delay: 0.7,
                        duration: 0.4,
                        ease: [0.25, 0.46, 0.45, 0.94]
                      }}
                      whileHover={{ x: 5 }}
                    >
                      <SidebarMenuButton
                        onClick={() => onPageChange('creator-dashboard')}
                        isActive={currentPage === 'creator-dashboard'}
                        tooltip="Creator Dashboard"
                        className="relative overflow-hidden group hover:bg-gradient-to-r hover:from-purple-500/10 hover:to-blue-500/10"
                      >
                        <motion.div
                          whileHover={{ 
                            scale: 1.2,
                            rotate: 15,
                          }}
                          transition={{ duration: 0.3 }}
                        >
                          <TrendingUp className="size-4 text-purple-600 dark:text-purple-400" />
                        </motion.div>
                        <span className="transition-all duration-300 group-hover:translate-x-1 font-medium">
                          {t('dashboard')}
                        </span>
                      </SidebarMenuButton>
                    </motion.div>
                  </SidebarMenuItem>
                  
                  <SidebarMenuItem>
                    <motion.div
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ 
                        delay: 0.8,
                        duration: 0.4,
                        ease: [0.25, 0.46, 0.45, 0.94]
                      }}
                      whileHover={{ x: 5 }}
                    >
                      <SidebarMenuButton
                        onClick={() => onPageChange('channel-analytics')}
                        isActive={currentPage === 'channel-analytics'}
                        tooltip="Channel Analytics"
                        className="relative overflow-hidden group hover:bg-gradient-to-r hover:from-blue-500/10 hover:to-green-500/10"
                      >
                        <motion.div
                          whileHover={{ 
                            scale: 1.2,
                            rotate: 15,
                          }}
                          transition={{ duration: 0.3 }}
                        >
                          <BarChart3 className="size-4 text-blue-600 dark:text-blue-400" />
                        </motion.div>
                        <span className="transition-all duration-300 group-hover:translate-x-1 font-medium">
                          {t('analytics')}
                        </span>
                      </SidebarMenuButton>
                    </motion.div>
                  </SidebarMenuItem>
                  
                  <SidebarMenuItem>
                    <motion.div
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ 
                        delay: 0.9,
                        duration: 0.4,
                        ease: [0.25, 0.46, 0.45, 0.94]
                      }}
                      whileHover={{ x: 5 }}
                    >
                      <SidebarMenuButton
                        onClick={() => onPageChange('earnings')}
                        isActive={currentPage === 'earnings'}
                        tooltip="Earnings & Monetization"
                        className="relative overflow-hidden group hover:bg-gradient-to-r hover:from-green-500/10 hover:to-yellow-500/10"
                      >
                        <motion.div
                          whileHover={{ 
                            scale: 1.2,
                            rotate: 15,
                          }}
                          transition={{ duration: 0.3 }}
                        >
                          <DollarSign className="size-4 text-green-600 dark:text-green-400" />
                        </motion.div>
                        <span className="transition-all duration-300 group-hover:translate-x-1 font-medium">
                          {t('earnings')}
                        </span>
                      </SidebarMenuButton>
                    </motion.div>
                  </SidebarMenuItem>
                  
                  <SidebarMenuItem>
                    <motion.div
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ 
                        delay: 1.0,
                        duration: 0.4,
                        ease: [0.25, 0.46, 0.45, 0.94]
                      }}
                      whileHover={{ x: 5 }}
                    >
                      <SidebarMenuButton
                        onClick={() => alert('Upload feature coming soon!')}
                        tooltip={t('uploadVideo')}
                        className="relative overflow-hidden group hover:bg-gradient-to-r hover:from-red-500/10 hover:to-pink-500/10"
                      >
                        <motion.div
                          whileHover={{ 
                            scale: 1.2,
                            rotate: 15,
                          }}
                          transition={{ duration: 0.3 }}
                        >
                          <Upload className="size-4 text-red-600 dark:text-red-400" />
                        </motion.div>
                        <span className="transition-all duration-300 group-hover:translate-x-1 font-medium">
                          {t('uploadVideo')}
                        </span>
                      </SidebarMenuButton>
                    </motion.div>
                  </SidebarMenuItem>
                  
                  <SidebarMenuItem>
                    <motion.div
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ 
                        delay: 1.1,
                        duration: 0.4,
                        ease: [0.25, 0.46, 0.45, 0.94]
                      }}
                      whileHover={{ x: 5 }}
                    >
                      <SidebarMenuButton
                        onClick={() => onPageChange('quick-edit')}
                        tooltip="Quick Edit Studio"
                        isActive={currentPage === 'quick-edit'}
                        className="relative overflow-hidden group hover:bg-gradient-to-r hover:from-blue-500/10 hover:to-purple-500/10"
                      >
                        <motion.div
                          whileHover={{ 
                            scale: 1.2,
                            rotate: 15,
                          }}
                          transition={{ duration: 0.3 }}
                        >
                          <Edit3 className="size-4 text-blue-600 dark:text-blue-400" />
                        </motion.div>
                        <span className="transition-all duration-300 group-hover:translate-x-1 font-medium">
                          Quick Edit Studio
                        </span>
                      </SidebarMenuButton>
                    </motion.div>
                  </SidebarMenuItem>
                </>
              ) : (
                // Show create channel option for users without channels
                <SidebarMenuItem>
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ 
                      delay: 0.7,
                      duration: 0.4,
                      ease: [0.25, 0.46, 0.45, 0.94]
                    }}
                    whileHover={{ x: 5 }}
                  >
                    <SidebarMenuButton
                      onClick={onCreateChannel}
                      tooltip="Create Your Channel"
                      className="relative overflow-hidden group hover:bg-gradient-to-r hover:from-blue-500/10 hover:to-purple-500/10"
                    >
                      <motion.div
                        whileHover={{ 
                          scale: 1.2,
                          rotate: 15,
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        <Users className="size-4 text-blue-600 dark:text-blue-400" />
                      </motion.div>
                      <span className="transition-all duration-300 group-hover:translate-x-1 font-medium">
                        {t('createChannel')}
                      </span>
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded opacity-0"
                        whileHover={{ opacity: 1 }}
                        transition={{ duration: 0.2 }}
                      />
                      <motion.div
                        className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        whileHover={{ scale: 1.1 }}
                      >
                        <Plus className="size-3 text-blue-600 dark:text-blue-400" />
                      </motion.div>
                    </SidebarMenuButton>
                  </motion.div>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        {/* Subscriptions Section */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarSubscriptions 
                currentPage={currentPage}
                onPageChange={onPageChange}
                onChannelClick={onChannelClick}
              />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        {/* Music Player Section */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMusicPlayer 
                currentPage={currentPage}
                onPageChange={onPageChange}
              />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        {/* Library Section */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <motion.div 
                  className="px-2 py-1.5 text-xs font-medium text-sidebar-foreground/70"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  {t('library')}
                </motion.div>
              </SidebarMenuItem>
              {libraryItems.map((item, index) => (
                <SidebarMenuItem key={item.page}>
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ 
                      delay: 0.1 * index + 0.9,
                      duration: 0.4,
                      ease: [0.25, 0.46, 0.45, 0.94]
                    }}
                    whileHover={{ x: 5 }}
                  >
                    <SidebarMenuButton
                      onClick={() => onPageChange(item.page)}
                      isActive={currentPage === item.page}
                      tooltip={item.title}
                      className="relative overflow-hidden group"
                    >
                      <motion.div
                        animate={currentPage === item.page ? { 
                          scale: [1, 1.1, 1],
                        } : {}}
                        transition={{ duration: 0.4 }}
                        whileHover={{ rotate: 5 }}
                      >
                        <item.icon className="size-4" />
                      </motion.div>
                      <span className="transition-all duration-300 group-hover:translate-x-1">
                        {item.title}
                      </span>
                      {currentPage === item.page && (
                        <motion.div
                          className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r"
                          layoutId="activeLibraryIndicator"
                          transition={{ duration: 0.3 }}
                        />
                      )}
                      <motion.div
                        className="absolute inset-0 bg-primary/10 rounded opacity-0"
                        whileHover={{ opacity: 1 }}
                        transition={{ duration: 0.2 }}
                      />
                    </SidebarMenuButton>
                  </motion.div>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        {/* Settings & Theme */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <div className="px-2 py-1.5 text-xs font-medium text-sidebar-foreground/70">
                  Preferences
                </div>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={onSettingsClick || onProfileClick} tooltip="Settings">
                  <Settings className="size-4" />
                  <span>{t('settings')}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <div className="flex items-center justify-between px-2 py-1.5">
                  <span className="text-sm">Background</span>
                  <ThemeToggle />
                </div>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <div className="flex items-center justify-between px-2 py-1.5">
                  <span className="text-sm">Colors</span>
                  <ColorSelector />
                </div>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <div className="flex items-center justify-between px-2 py-1.5">
                  <span className="text-sm">{t('language')}</span>
                  <LanguageSelector variant="button" size="sm" />
                </div>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        {/* Help & Support Section */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <motion.div 
                  className="px-2 py-1.5 text-xs font-medium text-sidebar-foreground/70"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2 }}
                >
                  Help & Support
                </motion.div>
              </SidebarMenuItem>
              
              {/* Send Feedback */}
              <SidebarMenuItem>
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ 
                    delay: 1.3,
                    duration: 0.4,
                    ease: [0.25, 0.46, 0.45, 0.94]
                  }}
                  whileHover={{ x: 5 }}
                >
                  <SidebarMenuButton
                    onClick={() => onPageChange('feedback')}
                    isActive={currentPage === 'feedback'}
                    tooltip="Send Feedback"
                    className="relative overflow-hidden group"
                  >
                    <motion.div
                      whileHover={{ 
                        scale: 1.1,
                        rotate: 5,
                        boxShadow: "0 0 15px rgba(34, 197, 94, 0.3)"
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <MessageSquare className="text-green-500" />
                    </motion.div>
                    <span>Send Feedback</span>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-green-600/10 rounded opacity-0"
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  </SidebarMenuButton>
                </motion.div>
              </SidebarMenuItem>

              {/* Report Issue */}
              <SidebarMenuItem>
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ 
                    delay: 1.4,
                    duration: 0.4,
                    ease: [0.25, 0.46, 0.45, 0.94]
                  }}
                  whileHover={{ x: 5 }}
                >
                  <SidebarMenuButton
                    onClick={() => onPageChange('report')}
                    isActive={currentPage === 'report'}
                    tooltip="Report Issue"
                    className="relative overflow-hidden group"
                  >
                    <motion.div
                      whileHover={{ 
                        scale: 1.1,
                        rotate: -5,
                        boxShadow: "0 0 15px rgba(239, 68, 68, 0.3)"
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <Flag className="text-red-500" />
                    </motion.div>
                    <span>Report Issue</span>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-red-600/10 rounded opacity-0"
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  </SidebarMenuButton>
                </motion.div>
              </SidebarMenuItem>

              {/* History (Alternative) */}
              <SidebarMenuItem>
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ 
                    delay: 1.5,
                    duration: 0.4,
                    ease: [0.25, 0.46, 0.45, 0.94]
                  }}
                  whileHover={{ x: 5 }}
                >
                  <SidebarMenuButton
                    onClick={() => onPageChange('activityHistory')}
                    isActive={currentPage === 'activityHistory'}
                    tooltip="Activity History"
                    className="relative overflow-hidden group"
                  >
                    <motion.div
                      whileHover={{ 
                        scale: 1.1,
                        boxShadow: "0 0 15px rgba(168, 85, 247, 0.3)"
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <FileText className="text-purple-500" />
                    </motion.div>
                    <span>Activity History</span>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-purple-600/10 rounded opacity-0"
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  </SidebarMenuButton>
                </motion.div>
              </SidebarMenuItem>

              {/* Help Center */}
              <SidebarMenuItem>
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ 
                    delay: 1.6,
                    duration: 0.4,
                    ease: [0.25, 0.46, 0.45, 0.94]
                  }}
                  whileHover={{ x: 5 }}
                >
                  <SidebarMenuButton
                    onClick={() => onPageChange('help')}
                    isActive={currentPage === 'help'}
                    tooltip="Help Center"
                    className="relative overflow-hidden group"
                  >
                    <motion.div
                      whileHover={{ 
                        scale: 1.1,
                        rotate: 360,
                        boxShadow: "0 0 15px rgba(59, 130, 246, 0.3)"
                      }}
                      transition={{ duration: 0.5 }}
                    >
                      <HelpCircle className="text-blue-500" />
                    </motion.div>
                    <span>{t('help')}</span>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-blue-600/10 rounded opacity-0"
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  </SidebarMenuButton>
                </motion.div>
              </SidebarMenuItem>
              
              {/* Translation Demo - For Testing */}
              <SidebarMenuItem>
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ 
                    delay: 1.7,
                    duration: 0.4,
                    ease: [0.25, 0.46, 0.45, 0.94]
                  }}
                  whileHover={{ x: 5 }}
                >
                  <SidebarMenuButton
                    onClick={() => onPageChange('translation-demo')}
                    isActive={currentPage === 'translation-demo'}
                    tooltip="Translation Demo"
                    className="relative overflow-hidden group"
                  >
                    <motion.div
                      whileHover={{ 
                        scale: 1.1,
                        rotate: 360,
                        boxShadow: "0 0 15px rgba(34, 197, 94, 0.3)"
                      }}
                      transition={{ duration: 0.5 }}
                    >
                      <Globe className="text-green-500" />
                    </motion.div>
                    <span>Translation Demo</span>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-600/10 rounded opacity-0"
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  </SidebarMenuButton>
                </motion.div>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ 
                    opacity: 1, 
                    x: 0,
                    scale: [1, 1.02, 1]
                  }}
                  transition={{ 
                    delay: 1.8,
                    duration: 0.4,
                    ease: [0.25, 0.46, 0.45, 0.94]
                  }}
                  whileHover={{ x: 5 }}
                >
                  <SidebarMenuButton
                    onClick={() => onPageChange('go-live-demo')}
                    isActive={currentPage === 'go-live-demo'}
                    tooltip="Go Live Demo"
                    className="relative overflow-hidden group"
                  >
                    <motion.div
                      whileHover={{ 
                        scale: 1.1,
                        rotate: 360,
                        boxShadow: "0 0 15px rgba(239, 68, 68, 0.3)"
                      }}
                      transition={{ duration: 0.5 }}
                    >
                      <Play className="text-red-500" />
                    </motion.div>
                    <span>Go Live Demo</span>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-pink-600/10 rounded opacity-0"
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  </SidebarMenuButton>
                </motion.div>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, duration: 0.6 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <SidebarMenuButton
                onClick={onProfileClick}
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground hover:shadow-lg transition-all duration-300 relative overflow-hidden group"
              >
                <motion.div
                  whileHover={{ 
                    scale: 1.1,
                    boxShadow: "0 0 20px rgba(59, 130, 246, 0.3)"
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarFallback className="rounded-lg bg-primary text-primary-foreground">
                      {user?.username?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </motion.div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <motion.span 
                    className="truncate font-semibold"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.7 }}
                  >
                    {user?.username || 'User'}
                  </motion.span>
                  <motion.span 
                    className="truncate text-xs"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.8 }}
                  >
                    {user?.email || 'user@example.com'}
                  </motion.span>
                </div>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded opacity-0"
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </SidebarMenuButton>
            </motion.div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

