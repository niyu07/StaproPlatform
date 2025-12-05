import { useState, useEffect } from "react";
import type { CurriculumDisplay, LessonDetail } from "@/types/database";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Props = {
  open: boolean;
  curriculum: CurriculumDisplay | null;
  onClose: () => void;
  onSave?: (curriculumId: string, progress: number) => void;
  onSaveLessonDetail?: (
    curriculumId: string,
    lessonNumber: number,
    lessonDetail: LessonDetail,
  ) => void;
  readOnly?: boolean; // 閲覧のみ（保護者用）
};

export const CurriculumEditModal = ({
  open,
  curriculum,
  onClose,
  onSave,
  onSaveLessonDetail,
  readOnly = false,
}: Props) => {
  const [progress, setProgress] = useState(0);
  const [activeTab, setActiveTab] = useState<"overview" | "lessons">(
    "overview",
  );
  const [lessonDetails, setLessonDetails] = useState<LessonDetail[]>(
    curriculum?.lessonDetails ?? [],
  );

  useEffect(() => {
    if (curriculum) {
      setProgress(curriculum.progress);
      setLessonDetails(curriculum.lessonDetails ?? []);
    }
  }, [curriculum]);

  if (!open || !curriculum) return null;

  const handleSave = () => {
    if (onSave) {
      onSave(curriculum.id, progress);
    }
    onClose();
  };

  const handleSaveLessonProgress = (
    lessonNumber: number,
    field: string,
    value: number,
  ) => {
    const updated = lessonDetails.map((lesson) => {
      if (lesson.lessonNumber === lessonNumber) {
        return { ...lesson, [field]: value };
      }
      return lesson;
    });
    setLessonDetails(updated);

    // カリキュラム全体の進捗を再計算（全小項目の中で最大の進捗）
    const allProgresses = updated
      .flatMap((lesson) => [
        lesson.progress1,
        lesson.progress2,
        lesson.progress3,
        lesson.progress4,
        lesson.progress5,
        lesson.progress6,
        lesson.progress7,
        lesson.progress8,
        lesson.overallProgress,
      ])
      .filter((p): p is number => p !== undefined);
    const maxProgress =
      allProgresses.length > 0 ? Math.max(...allProgresses) : 0;
    setProgress(maxProgress);

    if (onSaveLessonDetail) {
      const lesson = updated.find((l) => l.lessonNumber === lessonNumber);
      if (lesson) {
        onSaveLessonDetail(curriculum.id, lessonNumber, lesson);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>カリキュラム進捗編集</DialogTitle>
          <p className="text-xs text-muted-foreground">{curriculum.code}</p>
        </DialogHeader>

        {/* タブ */}
        <div className="flex border-b">
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === "overview"
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => setActiveTab("overview")}
          >
            概要
          </button>
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === "lessons"
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => setActiveTab("lessons")}
          >
            授業回詳細 ({lessonDetails.length}回)
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === "overview" ? (
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  カリキュラム名
                </label>
                <input
                  className="w-full rounded-lg border bg-muted px-3 py-2 text-sm"
                  value={curriculum.name}
                  readOnly
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  進捗率（%）
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    className="w-24 rounded-lg border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    value={progress}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      if (value >= 0 && value <= 100) {
                        setProgress(value);
                      }
                    }}
                  />
                  <span className="text-sm text-muted-foreground">%</span>
                  <div className="flex-1">
                    <div className="h-2 w-full rounded-full bg-muted">
                      <div
                        className="h-2 rounded-full bg-primary transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-3 text-sm md:grid-cols-2">
                <div className="flex flex-col">
                  <label className="mb-1 text-xs text-muted-foreground">
                    カテゴリ
                  </label>
                  <input
                    className="rounded-lg border bg-muted px-3 py-1.5 text-sm"
                    value={curriculum.category}
                    readOnly
                  />
                </div>
                <div className="flex flex-col">
                  <label className="mb-1 text-xs text-muted-foreground">
                    対象学年
                  </label>
                  <input
                    className="rounded-lg border bg-muted px-3 py-1.5 text-sm"
                    value={curriculum.targetGrade}
                    readOnly
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {lessonDetails.map((lesson) => (
                <div
                  key={lesson.lessonNumber}
                  className="rounded-lg border bg-muted p-4"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="font-semibold">
                      第{lesson.lessonNumber}回: {lesson.goal}
                    </h3>
                    <span className="text-xs font-medium text-primary">
                      進捗{" "}
                      {Math.max(
                        lesson.progress1 ?? 0,
                        lesson.progress2 ?? 0,
                        lesson.progress3 ?? 0,
                        lesson.progress4 ?? 0,
                        lesson.progress5 ?? 0,
                        lesson.progress6 ?? 0,
                        lesson.progress7 ?? 0,
                        lesson.progress8 ?? 0,
                        lesson.overallProgress ?? 0,
                      )}
                      %（スクラッチ全体）
                    </span>
                  </div>

                  <div className="space-y-2 text-sm">
                    {lesson.subItem1 && (
                      <div className="flex items-center gap-2">
                        <span className="w-32 text-muted-foreground">
                          {lesson.subItem1}
                        </span>
                        {lesson.description1 && (
                          <span className="w-20 font-mono text-xs text-muted-foreground">
                            {lesson.description1}
                          </span>
                        )}
                        {lesson.progress1 !== undefined && (
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              disabled={readOnly}
                              className="w-16 rounded border px-2 py-1 text-xs disabled:cursor-not-allowed disabled:opacity-50"
                              value={lesson.progress1}
                              onChange={(e) => {
                                if (readOnly) return;
                                handleSaveLessonProgress(
                                  lesson.lessonNumber,
                                  "progress1",
                                  Number(e.target.value),
                                );
                              }}
                            />
                            <span className="text-xs text-muted-foreground">
                              %
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                    {lesson.problem1 && (
                      <div className="flex items-center gap-2 pl-4">
                        <span className="w-32 font-mono text-xs text-muted-foreground">
                          {lesson.problem1}
                        </span>
                        {lesson.progress2 !== undefined && (
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              disabled={readOnly}
                              className="w-16 rounded border px-2 py-1 text-xs disabled:cursor-not-allowed disabled:opacity-50"
                              value={lesson.progress2}
                              onChange={(e) => {
                                if (readOnly) return;
                                handleSaveLessonProgress(
                                  lesson.lessonNumber,
                                  "progress2",
                                  Number(e.target.value),
                                );
                              }}
                            />
                            <span className="text-xs text-muted-foreground">
                              %
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                    {lesson.subItem2 && (
                      <div className="flex items-center gap-2">
                        <span className="w-32 text-muted-foreground">
                          {lesson.subItem2}
                        </span>
                        {lesson.description2 && (
                          <span className="w-20 font-mono text-xs text-muted-foreground">
                            {lesson.description2}
                          </span>
                        )}
                        {lesson.progress3 !== undefined && (
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              disabled={readOnly}
                              className="w-16 rounded border px-2 py-1 text-xs disabled:cursor-not-allowed disabled:opacity-50"
                              value={lesson.progress3}
                              onChange={(e) => {
                                if (readOnly) return;
                                handleSaveLessonProgress(
                                  lesson.lessonNumber,
                                  "progress3",
                                  Number(e.target.value),
                                );
                              }}
                            />
                            <span className="text-xs text-muted-foreground">
                              %
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                    {lesson.problem2 && (
                      <div className="flex items-center gap-2 pl-4">
                        <span className="w-32 font-mono text-xs text-muted-foreground">
                          {lesson.problem2}
                        </span>
                        {lesson.progress4 !== undefined && (
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              disabled={readOnly}
                              className="w-16 rounded border px-2 py-1 text-xs disabled:cursor-not-allowed disabled:opacity-50"
                              value={lesson.progress4}
                              onChange={(e) => {
                                if (readOnly) return;
                                handleSaveLessonProgress(
                                  lesson.lessonNumber,
                                  "progress4",
                                  Number(e.target.value),
                                );
                              }}
                            />
                            <span className="text-xs text-muted-foreground">
                              %
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                    {lesson.subItem3 && (
                      <div className="flex items-center gap-2">
                        <span className="w-32 text-muted-foreground">
                          {lesson.subItem3}
                        </span>
                        {lesson.description3 && (
                          <span className="w-20 font-mono text-xs text-muted-foreground">
                            {lesson.description3}
                          </span>
                        )}
                        {lesson.progress5 !== undefined && (
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              disabled={readOnly}
                              className="w-16 rounded border px-2 py-1 text-xs disabled:cursor-not-allowed disabled:opacity-50"
                              value={lesson.progress5}
                              onChange={(e) => {
                                if (readOnly) return;
                                handleSaveLessonProgress(
                                  lesson.lessonNumber,
                                  "progress5",
                                  Number(e.target.value),
                                );
                              }}
                            />
                            <span className="text-xs text-muted-foreground">
                              %
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                    {lesson.homework && (
                      <div className="mt-2 text-xs text-muted-foreground">
                        宿題: {lesson.homework}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 border-t p-6">
          <Button variant="outline" onClick={onClose}>
            {readOnly ? "閉じる" : "キャンセル"}
          </Button>
          {!readOnly && (
            <Button onClick={handleSave}>保存</Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

