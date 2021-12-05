export interface IAssignmentEntity {
    _id: string;
    title: string;
    description: string;
    owner: string;
    firstName: string;
    lastName: string;
    createdAt: Date;
    expiryDate: Date;
    roomId: string;
    data: string;
    roomOwner: string;
    status: string;
}