import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";

interface DetailButtonProps {
  id: number;
  onDelete: (id: number) => void;
}

export default function DetailButton({ id, onDelete }: DetailButtonProps) {
  const handleDelete = async () => {
    try {
      if (!confirm("削除しますか?")) {
        return;
      }

      const response = await fetch(`/api/opgg-summoner/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("削除に失敗しました");
      }

      onDelete(id);
    } catch (error) {
      console.error("削除中にエラーが発生しました:", error);
    }
  };

  return (
    <div className="absolute top-2 right-2">
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger className="p-2 rounded-full hover:bg-gray-800 transition">
          <MoreVertical className="w-5 h-5 text-white" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-gray-900 text-white">
          <DropdownMenuItem onClick={handleDelete}>削除</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
