import { Card } from "@/components/ui/card";
import { VirtualCard } from "../app/(private)/dashboard/professor/cartoes-virtuais/types/VirtualCardTypes";
import { Clock } from "lucide-react";

interface VirtualCardCardProps {
  card: VirtualCard;
}

const VirtualCardCard = ({ card }: VirtualCardCardProps) => {
  return (
    <Card className="p-5 h-full flex flex-col gap-3">
      <div className="text-xs text-gray-500">
        <p className="uppercase tracking-wide">Criado por</p>
        <p className="text-sm font-semibold text-gray-800">
          {card.creator.name || "Sem nome"}
        </p>
      </div>

      <div>
        <h2 className="text-lg font-bold text-gray-900">{card.title}</h2>
        {card.imageUrl && (
          <div className="mt-3 rounded-lg overflow-hidden border bg-gray-50">
            <img
              src={card.imageUrl}
              alt={card.title}
              className="h-40 w-full object-cover"
            />
          </div>
        )}
      </div>

      {card.estimatedTime !== null && card.estimatedTime > 0 && (
        <div className="flex flex-wrap gap-2">
          <span className="px-3 py-1 rounded-md flex items-center gap-1">
            {Array.from({ length: card.estimatedTime }).map((_, index) => (
              <Clock key={index} className="h-5 w-5" />
            ))}
            <span className="sr-only">
              Tempo estimado: {card.estimatedTime} unidades
            </span>
          </span>
        </div>
      )}
    </Card>
  );
};

export default VirtualCardCard;
