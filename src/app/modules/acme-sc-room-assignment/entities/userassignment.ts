export interface IUserAssignmentEntity {
    _id: string;
    assignmentId: string;
    submittedBy: string;
    submittedAt: Date;
    reviewedBy: string;
    reviewerFirstName: string;
    reviewerLastName: string;
    reviewedAt: Date;
    roomId: string;
    roomOwner: string;
    submitedData: string;
    submittedFileName: string;
    evaluatedData: string;
    evaluatedFileName: string;
    stars: string;
    status: string;
}