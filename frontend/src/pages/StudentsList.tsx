import { useState } from "react";
import type { Student } from "../types/database";
import { StudentCard } from "../components/StudentCard/StudentCard";
import { SearchBar } from "../components/SearchBar/SearchBar";
import { StudentEditModal } from "../components/StudentEditModal/StudentEditModal";
import {
    mockStudents as initialMockStudents,
    mockCurriculums,
    mockSchedules,
    getCurriculumMasterById,
} from "../mock/data";
import "./StudentsList.css";

export const StudentsList = () => {
    const [students, setStudents] = useState(initialMockStudents);
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // メモ保存処理（カード上の簡易編集）
    const handleSaveMemo = (userId: number, memo: string) => {
        console.log(`Saving memo for user ${userId}: ${memo}`);
        setStudents((prevStudents) =>
            prevStudents.map((student) =>
                student.user_id === userId ? { ...student, memo } : student
            )
        );
    };

    // 詳細ボタンクリック時の処理
    const handleDetailClick = (student: Student) => {
        setSelectedStudent(student);
        setIsModalOpen(true);
    };

    // 生徒情報の更新処理（モーダルからの保存）
    const handleUpdateStudent = (updatedStudent: Student) => {
        console.log("Updating student:", updatedStudent);
        setStudents((prevStudents) =>
            prevStudents.map((student) =>
                student.user_id === updatedStudent.user_id ? updatedStudent : student
            )
        );
        setIsModalOpen(false);
        setSelectedStudent(null);
    };

    // 各生徒のカリキュラムと次回スケジュールを取得
    const getStudentData = (userId: number) => {
        // 生徒のカリキュラムを取得（最初の1つを表示）
        const studentCurriculum = mockCurriculums
            .filter((c) => c.user_id === userId)
            .map((c) => getCurriculumMasterById(c.curriculum_id))
            .find((c) => c !== undefined);

        // 次回のスケジュールを取得（未来の最も近いスケジュール）
        const now = new Date();
        const nextSchedule = mockSchedules
            .filter((s) => s.user_id === userId && new Date(s.start_time) > now)
            .sort(
                (a, b) =>
                    new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
            )[0];

        return {
            curriculum: studentCurriculum,
            nextSchedule,
        };
    };

    return (
        <div className="students-list-container">
            <div className="students-list-header">
                <h1 className="page-title">生徒情報</h1>
                <p className="page-description">
                    登録されている生徒の一覧と詳細情報
                </p>
            </div>

            <div className="search-section">
                <div className="search-card">
                    <SearchBar placeholder="生徒名、学年、科目で検索..." />
                </div>
            </div>

            <div className="students-grid">
                {students.map((student) => {
                    const { curriculum, nextSchedule } = getStudentData(
                        student.user_id
                    );
                    return (
                        <StudentCard
                            key={student.user_id}
                            student={student}
                            curriculum={curriculum}
                            nextSchedule={nextSchedule}
                            onSaveMemo={handleSaveMemo}
                            onDetailClick={handleDetailClick}
                        />
                    );
                })}
            </div>

            <StudentEditModal
                isOpen={isModalOpen}
                student={selectedStudent}
                onClose={() => setIsModalOpen(false)}
                onSave={handleUpdateStudent}
            />
        </div>
    );
};
