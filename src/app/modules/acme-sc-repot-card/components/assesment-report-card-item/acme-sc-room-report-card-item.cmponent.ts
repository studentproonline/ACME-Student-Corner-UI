import { Component, Input } from '@angular/core';

@Component({
    selector: 'acme-sc-room-report-card-item',
    templateUrl: './acme-sc-room-report-card-item.cmponent.html',
    styleUrls: ['./acme-sc-room-report-card-item.cmponent.scss']
})
export class AcmeSCRoomReportCardItemComponent {
    @Input() assesmentReportCardItem: any
   
    constructor() {

    }
}