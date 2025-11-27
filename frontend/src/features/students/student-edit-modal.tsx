import React, { useState, useEffect } from "react";
import type { Student } from "../../types/database";
import { Button } from "../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import "./student-edit-modal.css";

interface StudentEditModalProps {
  isOpen: boolean;
  student: Student | null;
  onClose: () => void;
  onSave: (updatedStudent: Student) => void;
}

const emptyStudent: Student = {
  user_id: 0,
  name: "",
  grade: "",
  email: "",
  status: "active",
  memo: "",
};

export const StudentEditModal = ({
  isOpen,
  student,
  onClose,
  onSave,
}: StudentEditModalProps) => {
  // Initialize form data based on student prop
  const [formData, setFormData] = useState<Student>(() => {
    return student ? { ...student } : { ...emptyStudent };
  });

  // Reset form when the modal opens or the selected student changes
  // Using useMemo to derive state from props to avoid setState in effect
  const initialFormData = React.useMemo(() => {
    return student ? { ...student } : { ...emptyStudent };
  }, [student]);

  React.useEffect(() => {
    if (isOpen) {
      // Schedule state update to avoid synchronous setState
      const updateFormData = () => {
        setFormData(initialFormData);
      };
      // Use requestAnimationFrame to defer state update
      const frameId = requestAnimationFrame(updateFormData);
      return () => cancelAnimationFrame(frameId);
    }
  }, [isOpen, initialFormData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      status: value as "active" | "inactive",
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[500px]">
        <DialogHeader>
          <DialogTitle>生徒情報の編集</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <Label htmlFor="name">名前</Label>
            <Input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <Label htmlFor="grade">学年</Label>
            <Input
              type="text"
              id="grade"
              name="grade"
              value={formData.grade}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <Label htmlFor="email">メールアドレス</Label>
            <Input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <Label htmlFor="status">ステータス</Label>
            <Select value={formData.status} onValueChange={handleStatusChange}>
              <SelectTrigger id="status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">在籍中 (Active)</SelectItem>
                <SelectItem value="inactive">休会・退会 (Inactive)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="form-group">
            <Label htmlFor="memo">メモ</Label>
            <textarea
              id="memo"
              name="memo"
              value={formData.memo || ""}
              onChange={handleChange}
              rows={4}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={onClose}>
              キャンセル
            </Button>
            <Button type="submit" variant="default">
              保存する
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
