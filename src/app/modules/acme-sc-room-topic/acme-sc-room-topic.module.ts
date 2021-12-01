import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AcmeSCSharedModule } from '../shared/acme-sc-shared.module';
import { AcmeSCRoomsTopicRoutingModule } from './acme-sc-room-topic-routing.module';

//components
import { AcmeSCRoomTopicCommentsListComponent } from './components/room-topic-comments-list/acme-sc-room-topic-comments-list.component';
import { AcmeSCRoomTopicCommentComponent } from './components/room-topic-comment/acme-sc-room-topic-comment.component';

//dialogs
import { AcmeSCSRoomCreateCommentComponent } from './components/dialogs/create-comment/acme-sc-create-comment.component';

// quill editor
import { QuillModule } from 'ngx-quill';

//services
import { AcmeTopicCommentService } from './services/acme-sc-topic-comment.service';
import { AcmeTopicCommentVoteService } from './services/acme-sc-topic-comment-vote.service';
import { AcmesharedUiTuilitiesService} from '../shared/services/acme-sc-ui-utiltities.services';

@NgModule({
    declarations: [AcmeSCRoomTopicCommentsListComponent,
        AcmeSCRoomTopicCommentComponent,
        AcmeSCSRoomCreateCommentComponent],
    imports: [
        FlexLayoutModule,
        AcmeSCSharedModule,
        AcmeSCRoomsTopicRoutingModule,
        QuillModule
    ],
    providers: [AcmeTopicCommentService,
        AcmeTopicCommentVoteService, AcmesharedUiTuilitiesService],
    entryComponents: []
})
export class AcmeStudentCornerTopicModule {
}
