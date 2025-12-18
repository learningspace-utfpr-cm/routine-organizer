import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { formatDuration } from "@/lib/formatDuration";

type DayRoutineStats = {
  rotinaId: string;
  dateOfRealization: string | null;
  concluded: boolean;
  totalTimeSeconds: number;
  neededHelp: boolean;
};

interface DayRoutineStatsCardProps {
  dayRoutine: DayRoutineStats | null;
  studentName?: string | null;
}

const formatDate = (date: string | null) => {
  if (!date) return "Sem data definida";
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium" }).format(
    new Date(date)
  );
};

const DayRoutineStatsCard = ({
  dayRoutine,
  studentName,
}: DayRoutineStatsCardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
          <CardTitle className="text-lg sm:text-xl">Rotina de hoje</CardTitle>
          <CardDescription>
            Acompanhamento diário do aluno {studentName || "sem nome"}
          </CardDescription>
        </div>
        {dayRoutine && (
          <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
              dayRoutine.concluded
                ? "bg-emerald-50 text-emerald-700"
                : "bg-amber-50 text-amber-700"
            }`}
          >
            {dayRoutine.concluded ? "Concluída" : "Em andamento"}
          </span>
        )}
      </CardHeader>
      <CardContent>
        {!dayRoutine ? (
          <p className="text-sm text-muted-foreground">
            Nenhuma rotina registrada para hoje.
          </p>
        ) : (
          <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg border bg-background p-4">
              <dt className="text-xs font-semibold text-muted-foreground">
                Data
              </dt>
              <dd className="text-base font-medium">
                {formatDate(dayRoutine.dateOfRealization)}
              </dd>
            </div>
            <div className="rounded-lg border bg-background p-4">
              <dt className="text-xs font-semibold text-muted-foreground">
                Tempo total
              </dt>
              <dd className="text-base font-medium">
                {formatDuration(dayRoutine.totalTimeSeconds)}
              </dd>
            </div>
          </dl>
        )}
      </CardContent>
    </Card>
  );
};

export default DayRoutineStatsCard;
