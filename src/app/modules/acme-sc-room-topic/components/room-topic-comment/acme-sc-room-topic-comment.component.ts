import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';

import { AcmeSCUserConfirmationComponent } from '../../../shared/components/dialogs/user-confirmation/acme-sc-user-confirmation.component';

// services
import { AcmeTopicCommentService } from '../../services/acme-sc-topic-comment.service';
import { AcmeSCAuthorizationService } from '../../../../core/services/acme-sc-authorization.service';
import { AcmeTopicCommentVoteService } from '../../services/acme-sc-topic-comment-vote.service';

// model
import { IVote } from '../../models/vote';

//translation
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'acme-sc-room-topic-comment',
    templateUrl: './acme-sc-room-topic-comment.component.html',
    styleUrls: ['./acme-sc-room-topic-comment.component.scss']
})
export class AcmeSCRoomTopicCommentComponent implements OnInit {
    @Input() comment: any
    @Input() roomOwner: any
    @Output() commentDeleted = new EventEmitter();

    loggedInUser: string;
    isProgress = false;
    iscontentOrRoomOwner: boolean = false;

    constructor( private acmeTopicCommentService: AcmeTopicCommentService,
        private acmeTopicCommentVoteService: AcmeTopicCommentVoteService,
        private acmeSCAuthorizationService: AcmeSCAuthorizationService,
        private snackBar: MatSnackBar,public dialog: MatDialog,
        private translateService: TranslateService) {
    }
    
    ngOnInit() {
        this.loggedInUser =  this.acmeSCAuthorizationService.getSession().email;
        const userRoomRole = this.acmeSCAuthorizationService.getUserRoomRole();
        if( userRoomRole === 'Owner' || userRoomRole === 'Admin') {
            this.iscontentOrRoomOwner = true;
        }
    }

    vote(voteType: Number) {

        const vote: IVote = {
            commentId: this.comment._id,
            voteType: voteType
        }
        this.acmeTopicCommentVoteService.createTopicComment(vote, this.acmeSCAuthorizationService.getAccessToken()).subscribe(
            value => {
                
                if(voteType === 1) {
                    this.comment.thumbsUpCount =  this.comment.thumbsUpCount+1;
                } else {
                    this.comment.thumbsDownCount =  this.comment.thumbsDownCount+1;
                }
                this.snackBar.open(this.translateService.instant('ROOM_TOPIC_TOPIC_COMMENT_VOTE_SUCCESS'), '', {
                    duration: 3000
                });
            },
            err => {
                this.snackBar.open(err.error.description, '', {
                    duration: 3000
                });
            }
        );
    }

    deleteComment() {
        const dialogRef = this.dialog.open(AcmeSCUserConfirmationComponent, {
            width: '32.5vw',
            height: '20vh',
            panelClass: 'acme-sc-custom-container',
            disableClose: true,
            data: { message: this.translateService.instant('ROOM_TOPIC_TOPIC_COMMENT_DELTE_WARNING_MESSAGE') }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result.data === 'true') {
                this.deleteTopicComment();
            }
        });
    }

    // delete comment
    deleteTopicComment() {
        this.isProgress= true;
        this.acmeTopicCommentService.deleteTopicComment(this.comment._id, this.acmeSCAuthorizationService.getAccessToken()).subscribe(
            value => {
                this.isProgress= false;
                this.snackBar.open(this.translateService.instant('ROOM_TOPIC_TOPIC_COMMENT_DELTE_SUCCESS_MESSAGE'), '', {
                    duration: 3000
                });
                this.commentDeleted.emit();
            },
            err => {
                this.isProgress= false;
                this.snackBar.open(err.error.description, '', {
                    duration: 3000
                });
            }
        );
    }
}
