#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Define files and their fixes
const fixes = [
  // Remove unused React imports
  {
    file: 'src/components/VisibilityTest.tsx',
    search: "import React from 'react';",
    replace: ''
  },
  // Fix unused imports in various files
  {
    file: 'src/components/ChannelPage.tsx',
    search: "import {\n  Play,\n  Pause,\n  MoreVertical,\n  ThumbsUp,\n  ThumbsDown,\n  Share2,\n  Download,\n  BookmarkPlus,\n  Grid3X3,\n  Calendar,\n  Users,\n  Badge,\n  CheckCircle,\n  Heart,\n  MessageCircle,\n  Share,\n  ThumbsUp,\n  MoreHorizontal,\n  Play as PlayIcon,\n  Pause as PauseIcon\n} from 'lucide-react';",
    replace: "import {\n  Play,\n  Pause,\n  MoreVertical,\n  ThumbsDown,\n  Share2,\n  Download,\n  BookmarkPlus,\n  Calendar,\n  Users,\n  Badge,\n  CheckCircle,\n  Heart,\n  MessageCircle,\n  Share,\n  MoreHorizontal,\n  Play as PlayIcon,\n  Pause as PauseIcon\n} from 'lucide-react';"
  },
  // Fix ColorSelector unused imports
  {
    file: 'src/components/ColorSelector.tsx',
    search: "import { Card, CardContent, CardHeader, CardTitle } from './ui/card';",
    replace: "import { Card, CardContent } from './ui/card';"
  }
];

// Apply fixes
fixes.forEach(fix => {
  const filePath = path.join(__dirname, fix.file);
  try {
    if (fs.existsSync(filePath)) {
      let content = fs.readFileSync(filePath, 'utf8');
      if (content.includes(fix.search)) {
        content = content.replace(fix.search, fix.replace);
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ Fixed: ${fix.file}`);
      } else {
        console.log(`⚠️  Pattern not found in: ${fix.file}`);
      }
    } else {
      console.log(`❌ File not found: ${fix.file}`);
    }
  } catch (error) {
    console.error(`❌ Error fixing ${fix.file}:`, error.message);
  }
});

console.log('\n🎉 All fixes applied!');