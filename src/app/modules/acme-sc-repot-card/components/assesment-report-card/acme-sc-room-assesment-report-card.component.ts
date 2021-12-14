import { Component, ViewChild, ElementRef } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { AcmeSCAuthorizationService } from '../../../../core/services/acme-sc-authorization.service';
import { AcmeSCRoomReportCardService } from '../../services/acme-sc-room-report-card.service';
import { AcmesharedUiTuilitiesService } from '../../../shared/services/acme-sc-ui-utiltities.services';

import { ILoginEntity } from '../../../../core/entities/acme-sc-login.entity';
import { IRoomEntity } from '../../../shared/entities/acme-sc-room.entity';

import { AcmeSCSessionExpiredComponent } from '../../../shared/components/dialogs/session-expired/acme-sc-session-expired.component';
import { AcmeSCReportCardCommentComponent } from '../dialogs/comments/acme-sc-report-card-comments.component';

import jspdf from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
    selector: 'acme-sc-assesment-report-card',
    templateUrl: './acme-sc-room-assesment-report-card.component.html',
    styleUrls: ['./acme-sc-room-assesment-report-card.component.scss']
})
export class AcmeSCAssesmentReportCardComponent {
    loginEntity: ILoginEntity;
    roomDetailsEntity: IRoomEntity;
    assesmentgroup: string = '';
    teachersRemark = '';
    otherInformation = '';
    userAssesmentsList: any[] = [];
    isProgress = false;
    isSaveProgress = false;
    isSuccessFull = false;
    showSearchBox = false;
    nickName;
    fullName;
    roomAssesmentDetailsResponseMessage = '';
    roomId;
    roomType;
    roomName;
    selectedUser: any = {};
    selectesUserName = '';
    roomRole;
    isContentOrRoomOwner

    @ViewChild('reportCardContainer', { static: false, read: ElementRef }) reportCardContainer: ElementRef;

    constructor(private acmeSCAuthorizationService: AcmeSCAuthorizationService,
        private route: ActivatedRoute,
        private acmeSCRoomReportCardService: AcmeSCRoomReportCardService,
        private acmesharedUiTuilitiesService: AcmesharedUiTuilitiesService,
        public dialog: MatDialog, private snackBar: MatSnackBar) {

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
                this.roomType = params.roomType;
                this.roomName = params.roomName;
                this.selectesUserName = params.selectedUser;
                this.selectedUser.userEmail = this.selectesUserName;
                this.assesmentgroup = params.assesmentgroup;
                this.getRole();
            });
        this.roomDetailsEntity = {
            _id: this.roomId, name: '',
            owner: undefined,
            email: '',
            title: this.roomName,
            description: undefined,
            creationDate: undefined,
            status: undefined

        }
    }

    saveReportCard() {
        this.isSaveProgress = true;
        let body: any = {};
        body.userId = this.selectedUser._id;
        body.roomId = this.roomId;
        body.userEmail =this.selectedUser.userEmail;
        body.assesmentGroup = this.assesmentgroup;
        body.teachersRemark = this.teachersRemark;
        body.otherInformation = this.otherInformation;
        this.acmeSCRoomReportCardService.createReportCard(this.acmeSCAuthorizationService.getAccessToken(), body).subscribe(
            value => {
                this.isSaveProgress = false;
                this.snackBar.open(' Report Card is successfully saved.', '', {
                    duration: 3000
                });
            },
            err => {
                this.isSaveProgress = false;
                this.snackBar.open(err.error.description, '', {
                    duration: 3000
                });

            }
        );
    }

    getUserReportCard() {
        this.isProgress = true;
        this.isSuccessFull = false;
        this.acmeSCRoomReportCardService.getReportCard(this.roomId, this.selectedUser.userEmail,this.assesmentgroup, this.acmeSCAuthorizationService.getAccessToken()).subscribe(
            value => {
                const response: any = value;
                this.isProgress = false;
                this.isSuccessFull = true;
                let reportCardData = response.data;
                if(reportCardData) {
                    this.teachersRemark = reportCardData.teachersRemark;
                    this.otherInformation =reportCardData.otherInformation
                }
            },
            err => {
                this.isProgress = false;
                this.isSuccessFull = false;
                if (err.error && err.error.description) {
                    this.roomAssesmentDetailsResponseMessage = err.error.description;
                } else {
                    this.roomAssesmentDetailsResponseMessage = 'Server Error';
                }
                if (err.status === 401 || err.status === 401.1) {
                    //  show session expired dialog
                    this.openSessionExpiredDialog();
                }
            }

        );
    }

    getUserAssesments() {
        this.isProgress = true;
        this.isSuccessFull = false;
        this.acmeSCRoomReportCardService.getUserAssesmentReport(this.selectedUser.userEmail, this.roomId, this.assesmentgroup, this.acmeSCAuthorizationService.getAccessToken()).subscribe(
            value => {
                const response: any = value;
                this.userAssesmentsList = response.data;
                if (this.userAssesmentsList.length > 0) {
                    let roomDetails: IRoomEntity = {
                        _id: this.roomId, name: '',
                        owner: this.userAssesmentsList[0].roomOwner,
                        email: this.userAssesmentsList[0].roomOwner,
                        title: this.roomName,
                        description: undefined,
                        creationDate: undefined,
                        status: undefined

                    }
                    this.roomDetailsEntity = roomDetails;
                }
                this.getUserReportCard();
            },
            err => {
                this.isProgress = false;
                this.isSuccessFull = false;
                if (err.error && err.error.description) {
                    this.roomAssesmentDetailsResponseMessage = err.error.description;
                } else {
                    this.roomAssesmentDetailsResponseMessage = 'Server Error';
                }
                if (err.status === 401 || err.status === 401.1) {
                    //  show session expired dialog
                    this.openSessionExpiredDialog();
                }
            }

        );
    }

    getRole() {
        this.isProgress = true;
        this.isSuccessFull = false;

        this.acmeSCRoomReportCardService.getUserRoomRole(this.roomId, this.acmeSCAuthorizationService.getAccessToken()).subscribe(
            value => {
                this.isProgress = false;
                this.isSuccessFull = true;
                const response: any = value;
                this.roomRole = response.data;
                if (this.roomRole.role === 'Owner' || this.roomRole.role === 'Admin') {
                    this.isContentOrRoomOwner = true;
                }
                //this.getUserAssesments();
            },
            err => {
                this.isProgress = false;
                this.isSuccessFull = false;
                if (err.error && err.error.description) {
                    this.roomAssesmentDetailsResponseMessage = err.error.description;
                } else {
                    this.roomAssesmentDetailsResponseMessage = 'Server Error';
                }
                if (err.status === 401 || err.status === 401.1) {
                    //  show session expired dialog
                    this.openSessionExpiredDialog();
                }
            }
        );
    }

    addComment(type) {
        const dialogRef = this.dialog.open(AcmeSCReportCardCommentComponent, {
            width: '65vw',
            height: '65vh',
            panelClass: 'acme-sc-custom-container',
            disableClose: true,
            data: {}
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result && result.data) {
                if (type === "teacher") {
                    this.teachersRemark = result.data;
                } else {
                    this.otherInformation = result.data;
                }
            }
        });
    }

    RemoveComment(type) {
        if (type = "teacher") {
            this.teachersRemark = '';
        } else {
            this.otherInformation ='';
        }
    }

    openSessionExpiredDialog(): void {
        const dialogRef = this.dialog.open(AcmeSCSessionExpiredComponent, {
            width: this.acmesharedUiTuilitiesService.getSessionExpiredScreenWidth(),
            height: this.acmesharedUiTuilitiesService.getSessionExpiredScreenHeight(),
            disableClose: true,
            data: {}
        });
        dialogRef.afterClosed().subscribe(result => {
        });
    }

    userSelected($event) {
        // user id
        this.selectedUser = $event;
        this.getUserAssesments();
    }

    generateReportCard(reportCardName) {
        var data = document.getElementById('reportCardContainer');
        html2canvas(data).then(canvas => {
            // Few necessary setting options  
            var imgWidth = 208;
            var imgHeight = canvas.height * imgWidth / canvas.width;
         
            const contentDataURL = canvas.toDataURL('image/png')
            let pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF  
            var position = 0;
            pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)
            pdf.save(reportCardName + '_reportCard.pdf'); // Generated PDF   
        });
    }
}
