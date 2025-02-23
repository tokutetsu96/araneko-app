"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  addSummonerSchema,
  addSummonerSchemaType,
} from "@/lib/validations/add-summoner";
import { toast } from "@/hooks/use-toast";

type AddSummonerProps = {
  fetchSummoners: () => Promise<void>;
  setError: (error: string | null) => void;
};

export default function AddSummonerForm({
  fetchSummoners,
  setError,
}: AddSummonerProps) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<addSummonerSchemaType>({
    resolver: zodResolver(addSummonerSchema),
    defaultValues: {
      summonerName: "",
      tag: "",
      opggUrl: "",
    },
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const bgColor = !mounted
    ? "bg-transparent"
    : theme === "dark"
    ? "bg-black text-white"
    : "bg-white text-black";

  const flipBgColor = !mounted
    ? "bg-transparent"
    : theme === "dark"
    ? "bg-white text-black"
    : "bg-black text-white";

  const handleSubmitSummoner = async (data: addSummonerSchemaType) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/opgg-summoner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        form.reset();
        return toast({
          title: "登録に失敗しました。",
          description: "入力したサモナーはJPサーバーに存在しません",
          variant: "destructive",
        });
      }

      await fetchSummoners();
      form.reset();
      setShowForm(false);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "不明なエラーが発生しました"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative z-50">
      <div
        className="cursor-pointer text-lg flex items-center space-x-2"
        onClick={() => setShowForm(!showForm)}
      >
        <span className="font-bold">
          {showForm ? "△ 閉じる" : "▽ 新規登録"}
        </span>
      </div>

      <div
        className={`absolute left-0 w-full shadow-lg rounded-lg overflow-hidden transition-all duration-300 ${bgColor} ${
          showForm ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmitSummoner)}
            className="space-y-6 m-4"
          >
            <div className="flex gap-2">
              <FormField
                control={form.control}
                name="summonerName"
                render={({ field }) => (
                  <FormItem>
                    <Label className="font-bold">サモナー名</Label>
                    <FormControl>
                      <Input
                        placeholder="例:Farm Merge King"
                        className="w-full"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tag"
                render={({ field }) => (
                  <FormItem>
                    <Label className="font-bold">タグ ※＃なしで入力</Label>
                    <FormControl>
                      <Input
                        placeholder="例:ふぁまきん"
                        className="w-full"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="opggUrl"
              render={({ field }) => (
                <FormItem>
                  <Label className="font-bold">OPGG URL</Label>
                  <FormControl>
                    <Input
                      placeholder="登録したいサモナーのOPGGのURLを貼り付けてください"
                      className="w-full"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={loading}
              className={`w-full ${flipBgColor}`}
            >
              {loading ? "登録中..." : "登録"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
