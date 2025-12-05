import type { CurriculumDisplay } from "@/types/database";

type Props = {
  curriculum: CurriculumDisplay;
  onClickDetail: () => void;
  index?: number;
  isSelected?: boolean;
  isNextItem?: boolean;
  onRadioChange?: (curriculumId: string) => void;
  disabled?: boolean; // 編集不可（保護者用）
};

export const CurriculumCard = ({
  curriculum,
  onClickDetail,
  index,
  isSelected = false,
  isNextItem = false,
  onRadioChange,
  disabled = false,
}: Props) => {
  const isCompleted = curriculum.cardStatus === "completed";
  const hasProgress = curriculum.progress > 0 && curriculum.progress < 100;

  // カードのスタイルを状態に応じて変更（画像のように緑系）
  const cardClass = isCompleted
    ? "border-emerald-200 bg-emerald-50 text-emerald-900 hover:border-emerald-300 hover:bg-emerald-100"
    : hasProgress
    ? "border-emerald-200 bg-emerald-50 text-emerald-900 hover:border-emerald-300 hover:bg-emerald-100"
    : "border-slate-200 bg-white text-slate-900 hover:border-slate-300 hover:bg-slate-50";

  // アイコンのスタイル（緑のチェックマーク）
  const iconClass = isCompleted || hasProgress
    ? "border-emerald-500 bg-emerald-500 text-white"
    : "border-slate-300 bg-white";

  const curriculumName = index
    ? `カリキュラム${String(index).padStart(2, "0")}`
    : curriculum.name;

  const handleRadioClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onRadioChange) {
      onRadioChange(curriculum.id);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div
        className={`flex w-full items-center justify-between rounded-xl border px-6 py-4 shadow-sm transition-colors ${cardClass}`}
      >
        <div className="flex items-center gap-3 flex-1">
          <div className="flex items-center gap-2">
            <input
              type="radio"
              name="curriculum-radio"
              checked={isSelected}
              onChange={() => {}}
              onClick={handleRadioClick}
              disabled={disabled}
              className={`h-4 w-4 ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
            />
            <span
              className={`flex h-6 w-6 items-center justify-center rounded-full border text-xs font-semibold ${iconClass}`}
            >
              {(isCompleted || hasProgress) ? "✓" : ""}
            </span>
          </div>
          <button
            type="button"
            onClick={onClickDetail}
            className="flex flex-col text-left flex-1"
          >
            <span className="text-sm font-medium">{curriculumName}</span>
            {hasProgress && (
              <span className="text-xs opacity-70">
                進捗{curriculum.progress}%
              </span>
            )}
          </button>
        </div>
      </div>
      {isNextItem && (
        <div className="w-full rounded-lg bg-orange-500 px-4 py-2 text-xs font-medium text-white text-center shadow-sm">
          次はここから
        </div>
      )}
    </div>
  );
};

