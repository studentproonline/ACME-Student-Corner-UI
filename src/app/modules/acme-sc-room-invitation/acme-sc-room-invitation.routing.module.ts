import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//components
import { AcmeSCSharedRoomShareRequestComponent } from './components/room-share-request/acme-sc-room-share-request.component';

const routes: Routes = [
    {
        path: '',
        component: AcmeSCSharedRoomShareRequestComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: []
})
export class AcmeSCRoomInvitationRoutingModule {
}