import { StudentCard } from "../components/StudentCard/StudentCard";
import {
    mockStudents,
    mockCurriculums,
    mockSchedules,
    getCurriculumMasterById,
} from "../mock/data";
import "./StudentsList.css";

export const StudentsList = () => {
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
                <h1 className="page-title">生徒情報一覧</h1>
                <p className="page-description">
                    登録されている生徒の情報を確認できます
                </p>
            </div>

            <div className="students-grid">
                {mockStudents.map((student) => {
                    const { curriculum, nextSchedule } = getStudentData(
                        student.user_id
                    );
                    return (
                        <StudentCard
                            key={student.user_id}
                            student={student}
                            curriculum={curriculum}
                            nextSchedule={nextSchedule}
                        />
                    );
                })}
            </div>
        </div>
    );
};
