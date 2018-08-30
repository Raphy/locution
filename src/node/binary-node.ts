import { Functions } from '../functions';
import { Identifiers } from '../identifiers';
import { Node } from './node';

export class BinaryNode extends Node {
    constructor(operator: string, left: Node, right: Node) {
        super({left, right}, {operator});
    }

    public evaluate(functions: Functions, identifiers: Identifiers): any {
        const left: any = this.nodes.left.evaluate(functions, identifiers);
        const right: any = this.nodes.right.evaluate(functions, identifiers);

        const operatorMap: {[operator: string]: (left: any, right: any) => any} = {
            '+': (l: any, r: any) => Number(l) + Number(r),
            '-': (l: any, r: any) => Number(l) - Number(r),
            '/': (l: any, r: any) => Number(l) / Number(r),
            '*': (l: any, r: any) => Number(l) * Number(r),
            'in': (l: any, r: any) => r.includes(l),
            'not in': (l: any, r: any) => !r.includes(l),
            'matches': (l: any, r: any) => l.match(r) !== null,
            // tslint:disable-next-line:no-bitwise
            '|': (l: any, r: any) => Number(l) | Number(r),
            // tslint:disable-next-line:no-bitwise
            '^': (l: any, r: any) => Number(l) ^ Number(r),
            // tslint:disable-next-line:no-bitwise
            '&': (l: any, r: any) => Number(l) & Number(r),
            // tslint:disable-next-line:triple-equals
            '==': (l: any, r: any) => l == r,
            '===': (l: any, r: any) => l === r,
            // tslint:disable-next-line:triple-equals
            '!=': (l: any, r: any) => l != r,
            '!==': (l: any, r: any) => l !== r,
            '<': (l: any, r: any) => l < r,
            '>': (l: any, r: any) => l > r,
            '>=': (l: any, r: any) => l >= r,
            '<=': (l: any, r: any) => l <= r,
            '%': (l: any, r: any) => Number(l) % Number(r),
            'or': (l: any, r: any) => l || r,
            '||': (l: any, r: any) => l || r,
            'and': (l: any, r: any) => l && r,
            '&&': (l: any, r: any) => l && r,
            '**': (l: any, r: any) => Math.pow(Number(l), Number(r)),
            // tslint:disable-next-line:max-line-length
            '..': (l: any, r: any) => Array.apply(null, {length: r - l}).map(Function.call, Number).map((_, i) => i + l),
        };

        return operatorMap[this.attributes.operator](left, right);
    }
}