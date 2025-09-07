import { BotStatusCard } from "@/components/BotStatusCard";
import { GameStatsCard } from "@/components/GameStatsCard";
import { LeaderboardCard } from "@/components/LeaderboardCard";
import ActiveGamesCard from "@/components/ActiveGamesCard";
import WordsManagement from "@/components/WordsManagement";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TelegramIcon } from "@/components/TelegramIcon";
import { Settings, RefreshCw, ExternalLink, BarChart3, BookOpen, GamepadIcon } from "lucide-react";
import { useState } from "react";

const Dashboard = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Mock data - in real implementation, this would come from Supabase
  const mockPlayers = [
    { id: 1, name: "Ali Karimov", wins: 45, gamesPlayed: 60, winRate: 75 },
    { id: 2, name: "Malika Saidova", wins: 38, gamesPlayed: 52, winRate: 73.1 },
    { id: 3, name: "Bobur Rahimov", wins: 29, gamesPlayed: 42, winRate: 69.0 },
    { id: 4, name: "Nodira Tosheva", wins: 25, gamesPlayed: 38, winRate: 65.8 },
    { id: 5, name: "Sardor Alimov", wins: 22, gamesPlayed: 35, winRate: 62.9 },
  ];

  const mockActiveGames = [
    {
      id: '1',
      playerName: 'Ali Karimov',
      playerScore: 8,
      botScore: 6,
      currentWord: 'kitob',
      nextLetter: 'b',
      startTime: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
      totalWords: 14,
      chatId: 123456789
    },
    {
      id: '2', 
      playerName: 'Malika Saidova',
      playerScore: 12,
      botScore: 10,
      currentWord: 'oshxona',
      nextLetter: 'a',
      startTime: new Date(Date.now() - 12 * 60 * 1000), // 12 minutes ago
      totalWords: 22,
      chatId: 987654321
    },
    {
      id: '3',
      playerName: 'Bobur Rahimov', 
      playerScore: 3,
      botScore: 2,
      currentWord: 'holat',
      nextLetter: 't',
      startTime: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
      totalWords: 5,
      chatId: 456789123
    }
  ];

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-primary/5">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-telegram text-white">
                <TelegramIcon className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-telegram to-primary-glow bg-clip-text text-transparent">
                  So'z O'yini Bot
                </h1>
                <p className="text-sm text-muted-foreground">Telegram Bot Boshqaruv Paneli</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="transition-all duration-300"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                Yangilash
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Sozlamalar
              </Button>
              <Button size="sm" className="bg-gradient-to-r from-telegram to-telegram-dark hover:from-telegram-dark hover:to-telegram">
                <ExternalLink className="w-4 h-4 mr-2" />
                Telegram'da ochish
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:grid-cols-3">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="games" className="flex items-center gap-2">
              <GamepadIcon className="w-4 h-4" />
              Faol O'yinlar
            </TabsTrigger>
            <TabsTrigger value="words" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              So'zlar Bazasi
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Bot Status - Full width on mobile, spans 2 columns on desktop */}
              <div className="lg:col-span-2">
                <BotStatusCard 
                  isOnline={true}
                  activeGames={mockActiveGames.length}
                  totalUsers={156}
                />
              </div>

              {/* Quick Actions */}
              <div className="space-y-4">
                <div className="p-4 rounded-lg border bg-card">
                  <h3 className="font-semibold mb-3">Tezkor Harakatlar</h3>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      <Settings className="w-4 h-4 mr-2" />
                      Bot sozlamalari
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      So'zlar bazasini yangilash
                    </Button>
                  </div>
                </div>
              </div>

              {/* Game Statistics */}
              <div className="lg:col-span-2">
                <GameStatsCard 
                  totalGames={127}
                  wonGames={78}
                  lostGames={49}
                  averageGameTime="4:32"
                  longestChain={23}
                />
              </div>

              {/* Leaderboard */}
              <div>
                <LeaderboardCard players={mockPlayers} />
              </div>
            </div>

            {/* Recent Activity */}
            <div className="mt-8">
              <div className="rounded-lg border bg-card p-6">
                <h3 className="text-lg font-semibold mb-4">So'nggi Faollik</h3>
                <div className="space-y-3">
                  {[
                    { user: "Ali Karimov", action: "yangi o'yin boshladi", time: "2 daqiqa oldin", type: "game" },
                    { user: "Malika Saidova", action: "o'yinni tugatdi (g'alaba)", time: "5 daqiqa oldin", type: "win" },
                    { user: "Bobur Rahimov", action: "bot bilan o'yin o'ynadi", time: "8 daqiqa oldin", type: "game" },
                    { user: "Nodira Tosheva", action: "reytingga qo'shildi", time: "12 daqiqa oldin", type: "join" },
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-accent/30">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${
                          activity.type === 'win' ? 'bg-success' : 
                          activity.type === 'game' ? 'bg-primary' : 'bg-muted-foreground'
                        }`} />
                        <span className="font-medium">{activity.user}</span>
                        <span className="text-muted-foreground">{activity.action}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="games">
            <ActiveGamesCard games={mockActiveGames} />
          </TabsContent>

          <TabsContent value="words">
            <WordsManagement />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;