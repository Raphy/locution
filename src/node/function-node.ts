import { Functions } from '../functions';
import { Identifiers } from '../identifiers';
import { ArgumentsNode } from './arguments-node';
import { Node } from './node';

export class FunctionNode extends Node {
    constructor(name: string, args: ArgumentsNode) {
        super({args}, {name});
    }

    public evaluate(functions: Functions, identifiers: Identifiers): any {
        return functions[this.attributes.name].apply(null, this.nodes.args.evaluate(functions, identifiers));
    }
}