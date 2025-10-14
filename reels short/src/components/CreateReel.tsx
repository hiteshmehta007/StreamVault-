import { useState } from "react";
import { Upload, Scissors, Video, Sparkles, X, Check, Clock, Zap, Image as ImageIcon, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Slider } from "./ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Switch } from "./ui/switch";
import { Badge } from "./ui/badge";
import { motion, AnimatePresence } from "motion/react";

export function CreateReel() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [caption, setCaption] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [trimStart, setTrimStart] = useState(0);
  const [trimEnd, setTrimEnd] = useState(60);
  const [autoHighlight, setAutoHighlight] = useState(true);
  const [autoConvert, setAutoConvert] = useState(true);
  const [currentStep, setCurrentStep] = useState<"source" | "edit" | "details">("source");

  const games = [
    "VALORANT",
    "Grand Theft Auto V",
    "Fortnite",
    "League of Legends",
    "Minecraft",
    "Just Chatting",
    "Counter-Strike 2",
    "Apex Legends",
  ];

  const recentStreams = [
    { id: "1", title: "Ranked Grind", duration: "4:32:15", game: "VALORANT", thumbnail: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=200" },
    { id: "2", title: "Late Night Chill", duration: "6:12:08", game: "Just Chatting", thumbnail: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=200" },
    { id: "3", title: "Tournament Practice", duration: "3:45:22", game: "League of Legends", thumbnail: "https://images.unsplash.com/photo-1614179924047-e1ab49a0a0cf?w=200" },
  ];

  const suggestedHashtags = ["clutch", "gaming", "highlights", "live", "fyp", "trending"];

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setCurrentStep("edit");
    }
  };

  const handlePublish = () => {
    console.log("Publishing clip:", {
      file: selectedFile?.name,
      caption,
      hashtags,
      game: selectedGame,
      trimStart,
      trimEnd,
      autoHighlight,
      autoConvert,
    });
  };

  const addHashtag = (tag: string) => {
    if (!hashtags.includes(tag)) {
      setHashtags(hashtags ? `${hashtags} #${tag}` : `#${tag}`);
    }
  };

  return (
    <div className="w-full h-full bg-gradient-to-b from-gray-950 via-black to-gray-950 overflow-y-auto">
      <div className="max-w-2xl mx-auto px-4 space-y-6 pb-24">
        {/* Header */}
        <div className="sticky top-0 bg-black/60 backdrop-blur-xl z-20 pt-4 pb-4 -mx-4 px-4 border-b border-white/5">
          <div className="flex items-center justify-between">
            <h2 className="text-white">Create Clip</h2>
            <Button 
              variant="ghost" 
              size="icon"
              className="text-white hover:bg-white/10 rounded-full w-10 h-10"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center gap-2 mt-4">
            {["source", "edit", "details"].map((step, index) => (
              <div key={step} className="flex items-center flex-1">
                <div className={`h-1 flex-1 rounded-full transition-all ${
                  currentStep === step || (index === 0 && currentStep !== "source") || (index === 1 && currentStep === "details")
                    ? "bg-gradient-to-r from-purple-600 to-pink-600"
                    : "bg-white/10"
                }`} />
              </div>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1: Source Selection */}
          {currentStep === "source" && (
            <motion.div
              key="source"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <Tabs defaultValue="upload" className="w-full">
                <TabsList className="w-full bg-white/5 border border-white/10 h-14 p-1.5 rounded-2xl">
                  <TabsTrigger 
                    value="upload" 
                    className="flex-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white text-gray-400 rounded-xl h-full"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload
                  </TabsTrigger>
                  <TabsTrigger 
                    value="stream" 
                    className="flex-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white text-gray-400 rounded-xl h-full"
                  >
                    <Video className="w-4 h-4 mr-2" />
                    From Stream
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="upload" className="space-y-4 mt-6">
                  {/* File Upload */}
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    className="relative border-2 border-dashed border-purple-500/30 rounded-3xl p-12 text-center hover:border-purple-500/50 hover:bg-white/5 transition-all cursor-pointer group"
                  >
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleFileSelect}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      id="video-upload"
                    />
                    
                    <div className="pointer-events-none">
                      <motion.div 
                        className="w-20 h-20 rounded-3xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform"
                        whileHover={{ rotate: 5 }}
                      >
                        <Upload className="w-10 h-10 text-white" />
                      </motion.div>
                      
                      <h3 className="text-white mb-2">Upload your clip</h3>
                      <p className="text-gray-400 mb-6">
                        MP4, MOV, AVI • Max 60 seconds • Up to 4K
                      </p>
                      
                      <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl">
                        <ImageIcon className="w-5 h-5" />
                        <span>Browse Files</span>
                      </div>
                    </div>
                  </motion.div>

                  {/* Quick Tips */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                      <div className="w-10 h-10 rounded-xl bg-purple-600/20 flex items-center justify-center mb-3">
                        <Sparkles className="w-5 h-5 text-purple-400" />
                      </div>
                      <p className="text-white text-sm mb-1">Best Quality</p>
                      <p className="text-xs text-gray-400">1080p or higher recommended</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                      <div className="w-10 h-10 rounded-xl bg-pink-600/20 flex items-center justify-center mb-3">
                        <Clock className="w-5 h-5 text-pink-400" />
                      </div>
                      <p className="text-white text-sm mb-1">Keep It Short</p>
                      <p className="text-xs text-gray-400">15-60 seconds works best</p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="stream" className="space-y-4 mt-6">
                  {/* AI Highlight Detection */}
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-500/30">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                          <Zap className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <Label className="text-white">AI Highlight Detection</Label>
                          <p className="text-xs text-gray-300 mt-0.5">Auto-find epic moments</p>
                        </div>
                      </div>
                      <Switch checked={autoHighlight} onCheckedChange={setAutoHighlight} />
                    </div>
                  </div>

                  {/* Recent Streams */}
                  <div className="space-y-3">
                    <Label className="text-white">Recent Streams</Label>
                    <div className="space-y-2">
                      {recentStreams.map((stream, index) => (
                        <motion.button
                          key={stream.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-left group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-16 h-16 rounded-xl overflow-hidden bg-gradient-to-br from-purple-500 to-pink-500 flex-shrink-0">
                              <img src={stream.thumbnail} alt={stream.title} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <span className="text-white group-hover:text-purple-400 transition-colors block truncate mb-1">
                                {stream.title}
                              </span>
                              <div className="flex items-center gap-3">
                                <Badge className="bg-purple-600/20 text-purple-400 border-purple-500/30 text-xs">
                                  {stream.game}
                                </Badge>
                                <div className="flex items-center gap-1 text-xs text-gray-400">
                                  <Clock className="w-3 h-3" />
                                  <span>{stream.duration}</span>
                                </div>
                              </div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors flex-shrink-0" />
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </motion.div>
          )}

          {/* Step 2: Edit */}
          {currentStep === "edit" && (
            <motion.div
              key="edit"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {/* Video Preview */}
              <div className="aspect-[9/16] max-h-96 mx-auto bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-3xl border-2 border-white/10 flex items-center justify-center">
                <div className="text-center">
                  <Video className="w-16 h-16 text-white/40 mx-auto mb-3" />
                  <p className="text-white/60">Video Preview</p>
                  <p className="text-sm text-white/40 mt-1">{selectedFile?.name}</p>
                </div>
              </div>

              {/* Auto-convert toggle */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10">
                <div className="space-y-1">
                  <Label className="text-white">Auto-convert to 9:16</Label>
                  <p className="text-sm text-gray-400">
                    Automatically crop to vertical format
                  </p>
                </div>
                <Switch checked={autoConvert} onCheckedChange={setAutoConvert} />
              </div>

              {/* Trim Controls */}
              <div className="space-y-4">
                <Label className="text-white flex items-center gap-2">
                  <Scissors className="w-5 h-5 text-purple-400" />
                  Trim Clip
                </Label>
                <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">Start</span>
                      <span className="text-white px-3 py-1 bg-white/10 rounded-lg">{trimStart}s</span>
                    </div>
                    <Slider
                      value={[trimStart]}
                      onValueChange={(value) => setTrimStart(value[0])}
                      max={60}
                      step={1}
                      className="w-full"
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">End</span>
                      <span className="text-white px-3 py-1 bg-white/10 rounded-lg">{trimEnd}s</span>
                    </div>
                    <Slider
                      value={[trimEnd]}
                      onValueChange={(value) => setTrimEnd(value[0])}
                      max={60}
                      step={1}
                      className="w-full"
                    />
                  </div>

                  <div className="pt-3 border-t border-white/10 text-center">
                    <p className="text-purple-400">
                      Duration: <span className="text-white">{trimEnd - trimStart} seconds</span>
                    </p>
                  </div>
                </div>
              </div>

              <Button
                onClick={() => setCurrentStep("details")}
                className="w-full h-14 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-lg"
              >
                Continue
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </motion.div>
          )}

          {/* Step 3: Details */}
          {currentStep === "details" && (
            <motion.div
              key="details"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {/* Game Category */}
              <div className="space-y-3">
                <Label className="text-white">Game Category</Label>
                <div className="grid grid-cols-2 gap-2">
                  {games.map((game, index) => (
                    <motion.button
                      key={game}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.03 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedGame(game)}
                      className={`p-4 rounded-2xl border-2 transition-all ${
                        selectedGame === game
                          ? "border-purple-500 bg-gradient-to-r from-purple-600/20 to-pink-600/20 text-white"
                          : "border-white/10 bg-white/5 hover:bg-white/10 text-gray-400"
                      }`}
                    >
                      <span className="block truncate">{game}</span>
                      {selectedGame === game && (
                        <Check className="w-4 h-4 inline ml-2 text-purple-400" />
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Caption */}
              <div className="space-y-3">
                <Label htmlFor="caption" className="text-white">Caption</Label>
                <Textarea
                  id="caption"
                  placeholder="Describe your epic moment..."
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  rows={4}
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:bg-white/10 focus:border-purple-500/50 rounded-2xl resize-none"
                />
                <p className="text-xs text-gray-400">{caption.length}/150 characters</p>
              </div>

              {/* Hashtags */}
              <div className="space-y-3">
                <Label htmlFor="hashtags" className="text-white">Hashtags</Label>
                <Input
                  id="hashtags"
                  placeholder="Add hashtags..."
                  value={hashtags}
                  onChange={(e) => setHashtags(e.target.value)}
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:bg-white/10 focus:border-purple-500/50 rounded-2xl h-12"
                />
                
                {/* Suggested Hashtags */}
                <div className="flex flex-wrap gap-2">
                  <span className="text-sm text-gray-400">Suggested:</span>
                  {suggestedHashtags.map((tag) => (
                    <motion.button
                      key={tag}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => addHashtag(tag)}
                      className="px-3 py-1.5 rounded-full bg-white/5 hover:bg-purple-600/20 border border-white/10 hover:border-purple-500/50 text-sm text-gray-400 hover:text-purple-400 transition-all"
                    >
                      #{tag}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 sticky bottom-4 z-10">
                <Button 
                  onClick={() => setCurrentStep("edit")}
                  variant="outline" 
                  className="flex-1 h-14 rounded-2xl bg-white/5 hover:bg-white/10 text-white border-white/20"
                >
                  Back
                </Button>
                <Button 
                  onClick={handlePublish} 
                  className="flex-1 h-14 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-lg"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Publish
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
