import { Functions } from '../functions';
import { Identifiers } from '../identifiers';
import { Node } from './node';

export class UnaryNode extends Node {
    constructor(operator: string, node: Node) {
        super({node}, {operator});
    }

    public async evaluate(functions: Functions, identifiers: Identifiers): Promise<any> {
        const value: any = await this.nodes.node.evaluate(functions, identifiers);

        switch (this.attributes.operator) {
            case '!':
            case 'not':
                return new Promise<any>((resolve) => resolve(!value));
            case '-':
                return new Promise<any>((resolve) => resolve(-value));
            default:
                return new Promise<any>((resolve) => resolve(value));
        }
    }
}