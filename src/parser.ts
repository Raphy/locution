import { SyntaxError } from './error';
import { ArgumentsNode, ArrayCallNode, ArrayNode, BinaryNode, ConditionalNode, ConstantNode, FunctionNode, IdentifierNode, MethodCallNode, Node, ObjectNode, PropertyCallNode, UnaryNode } from './node';
import { Token, TokenStream, TokenType } from './token';

export class Parser {
    private _unaryOperators: { [operator: string]: { precedence: number } } = {
        'not': {precedence: 50},
        '!': {precedence: 50},
        '-': {precedence: 500},
        '+': {precedence: 500},
    };

    private _binaryOperators: { [operator: string]: { precedence: number, associativity: string } } = {
        'or': {precedence: 10, associativity: 'left'},
        '||': {precedence: 10, associativity: 'left'},
        'and': {precedence: 15, associativity: 'left'},
        '&&': {precedence: 15, associativity: 'left'},
        '|': {precedence: 16, associativity: 'left'},
        '^': {precedence: 17, associativity: 'left'},
        '&': {precedence: 18, associativity: 'left'},
        '==': {precedence: 20, associativity: 'left'},
        '===': {precedence: 20, associativity: 'left'},
        '!=': {precedence: 20, associativity: 'left'},
        '!==': {precedence: 20, associativity: 'left'},
        '<': {precedence: 20, associativity: 'left'},
        '>': {precedence: 20, associativity: 'left'},
        '>=': {precedence: 20, associativity: 'left'},
        '<=': {precedence: 20, associativity: 'left'},
        'not in': {precedence: 20, associativity: 'left'},
        'in': {precedence: 20, associativity: 'left'},
        'matches': {precedence: 20, associativity: 'left'},
        '..': {precedence: 25, associativity: 'left'},
        '+': {precedence: 30, associativity: 'left'},
        '-': {precedence: 30, associativity: 'left'},
        '~': {precedence: 40, associativity: 'left'},
        '*': {precedence: 60, associativity: 'left'},
        '/': {precedence: 60, associativity: 'left'},
        '%': {precedence: 60, associativity: 'left'},
        '**': {precedence: 200, associativity: 'right'},
    };

    constructor(private _functions: {[name: string]: Function}) {
    }

    public parse(tokenStream: TokenStream, identifiers: object): Node {
        const rootNode: Node = this._parseExpression(tokenStream, identifiers);
        if (tokenStream.token.type !== TokenType.END_OF_EXPRESSION) {
            throw new SyntaxError(`Unexpected token "${tokenStream.token.type}" of value "${tokenStream.token.value}"`, tokenStream.token.position, tokenStream.expression);
        }

        return rootNode;
    }

    private _parseExpression(tokenStream: TokenStream, identifiers: object, precedence: number = 0): Node {
        let expr: Node = this._getPrimaryNode(tokenStream, identifiers);
        let token: Token = tokenStream.token;

        while (token.isEquals(TokenType.OPERATOR) && this._binaryOperators.hasOwnProperty(token.value) && this._binaryOperators[token.value].precedence >= precedence) {
            const operator = this._binaryOperators[token.value];
            tokenStream.next();
            const expr1 = this._parseExpression(tokenStream, identifiers, operator.associativity === 'left' ? operator.precedence + 1 : operator.precedence);
            expr = new BinaryNode(token.value, expr, expr1);

            token = tokenStream.token;
        }

        if (0 === precedence) {
            return this._parseConditionalExpression(tokenStream, identifiers, expr);
        }

        return expr;
    }

    private _getPrimaryNode(tokenStream: TokenStream, identifiers: object): Node {
        const token: Token = tokenStream.token;

        if (token.isEquals(TokenType.OPERATOR) && this._unaryOperators.hasOwnProperty(token.value)) {
            tokenStream.next();
            const expr = this._parseExpression(tokenStream, identifiers, this._unaryOperators[token.value].precedence);

            return this._parsePostfixExpression(tokenStream, identifiers, new UnaryNode(token.value, expr));
        }

        if (token.isEquals(TokenType.PUNCTUATION, '(')) {
            tokenStream.next();
            const expr = this._parseExpression(tokenStream, identifiers);
            tokenStream.expect(TokenType.PUNCTUATION, ')', 'An opened parenthesis is not properly closed');

            return this._parsePostfixExpression(tokenStream, identifiers, expr);
        }

        return this._parsePrimaryExpression(tokenStream, identifiers);
    }

    private _parsePrimaryExpression(tokenStream: TokenStream, identifiers: object): Node {
        const token: Token = tokenStream.token;
        let node: Node;

        switch (token.type) {
            case TokenType.IDENTIFIER:
                tokenStream.next();
                switch (token.value) {
                    case 'true':
                    case 'TRUE':
                        return new ConstantNode(true);

                    case 'false':
                    case 'FALSE':
                        return new ConstantNode(false);

                    case 'null':
                    case 'NULL':
                        return new ConstantNode(null);

                    default:
                        if ('(' === tokenStream.token.value) {
                            // todo: use functions registry instead of identifiers
                            if (!this._functions.hasOwnProperty(token.value)) {
                                throw new SyntaxError(`The function "${token.value}" does not exist`, token.position, tokenStream.expression);
                            }

                            node = new FunctionNode(token.value, this._parseArguments(tokenStream, identifiers));
                        } else {
                            if (!identifiers.hasOwnProperty(token.value)) {
                                throw new SyntaxError(`Variable "${token.value}" is not valid`, token.position, tokenStream.expression);
                            }

                            node = new IdentifierNode(token.value);
                        }
                }
                break;

            case TokenType.NUMBER:
                tokenStream.next();

                return new ConstantNode(Number(token.value));
            case TokenType.STRING:
                tokenStream.next();

                return new ConstantNode(token.value.toString());
            default:
                if (token.isEquals(TokenType.PUNCTUATION, '[')) {
                    node = this._parseArrayExpression(tokenStream, identifiers);
                } else if (token.isEquals(TokenType.PUNCTUATION, '{')) {
                    node = this._parseObjectExpression(tokenStream, identifiers);
                    // throw new LocutionError('Not Implemented Yet');
                } else {
                    throw new SyntaxError(`Unexpected token "${token.type}" of value "${token.value}"`, token.position, tokenStream.expression);
                }
        }

        return this._parsePostfixExpression(tokenStream, identifiers, node);
    }

    private _parsePostfixExpression(tokenStream: TokenStream, identifiers: object, node: Node): Node {
        let token: Token = tokenStream.token;
        while (TokenType.PUNCTUATION == token.type) {
            if ('.' === token.value) {
                tokenStream.next();
                token = tokenStream.token;
                tokenStream.next();

                if (
                    TokenType.IDENTIFIER !== token.type
                    &&
                    (TokenType.OPERATOR !== token.type || !token.value.match('/[a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*/Y'))
                ) {
                    throw new SyntaxError('Expected name', token.position, tokenStream.expression);
                }

                const arg = new ConstantNode(token.value);

                if (tokenStream.token.isEquals(TokenType.PUNCTUATION, '(')) {
                    node = new MethodCallNode(node, arg, this._parseArguments(tokenStream, identifiers));
                } else {
                    node = new PropertyCallNode(node, arg);
                }
            } else if ('[' === token.value) {
                tokenStream.next();
                const arg = this._parseExpression(tokenStream, identifiers);
                tokenStream.expect(TokenType.PUNCTUATION, ']');

                node = new ArrayCallNode(node, arg);
            } else {
                break;
            }

            token = tokenStream.token;
        }

        return node;
    }

    private _parseArguments(tokenStream: TokenStream, identifiers: object): ArgumentsNode {
        const args = new ArgumentsNode();

        tokenStream.expect(TokenType.PUNCTUATION, '(', 'A list of arguments must begin with an opening parenthesis');
        while (!tokenStream.token.isEquals(TokenType.PUNCTUATION, ')')) {
            if (Object.keys(args.nodes).length > 0) {
                tokenStream.expect(TokenType.PUNCTUATION, ',', 'Arguments must be separated by a comma');
            }

            args.addItem(this._parseExpression(tokenStream, identifiers));
        }
        tokenStream.expect(TokenType.PUNCTUATION, ')', 'A list of arguments must be closed by a parenthesis');

        return args;
    }

    private _parseConditionalExpression(tokenStream: TokenStream, identifiers: object, expr: Node): Node {
        let trueNode: Node = new ConstantNode(null);
        let falseNode: Node = new ConstantNode(null);

        while (tokenStream.token.isEquals(TokenType.PUNCTUATION, '?')) {
            tokenStream.next();
            if (!tokenStream.token.isEquals(TokenType.PUNCTUATION, ':')) {
                trueNode = this._parseExpression(tokenStream, identifiers);
                if (tokenStream.token.isEquals(TokenType.PUNCTUATION, ':')) {
                    tokenStream.next();
                    falseNode = this._parseExpression(tokenStream, identifiers);
                }
            } else {
                tokenStream.next();
                trueNode = expr;
                falseNode = this._parseExpression(tokenStream, identifiers);
            }

            expr = new ConditionalNode(expr, trueNode, falseNode);
        }

        return expr;
    }

    private _parseArrayExpression(tokenStream: TokenStream, identifiers: object): Node {
        tokenStream.expect(TokenType.PUNCTUATION, '[', 'An array element was expected');

        const node: ArrayNode = new ArrayNode();
        let first: boolean = true;
        while (!tokenStream.token.isEquals(TokenType.PUNCTUATION, ']')) {
            if (!first) {
                tokenStream.expect(TokenType.PUNCTUATION, ',', 'An array element must be followed by a comma');

                // trailing ,?
                if (tokenStream.token.isEquals(TokenType.PUNCTUATION, ']')) {
                    break;
                }
            }
            first = false;

            node.addItem(this._parseExpression(tokenStream, identifiers));
        }
        tokenStream.expect(TokenType.PUNCTUATION, ']', 'An opened array is not properly closed');

        return node;
    }

    private _parseObjectExpression(tokenStream: TokenStream, identifiers: object): Node {
        tokenStream.expect(TokenType.PUNCTUATION, '{', 'A hash element was expected');

        const node = new ObjectNode();
        let first: boolean = true;
        while (!tokenStream.token.isEquals(TokenType.PUNCTUATION, '}')) {
            if (!first) {
                tokenStream.expect(TokenType.PUNCTUATION, ',', 'A hash value must be followed by a comma');

                // trailing ,?
                if (tokenStream.token.isEquals(TokenType.PUNCTUATION, '}')) {
                    break;
                }
            }
            first = false;

            // a hash key can be:
            //
            //  * a number -- 12
            //  * a string -- 'a'
            //  * a name, which is equivalent to a string -- a
            //  * an expression, which must be enclosed in parentheses -- (1 + 2)
            let key: Node;
            if (tokenStream.token.isEquals(TokenType.STRING) || tokenStream.token.isEquals(TokenType.IDENTIFIER) || tokenStream.token.isEquals(TokenType.NUMBER)) {
                key = new ConstantNode(tokenStream.token.value);
                tokenStream.next();
            } else if (tokenStream.token.isEquals(TokenType.PUNCTUATION, '(')) {
                key = this._parseExpression(tokenStream, identifiers);
            } else {
                throw new SyntaxError(`A hash key must be a quoted string, a number, a name, or an expression enclosed in parentheses (unexpected token "${tokenStream.token.type}" of value "${tokenStream.token.value}"`, tokenStream.token.position, tokenStream.expression);
            }

            tokenStream.expect(TokenType.PUNCTUATION, ':', 'A hash key must be followed by a colon (:)');
            const value: Node = this._parseExpression(tokenStream, identifiers);

            node.addItem(key, value);
        }
        tokenStream.expect(TokenType.PUNCTUATION, '}', 'An opened hash is not properly closed');

        return node;
    }
}