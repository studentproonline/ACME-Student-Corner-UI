import { Component, Input, Output, EventEmitter } from '@angular/core';
@Component({
    selector: 'acme-sc-room-assesment-type-item',
    templateUrl: './acme-sc-assesnt-type-item.component.html',
    styleUrls: ['./acme-sc-assesnt-type-item.component.scss']
})
export class AcmeSCRoomAssesmentTypeItemComponent {
    @Output() itemClicked = new EventEmitter<string>();
    @Input() itemName: string;
    @Input() iconName: string
    @Input() selected: boolean =false;


    assesmentTypeItemClicked() {
        this.itemClicked.emit(this.itemName);
    }
}