import { Injectable } from '@angular/core';

import { ILoginEntity } from '../entities/acme-sc-login.entity';
import { IRoomEntity } from '../../modules/shared/entities/acme-sc-room.entity';

@Injectable()
export class AcmeSCAuthorizationService {
   
    isSessionActive = false;
    private activeSession: ILoginEntity;
    roomDetailsEntity: IRoomEntity;
    roleResponse: any;

    setSession(login: ILoginEntity) {
        this.activeSession = login;
        this.isSessionActive = true;
    }
    getSession() {
        return this.activeSession;
    }

    getAccessToken() {
        return this.activeSession ? this.activeSession.token : null;
    }

    deleteSession() {
        this.activeSession = undefined;
        this.isSessionActive = false;
    }

    setRoomDetails(roomDetailsEntity: IRoomEntity) {
        this.roomDetailsEntity = roomDetailsEntity
    }

    setUserRoomRole(roleDetails: any) {
        this.roleResponse =roleDetails;
    }

     getRoomDetails(): IRoomEntity {
        return this.roomDetailsEntity;
    }

    getUserRoomRole(): any {
        return this.roleResponse;
    }
}