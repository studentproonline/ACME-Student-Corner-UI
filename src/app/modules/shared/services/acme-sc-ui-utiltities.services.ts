import { Injectable } from '@angular/core';

@Injectable()
export class AcmesharedUiTuilitiesService {

    getConfirmationScreenWidth() {
        return '40vw'
    }

    getConfirmationScreenHeight() {
        return '25vh';
    }

    getEmailConfirmationScreenWidth() {
        if (window.screen.width <= 736) { // 768px portrait
            return '45%';
        } else  {
            return '50%';
        }
    }

    getEmailConfirmationScreenHeight() {
        if (window.screen.height <= 414) { // 768px portrait
            return '50%';
        } else  {
            return '30%';
        }
    }

    getSessionExpiredScreenWidth() {
        return '60vw';
    }

    getSessionExpiredScreenHeight() {
        return '14vh';
    }
}
