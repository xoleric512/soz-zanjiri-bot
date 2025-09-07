import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TelegramIcon } from "./TelegramIcon";
import { Activity, Users, Zap } from "lucide-react";

interface BotStatusCardProps {
  isOnline: boolean;
  activeGames: number;
  totalUsers: number;
}

export const BotStatusCard = ({ isOnline, activeGames, totalUsers }: BotStatusCardProps) => {
  return (
    <Card className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary-glow/5" />
      <CardHeader className="relative">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <TelegramIcon className="w-5 h-5 text-telegram" />
            Bot Holati
          </CardTitle>
          <Badge variant={isOnline ? "default" : "destructive"} className="animate-pulse">
            {isOnline ? "Faol" : "Faol emas"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="relative space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-success/10">
              <Activity className="w-4 h-4 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Faol o'yinlar</p>
              <p className="text-2xl font-bold">{activeGames}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-telegram/10">
              <Users className="w-4 h-4 text-telegram" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Jami foydalanuvchi</p>
              <p className="text-2xl font-bold">{totalUsers}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 p-3 rounded-lg bg-accent/50">
          <Zap className="w-4 h-4 text-warning" />
          <span className="text-sm">Bot 24/7 ishlaydi va o'yinlarni boshqaradi</span>
        </div>
      </CardContent>
    </Card>
  );
};