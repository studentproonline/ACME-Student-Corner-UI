import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AgoraClient, ClientEvent, NgxAgoraService, Stream, StreamEvent } from 'ngx-agora';


import { AcmeSCAuthorizationService } from '../../../../core/services/acme-sc-authorization.service';
import { AcmeSCConferenceRoomLibraryService } from '../../services/acme-sc-conference-room.service';
import { ILoginEntity } from '../../../../core/entities/acme-sc-login.entity';

import { AcmeSCSessionExpiredComponent } from '../../../shared/components/dialogs/session-expired/acme-sc-session-expired.component';
import { AcmeSCUserConfirmationComponent } from '../../../shared/components/dialogs/user-confirmation/acme-sc-user-confirmation.component';

@Component({
    selector: 'acme-sc-conference-room',
    templateUrl: './acme-sc-conference-room.component.html',
    styleUrls: ['./acme-sc-conference-room.component.scss']
})
export class AcmeSCConferenceRoomComponent {
    title = 'angular-video';
    localCallId = 'agora_local';
    remoteCalls: string[] = [];
    connectedUsers: string[] = [];

    private client: AgoraClient;
    private localStream: Stream;
    private uid: number;

    loginEntity: ILoginEntity;
    nickName: string;
    fullName: string;
    roomId: string;
    roomType: string;
    roomName: string;
    ownerName: string;
    roomDetailsEntity: any;
    showSearchBox = false;

    isProgress = false;
    isTokenGenerationInProgress = false;
    isSuccessFull = false;
    isRoomOwner = false;
    conferenceRoomDetailsResponseMessage = '';
    conferenceAppId = '';
    conferenceToken = '';
    playing = false;
    pauseVideoStream = false;
    pauseAudioStream = false;
    pauseScreenShare = true;
    sessionStarted = false;

    selectedCallId: any

    constructor(private ngxAgoraService: NgxAgoraService,
        private acmeSCAuthorizationService: AcmeSCAuthorizationService,
        private acmeSCConferenceRoomLibraryService: AcmeSCConferenceRoomLibraryService,
        private route: ActivatedRoute, private router: Router,
        public dialog: MatDialog, private snackBar: MatSnackBar) {

        this.uid = Math.floor(Math.random() * 100);

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
                this.getRoomDetails();
            });

    }

    /**
     * Attempts to connect to an online chat room where users can host and receive A/V streams.
     */
    join(onSuccess?: (uid: number | string) => void, onFailure?: (error: Error) => void): void {
        this.client.join(this.conferenceToken, this.roomId, this.loginEntity.email, onSuccess, onFailure);
    }

    /**
    * Attempts to upload the created local A/V stream to a joined chat room.
    */
    publish(): void {
        this.client.publish(this.localStream, err => console.log('Publish local stream error: ' + err));
        this.playing = true;
    }

    startConferenceCallSession() {
        this.isTokenGenerationInProgress = true;
        this.acmeSCConferenceRoomLibraryService.startVideoConference(this.roomId, '120', this.acmeSCAuthorizationService.getAccessToken()).subscribe(
            value => {
                const response: any = value;
                this.isTokenGenerationInProgress = false;
                this.sessionStarted = true;
            }
            , err => {
                this.isTokenGenerationInProgress = false;
                this.snackBar.open(err.error.description, '', {
                    duration: 3000
                });
            }
        );
    }

    deletepConferenceCallSession() {
        this.isTokenGenerationInProgress = true;
        this.acmeSCConferenceRoomLibraryService.stopVideoConference(this.roomId, this.acmeSCAuthorizationService.getAccessToken()).subscribe(
            value => {
                const response: any = value;
                this.isTokenGenerationInProgress = false;
                this.sessionStarted = false;
                if(this.playing) {
                    this.leaveCall();
                }
                this.sessionStarted = false;
            }
            , err => {
                this.isTokenGenerationInProgress = false;
                this.snackBar.open(err.error.description, '', {
                    duration: 3000
                });
            }
        );
    }

    connectCall() {

        this.isTokenGenerationInProgress = true;
        this.conferenceToken = '';
        this.conferenceAppId = '';
        this.acmeSCConferenceRoomLibraryService.getVideoConferenceAccessToken(this.roomId, this.acmeSCAuthorizationService.getAccessToken()).subscribe(
            value => {
                const response: any = value;
                this.isTokenGenerationInProgress = false;
                this.conferenceToken = response.data.token;
                this.conferenceAppId = response.data.appId;
                this.connectToStream();
            },
            err => {
                this.isTokenGenerationInProgress = false;
                this.snackBar.open(err.error.description, '', {
                    duration: 3000
                });
            }
        );
    }

    connectToStream() {
        this.client = this.ngxAgoraService.createClient({ mode: 'rtc', codec: 'h264' }, false);
        this.client.init(this.conferenceAppId);
        this.assignClientHandlers();
        //Added in this step to initialize the local A/V stream
        this.localStream = this.ngxAgoraService.createStream({ streamID: this.uid, audio: true, video: true, screen: false });
        this.assignLocalStreamHandlers();
        this.initLocalStream(() => this.join(uid => this.publish(),
            error => {
                console.error(error)
                if (this.localStream) {
                    this.snackBar.open('Fail to join conference call', '', {
                        duration: 3000
                    });
                    this.localStream.stop();
                    this.localStream.close();
                }
            }));
    }

    leaveCall() {
        this.client.unpublish(this.localStream);
        this.client.unsubscribe(this.localStream)
        this.client.leave();
        this.localStream.stop();
        this.localStream.close();
        this.playing = false;
        this.connectedUsers.length = 0;
    }

    ConnectToScreenShare() {
        this.client = this.ngxAgoraService.createClient({ mode: 'rtc', codec: 'h264' }, false);
        this.client.init(this.conferenceAppId);
        this.assignClientHandlers();
        //Added in this step to initialize the local A/V stream
        this.localStream = this.ngxAgoraService.createStream({ streamID: this.uid, audio: true, video: false, screen: true });
        this.assignLocalStreamHandlers();
        this.initLocalStream(() => this.join(uid => this.publish(), error => console.error(error)));
    }

    pauseVideo() {

        if (this.localStream) {
            if (this.pauseVideoStream) {
                this.localStream.unmuteVideo();
            } else {
                this.localStream.muteVideo();
            }
        }
        this.pauseVideoStream = !this.pauseVideoStream;
    }

    pauseAudio() {
        if (this.localStream) {
            if (this.pauseAudioStream) {
                this.localStream.unmuteAudio();
            } else {
                this.localStream.muteAudio();
            }
        }
        this.pauseAudioStream = !this.pauseAudioStream;
    }

    screenShare() {
        if (this.localStream) {
            if (this.pauseScreenShare) {
                // switch to screen
                this.leaveCall();
                this.ConnectToScreenShare();
            } else {
                // switch to video
                // switch to screen
                this.leaveCall();
                this.connectCall();
            }
        }
        this.pauseScreenShare = !this.pauseScreenShare;
    }

    private assignLocalStreamHandlers(): void {
        this.localStream.on(StreamEvent.MediaAccessAllowed, () => {
            console.log('accessAllowed');
        });

        // The user has denied access to the camera and mic.
        this.localStream.on(StreamEvent.MediaAccessDenied, () => {
            console.log('accessDenied');
        });
    }

    private initLocalStream(onSuccess?: () => any): void {
        this.localStream.init(
            () => {
                // The user has granted access to the camera and mic.
                this.localStream.play(this.localCallId);
                if (onSuccess) {
                    onSuccess();
                }
            },
            err => console.error('getUserMedia failed', err)
        );
    }

    private assignClientHandlers(): void {
        this.client.on(ClientEvent.LocalStreamPublished, evt => {
            console.log('Publish local stream successfully');
        });

        this.client.on(ClientEvent.Error, error => {
            console.log('Got error msg:', error.reason);
            if (error.reason === 'DYNAMIC_KEY_TIMEOUT') {
                this.client.renewChannelKey(
                    '',
                    () => console.log('Renewed the channel key successfully.'),
                    renewError => console.error('Renew channel key failed: ', renewError)
                );
            }
        });

        this.client.on(ClientEvent.RemoteStreamAdded, evt => {
            const stream = evt.stream as Stream;
            this.client.subscribe(stream, { audio: true, video: true }, err => {
                console.log('Subscribe stream failed', err);
            });
        });

        this.client.on(ClientEvent.RemoteStreamSubscribed, evt => {
            const stream = evt.stream as Stream;
            const id = this.getRemoteId(stream);
            if (!this.remoteCalls.length) {
                this.remoteCalls.push(id);
                if (this.remoteCalls.length === 1) {
                    this.selectedCallId = this.remoteCalls[0];
                }
                setTimeout(() => stream.play(id), 1000);
            }
        });

        this.client.on(ClientEvent.RemoteStreamRemoved, evt => {
            const stream = evt.stream as Stream;
            if (stream) {
                stream.stop();
                this.remoteCalls = [];
                console.log(`Remote stream is removed ${stream.getId()}`);
            }
        });
        this.client.on(ClientEvent.PeerOnline, evt => {
            this.connectedUsers.push(evt.uid);
            console.log("user joined " + evt.uid)
        });
        this.client.on(ClientEvent.PeerLeave, evt => {
            const stream = evt.stream as Stream;
            if (stream) {
                stream.stop();
                this.remoteCalls = this.remoteCalls.filter(call => call !== `${this.getRemoteId(stream)}`);
                const index = this.connectedUsers.findIndex(user => user === evt.uid);
                if (index !== -1) {
                    this.connectedUsers.splice(index, 1);
                }
                console.log(`${evt.uid} left from this channel`);
            }
        });
    }
    private getRemoteId(stream: Stream): string {
        return `agora_remote-${stream.getId()}`;
    }

    selectCallIdForLargeView(callId) {
        this.selectedCallId = callId;
    }

    filterSelectedCallIds() {
        return this.remoteCalls.filter(x => x !== this.selectedCallId);
    }

    gotoRoomsList() {
        if (this.playing) {
            this.leaveConferenceRoom('Home');
        } else {
            this.router.navigateByUrl('/home?roomType=' + this.roomType);
        }
    }

    gotoTopics() {
        if (this.playing) {
            this.leaveConferenceRoom('RoomDetails');
        } else {
            this.router.navigateByUrl('/roomDetails?roomId=' + this.roomId + '&roomType=' + this.roomType);
        }
    }

    gotoLibrary() {
        if (this.playing) {
            this.leaveConferenceRoom('Library');
        } else {
            this.router.navigateByUrl('/library?roomType=' + this.roomType + '&roomId=' + this.roomId);
        }
    }

    gotoHome() {
        this.router.navigateByUrl ( '/home?roomType=My Rooms');
    }

    getRoomDetails() {
        this.isProgress = true;
        this.isSuccessFull = false;
        this.acmeSCConferenceRoomLibraryService.getRoomById(this.roomId, this.acmeSCAuthorizationService.getAccessToken()).subscribe(
            value => {
                const response: any = value;
                this.isProgress = false;
                this.isSuccessFull = true;
                this.roomDetailsEntity = response.data;
                this.roomName = response.data.title;
                this.ownerName = response.data.email;
                if (this.loginEntity.email.toUpperCase().trim() === response.data.email.toUpperCase().trim()) {
                    this.isRoomOwner = true;
                }
                //this.uid = this.loginEntity.email;
            },
            err => {
                this.isProgress = false;
                this.isSuccessFull = false;
                if (err.error && err.error.description) {
                    this.conferenceRoomDetailsResponseMessage = err.error.description;
                } else {
                    this.conferenceRoomDetailsResponseMessage = 'Server Error';
                }
                if (err.status === 401 || err.status === 401.1) {
                    //  show session expired dialog
                    this.openSessionExpiredDialog();
                }
            }
        );
    }

    openSessionExpiredDialog(): void {
        const dialogRef = this.dialog.open(AcmeSCSessionExpiredComponent, {
            width: '700px',
            height: '100px',
            disableClose: true,
            data: {}
        });
        dialogRef.afterClosed().subscribe(result => {
        });
    }

    leaveConferenceRoom(navigationArea) {
        const dialogRef = this.dialog.open(AcmeSCUserConfirmationComponent, {
            width: '500px',
            height: '150',
            panelClass: 'acme-sc-custom-container',
            disableClose: true,
            data: { message: 'This action will remove you from conference.' }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result && result.data === 'true') {
                this.playing = false;
                this.leaveCall();
                if (navigationArea === 'Home') {
                    this.router.navigateByUrl('/home?roomType=' + this.roomType);
                }
                else if (navigationArea === 'RoomDetails') {
                    this.router.navigateByUrl('/roomDetails?roomId=' + this.roomId + '&roomType=' + this.roomType);
                }
                else if (navigationArea === 'Library') {
                    this.router.navigateByUrl('/library?roomType=' + this.roomType + '&roomId=' + this.roomId);
                }
            }
        });
    }

    stopConferenceCallSession() {
        const dialogRef = this.dialog.open(AcmeSCUserConfirmationComponent, {
            width: '500px',
            height: '150',
            panelClass: 'acme-sc-custom-container',
            disableClose: true,
            data: { message: 'This action will stop conference session.' }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result && result.data === 'true') {
                this.deletepConferenceCallSession();
            }
        });
    }

    ngOnDestroy() {
        console.log('called onDestroy of video conference')
        if (this.playing) {
            this.playing = false;
            this.leaveCall();
        }
    }
}