import { LocutionError } from '../error';
import { Functions } from '../functions';
import { Identifiers } from '../identifiers';
import { ArgumentsNode } from './arguments-node';
import { Node } from './node';

export class MethodCallNode extends Node {
    constructor(object: Node, method: Node, args: ArgumentsNode) {
        super({object, method, args}, {});
    }

    public evaluate(functions: Functions, identifiers: Identifiers): any {
        const object = this.nodes.object.evaluate(functions, identifiers);

        // todo: check if object is an object

        const method = this.nodes.method.evaluate(functions, identifiers);

        if (false === Object.hasOwnProperty.call(object, method)) {
            throw new LocutionError(`Unable to call method \`${this.nodes.method.attributes.value}\``);
        }

        const args = this.nodes.args.evaluate(functions, identifiers);

        return object[method].apply(object, args);
    }
}