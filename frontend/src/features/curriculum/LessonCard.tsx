import type { LessonDetail } from "@/types/database";

type Props = {
  lesson: LessonDetail;
  onClickDetail: () => void;
  onToggleComplete?: (lessonNumber: number, isCompleted: boolean) => void;
  totalLessons?: number; // 全体の授業回数（スクラッチの場合は24）
  allLessons?: LessonDetail[]; // 全授業回のデータ（全体進捗計算用）
  isSelected?: boolean; // ラジオボタンで選択されているか
  isNextItem?: boolean; // 次の授業回か（「次回ここから」を表示するか）
  onRadioChange?: (lessonNumber: number) => void; // ラジオボタン変更時のコールバック
};

export const LessonCard = ({
  lesson,
  onClickDetail,
  onToggleComplete,
  totalLessons = 24,
  allLessons = [],
  isSelected = false,
  isNextItem = false,
  onRadioChange,
}: Props) => {
  // その授業回の中で最も進んでいる小項目の進捗を取得
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
  const isCompleted = lessonProgress >= 100;
  const isCurrent = lessonProgress > 0 && lessonProgress < 100;

  // 全体の進捗を計算（完了している授業回数 + 現在の授業回の進捗）
  const calculateOverallProgress = () => {
    if (allLessons.length === 0) {
      // allLessonsが渡されていない場合は、この授業回の進捗を全体の進捗として表示
      return Math.round((lessonProgress / 100) * (100 / totalLessons));
    }

    // 完了している授業回数をカウント
    let completedLessons = 0;
    let currentLessonProgress = 0;

    for (const l of allLessons) {
      const lProgress = Math.max(
        l.progress1 ?? 0,
        l.progress2 ?? 0,
        l.progress3 ?? 0,
        l.progress4 ?? 0,
        l.progress5 ?? 0,
        l.progress6 ?? 0,
        l.progress7 ?? 0,
        l.progress8 ?? 0,
        l.overallProgress ?? 0,
      );

      if (l.lessonNumber === lesson.lessonNumber) {
        // 現在の授業回の進捗
        currentLessonProgress = lProgress;
      } else if (lProgress >= 100) {
        // 完了している授業回
        completedLessons++;
      }
    }

    // 全体の進捗 = (完了授業回数 + 現在授業回の進捗/100) / 全授業回数 * 100
    const overallProgress =
      ((completedLessons + currentLessonProgress / 100) / totalLessons) * 100;
    return Math.round(overallProgress * 100) / 100; // 小数点第2位まで
  };

  const overallProgress = calculateOverallProgress();

  const handleToggleComplete = (e: React.MouseEvent) => {
    e.stopPropagation();
    // チェックマークを押したら、ラジオボタンの選択として扱う（次の授業回に「次回ここから」を表示）
    if (onRadioChange) {
      onRadioChange(lesson.lessonNumber);
    }
    // 進捗の更新も行う
    if (onToggleComplete) {
      onToggleComplete(lesson.lessonNumber, !isCompleted);
    }
  };

  // カードのスタイルを状態に応じて変更
  const cardClass = isCompleted
    ? "border-emerald-200 bg-emerald-50 text-emerald-900 hover:border-emerald-300 hover:bg-emerald-100"
    : isCurrent
    ? "border-orange-200 bg-orange-50 text-orange-900 hover:border-orange-300 hover:bg-orange-100"
    : "border-slate-200 bg-white text-slate-900 hover:border-slate-300 hover:bg-slate-50";

  // アイコンのスタイル
  const iconClass = isSelected
    ? "border-blue-500 bg-blue-500 text-white"
    : isCompleted
    ? "border-emerald-500 bg-emerald-500 text-white"
    : "border-slate-300 bg-white";
  
  // チェックマークの表示（選択されているか完了している場合）
  const showCheckmark = isSelected || isCompleted;

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={onClickDetail}
        className={`flex w-full items-center justify-between rounded-xl border px-6 py-4 text-left shadow-sm transition-colors ${cardClass}`}
      >
        <div className="flex items-center gap-3 flex-1">
          <button
            type="button"
            onClick={onClickDetail}
            className="flex flex-col text-left flex-1"
          >
            <span className="text-sm font-medium">
              第{lesson.lessonNumber}回: {lesson.goal}
            </span>
            <span className="text-xs opacity-70">進捗{overallProgress}%</span>
          </button>
          <button
            type="button"
            onClick={handleToggleComplete}
            className={`flex h-6 w-6 items-center justify-center rounded-full border text-xs font-semibold transition-colors ${iconClass} hover:scale-110`}
            title={isSelected ? "選択中" : isCompleted ? "未達成に戻す" : "達成にする"}
          >
            {showCheckmark ? "✓" : ""}
          </button>
        </div>
      </button>
      {isNextItem && (
        <div className="w-full rounded-lg bg-orange-500 px-4 py-2 text-xs font-medium text-white text-center shadow-sm">
          次回ここから
        </div>
      )}
    </div>
  );
};

