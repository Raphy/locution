import { Functions } from './functions';
import { Identifiers } from './identifiers';
import { Lexer } from './lexer';
import { Parser } from './parser';

export class Locution {
    private _lexer: Lexer = new Lexer();

    private _parser: Parser;

    constructor(private _functions: Functions = {}) {
        this._parser = new Parser(this._functions);
    }

    public evaluate(expression: string, identifiers: Identifiers = {}): any {
        return this._parser.parse(this._lexer.tokenize(expression), identifiers).evaluate(this._functions, identifiers);
    }
}