import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//components
import { AcmeSCConferenceRoomComponent } from './components/conference-room/acme-sc-conference-room.component';

const routes: Routes = [
    {
        path: '',
        component: AcmeSCConferenceRoomComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: []
})
export class AcmeSCRoomConferenceRoutingModule {
}