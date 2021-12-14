import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'acme-sc-room-assesment-group-item',
    templateUrl: './acme-sc-room-assesment-group-item.component.html',
    styleUrls: ['./acme-sc-room-assesment-group-item.component.scss']
})
export class AcmeSCRoomAssesmentGroupItemComponent {
    @Input() assesmentGroupItem: any
    @Output() assesmentGroupItemClicked = new EventEmitter<string>();

    constructor() {

    }

    ItemClicked() {
        this.assesmentGroupItemClicked.emit(this.assesmentGroupItem);
    }
}