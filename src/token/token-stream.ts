import { LocutionError, SyntaxError } from '../error';
import { Token } from './token';
import { TokenType } from './token-type';

/**
 * Represents a stream of tokens
 */
export class TokenStream {
    private _currentPosition: number = 0;

    get expression(): string {
        return this._expression;
    }

    get token(): Token {
        return this._tokens[this._currentPosition];
    }

    constructor(private _tokens: Token[], private _expression: string) {
        if (this._tokens.length === 0) {
            throw new LocutionError('The token array is empty');
        }
    }

    public next(): Token {
        if (this._currentPosition + 1 >= this._tokens.length) {
            throw new SyntaxError('Unexpected end of expression', this.token.position, this.expression);
        }

        this._currentPosition++;

        return this.token;
    }

    public expect(type: TokenType, value: string, message?: string) {
        const token: Token = this.token;

        if (!this.token.isEquals(type, value)) {
            throw new SyntaxError(`${message ? message + '. ' : ''}Unexpected token "${token.type}" of value "${token.value}" ("${type}" expected${value ? ` with value "${value}"` : ''})`, token.position, this.expression);
        }

        this.next();
    }
}