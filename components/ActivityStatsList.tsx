import ActivityStatCard, { ActivityStat } from "./ActivityStatCard";

interface ActivityStatsListProps {
  activityStats: ActivityStat[];
}

const ActivityStatsList = ({ activityStats }: ActivityStatsListProps) => {
  if (activityStats.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Nenhuma atividade concluída pelo aluno ainda.
      </p>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {activityStats.map((stat) => (
        <ActivityStatCard key={stat.atividadeId} stat={stat} />
      ))}
    </div>
  );
};

export default ActivityStatsList;
