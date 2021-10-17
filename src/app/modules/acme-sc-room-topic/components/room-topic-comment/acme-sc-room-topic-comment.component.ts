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

    constructor( private acmeTopicCommentService: AcmeTopicCommentService,
        private acmeTopicCommentVoteService: AcmeTopicCommentVoteService,
        private acmeSCAuthorizationService: AcmeSCAuthorizationService,
        private snackBar: MatSnackBar,public dialog: MatDialog) {
    }
    
    ngOnInit() {
        this.loggedInUser =  this.acmeSCAuthorizationService.getSession().email;
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
                this.snackBar.open('Succesfully voted', '', {
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
            width: '500px',
            height: '150',
            panelClass: 'acme-sc-custom-container',
            disableClose: true,
            data: { message: 'This opearation will permanently delete the comment.' }
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
                this.snackBar.open('comment succesfully deleted.', '', {
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
