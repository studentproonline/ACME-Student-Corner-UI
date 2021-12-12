import { Component, Input, Output, EventEmitter } from '@angular/core';
@Component({
    selector: 'acme-sc-room-user-item',
    templateUrl: './acme-sc-room-user-item.html',
    styleUrls: ['./acme-sc-room-user-item.scss']
})
export class AcmeSCRoomUserItemComponent {
    @Output() itemClicked = new EventEmitter<any>();
    @Input() user: any;
    @Input() selected: boolean =false;


    userItemClicked() {
        this.itemClicked.emit(this.user);
    }
}