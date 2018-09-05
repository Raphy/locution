import { Cache } from './cache';
import { Functions } from './functions';
import { Identifiers } from './identifiers';
import { Lexer } from './lexer';
import { Node } from './node';
import { Parser } from './parser';
import md5 from 'md5';

export class Locution {
    private _lexer: Lexer = new Lexer();

    private _parser: Parser;

    constructor(private _functions: Functions = {}, private _cache: Cache = null) {
        this._parser = new Parser(this._functions);
    }

    public evaluate(expression: string, identifiers: Identifiers = {}): Promise<any> {
        const key: string = md5(expression) + '_' + md5(JSON.stringify(identifiers));

        let node: Node;
        if (this._cache) {
            node = this._cache.get(key);
        }

        if (!node) {
            node = this._parser.parse(this._lexer.tokenize(expression), identifiers);

            if (this._cache) {
                this._cache.set(key, node);
            }
        }


        return node.evaluate(this._functions, identifiers);
    }
}