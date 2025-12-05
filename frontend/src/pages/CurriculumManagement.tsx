import { useMemo, useState, useEffect } from "react";
import {
  mockCurriculumMasters,
  mockStudents,
  mockStudentCurriculums,
  mockCurriculumDisplays,
} from "@/mock/data";
import type { CurriculumDisplay } from "@/types/database";
import { CurriculumCard } from "@/features/curriculum/CurriculumCard";
import { LessonCard } from "@/features/curriculum/LessonCard";
import { CurriculumEditModal } from "@/features/curriculum/CurriculumEditModal";
import type { LessonDetail } from "@/types/database";
import { CreateCurriculumModal } from "@/features/curriculum/CreateCurriculumModal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";

export const CurriculumManagement = () => {
  const { user } = useAuth();
  const isParent = user?.role === "student"; // student = 保護者

  // 保護者の場合は最初の生徒を自動選択、それ以外は選択可能
  const [selectedStudentId, setSelectedStudentId] = useState<number>(
    isParent ? (mockStudents[0]?.user_id ?? 0) : (mockStudents[0]?.user_id ?? 0),
  );
  // 選択されたカリキュラムマスタID（スクラッチ、HTML/CSSなど）
  const [selectedCurriculumMasterId, setSelectedCurriculumMasterId] =
    useState<number | null>(null);
  const [curriculums, setCurriculums] =
    useState<CurriculumDisplay[]>(mockCurriculumDisplays);
  const [selectedCurriculum, setSelectedCurriculum] =
    useState<CurriculumDisplay | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  // ラジオボタンで選択されたカリキュラムID（通常カリキュラム用）
  const [selectedRadioCurriculumId, setSelectedRadioCurriculumId] =
    useState<string | null>(null);
  // ラジオボタンで選択された授業回番号（スクラッチカリキュラム用）
  const [selectedRadioLessonNumber, setSelectedRadioLessonNumber] =
    useState<number | null>(null);

  // 選択された生徒が受講しているカリキュラムマスタのリスト
  const availableCurriculumMasters = useMemo(() => {
    const studentCurriculumIds = mockStudentCurriculums
      .filter((sc) => sc.user_id === selectedStudentId)
      .map((sc) => sc.curriculum_id);
    return mockCurriculumMasters.filter((cm) =>
      studentCurriculumIds.includes(cm.id),
    );
  }, [selectedStudentId]);

  // 生徒が変更されたら、最初のカリキュラムマスタを自動選択
  useEffect(() => {
    if (availableCurriculumMasters.length > 0 && !selectedCurriculumMasterId) {
      // 非同期で状態を更新して、レンダリングのカスケードを防ぐ
      const timer = setTimeout(() => {
        setSelectedCurriculumMasterId(availableCurriculumMasters[0].id);
      }, 0);
      return () => clearTimeout(timer);
    } else if (
      selectedCurriculumMasterId &&
      !availableCurriculumMasters.find((cm) => cm.id === selectedCurriculumMasterId)
    ) {
      // 選択中のカリキュラムマスタが利用可能でない場合、最初のものを選択
      const timer = setTimeout(() => {
        setSelectedCurriculumMasterId(
          availableCurriculumMasters.length > 0
            ? availableCurriculumMasters[0].id
            : null,
        );
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [availableCurriculumMasters, selectedCurriculumMasterId]);

  const selectedCurriculumMaster = mockCurriculumMasters.find(
    (cm) => cm.id === selectedCurriculumMasterId,
  );

  // 保護者の場合はすべてのカリキュラムを表示、それ以外は選択されたカリキュラムマスタでフィルタリング
  const filteredCurriculums = useMemo(() => {
    if (isParent) {
      // 保護者の場合は、選択された生徒のすべてのカリキュラムを表示
      return curriculums.filter((c) => c.userId === selectedStudentId);
    }
    // 管理者・教師の場合は、選択されたカリキュラムマスタでフィルタリング
    if (!selectedCurriculumMasterId || !selectedCurriculumMaster) return [];
    return curriculums.filter(
      (c) =>
        c.userId === selectedStudentId &&
        c.category === selectedCurriculumMaster.name,
    );
  }, [
    curriculums,
    selectedStudentId,
    selectedCurriculumMasterId,
    selectedCurriculumMaster,
    isParent,
  ]);

  const handleOpenDetail = (curriculum: CurriculumDisplay) => {
    setSelectedCurriculum(curriculum);
    setIsModalOpen(true);
  };


  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCurriculum(null);
  };

  const handleSaveProgress = (curriculumId: string, progress: number) => {
    setCurriculums((prev) =>
      prev.map((c) => (c.id === curriculumId ? { ...c, progress } : c)),
    );
  };

  const handleCreateCurriculum = (newCurriculum: CurriculumDisplay) => {
    setCurriculums((prev) => [...prev, newCurriculum]);
    // 作成したカリキュラムのカリキュラムマスタを選択
    const master = mockCurriculumMasters.find(
      (cm) => cm.name === newCurriculum.category,
    );
    if (master) {
      setSelectedCurriculumMasterId(master.id);
    }
  };


  const progressPercent = useMemo(() => {
    if (filteredCurriculums.length === 0) return 0;
    // スクラッチカリキュラムの場合、チェックが付いた（完了した）授業回の合計を計算
    const curriculum = filteredCurriculums[0];
    if (curriculum.lessonDetails && curriculum.lessonDetails.length > 0) {
      const totalLessons = curriculum.lessonDetails.length;
      let completedLessons = 0;

      for (const lesson of curriculum.lessonDetails) {
        const lessonProgress = Math.max(
          lesson.progress1 ?? 0,
          lesson.progress2 ?? 0,
          lesson.progress3 ?? 0,
          lesson.progress4 ?? 0,
          lesson.progress5 ?? 0,
          lesson.progress6 ?? 0,
          lesson.progress7 ?? 0,
          lesson.progress8 ?? 0,
          lesson.overallProgress ?? 0,
        );
        // 進捗が100%以上の場合、完了とみなす
        if (lessonProgress >= 100) {
          completedLessons++;
        }
      }

      // 完了した授業回数 / 全授業回数 * 100
      return Math.round((completedLessons / totalLessons) * 100);
    }
    // 通常のカリキュラムの場合、カリキュラムの進捗をそのまま使用
    return curriculum.progress;
  }, [filteredCurriculums]);

  const selectedStudent = mockStudents.find(
    (s) => s.user_id === selectedStudentId,
  );

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      {/* ページタイトル */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">
          カリキュラム管理
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          生徒ごとのカリキュラム進捗状況の確認
        </p>
      </div>

      {/* ステップ1: 生徒選択（保護者の場合は非表示） */}
      {!isParent && (
        <Card className="mb-4">
        <CardHeader>
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
              1
            </span>
            <Label>生徒を選択</Label>
          </div>
        </CardHeader>
        <CardContent>
          <Select
            value={selectedStudentId.toString()}
            onValueChange={(value) => {
              setSelectedStudentId(Number(value));
              setSelectedCurriculumMasterId(null); // 生徒変更時はカリキュラム選択をリセット
              setSelectedRadioCurriculumId(null); // ラジオボタンの選択をリセット
              setSelectedRadioLessonNumber(null); // ラジオボタンの選択をリセット
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="生徒を選択してください" />
            </SelectTrigger>
            <SelectContent>
              {mockStudents.map((student) => (
                <SelectItem
                  key={student.user_id}
                  value={student.user_id.toString()}
                >
                  {student.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>
      )}

      {/* ステップ2: カリキュラム名選択（保護者の場合は非表示） */}
      {!isParent && availableCurriculumMasters.length > 0 && (
        <div className="mb-4 flex gap-4">
          <Card className="flex-1">
            <CardHeader>
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                  2
                </span>
                <Label>カリキュラム名を選択</Label>
              </div>
            </CardHeader>
            <CardContent>
              <Select
                value={selectedCurriculumMasterId?.toString() ?? ""}
                onValueChange={(value) => {
                  setSelectedCurriculumMasterId(Number(value));
                  setSelectedRadioCurriculumId(null); // カリキュラム変更時はラジオボタンの選択をリセット
                  setSelectedRadioLessonNumber(null); // ラジオボタンの選択をリセット
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="カリキュラムを選択してください" />
                </SelectTrigger>
                <SelectContent>
                  {availableCurriculumMasters.map((cm) => (
                    <SelectItem key={cm.id} value={cm.id.toString()}>
                      {cm.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
          {selectedCurriculumMasterId === 1 && (
            <div className="flex items-end">
              <Button onClick={() => setIsCreateModalOpen(true)}>
                新規スクラッチカリキュラムを作成
              </Button>
            </div>
          )}
        </div>
      )}

      {/* ステップ3: カリキュラムの順番（授業回）表示 */}
      {isParent ? (
        // 保護者の場合は、すべてのカリキュラムをカテゴリごとに表示
        <>
          {availableCurriculumMasters.map((master) => {
              const masterCurriculums = filteredCurriculums.filter(
                (c) => c.category === master.name,
              );
              if (masterCurriculums.length === 0) return null;

              // カテゴリごとの進捗を計算
              const calculateMasterProgress = () => {
                const curriculum = masterCurriculums[0];
                if (curriculum.lessonDetails && curriculum.lessonDetails.length > 0) {
                  const totalLessons = curriculum.lessonDetails.length;
                  let completedLessons = 0;
                  for (const lesson of curriculum.lessonDetails) {
                    const lessonProgress = Math.max(
                      lesson.progress1 ?? 0,
                      lesson.progress2 ?? 0,
                      lesson.progress3 ?? 0,
                      lesson.progress4 ?? 0,
                      lesson.progress5 ?? 0,
                      lesson.progress6 ?? 0,
                      lesson.progress7 ?? 0,
                      lesson.progress8 ?? 0,
                      lesson.overallProgress ?? 0,
                    );
                    if (lessonProgress >= 100) {
                      completedLessons++;
                    }
                  }
                  return Math.round((completedLessons / totalLessons) * 100);
                }
                return curriculum.progress;
              };
              const masterProgress = calculateMasterProgress();

              return (
                <div key={master.id} className="mb-6">
                  <Card className="mb-4">
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                          3
                        </span>
                        <div className="flex flex-1 items-center justify-between">
                          <div className="text-sm font-medium">
                            <span className="font-semibold">
                              {selectedStudent?.name ?? "生徒未選択"}
                            </span>
                            {" - "}
                            <span className="font-semibold">{master.name}</span>
                            カリキュラムの進捗
                          </div>
                          <div className="text-xs font-semibold text-primary">
                            進捗 {masterProgress}%
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="h-2 w-full rounded-full bg-muted">
                        <div
                          className="h-2 rounded-full bg-primary transition-all"
                          style={{ width: `${masterProgress}%` }}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* カリキュラムの順番（授業回）カードグリッド */}
                  <div className="grid gap-4 md:grid-cols-2">
                    {masterCurriculums.flatMap((curriculum) => {
                      // スクラッチカリキュラムの場合、授業回詳細を表示
                      if (
                        curriculum.lessonDetails &&
                        curriculum.lessonDetails.length > 0
                      ) {
                        const lessonDetails = curriculum.lessonDetails;
                        const selectedIndex = lessonDetails.findIndex(
                          (l) => l.lessonNumber === selectedRadioLessonNumber,
                        );
                        return lessonDetails.map((lesson, index) => {
                          const isSelected =
                            selectedRadioLessonNumber === lesson.lessonNumber;
                          const isNextItem =
                            selectedIndex >= 0 && index === selectedIndex + 1;

                          return (
                            <LessonCard
                              key={`${curriculum.id}-lesson-${lesson.lessonNumber}`}
                              lesson={lesson}
                              totalLessons={lessonDetails.length}
                              isSelected={isSelected}
                              isNextItem={isNextItem}
                              disabled={isParent}
                              onRadioChange={(lessonNumber) => {
                                if (!isParent) {
                                  setSelectedRadioLessonNumber(lessonNumber);
                                }
                              }}
                              onClickDetail={() => {
                                setSelectedCurriculum(curriculum);
                                setIsModalOpen(true);
                              }}
                              onToggleComplete={(lessonNumber, isCompleted) => {
                                if (isParent) return;
                                setCurriculums((prev) =>
                                  prev.map((c) => {
                                    if (c.id === curriculum.id && c.lessonDetails) {
                                      const updatedLessonDetails =
                                        c.lessonDetails.map((l) => {
                                          if (l.lessonNumber === lessonNumber) {
                                            const targetProgress = isCompleted
                                              ? 100
                                              : 0;
                                            const updated: LessonDetail = { ...l };
                                            if (updated.progress1 !== undefined) {
                                              updated.progress1 = targetProgress;
                                            }
                                            if (updated.progress2 !== undefined) {
                                              updated.progress2 = targetProgress;
                                            }
                                            if (updated.progress3 !== undefined) {
                                              updated.progress3 = targetProgress;
                                            }
                                            if (updated.progress4 !== undefined) {
                                              updated.progress4 = targetProgress;
                                            }
                                            if (updated.progress5 !== undefined) {
                                              updated.progress5 = targetProgress;
                                            }
                                            if (updated.progress6 !== undefined) {
                                              updated.progress6 = targetProgress;
                                            }
                                            if (updated.progress7 !== undefined) {
                                              updated.progress7 = targetProgress;
                                            }
                                            if (updated.progress8 !== undefined) {
                                              updated.progress8 = targetProgress;
                                            }
                                            if (
                                              updated.overallProgress !== undefined
                                            ) {
                                              updated.overallProgress = targetProgress;
                                            }
                                            return updated;
                                          }
                                          return l;
                                        });
                                      const allProgresses = updatedLessonDetails
                                        .flatMap((l) => [
                                          l.progress1,
                                          l.progress2,
                                          l.progress3,
                                          l.progress4,
                                          l.progress5,
                                          l.progress6,
                                          l.progress7,
                                          l.progress8,
                                          l.overallProgress,
                                        ])
                                        .filter((p): p is number => p !== undefined);
                                      const maxProgress =
                                        allProgresses.length > 0
                                          ? Math.max(...allProgresses)
                                          : 0;
                                      return {
                                        ...c,
                                        lessonDetails: updatedLessonDetails,
                                        progress: maxProgress,
                                      };
                                    }
                                    return c;
                                  }),
                                );
                              }}
                            />
                          );
                        });
                      }
                      // 通常のカリキュラムの場合、カードを表示
                      return [];
                    })}
                    {(() => {
                      const normalCurriculums = masterCurriculums.filter(
                        (c) => !c.lessonDetails || c.lessonDetails.length === 0,
                      );
                      const selectedIndex = normalCurriculums.findIndex(
                        (c) => c.id === selectedRadioCurriculumId,
                      );
                      return normalCurriculums.map((curriculum, index) => {
                        const isSelected =
                          selectedRadioCurriculumId === curriculum.id;
                        const isNextItem =
                          selectedIndex >= 0 && index === selectedIndex + 1;

                        return (
                          <CurriculumCard
                            key={curriculum.id}
                            curriculum={curriculum}
                            onClickDetail={() => handleOpenDetail(curriculum)}
                            index={index + 1}
                            isSelected={isSelected}
                            isNextItem={isNextItem}
                            disabled={isParent}
                            onRadioChange={(curriculumId: string) => {
                              if (!isParent) {
                                setSelectedRadioCurriculumId(curriculumId);
                              }
                            }}
                          />
                        );
                      });
                    })()}
                  </div>
                </div>
              );
            })}
        </>
      ) : (
            // 管理者・教師の場合は従来通り
            <>
              {selectedCurriculumMaster && (
                <>
                  <Card className="mb-4">
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                          3
                        </span>
                        <div className="flex flex-1 items-center justify-between">
                          <div className="text-sm font-medium">
                            <span className="font-semibold">
                              {selectedStudent?.name ?? "生徒未選択"}
                            </span>
                            {" - "}
                            <span className="font-semibold">
                              {selectedCurriculumMaster.name}
                            </span>
                            カリキュラムの進捗
                          </div>
                          <div className="text-xs font-semibold text-primary">
                            進捗 {progressPercent}%
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="h-2 w-full rounded-full bg-muted">
                        <div
                          className="h-2 rounded-full bg-primary transition-all"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* カリキュラムの順番（授業回）カードグリッド */}
                  {filteredCurriculums.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {filteredCurriculums.flatMap((curriculum) => {
                // スクラッチカリキュラムの場合、授業回詳細を表示
                if (
                  curriculum.lessonDetails &&
                  curriculum.lessonDetails.length > 0
                ) {
                  const lessonDetails = curriculum.lessonDetails;
                  const selectedIndex = lessonDetails.findIndex(
                    (l) => l.lessonNumber === selectedRadioLessonNumber,
                  );
                  return lessonDetails.map((lesson, index) => {
                    const isSelected =
                      selectedRadioLessonNumber === lesson.lessonNumber;
                    const isNextItem =
                      selectedIndex >= 0 && index === selectedIndex + 1;

                    return (
                      <LessonCard
                        key={`${curriculum.id}-lesson-${lesson.lessonNumber}`}
                        lesson={lesson}
                        totalLessons={lessonDetails.length}
                        isSelected={isSelected}
                        isNextItem={isNextItem}
                        onRadioChange={(lessonNumber) => {
                          setSelectedRadioLessonNumber(lessonNumber);
                        }}
                        onClickDetail={() => {
                          setSelectedCurriculum(curriculum);
                          setIsModalOpen(true);
                        }}
                        onToggleComplete={(lessonNumber, isCompleted) => {
                        setCurriculums((prev) =>
                          prev.map((c) => {
                            if (c.id === curriculum.id && c.lessonDetails) {
                              const updatedLessonDetails =
                                c.lessonDetails.map((l) => {
                                  if (l.lessonNumber === lessonNumber) {
                                    const targetProgress = isCompleted
                                      ? 100
                                      : 0;
                                    const updated: LessonDetail = { ...l };
                                    if (updated.progress1 !== undefined) {
                                      updated.progress1 = targetProgress;
                                    }
                                    if (updated.progress2 !== undefined) {
                                      updated.progress2 = targetProgress;
                                    }
                                    if (updated.progress3 !== undefined) {
                                      updated.progress3 = targetProgress;
                                    }
                                    if (updated.progress4 !== undefined) {
                                      updated.progress4 = targetProgress;
                                    }
                                    if (updated.progress5 !== undefined) {
                                      updated.progress5 = targetProgress;
                                    }
                                    if (updated.progress6 !== undefined) {
                                      updated.progress6 = targetProgress;
                                    }
                                    if (updated.progress7 !== undefined) {
                                      updated.progress7 = targetProgress;
                                    }
                                    if (updated.progress8 !== undefined) {
                                      updated.progress8 = targetProgress;
                                    }
                                    if (
                                      updated.overallProgress !== undefined
                                    ) {
                                      updated.overallProgress = targetProgress;
                                    }
                                    return updated;
                                  }
                                  return l;
                                });
                              const allProgresses = updatedLessonDetails
                                .flatMap((l) => [
                                  l.progress1,
                                  l.progress2,
                                  l.progress3,
                                  l.progress4,
                                  l.progress5,
                                  l.progress6,
                                  l.progress7,
                                  l.progress8,
                                  l.overallProgress,
                                ])
                                .filter((p): p is number => p !== undefined);
                              const maxProgress =
                                allProgresses.length > 0
                                  ? Math.max(...allProgresses)
                                  : 0;
                              return {
                                ...c,
                                lessonDetails: updatedLessonDetails,
                                progress: maxProgress,
                              };
                            }
                            return c;
                          }),
                        );
                        }}
                      />
                    );
                  });
                }
                // 通常のカリキュラムの場合、カードを表示
                return [];
              })}
              {(() => {
                const normalCurriculums = filteredCurriculums.filter(
                  (c) => !c.lessonDetails || c.lessonDetails.length === 0,
                );
                const selectedIndex = normalCurriculums.findIndex(
                  (c) => c.id === selectedRadioCurriculumId,
                );
                return normalCurriculums.map((curriculum, index) => {
                  const isSelected =
                    selectedRadioCurriculumId === curriculum.id;
                  const isNextItem =
                    selectedIndex >= 0 && index === selectedIndex + 1;

                  return (
                    <CurriculumCard
                      key={curriculum.id}
                      curriculum={curriculum}
                      onClickDetail={() => handleOpenDetail(curriculum)}
                      index={index + 1}
                      isSelected={isSelected}
                      isNextItem={isNextItem}
                      disabled={isParent}
                      onRadioChange={(curriculumId: string) => {
                        if (!isParent) {
                          setSelectedRadioCurriculumId(curriculumId);
                        }
                      }}
                    />
                  );
                });
              })()}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                このカリキュラムの詳細項目はまだ登録されていません。
              </CardContent>
            </Card>
          )}
                </>
              )}
            </>
          )}

      <CurriculumEditModal
        open={isModalOpen}
        curriculum={selectedCurriculum}
        onClose={handleCloseModal}
        onSave={isParent ? undefined : handleSaveProgress}
        readOnly={isParent}
      />

      <CreateCurriculumModal
        open={isCreateModalOpen}
        studentId={selectedStudentId}
        curriculumMasterId={selectedCurriculumMasterId ?? 1}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateCurriculum}
      />
    </div>
  );
};

