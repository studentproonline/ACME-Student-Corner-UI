import { Component, Output,  EventEmitter} from '@angular/core';

@Component({
    selector: 'acme-sc-room-library-content-types',
    templateUrl: './acme-sc-room-library-content-types.component.html',
    styleUrls: ['./acme-sc-room-library-content-types.component.scss']
})
export class AcmeSCRoomLibraryContentTypesComponent {

    allContentsSelected =true;
    documentsSelected =false;
    linksSelected =false;

    @Output() itemClicked = new EventEmitter<string>();

    allContentsItemClicked() {
       
        this.allContentsSelected =true;
        this.documentsSelected =false;
        this.linksSelected =false;
        this.itemClicked.emit('All');
    }

    linkContentsItemClicked() {
        this.allContentsSelected =false;
        this.documentsSelected =false;
        this.linksSelected =true;
        this.itemClicked.emit('Links');
    }

    documentContentsItemClicked() {
        this.allContentsSelected =false;
        this.documentsSelected =true;
        this.linksSelected =false;
        this.itemClicked.emit('Documents');
    }
}
