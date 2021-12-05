import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AcmeSCSharedModule } from '../shared/acme-sc-shared.module';
import { AcmeSCRoomAssignmentRoutingModule } from './acme-sc-room-assignment-routing.module';

//components
import { AcmeSCAssignmentExplorerComponent } from './components/assignment-explore/acme-sc-room-assignment-explorer.component';
import { AcmeSCRoomAssignmentListComponent } from './components/assignment-list/acme-sc-room-assignment-list.component';
import { AcmeSCRoomAssignmentItemComponent } from './components/assignment-item/acme-sc-room-assignment-item.component';
import { AcmeSUploadAssignmentComponent } from './components/dialogs/upload-assignment/acme-sc-upload-assignment.component';
import { AcmeSCRoomAssignmentTypesComponent } from './components/assigment-types-list/acme-sc-room-assigment-types-list.component';
import { AcmeSCRoomAssignmentTypeItemComponent } from './components/assignment-type-item/acme-sc-assignment-type-item.component';
import { AcmeSCAssignmentDetailsComponent } from './components/assignment-details/acme-sc-room-assignment-details.component';
import { AcmeSCAssignmentEvaluationComponent} from './components/assignment-evaluation/acme-sc-room-assignment-evaluation.component';
import { AcmeSCRoomAssignmentUsersListComponent } from './components/assignement-users-list/acme-sc-room-assignment-users-list.component';
import { AcmeSCRoomAssignmentUserItemComponent } from './components/assignment-user-item/acme-sc-asssignment-user-item.component';
import { AcmeSCAssignmentSubmissionComponent } from './components/assignment-submission/acme-sc-room-assignment-submission.component';

//services
import { AcmeSCRoomAssignmentService } from './services/acme-sc-room-assigment.service';
import { AcmesharedUiTuilitiesService } from '../shared/services/acme-sc-ui-utiltities.services';
import { AcmesharedRoomService } from '../shared/services/acme-sc-shared-room.service';

// quill editor
import { QuillModule } from 'ngx-quill';

@NgModule({
    declarations: [AcmeSCAssignmentExplorerComponent,
        AcmeSCRoomAssignmentListComponent,
        AcmeSUploadAssignmentComponent,
        AcmeSCRoomAssignmentItemComponent,
        AcmeSCRoomAssignmentTypesComponent,
        AcmeSCRoomAssignmentTypeItemComponent,
        AcmeSCAssignmentDetailsComponent,
        AcmeSCAssignmentEvaluationComponent,
        AcmeSCRoomAssignmentUsersListComponent,
        AcmeSCRoomAssignmentUserItemComponent,
        AcmeSCAssignmentSubmissionComponent],

    imports: [FlexLayoutModule,
        AcmeSCSharedModule,
        AcmeSCRoomAssignmentRoutingModule,
        QuillModule],

    providers: [AcmeSCRoomAssignmentService, AcmesharedUiTuilitiesService, AcmesharedRoomService ],

    entryComponents: []
})
export class AcmeStudentCornerRoomAssignmentModule {
}