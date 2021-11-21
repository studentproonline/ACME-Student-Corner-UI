export interface ILibraryContentEntity {
    _id: string;
    roomId: string;
    name: string;
    owner: string;
    tags: string;
    description: string;
    contentType: string;
    createdOn: Date;
}