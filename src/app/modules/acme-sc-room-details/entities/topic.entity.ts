export interface ITopicEntity {
    _id: string;
    title: string;
    tags: string[];
    createdAt: Date;
    owner: string;
    ownerFirstName: string;
    ownerLastName: string;
    roomId: string;
    roomOwner: string;
    status: string;
}
