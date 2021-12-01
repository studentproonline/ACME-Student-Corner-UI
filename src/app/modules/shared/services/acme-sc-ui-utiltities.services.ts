import { Injectable } from '@angular/core';

@Injectable()
export class AcmesharedUiTuilitiesService {

    getScreenWidth() {
        if (window.screen.width <= 736) { // 768px portrait
            return '45%';
        } else  {
            return '25%';
        }
    }

    getScreenHeight() {
        if (window.screen.height <= 414) { // 768px portrait
            return '35%';
        } else  {
            return '25%';
        }
    }

    getHelpScreenWidth() {
        if (window.screen.width <= 736) { // 768px portrait
            return '55%';
        } else  {
            return '35%';
        }
    }

    getHelpScreenHeight() {
        if (window.screen.height <= 414) { // 768px portrait
            return '55%';
        } else  {
            return '35%';
        }
    }

    getScreenLeftOffSet() {
        if (window.screen.width <= 736) { // 768px portrait
            return 350;
        }
        return 400;
    }


    getConfirmationScreenWidth() {
        if (window.screen.width <= 736) { // 768px portrait
            return '60%';
        } else  {
            return '40%';
        }
    }

    getConfirmationScreenHeight() {
        if (window.screen.height <= 414) { // 768px portrait
            return '35%';
        } else  {
            return '25%';
        }
    }

    getShareRoomScreenWidth() {
        if (window.screen.width <= 736) { // 768px portrait
            return '45%';
        } else  {
            return '40%';
        }
    }

    getShareScreenHeight() {
        if (window.screen.height <= 414) { // 768px portrait
            return '60%';
        } else  {
            return '40%';
        }
    }

    getCreateRoomScreenWidth() {
        if (window.screen.width <= 736) { // 768px portrait
            return '60%';
        } else  {
            return '40%';
        }
    }

    getCreateRoomScreenHeight() {
        if (window.screen.height <= 414) { // 768px portrait
            return '50%';
        } else  {
            return '45%';
        }
    }

    getCreateTopicScreenWidth() {
        if (window.screen.width <= 736) { // 768px portrait
            return '80%';
        } else  {
            return '40%';
        }
    }

    getCreateTopicScreenHeight() {
        if (window.screen.height <= 414) { // 768px portrait
            return '50%';
        } else  {
            return '45%';
        }
    }

    getCreateCommentScreenWidth() {
        console.log(window.screen.width);
        if (window.screen.width <= 736) { // 768px portrait
            return '500px';
        } else  {
            return '50%';
        }
    }

    getCreatecommentScreenHeight() {
        if (window.screen.height <= 414) { // 768px portrait
            return '80%';
        } else  {
            return '70%';
        }
    }

    getCreateAccountScreenWidth() {
        if (window.screen.width <= 414) { // 768px portrait
            return '45%';
        } else  {
            return '40%';
        }
    }

    getCreateAccountScreenHeight() {
        if (window.screen.height <= 736) { // 768px portrait
            return '90%';
        } else  {
            return '70%';
        }
    }

    getEmailConfirmationScreenWidth() {
        if (window.screen.width <= 414) { // 768px portrait
            return '45%';
        } else  {
            return '50%';
        }
    }

    getEmailConfirmationScreenHeight() {
        if (window.screen.height <= 736) { // 768px portrait
            return '50%';
        } else  {
            return '30%';
        }
    }

    getSessionExpiredScreenWidth() {
        if (window.screen.width <= 414) { // 768px portrait
            return '80%';
        } else  {
            return '60%';
        }
    }

    getSessionExpiredScreenHeight() {
        if (window.screen.height <= 736) { // 768px portrait
            return '20%';
        } else  {
            return '14%';
        }
    }

}