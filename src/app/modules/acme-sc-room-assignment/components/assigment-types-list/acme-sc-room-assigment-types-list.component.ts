import { Component, Output,  EventEmitter} from '@angular/core';

@Component({
    selector: 'acme-sc-room-assignment-types-list',
    templateUrl: './acme-sc-room-assigment-types-list.component.html',
    styleUrls: ['./acme-sc-room-assigment-types-list.component.scss']
})
export class AcmeSCRoomAssignmentTypesComponent {

    allAssignmentsSelected =true;
    activesSelected =false;
    expiredSelected =false;
    closedSelected =false;

    @Output() itemClicked = new EventEmitter<string>();

    allAssignmentsItemClicked() {
       
        this.allAssignmentsSelected =true;
        this.activesSelected =false;
        this.expiredSelected =false;
        this.closedSelected = false;
        this.itemClicked.emit('All');
    }

    activeAssignmentsItemClicked() {
        this.allAssignmentsSelected =false;
        this.activesSelected =true;
        this.expiredSelected =false;
        this.closedSelected = false;
        this.itemClicked.emit('Active');
    }

    expiredAssignmentsItemClicked() {
        this.allAssignmentsSelected =false;
        this.activesSelected =false;
        this.expiredSelected =true;
        this.closedSelected = false;
        this.itemClicked.emit('Expired');
    }

    closedAssignmentsItemClicked() {
        this.allAssignmentsSelected =false;
        this.activesSelected =false;
        this.expiredSelected =false;
        this.closedSelected = true;
        this.itemClicked.emit('Closed');
    }

}
