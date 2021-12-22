import { Component, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AcmeSCCreateRoomComponent } from '../dialogs/create-room/acme-sc-create-room.component';

import { IRoomModel } from '../../models/acme-sc-room.model';

@Component({
    selector: 'acme-sc-rooms-default',
    templateUrl: './acme-sc-rooms-default.component.html',
    styleUrls: ['./acme-sc-rooms-default.component.scss']
})
export class AcmeSCRoomsDefaultComponent {
    @Output() roomCreated = new EventEmitter<IRoomModel>();
    
    constructor( public dialog: MatDialog, private snackBar: MatSnackBar) {

    }
    
    createRoom() {
        const dialogRef = this.dialog.open(AcmeSCCreateRoomComponent, {
            width: '40vw',
            height: '45vh',
            panelClass: 'acme-sc-custom-container',
            disableClose: true,
            data: {}
        });
        dialogRef.afterClosed().subscribe(result => {
            if(result.data) {
                this.roomCreated.emit(result.data);
            }
        });
    }
}