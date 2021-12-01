import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import {ClipboardModule} from '@angular/cdk/clipboard';
import { AcmeSCSharedModule } from '../shared/acme-sc-shared.module';
import { AcmeSCRoomsExplorerRoutingModule } from './acme-sc-explorer-routing.module';

//components
import { AcmeSCMainPageComponent } from './components/home-page/aacme-sc-home-page.component';
import { AcmeSCNavigationSidebarComponent } from './components/navigation-side-bar/acme-sc-navigation-sidebar.component';
import { AcmeSCNavigationItemComponent } from './components/navigation-item/acme-sc-navigation-item.component';
import { AcmeSCRoomsDefaultComponent } from './components/rooms-default/acme-sc-rooms-default.component';
import { AcmeSCRoomsListComponent } from './components/rooms-list/acme-sc-rooms-list.component';
import { AcmeSCRoomComponent } from './components/room-card/acme-sc-room-card.component';
import { AcmeSCSharedRoomActivationComponent } from  './components/shared-room-activation/acme-sc-shared-room-activation.component';

// dialogs
import { AcmeSCCreateRoomComponent } from './components/dialogs/create-room/acme-sc-create-room.component';

//services
import { AcmeRoomService } from './services/acme-sc-room.service';
import { AcmeFavRoomService } from './services/acme-sc-fav-room.service';
import { AcmesharedRoomService} from '../shared/services/acme-sc-shared-room.service';
import { AcmesharedUiTuilitiesService} from '../shared/services/acme-sc-ui-utiltities.services';

@NgModule({
    declarations: [AcmeSCMainPageComponent,
        AcmeSCNavigationSidebarComponent,
        AcmeSCNavigationItemComponent,
        AcmeSCRoomsDefaultComponent,
        AcmeSCRoomsListComponent,
        AcmeSCRoomComponent,
        AcmeSCCreateRoomComponent,
        AcmeSCSharedRoomActivationComponent],
    imports: [
        FlexLayoutModule,
        AcmeSCSharedModule,
        ClipboardModule,
        AcmeSCRoomsExplorerRoutingModule

    ],
    providers: [AcmeRoomService, AcmeFavRoomService, AcmesharedRoomService, AcmesharedUiTuilitiesService],
    entryComponents: []
})
export class AcmeStudentCornerExplorerModule { }