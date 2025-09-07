import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Trophy, Target, Clock, Award } from "lucide-react";

interface GameStatsCardProps {
  totalGames: number;
  wonGames: number;
  lostGames: number;
  averageGameTime: string;
  longestChain: number;
}

export const GameStatsCard = ({ 
  totalGames, 
  wonGames, 
  lostGames, 
  averageGameTime,
  longestChain 
}: GameStatsCardProps) => {
  const winRate = totalGames > 0 ? (wonGames / totalGames) * 100 : 0;

  return (
    <Card className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-success/5 via-transparent to-warning/5" />
      <CardHeader className="relative">
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-warning" />
          O'yin Statistikasi
        </CardTitle>
      </CardHeader>
      <CardContent className="relative space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 rounded-lg bg-success/10">
            <Trophy className="w-6 h-6 text-success mx-auto mb-2" />
            <p className="text-2xl font-bold text-success">{wonGames}</p>
            <p className="text-sm text-muted-foreground">G'alabalar</p>
          </div>
          <div className="text-center p-4 rounded-lg bg-destructive/10">
            <Target className="w-6 h-6 text-destructive mx-auto mb-2" />
            <p className="text-2xl font-bold text-destructive">{lostGames}</p>
            <p className="text-sm text-muted-foreground">Mag'lubiyatlar</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>G'alaba foizi</span>
            <span className="font-medium">{winRate.toFixed(1)}%</span>
          </div>
          <Progress value={winRate} className="h-2" />
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">O'rtacha vaqt</p>
              <p className="font-semibold">{averageGameTime}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Eng uzun zanjir</p>
              <p className="font-semibold">{longestChain} so'z</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};