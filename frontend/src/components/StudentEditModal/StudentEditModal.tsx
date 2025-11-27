import React, { useState, useEffect } from "react";
import type { Student } from "../../types/database";
import { Button } from "../ui/button";
import "./StudentEditModal.css";

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
  const [formData, setFormData] = useState<Student>(emptyStudent);

  // Reset form when the modal opens or the selected student changes
  useEffect(() => {
    if (student) {
      setFormData({ ...student });
    } else {
      setFormData({ ...emptyStudent });
    }
  }, [student, isOpen]);

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  // Close modal when Escape key is pressed
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} aria-hidden="true">
      <div
        className="modal-content"
        role="dialog"
        aria-modal="true"
        aria-labelledby="student-edit-modal-title"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
        tabIndex={-1}
      >
        <div className="modal-header">
          <h2 id="student-edit-modal-title">生徒情報の編集</h2>
          <button
            className="close-button"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">名前</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="grade">学年</label>
            <input
              type="text"
              id="grade"
              name="grade"
              value={formData.grade}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">メールアドレス</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="status">ステータス</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="active">在籍中 (Active)</option>
              <option value="inactive">休会・退会 (Inactive)</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="memo">メモ</label>
            <textarea
              id="memo"
              name="memo"
              value={formData.memo || ""}
              onChange={handleChange}
              rows={4}
            />
          </div>

          <div className="modal-actions">
            <Button type="button" variant="ghost" onClick={onClose}>
              キャンセル
            </Button>
            <Button type="submit" variant="default">
              保存する
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
