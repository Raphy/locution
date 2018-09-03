import { Functions } from '../functions';
import { Identifiers } from '../identifiers';
import { ArgumentsNode } from './arguments-node';
import { Node } from './node';

export class FunctionNode extends Node {
    constructor(name: string, args: ArgumentsNode) {
        super({args}, {name});
    }

    public async evaluate(functions: Functions, identifiers: Identifiers): Promise<any> {
        const args = await this.nodes.args.evaluate(functions, identifiers);

        return new Promise<any>((resolve) => resolve(functions[this.attributes.name].apply(null, args)));
    }
}