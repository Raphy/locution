import { LocutionError } from './locution-error';

export class SyntaxError extends LocutionError {
    constructor(message: string, position: number, expression: string) {
        super(`${message} at index ${position} in expression \`${expression}\``);
    }
}