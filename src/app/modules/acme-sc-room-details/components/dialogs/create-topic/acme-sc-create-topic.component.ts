import { Component, Inject } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

// services
import { AcmeRoomTopicsService } from '../../../services/acme-sc-room-topics.service';
import { AcmeSCAuthorizationService } from '../../../../../core/services/acme-sc-authorization.service';

//models
import { ITopic } from '../../../Models/topic';
import { ITopicEntity } from '../../../entities/topic.entity';

@Component({
    selector: 'acme-sc-create-topic',
    templateUrl: './acme-sc-create-topic.component.html',
    styleUrls: ['./acme-sc-create-topic.component.scss']
})
export class AcmeSCSRoomCreateTopicComponent {
    topicFormGroup: any;
    isProgress = false;
    tags: string[] = [];

    selectable = false;
    removable = true;
    separatorKeysCodes: number[] = [ENTER, COMMA];

    constructor(public dialogRef: MatDialogRef<AcmeSCSRoomCreateTopicComponent>, private formBuilder: FormBuilder,
        private acmeRoomTopicsService: AcmeRoomTopicsService, private acmeSCAuthorizationService: AcmeSCAuthorizationService,
        private snackBar: MatSnackBar, @Inject(MAT_DIALOG_DATA) public data: any) {

        this.topicFormGroup = this.formBuilder.group({
            titleControl: ['', [Validators.required]],
            tagControl: []
        });

    }

    createTopic() {
        const titleControl = 'titleControl';

        const topic: ITopic = {
            roomId: this.data.roomId,
            title: this.topicFormGroup.controls[titleControl].value,
            tags: this.tags
        }
        // show progress
        this.isProgress = true;
        this.acmeRoomTopicsService.createRoomTopic(topic, this.acmeSCAuthorizationService.getAccessToken()).subscribe(
            value => {
                this.isProgress = false; // end progress
                this.snackBar.open('New discussion topic is successfully created.', '', {
                    duration: 3000
                });
                this.dialogRef.close({data: topic});
            },
            err => {
                this.isProgress = false; // end progress
                this.snackBar.open(err.error.description, '', {
                    duration: 3000
                });
            }
        );
    }

    cancelTopicCreation() {
        this.dialogRef.close();
    }

    addTag(event: MatChipInputEvent): void {
        const value = (event.value || '').trim();

        // Add tag
        if(this.tags.find(key => key.toUpperCase().trim() === value.toUpperCase().trim()) === undefined) {
            this.tags.push(value);
        }
          
        // Clear the input value
        event.chipInput!.clear();
    
        this.topicFormGroup.controls['tagControl'].setValue(null);
    }

    removeTag(tag: string) {

    }
}
