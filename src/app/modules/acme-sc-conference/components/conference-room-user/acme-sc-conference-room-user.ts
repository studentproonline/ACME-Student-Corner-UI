import { Component, Input } from '@angular/core';

@Component({
    selector: 'acme-sc-conference-room-user',
    templateUrl: './acme-sc-conference-room-user.html',
    styleUrls: ['./acme-sc-conference-room-user.scss']
})
export class AcmeSCConferenceRoomUserComponent {
    @Input() userName;
}