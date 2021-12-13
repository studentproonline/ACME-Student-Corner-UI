export interface IAssesmentEntity {
    _id: string;
    title: string;
    description: string;
    fileName: string;
    owner: string;
    group:string;
    ownerFirstName: string;
    ownerLastName: string;
    conductedOn: Date;
    roomId: string;
    roomOwner: string;
    status: string;
}