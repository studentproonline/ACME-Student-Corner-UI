import { Component, Input } from '@angular/core';

import { ILibraryContentEntity } from '../../entities/library-content';

@Component({
    selector: 'acme-sc-room-library-contents-list',
    templateUrl: './acme-sc-room-library-contents-list.component.html',
    styleUrls: ['./acme-sc-room-library-contents-list.component.scss']
})
export class AcmeSCRoomTopicsListComponent {

    @Input() room: any;
    @Input() roomType: string;
    @Input() filterText = '';

    isProgress = false;
    isSuccessFull = true;
    libraryResponseMessage = '';

    roomTopicsList:ILibraryContentEntity[]=[];
    filteredRoomTopicsList: ILibraryContentEntity[] = [];

    constructor() {

    }

    refreshLibraryContent() {

    }

    uploadNewContent() {

    }
}