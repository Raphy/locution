import { Lexer } from './lexer';
import { Parser } from './parser';

/**
 *
 */
export class Locution {
    private _lexer: Lexer = new Lexer();

    private _parser: Parser = new Parser();

    public evaluate(expression: string, identifiers: object = {}): any {
        return this._parser.parse(this._lexer.tokenize(expression), identifiers).evaluate(identifiers);
    }
}