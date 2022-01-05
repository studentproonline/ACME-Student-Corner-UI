import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { AcmeScCookiesService } from '../../../../core/services/acme-sc-cookies.service';

import { AcmeSCContactinformationComponent } from '../../../shared/components/dialogs/contact-information/acme-sc-contact-information.component';
import { AcmesharedUiTuilitiesService } from '../../../shared/services/acme-sc-ui-utiltities.services';

@Component({
    selector: 'acme-sc-main-header',
    templateUrl: './acme-sc-main-header.component.html',
    styleUrls: ['./acme-sc-main-header.component.scss']
})
export class AcmeSCMainHeaderComponent {
    @Input() userNickName = '';
    @Input() userFullName = '';
    @Input() placeHolder = '';
    @Input() dislaySearchBox = true;
    @Input() title =''
    @Output() userNameClicked = new EventEmitter();
    @Output() searchTextchange = new EventEmitter<string>();

    searchFormGroup: any;
    showUserPopup: any= false;
    rightClickMenuPositionX: number;
    rightClickMenuPositionY: number;

    constructor(private acmeScCookiesService: AcmeScCookiesService, private router: Router,
        public dialog: MatDialog, private acmesharedUiTuilitiesService: AcmesharedUiTuilitiesService) {
            
    }

    onSearchChange(value) {
        this.searchTextchange.emit(value);
    }

    nickNameClicked(event): void {
        this.userNameClicked.emit();
        this.showUserPopup= true;
        this.rightClickMenuPositionX = event.clientX;
        this.rightClickMenuPositionY = event.clientY;
    }

    // close popup event 
    closePopup() {
        this.showUserPopup= false;
    }

    

    getRightClickMenuStyle() {
        return {
            position: 'absolute',
            left: `${this.rightClickMenuPositionX-300}px`,
            top: `${this.rightClickMenuPositionY+15}px`,
            height: '20vh',
            width: '20vw',
            'z-index': '100'
          }
    }

    logout() {
       this.acmeScCookiesService.deleteCookies();
       this.router.navigateByUrl("/login");
    }

    openHelp() {
        const dialogRef = this.dialog.open(AcmeSCContactinformationComponent, {
            width: '35vw',
            height:'42vh',
            panelClass: 'acme-sc-custom-container',
            disableClose: true
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result && result.data ) {
                //this.updateRoomStatus(status);
            }
        });
    }
}
