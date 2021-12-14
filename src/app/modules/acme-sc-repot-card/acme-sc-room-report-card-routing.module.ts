import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//components
import { AcmeSCReportCardExplorerComponent } from './components/report-card-explorer/acme-sc-room-report-card-explorer.component';
import { AcmeSCAssesmentReportCardComponent } from './components/assesment-report-card/acme-sc-room-assesment-report-card.component';

const routes: Routes = [
    {
        path: '',
        component: AcmeSCReportCardExplorerComponent
    },
    {
        path: 'details',
        component: AcmeSCAssesmentReportCardComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: []
})
export class AcmeSCRoomReportCardRoutingModule {
}