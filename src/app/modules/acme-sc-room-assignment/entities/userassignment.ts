export interface IUserAssignmentEntity {
    _id: string;
    assignmentId: string;
    submittedBy: string;
    submittedAt: Date;
    reviewedBy: string;
    reviewedAt: Date;
    roomId: string;
    data: string;
    evaluatedData: string;
    stars: Number;
    status: string;
}