import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GamepadIcon, Clock, User, Bot, Eye } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { uz } from "date-fns/locale";

interface ActiveGame {
  id: string;
  playerName: string;
  playerScore: number;
  botScore: number;
  currentWord: string;
  nextLetter: string;
  startTime: Date;
  totalWords: number;
  chatId: number;
}

interface ActiveGamesCardProps {
  games: ActiveGame[];
}

const ActiveGamesCard = ({ games }: ActiveGamesCardProps) => {
  const handleViewGame = (gameId: string) => {
    console.log(`Viewing game: ${gameId}`);
    // In real app, this would open game details
  };

  return (
    <Card className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-telegram/5" />
      <CardHeader className="relative">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GamepadIcon className="w-5 h-5 text-primary" />
            Faol O'yinlar
          </div>
          <Badge variant="secondary">{games.length} ta o'yin</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="relative">
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {games.map((game) => (
            <div 
              key={game.id}
              className="p-4 rounded-lg border bg-card/50 hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-primary" />
                  <span className="font-medium">{game.playerName}</span>
                </div>
                <Badge variant="outline" className="text-xs">
                  ID: {game.chatId}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-3">
                <div className="text-center p-2 rounded bg-primary/10">
                  <p className="text-sm text-muted-foreground">O'yinchi</p>
                  <p className="text-lg font-bold text-primary">{game.playerScore}</p>
                </div>
                <div className="text-center p-2 rounded bg-telegram/10">
                  <p className="text-sm text-muted-foreground">Bot</p>
                  <p className="text-lg font-bold text-telegram">{game.botScore}</p>
                </div>
              </div>

              <div className="space-y-2 mb-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Joriy so'z:</span>
                  <span className="font-semibold">"{game.currentWord}"</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Keyingi harf:</span>
                  <Badge variant="secondary">{game.nextLetter.toUpperCase()}</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Jami so'zlar:</span>
                  <span>{game.totalWords}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  {formatDistanceToNow(game.startTime, { 
                    addSuffix: true, 
                    locale: uz 
                  })}
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleViewGame(game.id)}
                >
                  <Eye className="w-3 h-3 mr-1" />
                  Ko'rish
                </Button>
              </div>
            </div>
          ))}
          
          {games.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <GamepadIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>Hozirda faol o'yinlar yo'q</p>
              <p className="text-sm">Foydalanuvchilar o'yin boshlaganda bu yerda ko'rinadi</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ActiveGamesCard;