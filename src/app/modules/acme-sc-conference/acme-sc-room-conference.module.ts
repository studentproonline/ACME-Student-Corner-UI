import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AcmeSCSharedModule } from '../shared/acme-sc-shared.module';
import { AcmeSCRoomConferenceRoutingModule } from './acme-sc-room-conference.routing.module';

import { NgxAgoraModule } from 'ngx-agora';

//components
import { AcmeSCConferenceRoomComponent } from './components/conference-room/acme-sc-conference-room.component';
import { AcmeSCConferenceRoomUsersListComponent } from './components/conference-room-users-list/acme-sc-conference-room-users-list.component';
import { AcmeSCConferenceRoomUserComponent } from './components/conference-room-user/acme-sc-conference-room-user';

//services
import { AcmeSCConferenceRoomLibraryService } from './services/acme-sc-conference-room.service';

@NgModule({
    declarations: [AcmeSCConferenceRoomComponent,
        AcmeSCConferenceRoomUsersListComponent,
        AcmeSCConferenceRoomUserComponent],

    imports: [FlexLayoutModule,
        AcmeSCSharedModule,
        AcmeSCRoomConferenceRoutingModule,
        NgxAgoraModule.forRoot({ AppID: '9f02b64bac7c41639488ebc1b4f36cab' })],

    providers: [AcmeSCConferenceRoomLibraryService],

    entryComponents: []
})
export class AcmeStudentCornerRoomconferenceModule {
}