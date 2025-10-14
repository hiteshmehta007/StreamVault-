import { useState } from "react";
import { Video, Compass, PlusCircle, User } from "lucide-react";
import { ReelsFeed } from "./components/ReelsFeed";
import { CreateReel } from "./components/CreateReel";
import { ExplorePage } from "./components/ExplorePage";
import { ProfilePage } from "./components/ProfilePage";
import { mockReels } from "./data/mockData";
import { Toaster } from "./components/ui/sonner";

type TabType = "feed" | "explore" | "create" | "profile";

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>("feed");

  const tabs = [
    { id: "feed" as TabType, icon: Video, label: "Clips" },
    { id: "explore" as TabType, icon: Compass, label: "Explore" },
    { id: "create" as TabType, icon: PlusCircle, label: "Create" },
    { id: "profile" as TabType, icon: User, label: "Profile" },
  ];

  return (
    <div className="size-full flex items-center justify-center bg-gradient-to-br from-gray-950 via-black to-gray-950">
      {/* 9:16 Aspect Ratio Container */}
      <div className="w-full h-full md:h-screen md:w-auto md:aspect-[9/16] flex flex-col bg-black md:shadow-2xl md:overflow-hidden md:rounded-3xl md:border md:border-white/10">
        {/* Main Content */}
        <div className="flex-1 overflow-hidden relative">
          {activeTab === "feed" && (
            <div className="w-full h-full">
              <ReelsFeed reels={mockReels} />
            </div>
          )}
          {activeTab === "explore" && <ExplorePage />}
          {activeTab === "create" && <CreateReel />}
          {activeTab === "profile" && <ProfilePage />}
        </div>

        {/* Bottom Navigation */}
        <nav className="bg-black/95 backdrop-blur-xl border-t border-white/5 shadow-2xl">
          <div className="flex items-center justify-around h-20 px-4 relative">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="flex flex-col items-center justify-center gap-1.5 flex-1 group relative py-2 touch-manipulation"
                >
                  {/* Active Indicator */}
                  {isActive && (
                    <div className="absolute -top-px left-1/2 -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 rounded-full" />
                  )}
                  
                  {/* Icon Container */}
                  <div className={`relative transition-all duration-300 ${
                    isActive ? "scale-110" : "scale-100 group-hover:scale-105 group-active:scale-95"
                  }`}>
                    {isActive && tab.id === "create" ? (
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-lg shadow-purple-500/50">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                    ) : (
                      <>
                        <Icon
                          className={`w-7 h-7 transition-all duration-300 ${
                            isActive
                              ? "text-white"
                              : "text-gray-500 group-hover:text-gray-300"
                          }`}
                          fill={isActive && tab.id === "feed" ? "currentColor" : "none"}
                        />
                        {isActive && tab.id !== "create" && (
                          <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 opacity-20 blur-xl rounded-full" />
                        )}
                      </>
                    )}
                  </div>
                  
                  {/* Label */}
                  <span className={`text-xs transition-all duration-300 ${
                    isActive
                      ? "text-white opacity-100"
                      : "text-gray-500 opacity-80 group-hover:text-gray-300 group-hover:opacity-100"
                  }`}>
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>
        </nav>

        <Toaster 
          position="top-center"
          toastOptions={{
            style: {
              background: 'rgba(0, 0, 0, 0.8)',
              color: '#fff',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
            },
          }}
        />
      </div>
    </div>
  );
}
