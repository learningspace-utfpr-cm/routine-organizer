import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { Role } from "@prisma/client";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== Role.TEACHER) {
      return new NextResponse("Acesso não autorizado", { status: 403 }); // 403 Forbidden
    }

    const students = await prisma.user.findMany({
      where: {
        role: Role.STUDENT,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(students, { status: 200 });
  } catch (error) {
    console.error("ERRO AO BUSCAR ALUNOS:", error);
    return new NextResponse("Erro interno do servidor", { status: 500 });
  }
}
