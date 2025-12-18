import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuSubContent,
} from "@radix-ui/react-dropdown-menu";
import { Button } from "./ui/button";
import { MoreHorizontalIcon } from "lucide-react";
import Link from "next/link";

interface StudentDropDownProps {
  studentId?: string;
}

const StudentDropDown = ({ studentId }: StudentDropDownProps) => {
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" aria-label="Open menu" size="icon-sm">
            <MoreHorizontalIcon />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuPortal>
          <DropdownMenuContent
            align="end"
            sideOffset={8}
            className="z-50 w-40 rounded-md border bg-popover text-popover-foreground shadow-md animate-in data-[side=bottom]:slide-in-from-top-2"
          >
            <DropdownMenuGroup>
              <Link href={`/dashboard/professor/${studentId}/rotina`}>
                <DropdownMenuItem className="flex cursor-pointer select-none items-center rounded-md px-2 py-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground">
                  Ver rotinas
                </DropdownMenuItem>
              </Link>
              <Link href={`/dashboard/professor/${studentId}/estatisticas`}>
                <DropdownMenuItem className="flex cursor-pointer select-none items-center rounded-md px-2 py-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground">
                  Ver estatísticas
                </DropdownMenuItem>
              </Link>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenuPortal>
      </DropdownMenu>
    </>
  );
};

export default StudentDropDown;
