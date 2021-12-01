import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { AcmeScCookiesService } from '../../../../core/services/acme-sc-cookies.service';

import { AcmeSCContactinformationComponent } from '../../../shared/components/dialogs/contact-information/acme-sc-contact-information.component';

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
        public dialog: MatDialog) {
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

    getScreenWidth() {
        if (window.screen.width <= 414) { // 768px portrait
            return '45%';
        } else  {
            return '25%';
        }
    }

    getScreenHeight() {
        if (window.screen.height <= 736) { // 768px portrait
            return '35%';
        } else  {
            return '25%';
        }
    }

    getHelpScreenWidth() {
        if (window.screen.width <= 414) { // 768px portrait
            return '5%';
        } else  {
            return '35%';
        }
    }

    getHelpScreenHeight() {
        if (window.screen.height <= 736) { // 768px portrait
            return '55%';
        } else  {
            return '35%';
        }
    }

    getScreenLeftOffSet() {
        if (window.screen.width <= 414) { // 768px portrait
            return 0;
        }
        return 400;
    }

    getRightClickMenuStyle() {
        return {
            position: 'absolute',
            left: `${this.rightClickMenuPositionX-this.getScreenLeftOffSet()}px`,
            top: `${this.rightClickMenuPositionY+20}px`,
            height: this.getScreenHeight(),
            width: this.getScreenWidth(),
            'z-index': '100'
          }
    }

    logout() {
       this.acmeScCookiesService.deleteCookies();
       this.router.navigateByUrl("/login");
    }

    openHelp() {
        const dialogRef = this.dialog.open(AcmeSCContactinformationComponent, {
            width: this.getHelpScreenWidth(),
            height: this.getHelpScreenHeight(),
            panelClass: 'acme-sc-custom-container',
            disableClose: true
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result.data ) {
                //this.updateRoomStatus(status);
            }
        });
    }
}
