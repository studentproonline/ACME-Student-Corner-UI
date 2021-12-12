import { Component, Output,  EventEmitter} from '@angular/core';

@Component({
    selector: 'acme-sc-room-assesment-types-list',
    templateUrl: './acme-sc-room-assesment-types-list.component.html',
    styleUrls: ['./acme-sc-room-assesment-types-list.component.scss']
})
export class AcmeSCRoomAssesmentTypesComponent {
    allAssesmentsSelected =true;
    activesSelected =false;
    ScheduledSelected =false;
    closedSelected =false;

    @Output() itemClicked = new EventEmitter<string>();

    allAssesmentsItemClicked() {
       
        this.allAssesmentsSelected =true;
        this.activesSelected =false;
        this.ScheduledSelected =false;
        this.closedSelected = false;
        this.itemClicked.emit('All');
    }

    activeAssesmentsItemClicked() {
        this.allAssesmentsSelected =false;
        this.activesSelected =true;
        this.ScheduledSelected =false;
        this.closedSelected = false;
        this.itemClicked.emit('Active');
    }

    scheduledAssesmentsItemClicked() {
        this.allAssesmentsSelected =false;
        this.activesSelected =false;
        this.ScheduledSelected =true;
        this.closedSelected = false;
        this.itemClicked.emit('Scheduled');
    }

    closedAssesmentsItemClicked() {
        this.allAssesmentsSelected =false;
        this.activesSelected =false;
        this.ScheduledSelected =false;
        this.closedSelected = true;
        this.itemClicked.emit('Closed');
    }
}