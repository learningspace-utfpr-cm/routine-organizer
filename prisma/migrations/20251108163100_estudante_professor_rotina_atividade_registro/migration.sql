-- CreateEnum
CREATE TYPE "roles" AS ENUM ('student', 'teacher');

-- CreateEnum
CREATE TYPE "feedback_sound_types" AS ENUM ('SUCCESS', 'NEUTRAL_TONE', 'ALERT_BUZZ');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "role" "roles" NOT NULL,
    "password_hash" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teacher_student_links" (
    "teacher_id" TEXT NOT NULL,
    "student_id" TEXT NOT NULL,

    CONSTRAINT "teacher_student_links_pkey" PRIMARY KEY ("teacher_id","student_id")
);

-- CreateTable
CREATE TABLE "rotinas" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "creator_id" TEXT NOT NULL,
    "student_id" TEXT NOT NULL,

    CONSTRAINT "rotinas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "atividades" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "duration_in_seconds" INTEGER,
    "feedback_sound_type" "feedback_sound_types",
    "rotinaId" TEXT NOT NULL,

    CONSTRAINT "atividades_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "registro_desempenho" (
    "id" TEXT NOT NULL,
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "time_taken_seconds" INTEGER,
    "status" TEXT NOT NULL,
    "student_id" TEXT NOT NULL,
    "atividade_id" TEXT NOT NULL,

    CONSTRAINT "registro_desempenho_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "teacher_student_links" ADD CONSTRAINT "teacher_student_links_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teacher_student_links" ADD CONSTRAINT "teacher_student_links_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rotinas" ADD CONSTRAINT "rotinas_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rotinas" ADD CONSTRAINT "rotinas_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "atividades" ADD CONSTRAINT "atividades_rotinaId_fkey" FOREIGN KEY ("rotinaId") REFERENCES "rotinas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registro_desempenho" ADD CONSTRAINT "registro_desempenho_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registro_desempenho" ADD CONSTRAINT "registro_desempenho_atividade_id_fkey" FOREIGN KEY ("atividade_id") REFERENCES "atividades"("id") ON DELETE CASCADE ON UPDATE CASCADE;
