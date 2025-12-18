import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { formatDuration } from "@/lib/formatDuration";

export type ActivityStat = {
  atividadeId: string;
  title: string;
  imageUrl: string;
  totalCompleted: number;
  completionStreak: number;
  averageTimeSeconds: number | null;
};

interface ActivityStatCardProps {
  stat: ActivityStat;
}

const ActivityStatCard = ({ stat }: ActivityStatCardProps) => {
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-start justify-between gap-2">
        <div className="space-y-1">
          <CardTitle className="text-base sm:text-lg">{stat.title}</CardTitle>
        </div>
        <div className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          {stat.totalCompleted} concluída{stat.totalCompleted === 1 ? "" : "s"}
        </div>
      </CardHeader>
      <CardContent className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border bg-background p-3">
          <p className="text-xs font-semibold text-muted-foreground">
            Sequência de conclusões
          </p>
          <p className="text-base font-semibold">
            {stat.completionStreak} dia{stat.completionStreak === 1 ? "" : "s"}
          </p>
        </div>
        <div className="rounded-lg border bg-background p-3">
          <p className="text-xs font-semibold text-muted-foreground">
            Tempo médio
          </p>
          <p className="text-base font-semibold">
            {stat.averageTimeSeconds !== null
              ? formatDuration(stat.averageTimeSeconds)
              : "Sem dados"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityStatCard;
