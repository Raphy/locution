import { Lexer } from './lexer';
import { Node } from './node';
import { Parser } from './parser';

/**
 *
 */
export class Locution {
    /**
     * Evaluate an expression with a given identifiers
     *
     * @param expression
     * @param identifiers
     */
    public evaluate(expression: string, identifiers: object = {}): any {
        // console.log('Locution Evaluate', expression, identifiers);

        const lexer = new Lexer();
        const tokenStream = lexer.tokenize(expression);
        // console.log('TokenStream', tokenStream, tokenStream.token);

        const parser = new Parser();
        const rootNode: Node = parser.parse(tokenStream, identifiers);

        // console.log('RootNode', rootNode, JSON.stringify(rootNode));

        return rootNode.evaluate(identifiers);
    }
}