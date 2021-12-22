//^(?=.*[A-Z].*[A-Z])(?=.*[!@#$&*])(?=.*[0-9].*[0-9])(?=.*[a-z].*[a-z].*[a-z]).{8}$

import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';
@Injectable()
export class StrongPasswordValidator {
    static strongPassword(c: FormControl) {
        return c.value.trim().match( ( /^(?=.*[A-Z]{1,})(?=.*[!@#$&*]{1,})(?=.*[0-9]{1,})(?=.*[a-z]{1,}).{6,}$/ ) ) ? null : { notStrong: true };
    }
    constructor() {
    }
}
