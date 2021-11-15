import { NgModule } from '@angular/core';
import { Routes, RouterModule, CanActivate } from '@angular/router';

import {  AcmeSCAuthenticationGuard } from './core/guards/acme-sc-authentication.guard'; 

const routes: Routes = [
    {
        path: 'login',
        loadChildren: () => import('./modules/acme-sc-login/acme-sc-login.module').then(m => m.AcmeStudentCornerLoginModule)
    },
    {
        path: 'home',
        loadChildren: () => import('./modules/acme-sc-explorer/acme-sc-explorer.module').then(m => m.AcmeStudentCornerExplorerModule),
        canActivate: [AcmeSCAuthenticationGuard]
        
    },
    {
        path: 'RoomActivation',
        loadChildren: () => import('./modules/acme-sc-explorer/acme-sc-explorer.module').then(m => m.AcmeStudentCornerExplorerModule),
        
    },
    {
        path: 'roomDetails',
        loadChildren: () => import('./modules/acme-sc-room-details/acme-sc-room-details.module').then(m => m.AcmeStudentCornerRoomDetailsModule),
        canActivate: [AcmeSCAuthenticationGuard]
        
    },
    {
        path: 'topics',
        loadChildren: () => import('./modules/acme-sc-room-topic/acme-sc-room-topic.module').then(m => m.AcmeStudentCornerTopicModule),
        canActivate: [AcmeSCAuthenticationGuard]
        
    },
    {
        path: 'achievements',
        loadChildren: () => import('./modules/acme-sc-achievements/acme-sc-achievements.module').then(m => m.AcmeStudentCornerAchievementsModule),
        canActivate: [AcmeSCAuthenticationGuard]
        
    },
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: '**', redirectTo: 'app' },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class AppRoutingModule { }