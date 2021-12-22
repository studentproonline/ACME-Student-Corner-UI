import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'acme-sc-device-orientation',
    templateUrl: './acme-sc-device-orientation.component.html',
    styleUrls: ['./acme-sc-device-orientation.component.scss']
})
export class AcmeSCDeviceOrientationComponent {
    constructor(public dialogRef: MatDialogRef<AcmeSCDeviceOrientationComponent>) {

    }

    close() {
        this.dialogRef.close();
    }
}