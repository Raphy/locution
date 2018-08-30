import { ArgumentsNode } from './arguments-node';
import { Node } from './node';

export class FunctionNode extends Node {
    constructor(name: string, args: ArgumentsNode) {
        super({args}, {name});
    }

    public evaluate(functions: {[name: string]: Function}, identifiers: object): any {
        return (<any>functions)[(<any>this.attributes)['name']].apply(null, (<any>this.nodes)['args'].evaluate(functions, identifiers));
    }
}