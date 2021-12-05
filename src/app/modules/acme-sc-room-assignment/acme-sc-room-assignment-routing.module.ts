import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//components
import { AcmeSCAssignmentExplorerComponent } from './components/assignment-explore/acme-sc-room-assignment-explorer.component';
import { AcmeSCAssignmentDetailsComponent } from './components/assignment-details/acme-sc-room-assignment-details.component';

const routes: Routes = [
    {
        path: '',
        component: AcmeSCAssignmentExplorerComponent
    },
    {
        path: 'details',
        component: AcmeSCAssignmentDetailsComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: []
})
export class AcmeSCRoomAssignmentRoutingModule {
}