import { Component, Input, Output, EventEmitter } from '@angular/core';
@Component({
    selector: 'acme-sc-room-assignment-type-item',
    templateUrl: './acme-sc-assignment-type-item.component.html',
    styleUrls: ['./acme-sc-assignment-type-item.component.scss']
})
export class AcmeSCRoomAssignmentTypeItemComponent {
    @Output() itemClicked = new EventEmitter<string>();
    @Input() itemName: string;
    @Input() iconName: string
    @Input() selected: boolean =false;


    assignementTypeItemClicked() {
        this.itemClicked.emit(this.itemName);
    }
}