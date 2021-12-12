import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//components
import { AcmeSCAssesmentExplorerComponent } from './components/assesment-explore/acme-sc-room-assesment-explorer.component';
import { AcmeSCAssesmentDetailsComponent } from './components/assesment-details/acme-sc-room-assesment-details.component';

const routes: Routes = [
    {
        path: '',
        component: AcmeSCAssesmentExplorerComponent
    },
    {
        path: 'details',
        component: AcmeSCAssesmentDetailsComponent
    }
    
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: []
})
export class AcmeSCRoomAssesmentRoutingModule {
}