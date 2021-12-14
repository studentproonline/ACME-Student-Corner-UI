export interface IUserAssesmentEntity {
    _id: string;
    assesmentId: string;
    submittedBy: string;
    submittedAt: Date;
    reviewedBy: string;
    reviewerFirstName: string;
    reviewerLastName: string;
    submittedFileName: string;
    evaluatedFileName: string;
    reviewedAt: Date;
    roomId: string;
    roomOwner: string;
    data: string;
    evaluatedData: string;
    grade: string;
    marksObtained: number;
    totalMarks: number
    status: string;
    assesmentTitle: string;
    group: string;
}