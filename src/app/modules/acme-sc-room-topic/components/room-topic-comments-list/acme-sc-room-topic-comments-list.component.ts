import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

// dialog
import { AcmeSCSRoomCreateCommentComponent } from '../dialogs/create-comment/acme-sc-create-comment.component';
import { AcmeSCSessionExpiredComponent } from '../../../shared/components/dialogs/session-expired/acme-sc-session-expired.component';

// entities
import { ICommentEntity } from '../../entities/comment.entity';
import { IRoomEntity } from '../../../shared/entities/acme-sc-room.entity';
import { ILoginEntity } from '../../../../core/entities/acme-sc-login.entity';

// services
import { AcmeTopicCommentService } from '../../services/acme-sc-topic-comment.service';
import { AcmeSCAuthorizationService } from '../../../../core/services/acme-sc-authorization.service';

//translation
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'acme-sc-room-topic-comments-list',
    templateUrl: './acme-sc-room-topic-comments-list.component.html',
    styleUrls: ['./acme-sc-room-topic-comments-list.component.scss']
})
export class AcmeSCRoomTopicCommentsListComponent implements OnInit {

    roomId: string;
    roomType: string;
    roomName: string;
    topicId: string;
    isProgress = false;
    isSuccessFull = false;
    roomOwner: string;
    isRoomActive = false;
    isTopicActive = false;
    commentsResponseMessage = '';
    roomDetailsEntity: IRoomEntity;
    commentsEntity: ICommentEntity;
    commentsList: any[] = [];
    isMore = false;
    currentPageNumber = 0;
    showSearchBox = false;
    nickName: string;
    fullName: string;
    commentTitle: string = '';

    loginEntity: ILoginEntity;

    constructor(private route: ActivatedRoute, private router: Router,
        public dialog: MatDialog, private acmeTopicCommentService: AcmeTopicCommentService,
        private acmeSCAuthorizationService: AcmeSCAuthorizationService,
        private translateService: TranslateService) {

        this.loginEntity = this.acmeSCAuthorizationService.getSession();
        const firstNameChar = (this.loginEntity.firstName.substring(0, 1)).toUpperCase();
        const lastNameChar = (this.loginEntity.lastName.substring(0, 1)).toUpperCase();
        this.nickName = firstNameChar.concat(lastNameChar);
        this.fullName = this.loginEntity.firstName.concat(' ', this.loginEntity.lastName);

    }

    ngOnInit() {
        this.route.queryParams
            .subscribe(params => {
                this.topicId = params.topicId;
                this.roomType = params.roomType;
                this.roomName = params.roomName;
                this.commentTitle = params.commentTitle;
                this.roomDetailsEntity = this.acmeSCAuthorizationService.getRoomDetails();
                this.getComments(0);
            });
    }

    refrshCommentsList() {
        this.commentsList.length = 0;
        this.currentPageNumber = 0;
        this.getComments(this.currentPageNumber);
    }

    fetchMoreRecords() {
        this.currentPageNumber = this.currentPageNumber + 1;
        this.getComments(this.currentPageNumber);
    }

    getComments(pageNumber: Number) {
        // show progress
        this.isProgress = true;
        this.acmeTopicCommentService.getTopicComments(pageNumber, this.topicId, this.acmeSCAuthorizationService.getAccessToken()).subscribe(
            value => {
                const response: any = value;
               
                this.commentsEntity = response.data;
                if (this.commentsEntity) {
                    this.commentTitle = this.commentsEntity.topicTitle;
                    this.roomId = this.commentsEntity.roomId;
                    this.roomOwner = this.commentsEntity.roomOwner;
                    this.isProgress = false;
                    this.isMore = false;
                    this.isSuccessFull = true;
                    if (this.commentsEntity.comments && this.commentsEntity.comments.length > 0) {
                        this.commentsList = this.commentsList.concat(this.commentsEntity.comments);
                        if (this.commentsEntity.comments.length >= 10) {
                            this.isMore = true;
                        }
                    } else {
                        this.currentPageNumber = this.currentPageNumber - 1;
                        this.isMore = false;
                    }
                    if (this.commentsEntity.roomStatus === 'Active') {
                        this.isRoomActive = true;
                    }
                    if (this.commentsEntity.topicStatus === 'Active') {
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
                    this.commentsResponseMessage = this.translateService.instant('ROOM_TOPIC_TOPIC_COMMENT_LIST_SERVER_ERROR');
                }
                if (err.status === 401 || err.status === 401.1) {
                    //  show session expired dialog
                    this.openSessionExpiredDialog();
                }
            }
        );
    }

    createComment() {
        const dialogRef = this.dialog.open(AcmeSCSRoomCreateCommentComponent, {
           // width: '47vw',
           // height: '42vh',
            width: '50vw',
            height: '70vh',
            panelClass: 'acme-sc-custom-container',
            disableClose: true,
            data: {
                roomId: this.roomId,
                topicId: this.topicId
            }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result && result.data) {
                this.commentsList.length = 0;
                this.getComments(0);
            }
        });
    }

    // comment delete event
    commentDeleted() {
        // refresh comment list
        this.currentPageNumber = 0;
        this.commentsList.length = 0;
        this.getComments(0);
    }

    openSessionExpiredDialog(): void {
        const dialogRef = this.dialog.open(AcmeSCSessionExpiredComponent, {
            width: '45.5vw',
            height: '14vh',
            disableClose: true,
            data: {}
        });
        dialogRef.afterClosed().subscribe(result => {
        });
    }
}