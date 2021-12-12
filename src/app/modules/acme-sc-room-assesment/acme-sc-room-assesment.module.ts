import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AcmeSCSharedModule } from '../shared/acme-sc-shared.module';
import { AcmeSCRoomAssesmentRoutingModule } from './acme-sc-room-assesment-routing.module';

// components
import { AcmeSCAssesmentExplorerComponent } from './components/assesment-explore/acme-sc-room-assesment-explorer.component';
import { AcmeSCRoomAssesmentTypesComponent } from './components/assesment-types-list/acme-sc-room-assesment-types-list.component';
import { AcmeSCRoomAssesmentTypeItemComponent } from './components/assesment-type-item/acme-sc-assesnt-type-item.component';
import { AcmeSCRoomAssesmentListComponent } from './components/assesment-list/acme-sc-room-assesment-list.component';
import { AcmeSUploadAssesmentComponent } from './components/dialogs/upload-aasesment/acme-sc-upload-assesment.component';
import { AcmeSCRoomAssesmentItemComponent } from './components/assesment-item/acme-sc-room-assesment-item.component';
import { AcmeSCAssesmentDetailsComponent } from  './components/assesment-details/acme-sc-room-assesment-details.component';
import { AcmeSCAssesmentEvaluationComponent } from './components/assesment-evaluation/acme-sc-room-assesment-evaluation.component';

//services
import { AcmeSCRoomAssesmentService } from './services/acme-sc-room-assesment.service';
import { AcmesharedRoomService } from '../shared/services/acme-sc-shared-room.service';
import { AcmesharedUiTuilitiesService } from '../shared/services/acme-sc-ui-utiltities.services';

// quill editor
import { QuillModule } from 'ngx-quill';

@NgModule({
    declarations: [AcmeSCAssesmentExplorerComponent,
        AcmeSCRoomAssesmentTypesComponent,
        AcmeSCRoomAssesmentTypeItemComponent,
        AcmeSCRoomAssesmentListComponent,
        AcmeSUploadAssesmentComponent,
        AcmeSCRoomAssesmentItemComponent,
        AcmeSCAssesmentDetailsComponent,
        AcmeSCAssesmentEvaluationComponent],

    imports: [FlexLayoutModule,
        AcmeSCSharedModule,
        AcmeSCRoomAssesmentRoutingModule,
        QuillModule],

    providers: [AcmesharedRoomService, AcmeSCRoomAssesmentService,
        AcmesharedUiTuilitiesService],

    entryComponents: []
})
export class AcmeStudentCornerRoomAssesmentModule {
}
