# モックデータ

このディレクトリには、Supabaseデータベースの仕様書に基づいたモックデータが含まれています。

## ファイル構成

- `data.ts`: すべてのモックデータとヘルパー関数

## データ構造

### マスターデータ

- **schools（校舎）**: 出汐校、五日市校、西風新都校
- **mentors（メンター）**: 河村、宇田、西岡
- **curriculum_master（カリキュラムマスター）**: スクラッチ、マイクラ、HTML、Javascript、Unity

### トランザクションデータ

- **students（生徒）**: 田中一郎（101）、木村太郎（102）、竹本花子（103）
- **schedules（授業スケジュール）**: 各生徒の過去・現在・未来のスケジュール
- **curriculums（カリキュラム進行）**: 各生徒のカリキュラム進行状況
- **admins（管理者）**: 管理者アカウント情報

## 使用方法

```typescript
import { mockData, getScheduleWithRelations } from "./mock/data";

// すべてのデータにアクセス
const allSchools = mockData.schools;
const allStudents = mockData.students;

// リレーションを含むデータを取得
const schedule = mockData.schedules[0];
const scheduleWithRelations = getScheduleWithRelations(schedule);
```

## 注意事項

- スケジュールの日時は実行時に動的に生成されます（現在日時を基準）
- UUIDはモック用の固定値です
- 実際のSupabaseデータベースに接続する際は、このモックデータを置き換えてください

