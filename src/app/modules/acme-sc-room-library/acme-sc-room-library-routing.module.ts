import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//components
import { AcmeSCLibraryExplorerComponent } from './components/library-explorer/acme-sc-room-library-explorer.component';

const routes: Routes = [
    {
        path: '',
        component: AcmeSCLibraryExplorerComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: []
})
export class AcmeSCRoomLibraryRoutingModule {
}