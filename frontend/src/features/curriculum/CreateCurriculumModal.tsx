import { useState } from "react";
import type { CurriculumDisplay, LessonDetail } from "@/types/database";
import { scratchLessonDetails } from "@/mock/scratchLessons";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = {
  open: boolean;
  studentId: number;
  curriculumMasterId: number;
  onClose: () => void;
  onCreate: (curriculum: CurriculumDisplay) => void;
};

export const CreateCurriculumModal = ({
  open,
  studentId,
  curriculumMasterId,
  onClose,
  onCreate,
}: Props) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  if (!open) return null;

  const handleCreate = () => {
    if (!name.trim()) {
      alert("カリキュラム名を入力してください");
      return;
    }

    const newCurriculum: CurriculumDisplay = {
      id: `cur-${Date.now()}`,
      userId: studentId,
      name: name.trim(),
      code: `CUR-${studentId}-${curriculumMasterId}-${Date.now()}`,
      category: curriculumMasterId === 1 ? "スクラッチ" : "その他",
      level: "初級",
      targetGrade: "小5",
      totalLessons: 24,
      lessonDuration: 60,
      teacherName: "担当メンター",
      enrolledCount: 1,
      status: "active",
      updatedAt: new Date().toISOString().split("T")[0],
      description: description.trim() || `${name}のカリキュラムです。`,
      progress: 0,
      cardStatus: "upcoming",
      // スクラッチカリキュラムの場合、授業回詳細を追加
      lessonDetails:
        curriculumMasterId === 1 ? [...scratchLessonDetails] : undefined,
    };

    onCreate(newCurriculum);
    setName("");
    setDescription("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>スクラッチカリキュラムを作成</DialogTitle>
          <p className="text-xs text-muted-foreground">
            新しいスクラッチカリキュラムを作成します
          </p>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="curriculum-name">
              カリキュラム名 <span className="text-destructive">*</span>
            </Label>
            <Input
              id="curriculum-name"
              type="text"
              placeholder="例: スクラッチ基礎"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="curriculum-description">説明</Label>
            <textarea
              id="curriculum-description"
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              placeholder="カリキュラムの説明を入力してください"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="rounded-lg border bg-muted p-3">
            <p className="text-xs">
              <strong>含まれる内容:</strong>
            </p>
            <ul className="mt-1 list-inside list-disc text-xs">
              <li>第1回〜第24回の授業回詳細</li>
              <li>各授業回の目標・小項目・問題</li>
              <li>進捗管理機能</li>
            </ul>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            キャンセル
          </Button>
          <Button onClick={handleCreate}>作成</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

