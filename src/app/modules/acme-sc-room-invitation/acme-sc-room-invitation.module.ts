import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AcmeSCSharedModule } from '../shared/acme-sc-shared.module';
import { AcmeSCRoomInvitationRoutingModule } from './acme-sc-room-invitation.routing.module';

import { NgxAgoraModule } from 'ngx-agora';

//components
import { AcmeSCSharedRoomShareRequestComponent } from './components/room-share-request/acme-sc-room-share-request.component';

//dialogs
import { AcmeSCGetRoomPublicDetailsComponent} from './components/dialogs/room-public-details/acme-sc-room-public-details.component';


//services
import { AcmesharedRoomService } from '../shared/services/acme-sc-shared-room.service';

export const agoraConfig: any = {
    AppID: null //setting null here
};

@NgModule({
    declarations: [AcmeSCSharedRoomShareRequestComponent,
        AcmeSCGetRoomPublicDetailsComponent],

    imports: [FlexLayoutModule,
        AcmeSCSharedModule,
        AcmeSCRoomInvitationRoutingModule,
        NgxAgoraModule.forRoot(agoraConfig)],

    providers: [AcmesharedRoomService],

    entryComponents: []
})
export class AcmeStudentCornerRoomInvitationModule {
}