import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AcmeSCSharedModule } from '../shared/acme-sc-shared.module';
import { AcmeSCRoomConferenceRoutingModule } from './acme-sc-room-conference.routing.module';

import { NgxAgoraModule } from 'ngx-agora';

//components
import { AcmeSCConferenceRoomComponent } from './components/conference-room/acme-sc-conference-room.component';
import { AcmeSCConferenceRoomUsersListComponent } from './components/conference-room-users-list/acme-sc-conference-room-users-list.component';
import { AcmeSCConferenceRoomUserComponent } from './components/conference-room-user/acme-sc-conference-room-user';
import { AcmeSCConferenceRoomSelfViewComponent } from './components/conference-room-self-view/acme-sc-conference-room-self-view.component';

//services
import { AcmeSCConferenceRoomLibraryService } from './services/acme-sc-conference-room.service';

export const agoraConfig: any = {
    AppID: null //setting null here
};

@NgModule({
    declarations: [AcmeSCConferenceRoomComponent,
        AcmeSCConferenceRoomUsersListComponent,
        AcmeSCConferenceRoomUserComponent,
        AcmeSCConferenceRoomSelfViewComponent],

    imports: [FlexLayoutModule,
        AcmeSCSharedModule,
        AcmeSCRoomConferenceRoutingModule,
        NgxAgoraModule.forRoot(agoraConfig)],

    providers: [AcmeSCConferenceRoomLibraryService],

    entryComponents: []
})
export class AcmeStudentCornerRoomconferenceModule {
}