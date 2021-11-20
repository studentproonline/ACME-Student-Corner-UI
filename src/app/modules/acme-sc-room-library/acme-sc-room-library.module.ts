import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AcmeSCSharedModule } from '../shared/acme-sc-shared.module';
import { AcmeSCRoomLibraryRoutingModule } from './acme-sc-room-library-routing.module';

//components
import { AcmeSCLibraryExplorerComponent } from './components/library-explorer/acme-sc-room-library-explorer.component';
import { AcmeSCRoomTopicsListComponent } from './components/library-contents-list/acme-sc-room-library-contents-list.component';
//import { AcmeSCAchievementCardComponent } from './components/achievement-card/acme-sc-achievement-card.component';

//services
import { AcmeSCRoomLibraryService } from './services/acme-sc-room-library.service';

@NgModule({
    declarations: [AcmeSCLibraryExplorerComponent,
        AcmeSCRoomTopicsListComponent],

    imports: [FlexLayoutModule,
        AcmeSCSharedModule,
        AcmeSCRoomLibraryRoutingModule],

    providers: [AcmeSCRoomLibraryService],

    entryComponents: []
})
export class AcmeStudentCornerRoomLibraryModule {
}