import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';
@Injectable()
export class WhiteSpaceValidator {
    static whiteSpace(c: FormControl) {
        return c.value.trim().match( ( /^$|pattern/ ) ) ? { whiteSpace: true } : null;
    }
    constructor() {
    }
}
