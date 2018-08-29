import { LocutionError } from '../error';
import { ArgumentsNode } from './arguments-node';
import { Node } from './node';

export class MethodCallNode extends Node {
    constructor(object: Node, method: Node, args: ArgumentsNode) {
        super({object, method, args}, {});
    }

    public evaluate(identifiers: object): any {
        const object = this.nodes.object.evaluate(identifiers);

        // todo: check if object is an object
        // if (object === null || typeof object === 'object') {
        //     throw new LocutionError('Unable to get a property on a non-object');
        // }

        const method = this.nodes.method.evaluate(identifiers);

        if (false === Object.hasOwnProperty.call(object, method)) {
            throw new LocutionError(`Unable to call method \`${(<any>this.nodes)['method'].attributes.value}\``);
        }

        const args = this.nodes.args.evaluate(identifiers);

        return object[method].apply(object, args);
    }
}