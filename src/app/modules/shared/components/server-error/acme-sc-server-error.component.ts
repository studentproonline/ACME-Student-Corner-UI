import { Component, Input } from '@angular/core';

@Component({
    selector: 'acme-sc-server-error',
    templateUrl: './acme-sc-server-error.component.html',
    styleUrls: ['./acme-sc-server-error.component.scss']
})
export class AcmeSCServerErrorComponent {
    @Input() errorMessage = '';
}