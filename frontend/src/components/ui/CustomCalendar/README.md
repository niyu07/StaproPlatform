# CustomCalendar

スケジュール管理用のカスタムカレンダーコンポーネントです。

## 機能

- 月次カレンダービューの表示
- 月の前後ナビゲーション
- 日付ごとのスケジュール表示
- 今日の日付のハイライト表示
- スケジュールクリック時のコールバック

## 使用方法

```tsx
import { CustomCalendar } from "@/components/ui/CustomCalendar";
import type { ScheduleWithRelations } from "@/types/database";

const schedules: ScheduleWithRelations[] = [
  // スケジュールデータ
];

<CustomCalendar
  schedules={schedules}
  onScheduleClick={(schedule) => {
    console.log("Clicked schedule:", schedule);
  }}
/>
```

## Props

- `schedules`: `ScheduleWithRelations[]` - 表示するスケジュールの配列
- `onScheduleClick?`: `(schedule: ScheduleWithRelations) => void` - スケジュールクリック時のコールバック関数（オプション）

## スタイル

- Tailwind CSSを使用
- shadcn/uiのテーマシステムに準拠
- レスポンシブデザイン対応

