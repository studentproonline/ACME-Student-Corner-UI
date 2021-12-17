export interface IAssignmentEntity {
    _id: string;
    title: string;
    description: string;
    owner: string;
    ownerFirstName: string;
    ownerLastName: string;
    createdAt: Date;
    expiryDate: Date;
    roomId: string;
    data: string;
    roomOwner: string;
    fileName: string;
    status: string;
}