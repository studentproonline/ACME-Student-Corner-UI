import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AcmeSCSharedModule } from '../shared/acme-sc-shared.module';
import { AcmeSCRoomConferenceRoutingModule } from './acme-sc-room-conference.routing.module';

import { NgxAgoraModule } from 'ngx-agora';
import { GridsterModule } from 'angular-gridster2';

//components
import { AcmeSCConferenceRoomComponent } from './components/conference-room/acme-sc-conference-room.component';
import { AcmeSCConferenceRoomUsersListComponent } from './components/conference-room-users-list/acme-sc-conference-room-users-list.component';
import { AcmeSCConferenceRoomUserComponent } from './components/conference-room-user/acme-sc-conference-room-user';
import { AcmeSCConferenceRoomSelfViewComponent } from './components/conference-room-self-view/acme-sc-conference-room-self-view.component';

//services
import { AcmeSCConferenceRoomLibraryService } from './services/acme-sc-conference-room.service';
import { AcmesharedUiTuilitiesService} from '../shared/services/acme-sc-ui-utiltities.services';

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
        GridsterModule,
        AcmeSCRoomConferenceRoutingModule,
        NgxAgoraModule.forRoot(agoraConfig)],

    providers: [AcmeSCConferenceRoomLibraryService, AcmesharedUiTuilitiesService],

    entryComponents: []
})
export class AcmeStudentCornerRoomconferenceModule {
}