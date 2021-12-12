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
    {
        path: 'library',
        loadChildren: () => import('./modules/acme-sc-room-library/acme-sc-room-library.module').then(m => m.AcmeStudentCornerRoomLibraryModule),
        canActivate: [AcmeSCAuthenticationGuard]
        
    },
    {
        path: 'assignments',
        loadChildren: () => import('./modules/acme-sc-room-assignment/acme-sc-room-assignment.module').then(m => m.AcmeStudentCornerRoomAssignmentModule),
        canActivate: [AcmeSCAuthenticationGuard]
        
    },
    {
        path: 'assesments',
        loadChildren: () => import('./modules/acme-sc-room-assesment/acme-sc-room-assesment.module').then(m => m.AcmeStudentCornerRoomAssesmentModule),
        canActivate: [AcmeSCAuthenticationGuard]
        
    },
    {
        path: 'conference',
        loadChildren: () => import('./modules/acme-sc-conference/acme-sc-room-conference.module').then(m => m.AcmeStudentCornerRoomconferenceModule),
        canActivate: [AcmeSCAuthenticationGuard]
        
    },
    {
        path: 'shareRoom',
        loadChildren: () => import('./modules/acme-sc-room-invitation/acme-sc-room-invitation.module').then(m => m.AcmeStudentCornerRoomInvitationModule),
        
    },
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: '**', redirectTo: 'app' },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class AppRoutingModule { }