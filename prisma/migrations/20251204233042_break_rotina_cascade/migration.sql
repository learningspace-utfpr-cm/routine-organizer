-- DropForeignKey
ALTER TABLE "atividades" DROP CONSTRAINT "atividades_rotina_id_fkey";

-- AddForeignKey
ALTER TABLE "atividades" ADD CONSTRAINT "atividades_rotina_id_fkey" FOREIGN KEY ("rotina_id") REFERENCES "rotinas"("id") ON DELETE SET NULL ON UPDATE CASCADE;
