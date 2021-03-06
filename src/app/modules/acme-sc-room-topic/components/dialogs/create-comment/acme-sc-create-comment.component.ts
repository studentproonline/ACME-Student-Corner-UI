import { Component, Inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import Quill from 'quill';
import ImageResize from 'quill-image-resize-module';

// services
import { AcmeTopicCommentService } from '../../../services/acme-sc-topic-comment.service';
import { AcmeSCAuthorizationService } from '../../../../../core/services/acme-sc-authorization.service';

// model
import { IComment } from '../../../Models/comment';

//translation
import { TranslateService } from '@ngx-translate/core';

// voice recognition
import { AcmeSCVoiceRecognitionService } from '../../../../shared/services/acme-sc-voice-recognition.service';

Quill.register('modules/imageResize', ImageResize);


@Component({
    selector: 'acme-sc-create-comment',
    templateUrl: './acme-sc-create-comment.component.html',
    styleUrls: ['./acme-sc-create-comment.component.scss']
})
export class AcmeSCSRoomCreateCommentComponent {
    model: string = '';
    isProgress = false;
    startVoiceCapture = false;

    modules = {
        imageResize: { modules: ['Resize', 'DisplaySize', 'Toolbar'] },
        toolbar: [
            ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
            ['blockquote', 'code-block'],

            [{ 'header': 1 }, { 'header': 2 }],               // custom button values
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
            [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
            [{ 'direction': 'rtl' }],                         // text direction
            [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
            [{ 'font': [] }],
            [{ 'align': [] }],
            ['clean'],                                        // remove formatting button
            ['link', 'image', 'video']
        ]
    };

    constructor(public dialogRef: MatDialogRef<AcmeSCSRoomCreateCommentComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any, private snackBar: MatSnackBar,
        private acmeTopicCommentService: AcmeTopicCommentService,
        private acmeSCAuthorizationService: AcmeSCAuthorizationService,
        private translateService: TranslateService,
        public acmeSCVoiceRecognitionService: AcmeSCVoiceRecognitionService) {

    }

    startRecognition() {
        if (!this.startVoiceCapture) {
            this.acmeSCVoiceRecognitionService.init(this.model);
            this.acmeSCVoiceRecognitionService.start();
            
        } else {
            this.acmeSCVoiceRecognitionService.stop();
            this.model=this.acmeSCVoiceRecognitionService.text;
        }
        this.startVoiceCapture = !this.startVoiceCapture
        
    }

    createComment() {

        let x = (this.model.length * (3 / 4)) - 2 // bytes
        const sizeinMB = x / (1024 * 1024);

        if (!this.model || this.model.trim().length === 0) {
            this.snackBar.open(this.translateService.instant('ROOM_TOPIC_TOPIC_COMMENT_DIALOG_NO_COMMENT'), '', {
                duration: 3000
            });
        }

        if (sizeinMB > 2) {
            this.snackBar.open(this.translateService.instant('ROOM_TOPIC_TOPIC_COMMENT_DIALOG_COMMENT_SIZE'), '', {
                duration: 3000
            });
        }
        const comment: IComment = {
            roomId: this.data.roomId,
            topicId: this.data.topicId,
            data: this.model
        }
        // show progress
        this.isProgress = true;
        this.acmeTopicCommentService.createTopicComment(comment, this.acmeSCAuthorizationService.getAccessToken()).subscribe(
            value => {

                this.isProgress = false; // end progress
                this.snackBar.open(this.translateService.instant('"ROOM_TOPIC_TOPIC_COMMENT_DIALOG_COMMENT_ADD_SUCCESS_MESSAGE'), '', {
                    duration: 3000
                });
                this.dialogRef.close({ data: 'Comment Added' });
            },
            err => {
                this.isProgress = false; // end progress
                this.snackBar.open(err.error.description, '', {
                    duration: 3000
                });
            }
        );
    }

    cancelCommentCreation() {
        this.dialogRef.close();
    }

    ngOnDestroy() {
        if(this.startVoiceCapture){
            this.acmeSCVoiceRecognitionService.stop();
        }
    }
}
