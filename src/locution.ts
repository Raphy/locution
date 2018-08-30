import { Lexer } from './lexer';
import { Parser } from './parser';

/**
 *
 */
export class Locution {
    private _lexer: Lexer = new Lexer();

    private _parser: Parser;

    constructor(private _functions: {[name: string]: Function} = {}) {
        this._parser = new Parser(this._functions);
    }

    public evaluate(expression: string, identifiers: object = {}): any {
        return this._parser.parse(this._lexer.tokenize(expression), identifiers).evaluate(this._functions, identifiers);
    }
}