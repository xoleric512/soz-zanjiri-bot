import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Crown, Medal, Award, User } from "lucide-react";

interface Player {
  id: number;
  name: string;
  wins: number;
  gamesPlayed: number;
  winRate: number;
}

interface LeaderboardCardProps {
  players: Player[];
}

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return <Crown className="w-4 h-4 text-warning" />;
    case 2:
      return <Medal className="w-4 h-4 text-muted-foreground" />;
    case 3:
      return <Award className="w-4 h-4 text-orange-500" />;
    default:
      return <User className="w-4 h-4 text-muted-foreground" />;
  }
};

export const LeaderboardCard = ({ players }: LeaderboardCardProps) => {
  return (
    <Card className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-warning/5 via-transparent to-success/5" />
      <CardHeader className="relative">
        <CardTitle className="flex items-center gap-2">
          <Crown className="w-5 h-5 text-warning" />
          Reyting Jadvali
        </CardTitle>
      </CardHeader>
      <CardContent className="relative">
        <div className="space-y-3">
          {players.map((player, index) => (
            <div 
              key={player.id}
              className="flex items-center justify-between p-3 rounded-lg bg-card hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  {getRankIcon(index + 1)}
                  <span className="font-semibold text-sm">#{index + 1}</span>
                </div>
                <div>
                  <p className="font-medium">{player.name}</p>
                  <p className="text-sm text-muted-foreground">{player.gamesPlayed} o'yin</p>
                </div>
              </div>
              <div className="text-right">
                <Badge variant="secondary" className="mb-1">
                  {player.wins} g'alaba
                </Badge>
                <p className="text-sm text-muted-foreground">
                  {player.winRate.toFixed(1)}% g'alaba
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};