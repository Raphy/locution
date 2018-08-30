import { Functions } from '../functions';
import { Identifiers } from '../identifiers';
import { Node } from './node';

export class UnaryNode extends Node {
    constructor(operator: string, node: Node) {
        super({node}, {operator});
    }

    public evaluate(functions: Functions, identifiers: Identifiers): any {
        const value: any = this.nodes.node.evaluate(functions, identifiers);

        switch (this.attributes.operator) {
            case '!':
            case 'not':
                return !value;
            case '-':
                return -value;
            default:
                return value;
        }

        return value;
    }
}