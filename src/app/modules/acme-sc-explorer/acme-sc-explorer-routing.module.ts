import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AcmeSCMainPageComponent } from './components/home-page/aacme-sc-home-page.component';
import { AcmeSCSharedRoomActivationComponent } from './components/shared-room-activation/acme-sc-shared-room-activation.component';

const routes: Routes = [
    {
        path: '',
        component: AcmeSCMainPageComponent

    },
    {
        path: 'ActivateRoom',
        component: AcmeSCSharedRoomActivationComponent
    }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: []
})
export class AcmeSCRoomsExplorerRoutingModule {

}