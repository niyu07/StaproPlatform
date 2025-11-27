import { Button } from "@/components/ui/button";

export const Dashboard = () => {
  return (
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-bold">ダッシュボード</h1>
      <div className="card p-6 rounded-lg border bg-card">
        <p className="mb-4">ようこそ、Staproプラットフォームへ。</p>
        <p className="text-muted-foreground mb-6">
          左側のメニューから操作を選択してください。
        </p>
        
        <div className="flex gap-4 flex-wrap">
          <h2 className="w-full text-xl font-semibold mb-2">shadcn/ui コンポーネントテスト</h2>
          <Button>デフォルトボタン</Button>
          <Button variant="secondary">セカンダリボタン</Button>
          <Button variant="destructive">削除ボタン</Button>
          <Button variant="outline">アウトラインボタン</Button>
          <Button variant="ghost">ゴーストボタン</Button>
          <Button variant="link">リンクボタン</Button>
          <Button size="sm">小さいボタン</Button>
          <Button size="lg">大きいボタン</Button>
        </div>
      </div>
    </div>
  );
};
