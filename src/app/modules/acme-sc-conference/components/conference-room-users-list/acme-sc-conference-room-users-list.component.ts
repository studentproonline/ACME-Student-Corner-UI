import { Component, Input} from '@angular/core';

@Component({
    selector: 'acme-sc-conference-room-users-list',
    templateUrl: './acme-sc-conference-room-users-list.component.html',
    styleUrls: ['./acme-sc-conference-room-users-list.component.scss']
})
export class AcmeSCConferenceRoomUsersListComponent {
    @Input() connectedUsersNameList;
}