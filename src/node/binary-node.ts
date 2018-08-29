import { Node } from './node';

export class BinaryNode extends Node {
    constructor(operator: string, left: Node, right: Node) {
        super({left, right}, {operator});
    }

    public evaluate(identifiers: object): any {
        const left: any = this.nodes.left.evaluate(identifiers);
        const right: any = this.nodes.right.evaluate(identifiers);

    const operatorMap: {[operator: string]: (left: any, right: any) => any} = {
            '+': (l: any, r: any) => Number(l) + Number(r),
            '-': (l: any, r: any) => Number(l) - Number(r),
            '/': (l: any, r: any) => Number(l) / Number(r),
            '*': (l: any, r: any) => Number(l) * Number(r),
            'in': (l: any, r: any) => r.includes(l),
            'not in': (l: any, r: any) => !r.includes(l),
            'matches': (l: any, r: any) => l.match(r) !== null,
            '|': (l: any, r: any) => l | r,
            '^': (l: any, r: any) => l ^ r,
            '&': (l: any, r: any) => l & r,
            '==': (l: any, r: any) => l == r,
            '===': (l: any, r: any) => l === r,
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
            '..': (l: any, r: any) => Array.apply(null, {length: r - l}).map(Function.call, Number).map((_: any, i: number) => i + l),
        };

        return operatorMap[(<any>this.attributes)['operator']](left, right);
    }
}