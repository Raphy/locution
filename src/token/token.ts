import { TokenType } from './token-type';

/**
 * Represents a token
 */
export class Token {
    get type(): TokenType {
        return this._type;
    }

    get position(): number {
        return this._position;
    }

    get value(): string {
        return this._value;
    }

    constructor(private _type: TokenType, private _position: number, private _value: string) {
    }

    public isEquals(type: TokenType, value?: string | undefined): boolean {
        return this.type === type && (value ? this.value === value : true);
    }
}