import { SyntaxError } from './error';
import { Token, TokenStream, TokenType } from './token';

/**
 * The lexer of Locution library
 */
export class Lexer {
    /**
     * Tokenize a given expression into a TokenStream
     *
     * @param expression
     */
    public tokenize(expression: string): TokenStream {
        let position: number = 0;
        let tokens: Token[] = [];
        let matchResult: RegExpMatchArray | null;
        let brackets: { value: string, position: number }[] = [];

        while (position < expression.length) {
            while (matchResult = expression.substring(position).match(/\s+/y)) {
                position += matchResult[0].length;
            }

            if (matchResult = expression.substring(position).match(/[0-9]+(?:\.[0-9]+)?/y)) {
                tokens.push(new Token(TokenType.NUMBER, position, matchResult[0])); // Numbers
            } else if (matchResult = expression.substring(position).match(/{|\(|\[/y)) {
                brackets.push({value: matchResult[0], position: position}); // Opening brackets
                tokens.push(new Token(TokenType.PUNCTUATION, position, matchResult[0]));
            } else if (matchResult = expression.substring(position).match(/}|\)|\]/y)) {
                const bracket: { value: string, position: number } | undefined = brackets.pop();

                // Check if there is any kind of bracket to close
                if (!bracket) {
                    throw new SyntaxError(`Unexpected \`${matchResult[0]}\``, position, expression);
                }

                // Check if the kind of bracket pair is properly closed
                if ('{(['.indexOf(bracket.value) !== '})]'.indexOf(matchResult[0])) {
                    throw new SyntaxError(`Unclosed \`${bracket.value}\``, position, expression);
                }

                tokens.push(new Token(TokenType.PUNCTUATION, position, matchResult[0])); // Closing brackets
            } else if (matchResult = expression.substring(position).match(/"([^"\\\\]*(?:\\\\.[^"\\\\]*)*)"|'([^'\\\\]*(?:\\\\.[^'\\\\]*)*)'/y)) {
                tokens.push(new Token(TokenType.STRING, position, matchResult[0].substring(1, matchResult[0].length - 1))); // Strings
            } else if (matchResult = expression.substring(position).match(/not in(?=[\s(])|\!\=\=|not(?=[\s(])|and(?=[\s(])|\=\=\=|\>\=|or(?=[\s(])|\<\=|\*\*|\.\.|in(?=[\s(])|&&|\|\||matches|\=\=|\!\=|\*|~|%|\/|\>|\||\!|\^|&|\+|\<|\-/y)) {
                tokens.push(new Token(TokenType.OPERATOR, position, matchResult[0])); // Operators
            } else if (matchResult = expression.substring(position).match(/\.|\:|,|\?/y)) {
                tokens.push(new Token(TokenType.PUNCTUATION, position, matchResult[0])); // Punctuations
            } else if (matchResult = expression.substring(position).match(/[a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*/y)) {
                tokens.push(new Token(TokenType.IDENTIFIER, position, matchResult[0])); // Identifiers
            } else {
                throw new SyntaxError(`Unexpected character \`${expression[position]}\``, position, expression);
            }

            position += matchResult[0].length;
            while (matchResult = expression.substring(position).match(/\s+/y)) {
                position += matchResult[0].length;
            }
            matchResult = null;
        }

        // Check if any kind of brackets have been closed
        const bracket: { value: string, position: number } | undefined = brackets.pop();
        if (bracket) {
            throw new SyntaxError(`Unclosed \`${bracket.value}\``, position, expression);
        }

        tokens.push(new Token(TokenType.END_OF_EXPRESSION, position, ''));

        return new TokenStream(tokens, expression);
    }
}