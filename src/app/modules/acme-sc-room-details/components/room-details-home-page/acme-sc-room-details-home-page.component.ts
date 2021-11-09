import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

import { AcmeSCAuthorizationService } from '../../../../core/services/acme-sc-authorization.service';
import { ILoginEntity } from '../../../../core/entities/acme-sc-login.entity';

import { AcmeRoomDetailsService } from '../../services/acme-sc-room-details.service';
import { IRoomEntity } from '../../../shared/entities/acme-sc-room.entity';

import { AcmeSCSessionExpiredComponent } from '../../../shared/components/dialogs/session-expired/acme-sc-session-expired.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'acme-sc-room-details-home-page',
    templateUrl: './acme-sc-room-details-home-page.component.html',
    styleUrls: ['./acme-sc-room-details-home-page.component.scss']
})
export class AcmeSCRoomDetailsHomePageComponent {
    loginEntity: ILoginEntity;
    roomDetailsEntity: IRoomEntity;
    nickName: string;
    fullName: string;
    roomId: string;
    roomType: string;
    roomName: string;
    ownerName: string;

    isProgress = false;
    isSuccessFull = false;
    isRoomOwner = false;
    roomDetailsResponseMessage = '';
    filterText: string = '';

    constructor(private acmeSCAuthorizationService: AcmeSCAuthorizationService,
         private route: ActivatedRoute, private acmeRoomDetailsService: AcmeRoomDetailsService,
         private router: Router, public dialog: MatDialog) {
        
        this.loginEntity = this.acmeSCAuthorizationService.getSession();
        const firstNameChar = (this.loginEntity.firstName.substring(0, 1)).toUpperCase();
        const lastNameChar = (this.loginEntity.lastName.substring(0, 1)).toUpperCase();
        this.nickName = firstNameChar.concat(lastNameChar);
        this.fullName = this.loginEntity.firstName.concat(' ', this.loginEntity.lastName);
    }

    ngOnInit() {
        this.route.queryParams
            .subscribe(params => {
                this.roomId = params.roomId;
                this.roomType=params.roomType;
                this.getRoomDetails();
            });
    }

    getRoomDetails() {
        this.isProgress = true;
        this.isSuccessFull = false;
        this.acmeRoomDetailsService.getRoomById(this.roomId,this.acmeSCAuthorizationService.getAccessToken()).subscribe(
            value => {
                const response: any = value;
                this.isProgress = false;
                this.isSuccessFull = true;
                this.roomDetailsEntity=response.data;
                this.roomName=this.roomDetailsEntity.title;
                this.ownerName = this.roomDetailsEntity.email;
                if(this.loginEntity.email.toUpperCase().trim() === this.roomDetailsEntity.email.toUpperCase().trim()) {
                    this.isRoomOwner=true;
                }
            },
            err => {
                this.isProgress = false;
                this.isSuccessFull = false;
                if (err.error && err.error.description) {
                    this.roomDetailsResponseMessage = err.error.description;
                } else {
                    this.roomDetailsResponseMessage = 'Server Error';
                }
                if(err.status === 401 || err.status === 401.1) {
                    //  show session expired dialog
                    this.openSessionExpiredDialog();
                }
            }
        );
    }

    userNameClicked($event) {
        console.log('nick name clicked')
    }

    gotoRoomsList() {
        this.router.navigateByUrl ( '/home?roomType='+ this.roomType);
    }
    searchTextchange($event) {
      this.filterText = $event;
    }

    openSessionExpiredDialog(): void {
        const dialogRef = this.dialog.open(AcmeSCSessionExpiredComponent, {
            width: '700px',
            height: '100px',
            disableClose: true,
            data:{}
        });
        dialogRef.afterClosed().subscribe(result => {
        });
    }
}