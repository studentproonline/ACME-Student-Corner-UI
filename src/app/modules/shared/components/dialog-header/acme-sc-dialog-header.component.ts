import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'acme-sc-dialog-header',
    templateUrl: './acme-sc-dialog-header.component.html',
    styleUrls: ['./acme-sc-dialog-header.component.scss']
})
export class AcmeSCDialogHeaderComponent {
    @Input() title = '';
    @Output() closeButtonClicked = new EventEmitter();

    close($event): void{
        this.closeButtonClicked.emit();
    }
}