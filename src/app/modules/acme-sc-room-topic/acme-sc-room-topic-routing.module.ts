import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//components
import { AcmeSCRoomTopicCommentsListComponent } from './components/room-topic-comments-list/acme-sc-room-topic-comments-list.component';

const routes: Routes = [
    {
        path: 'comments',
        component: AcmeSCRoomTopicCommentsListComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: []
})
export class AcmeSCRoomsTopicRoutingModule {
}
