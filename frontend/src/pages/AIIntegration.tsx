import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Sparkles,
  Copy,
  RefreshCw,
  Send,
} from "lucide-react";
import { mockStudents } from "@/mock/data";

// モックデータ：生成された文章
const mockGeneratedText = `山田様

いつもお世話になっております。

本日、花子さんは二次関数の基礎について学習いたしました。花子さんは理解が早く、グラフの描き方も上達してきています。

以下の2点についてご確認をお願いいたします。

・前回お渡しした宿題の提出について
・次回の授業は11月22日（金）16:00を希望されております

引き続き、花子さんの学習をサポートさせていただきます。ご不明な点がございましたら、お気軽にお問い合わせください。

よろしくお願いいたします。`;

// クイックテンプレート
const quickTemplates = [
  "宿題未提出",
  "次回日程確認",
  "成績向上を褒める",
];

export function AIIntegration() {
  const [selectedStudent, setSelectedStudent] = useState<string>("");
  const [contactContent, setContactContent] = useState<string>(
    "・宿題が未提出です\n・次回は11月22日16:00を希望\n・前回のテストで良い成績でした"
  );
  const [generatedText, setGeneratedText] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  // 生徒選択の変更
  const handleStudentChange = (value: string) => {
    setSelectedStudent(value);
  };

  // クイックテンプレートの適用
  const handleTemplateClick = (template: string) => {
    const templateTexts: Record<string, string> = {
      "宿題未提出": "・宿題が未提出です\n・次回の授業までに提出をお願いします",
      "次回日程確認": "・次回の授業日程についてご確認をお願いします\n・ご希望の日時があればお知らせください",
      "成績向上を褒める": "・前回のテストで良い成績でした\n・引き続き頑張ってください",
    };
    setContactContent(templateTexts[template] || "");
  };

  // AI文章生成（モック）
  const handleGenerate = async () => {
    setIsGenerating(true);
    // モック：1秒後に生成された文章を表示
    setTimeout(() => {
      setGeneratedText(mockGeneratedText);
      setIsGenerating(false);
    }, 1000);
  };

  // 再生成
  const handleRegenerate = () => {
    handleGenerate();
  };

  // コピー
  const handleCopy = () => {
    if (generatedText) {
      navigator.clipboard.writeText(generatedText);
      // トースト通知などは後で実装
      alert("コピーしました");
    }
  };

  // LINEで送信（モック）
  const handleSendLine = () => {
    if (generatedText) {
      // 実際の実装ではLINE APIを呼び出す
      alert("LINEで送信しました（モック）");
    }
  };

  const selectedStudentData = mockStudents.find(
    (s) => s.user_id.toString() === selectedStudent
  );

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">AI連携機能</h1>
        <p className="text-muted-foreground">
          Gemini APIを活用した自動文章生成とレビュー
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 左側：入力条件 */}
        <Card>
          <CardHeader>
            <CardTitle>入力条件</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* 生徒選択 */}
            <div className="space-y-2">
              <Label htmlFor="student-select">生徒選択</Label>
              <Select
                value={selectedStudent}
                onValueChange={handleStudentChange}
              >
                <SelectTrigger id="student-select">
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
            </div>

            {/* 連絡内容 */}
            <div className="space-y-2">
              <Label htmlFor="contact-content">連絡内容（箇条書き）</Label>
              <textarea
                id="contact-content"
                className="w-full min-h-[200px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={contactContent}
                onChange={(e) => setContactContent(e.target.value)}
                placeholder="・連絡内容を箇条書きで入力してください"
              />
            </div>

            {/* クイックテンプレート */}
            <div className="space-y-2">
              <Label>クイックテンプレート</Label>
              <div className="flex flex-wrap gap-2">
                {quickTemplates.map((template) => (
                  <Button
                    key={template}
                    variant="outline"
                    size="sm"
                    onClick={() => handleTemplateClick(template)}
                  >
                    {template}
                  </Button>
                ))}
              </div>
            </div>

            {/* AI文章生成ボタン */}
            <Button
              onClick={handleGenerate}
              disabled={!selectedStudent || !contactContent || isGenerating}
              className="w-full"
              size="lg"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              {isGenerating ? "生成中..." : "AI文章生成"}
            </Button>
          </CardContent>
        </Card>

        {/* 右側：生成結果 */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>生成結果</CardTitle>
              {generatedText && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopy}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  コピー
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* 生成された文章 */}
            {generatedText ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold">授業コメントレビュー</h3>
                  <div className="rounded-md border bg-muted/50 p-4 min-h-[300px] whitespace-pre-wrap text-sm">
                    {generatedText}
                  </div>
                </div>

                {/* AI免責事項 */}
                <div className="flex items-start gap-2 p-3 bg-muted/30 rounded-md text-xs text-muted-foreground">
                  <Sparkles className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <p>
                    Gemini APIにより生成された文章です。内容を確認の上、ご使用ください。
                  </p>
                </div>

                {/* アクションボタン */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={handleRegenerate}
                    className="flex-1"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    再生成
                  </Button>
                  <Button
                    onClick={handleSendLine}
                    className="flex-1"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    LINEで送信
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center min-h-[300px] text-muted-foreground">
                <div className="text-center">
                  <Sparkles className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>左側の条件を入力して「AI文章生成」をクリックしてください</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

