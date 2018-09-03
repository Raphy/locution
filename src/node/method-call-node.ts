import { LocutionError } from '../error';
import { Functions } from '../functions';
import { Identifiers } from '../identifiers';
import { ArgumentsNode } from './arguments-node';
import { Node } from './node';

export class MethodCallNode extends Node {
    constructor(object: Node, method: Node, args: ArgumentsNode) {
        super({object, method, args}, {});
    }

    public async evaluate(functions: Functions, identifiers: Identifiers): Promise<any> {
        const object = await this.nodes.object.evaluate(functions, identifiers);

        // todo: check if object is an object

        const method = await this.nodes.method.evaluate(functions, identifiers);

        if (false === Object.hasOwnProperty.call(object, method)) {
            throw new LocutionError(`Unable to call method \`${this.nodes.method.attributes.value}\``);
        }

        const args = await this.nodes.args.evaluate(functions, identifiers);

        return new Promise<any>((resolve) => resolve(object[method].apply(object, args)));
    }
}