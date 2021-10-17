import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AcmeSCSharedModule } from '../shared/acme-sc-shared.module';
import { AcmeSCTopicsRoutingModule } from './acme-sc-room-details-routing.module';

//components
import { AcmeSCRoomDetailsHomePageComponent } from './components/room-details-home-page/acme-sc-room-details-home-page.component';
import { AcmeSCRoomUsersListComponent } from './components/room-users-list/acme-sc-room-users-list.component';
import { AcmeSCRoomUserItemComponent } from './components/room-user-item/acme-sc-room-user-item.component';
import { AcmeSCRoomTopicsListComponent } from './components/room-topics-list/acme-sc-room-topics-list-component';
import { AcmeSCRoomTopicItemComponent } from './components/room-topic-item/acme-sc-room-topic.component';
import { AcmeSCRoomTopicVotesComponent } from './components/room-topic-votes/acme-sc-room-topic-votes.component';
import { AcmeSCRoomTopicViewsComponent } from './components/room-topic-views/acme-sc-room-topic-views.component';

// dialogs
import { AcmeSCSRoomCreateTopicComponent } from './components/dialogs/create-topic/acme-sc-create-topic.component';

//services
import { AcmeRoomDetailsService } from './services/acme-sc-room-details.service';
import { AcmesharedRoomService } from '../shared/services/acme-sc-shared-room.service';
import { AcmeRoomTopicsService } from './services/acme-sc-room-topics.service';

@NgModule({
    declarations: [AcmeSCRoomDetailsHomePageComponent,
        AcmeSCRoomUsersListComponent,
        AcmeSCRoomUserItemComponent,
        AcmeSCRoomTopicsListComponent,
        AcmeSCSRoomCreateTopicComponent,
        AcmeSCRoomTopicItemComponent,
        AcmeSCRoomTopicVotesComponent,
        AcmeSCRoomTopicViewsComponent],
    imports: [
        FlexLayoutModule,
        AcmeSCSharedModule,
        AcmeSCTopicsRoutingModule
    ],
    providers: [ AcmeRoomDetailsService, AcmesharedRoomService, AcmeRoomTopicsService ]
})

export class AcmeStudentCornerRoomDetailsModule { }