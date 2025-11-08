import { User } from "@prisma/client";
import { Card } from "./ui/card";

interface StudentCardProps {
  student: Partial<User>;
}

const StudentCard = ({ student }: StudentCardProps) => {
  return (
    <Card className="flex flex-col p-4 mb-4 w-64 h-32">
      <h2
        className="text-lg font-bold truncate mb-2"
        title={student.name || ""}
      >
        {student.name || "Sem nome"}
      </h2>
      <p className="text-sm text-gray-600 truncate" title={student.email || ""}>
        {student.email}
      </p>
    </Card>
  );
};

export default StudentCard;
