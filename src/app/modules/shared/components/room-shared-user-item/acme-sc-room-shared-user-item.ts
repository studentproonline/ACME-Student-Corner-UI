import { Component, Input, Output, EventEmitter } from '@angular/core';
@Component({
    selector: 'acme-sc-room-shared-user-item',
    templateUrl: './acme-sc-room-shared-user-item.html',
    styleUrls: ['./acme-sc-room-shared-user-item.scss']
})
export class AcmeSCRoomSharedUserItemComponent {
    @Output() itemClicked = new EventEmitter<any>();
    @Input() user: any;
    @Input() selected: boolean =false;


    userItemClicked() {
        this.itemClicked.emit(this.user);
    }
}