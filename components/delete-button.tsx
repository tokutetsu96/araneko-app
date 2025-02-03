"use client";

import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

type DeleteButtonProps = {
  id: number;
  onDelete: (id: number) => void;
};

export default function DeleteButton({ id, onDelete }: DeleteButtonProps) {
  const [openConfirm, setOpenConfirm] = useState(false); // 削除確認ダイアログ

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/opgg-summoner/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        return toast({
          title: "削除に失敗しました。",
          description: "サモナー情報の削除に失敗しました。",
          variant: "destructive",
        });
      }

      onDelete(id);
      return toast({
        title: "削除に成功しました。",
        description: "サモナー情報を削除しました。",
      });
    } catch (error) {
      console.error("削除中にエラーが発生しました:", error);
    }
  };

  return (
    <div className="absolute top-2 right-2">
      {/* 削除ボタン（ゴミ箱アイコン） */}
      <button
        onClick={() => setOpenConfirm(true)}
        className="p-2 rounded-full hover:bg-gray-800 transition"
      >
        <Trash2 className="w-5 h-5 text-white" />
      </button>

      {/* 削除確認ダイアログ */}
      <AlertDialog open={openConfirm} onOpenChange={setOpenConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>削除しますか？</AlertDialogTitle>
            <AlertDialogDescription>
              この操作は取り消せません。本当に削除してもよろしいですか？
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>キャンセル</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              削除する
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
