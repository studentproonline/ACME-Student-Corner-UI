import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AcmeSCSharedModule } from '../shared/acme-sc-shared.module';
import { AcmeSCRoomReportCardRoutingModule } from './acme-sc-room-report-card-routing.module';

//components
import { AcmeSCReportCardExplorerComponent } from './components/report-card-explorer/acme-sc-room-report-card-explorer.component';
import { AcmeSCRoomAssesmentGroupListComponent } from  './components/assesment-group-list/acme-sc-room-assesment-group-list.component';
import { AcmeSCRoomAssesmentGroupItemComponent } from './components/assesment-group-item/acme-sc-room-assesment-group-item.component';
import { AcmeSCAssesmentReportCardComponent } from './components/assesment-report-card/acme-sc-room-assesment-report-card.component';
import { AcmeSCRoomReportCardItemComponent } from './components/assesment-report-card-item/acme-sc-room-report-card-item.cmponent';
import { AcmeSCReportCardCommentComponent } from './components/dialogs/comments/acme-sc-report-card-comments.component';

//services
import { AcmeSCRoomReportCardService } from './services/acme-sc-room-report-card.service';
import { AcmesharedUiTuilitiesService} from '../shared/services/acme-sc-ui-utiltities.services';
import { AcmesharedRoomService } from '../shared/services/acme-sc-shared-room.service';

// quill editor
import { QuillModule } from 'ngx-quill';

@NgModule({
    declarations: [ AcmeSCReportCardExplorerComponent,
        AcmeSCRoomAssesmentGroupListComponent,
        AcmeSCRoomAssesmentGroupItemComponent,
        AcmeSCAssesmentReportCardComponent,
        AcmeSCRoomReportCardItemComponent,
        AcmeSCReportCardCommentComponent],

    imports: [FlexLayoutModule,
        AcmeSCSharedModule,
        AcmeSCRoomReportCardRoutingModule,
        QuillModule],

    providers: [AcmesharedUiTuilitiesService, AcmeSCRoomReportCardService, AcmesharedRoomService],

    entryComponents: []
})
export class AcmeStudentCornerRoomReportCardModule {
}