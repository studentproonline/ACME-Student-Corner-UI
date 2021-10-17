export interface ICommentEntity {
   
    roomId: string;
    topicId: string;
    topicStatus: string;
    topicTitle: string;
    roomOwner: string;
    roomStatus: string;
    comments: [];
}
