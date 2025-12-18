import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { Role } from "@prisma/client";
import { buildObjectUrl } from "@/lib/minio";

function getTodayRange() {
  const start = new Date();
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(end.getDate() + 1);

  return { start, end };
}

function normalizeImageUrl(url: string) {
  const hasAbsoluteUrl = /^https?:\/\//i.test(url);
  return hasAbsoluteUrl ? url : buildObjectUrl(url);
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ studentId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== Role.TEACHER) {
      return new NextResponse("Acesso não autorizado", { status: 403 });
    }

    const { studentId } = await params;

    if (!studentId) {
      return new NextResponse("studentId é obrigatório", { status: 400 });
    }

    const student = await prisma.user.findUnique({
      where: { id: studentId, role: Role.STUDENT },
      select: { id: true, name: true },
    });

    if (!student) {
      return new NextResponse("Aluno não encontrado", { status: 404 });
    }

    const link = await prisma.teacherStudentLink.findUnique({
      where: {
        teacherId_studentId: {
          teacherId: session.user.id,
          studentId,
        },
      },
    });

    if (!link) {
      return new NextResponse("Aluno não vinculado a este professor", {
        status: 404,
      });
    }

    const { start, end } = getTodayRange();

    const todaysRoutine = await prisma.rotina.findFirst({
      where: {
        studentId,
        creatorId: session.user.id,
        dateOfRealization: {
          gte: start,
          lt: end,
        },
      },
      select: {
        id: true,
        dateOfRealization: true,
        status: true,
        atividades: {
          select: {
            id: true,
          },
        },
      },
    });

    let dayTotalTimeSeconds = 0;
    let dayNeededHelp = false;

    if (todaysRoutine && todaysRoutine.atividades.length > 0) {
      const registrosDoDia = await prisma.registroDesempenho.findMany({
        where: {
          studentId,
          atividadeId: {
            in: todaysRoutine.atividades.map((a) => a.id),
          },
          completedAt: {
            gte: start,
            lt: end,
          },
        },
        select: {
          status: true,
          timeTakenSeconds: true,
        },
      });

      dayTotalTimeSeconds = registrosDoDia.reduce(
        (total, registro) => total + (registro.timeTakenSeconds ?? 0),
        0
      );

      dayNeededHelp = registrosDoDia.some(
        (registro) => registro.status !== "COMPLETED"
      );
    }

    const registros = await prisma.registroDesempenho.findMany({
      where: {
        studentId,
        atividade: {
          creatorId: session.user.id,
        },
      },
      orderBy: { completedAt: "desc" },
      select: {
        status: true,
        timeTakenSeconds: true,
        atividade: {
          select: {
            id: true,
            title: true,
            imageUrl: true,
          },
        },
      },
    });

    const statsMap = new Map<
      string,
      {
        atividadeId: string;
        title: string;
        imageUrl: string;
        totalCompleted: number;
        durations: number[];
        completionStreak: number;
        streakSettled: boolean;
      }
    >();

    registros.forEach((registro) => {
      const { id, title, imageUrl } = registro.atividade;

      if (!statsMap.has(id)) {
        statsMap.set(id, {
          atividadeId: id,
          title,
          imageUrl: normalizeImageUrl(imageUrl),
          totalCompleted: 0,
          durations: [],
          completionStreak: 0,
          streakSettled: false,
        });
      }

      const entry = statsMap.get(id)!;

      if (registro.status === "COMPLETED") {
        entry.totalCompleted += 1;
        if (
          typeof registro.timeTakenSeconds === "number" &&
          Number.isFinite(registro.timeTakenSeconds)
        ) {
          entry.durations.push(registro.timeTakenSeconds);
        }
        if (!entry.streakSettled) {
          entry.completionStreak += 1;
        }
      } else if (!entry.streakSettled) {
        entry.streakSettled = true;
      }
    });

    const activityStats = Array.from(statsMap.values()).map((entry) => ({
      atividadeId: entry.atividadeId,
      title: entry.title,
      imageUrl: entry.imageUrl,
      totalCompleted: entry.totalCompleted,
      completionStreak: entry.completionStreak,
      averageTimeSeconds:
        entry.durations.length > 0
          ? Math.round(
              entry.durations.reduce((acc, curr) => acc + curr, 0) /
                entry.durations.length
            )
          : null,
    }));

    activityStats.sort((a, b) => b.totalCompleted - a.totalCompleted);

    return NextResponse.json(
      {
        student,
        dayRoutine: todaysRoutine
          ? {
              rotinaId: todaysRoutine.id,
              dateOfRealization: todaysRoutine.dateOfRealization,
              concluded: todaysRoutine.status === "COMPLETED",
              totalTimeSeconds: dayTotalTimeSeconds,
              neededHelp: dayNeededHelp,
            }
          : null,
        activityStats,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("ERRO AO BUSCAR ESTATÍSTICAS DO ALUNO:", error);
    return new NextResponse("Erro interno do servidor", { status: 500 });
  }
}
