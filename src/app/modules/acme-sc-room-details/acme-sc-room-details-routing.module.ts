import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//components
import { AcmeSCRoomDetailsHomePageComponent } from './components/room-details-home-page/acme-sc-room-details-home-page.component';

const routes: Routes = [
    {
        path: '',
        component: AcmeSCRoomDetailsHomePageComponent

    }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: []
})
export class AcmeSCTopicsRoutingModule {

}