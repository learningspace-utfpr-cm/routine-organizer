"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import DayRoutineStatsCard from "@/components/DayRoutineStatsCard";
import ActivityStatsList from "@/components/ActivityStatsList";
import StudentStatsSkeleton from "@/components/StudentStatsSkeleton";
import ForbiddenPage from "@/components/ForbiddenPage";
import { ActivityStat } from "@/components/ActivityStatCard";

type DayRoutineStats = {
  rotinaId: string;
  dateOfRealization: string | null;
  concluded: boolean;
  totalTimeSeconds: number;
  neededHelp: boolean;
};

type StudentStatsResponse = {
  student: { id: string; name: string | null };
  dayRoutine: DayRoutineStats | null;
  activityStats: ActivityStat[];
};

const StudentStatisticsPage = () => {
  const params = useParams();
  const slugParam = params?.slug;
  const studentId = Array.isArray(slugParam) ? slugParam[0] : slugParam;

  const [dayRoutine, setDayRoutine] = useState<DayRoutineStats | null>(null);
  const [activityStats, setActivityStats] = useState<ActivityStat[]>([]);
  const [studentName, setStudentName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isForbidden, setIsForbidden] = useState(false);

  const fetchStats = useCallback(async () => {
    if (!studentId) {
      setError("Aluno inválido");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`/api/students/${studentId}/stats`);

      if (res.status === 403) {
        setIsForbidden(true);
        setLoading(false);
        return;
      }

      if (!res.ok) {
        const message = await res.text();
        throw new Error(message || "Falha ao carregar estatísticas");
      }

      const data = (await res.json()) as StudentStatsResponse;
      setDayRoutine(data.dayRoutine);
      setActivityStats(data.activityStats ?? []);
      setStudentName(data.student?.name ?? null);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Falha ao carregar estatísticas";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [studentId]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const formattedStudentName = useMemo(
    () => studentName || "Aluno",
    [studentName]
  );

  if (isForbidden) {
    return (
      <ForbiddenPage
        title="403 - Acesso Proibido"
        message="Você não tem as permissões necessárias para acessar este recurso."
        backUrl="/dashboard/professor"
        showHomeButton={false}
      />
    );
  }

  if (error) {
    return <div className="text-red-500 font-medium">Erro: {error}</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold">Estatísticas do aluno</h1>
        <p className="text-sm text-muted-foreground">
          Monitoramento de {formattedStudentName}
        </p>
      </div>

      {loading ? (
        <StudentStatsSkeleton />
      ) : (
        <>
          <DayRoutineStatsCard
            dayRoutine={dayRoutine}
            studentName={formattedStudentName}
          />

          <section className="space-y-3">
            <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-xl font-semibold">
                  Visão geral por atividade
                </h2>
                <p className="text-sm text-muted-foreground">
                  Desempenho acumulado em cada atividade atribuída.
                </p>
              </div>
              <span className="text-xs text-muted-foreground">
                Atualizado automaticamente
              </span>
            </div>
            <ActivityStatsList activityStats={activityStats} />
          </section>
        </>
      )}
    </div>
  );
};

export default StudentStatisticsPage;
