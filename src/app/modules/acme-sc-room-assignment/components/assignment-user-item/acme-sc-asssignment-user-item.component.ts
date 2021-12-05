import { Component, Input, Output, EventEmitter } from '@angular/core';
@Component({
    selector: 'acme-sc-room-assignment-user-item',
    templateUrl: './acme-sc-asssignment-user-item.component.html',
    styleUrls: ['./acme-sc-asssignment-user-item.component.scss']
})
export class AcmeSCRoomAssignmentUserItemComponent {
    @Output() itemClicked = new EventEmitter<any>();
    @Input() user: any;
    @Input() selected: boolean =false;


    userItemClicked() {
        this.itemClicked.emit(this.user);
    }
}