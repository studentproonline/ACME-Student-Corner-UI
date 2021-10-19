import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

// dialog
import { AcmeSCSRoomCreateCommentComponent } from '../dialogs/create-comment/acme-sc-create-comment.component';
import { AcmeSCSessionExpiredComponent } from '../../../shared/components/dialogs/session-expired/acme-sc-session-expired.component';

// entities
import { ICommentEntity } from '../../entities/comment.entity';

// services
import { AcmeTopicCommentService } from '../../services/acme-sc-topic-comment.service';
import { AcmeSCAuthorizationService } from '../../../../core/services/acme-sc-authorization.service';

@Component({
    selector: 'acme-sc-room-topic-comments-list',
    templateUrl: './acme-sc-room-topic-comments-list.component.html',
    styleUrls: ['./acme-sc-room-topic-comments-list.component.scss']
})
export class AcmeSCRoomTopicCommentsListComponent implements OnInit {

    roomId: String;
    roomType: String;
    topicId: String;
    isProgress = false;
    isSuccessFull = false;
    roomOwner: string;
    isRoomActive = false;
    isTopicActive = false;
    commentsResponseMessage = '';
    commentsEntity: ICommentEntity;
    commentsList: any[] = [];
    isMore= false;
    currentPageNumber = 0;

    constructor(private route: ActivatedRoute, private router: Router,
        public dialog: MatDialog, private acmeTopicCommentService: AcmeTopicCommentService,
        private acmeSCAuthorizationService: AcmeSCAuthorizationService) {

    }

    ngOnInit() {
        this.route.queryParams
            .subscribe(params => {
                this.topicId = params.topicId;
                this.roomType = params.roomType;
                this.getComments(0);
            });
    }

    refrshCommentsList() {
        this.commentsList.length=0;
        this.currentPageNumber = 0;
        this.getComments(this.currentPageNumber);
    }

    fetchMoreRecords() {
        this.currentPageNumber = this.currentPageNumber+1;
        this.getComments(this.currentPageNumber);
    }

    getComments(pageNumber: Number) {
        // show progress
        this.isProgress = true;
        this.acmeTopicCommentService.getTopicComments(pageNumber,this.topicId, this.acmeSCAuthorizationService.getAccessToken()).subscribe(
            value => {
                const response: any = value;
                this.isProgress = false;
                this.isSuccessFull = true;
                this.commentsEntity = response.data;
                if (this.commentsEntity) {
                    this.roomId = this.commentsEntity.roomId;
                    this.roomOwner= this.commentsEntity.roomOwner;
                    if(this.commentsEntity.comments && this.commentsEntity.comments.length > 0) {
                        this.commentsList=this.commentsList.concat(this.commentsEntity.comments);
                        this.isMore = true;
                    } else{
                        this.currentPageNumber=this.currentPageNumber-1;
                        this.isMore = false;
                    }
                    if(this.commentsEntity.roomStatus === 'Active') {
                        this.isRoomActive = true;
                    }
                    if(this.commentsEntity.topicStatus === 'Active') {
                        this.isTopicActive = true;
                    }
                }
            },
            err => {
                this.isProgress = false;
                this.isSuccessFull = false;
                this.isMore = false;
                if (err.error && err.error.description) {
                    this.commentsResponseMessage = err.error.description;
                } else {
                    this.commentsResponseMessage = 'Server Error';
                }
                if(err.status === 401 || err.status === 401.1) {
                    //  show session expired dialog
                    this.openSessionExpiredDialog();
                }
            }
        );
    }

    goToAllTopics() {
        this.router.navigateByUrl('/roomDetails?roomId='+this.roomId+'&roomType='+this.roomType);
    }

    createComment() {
        const dialogRef = this.dialog.open(AcmeSCSRoomCreateCommentComponent, {
            width: '900px',
            height: '550px',
            panelClass: 'acme-sc-custom-container',
            disableClose: true,
            data: {
                roomId: this.roomId,
                topicId: this.topicId
            }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result && result.data) {
                this.commentsList.length=0;
                this.getComments(0);
            }
        });
    }

    // comment delete event
    commentDeleted() {
        // refresh comment list
        this.commentsList.length=0;
        this.getComments(0);
    }

    openSessionExpiredDialog(): void {
        const dialogRef = this.dialog.open(AcmeSCSessionExpiredComponent, {
            width: '700px',
            height: '100px',
            disableClose: true,
            data:{}
        });
        dialogRef.afterClosed().subscribe(result => {
        });
    }
}