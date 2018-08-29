import { LocutionError } from '../error';
import { Node } from './node';

export class PropertyCallNode extends Node {
    constructor(object: Node, property: Node) {
        super({object, property}, {});
    }

    public evaluate(identifiers: object): any {
        const object = this.nodes.object.evaluate(identifiers);

        // todo: check if object is an object
        // if (object === null || typeof object === 'object') {
        //     throw new LocutionError('Unable to get a property on a non-object');
        // }

        const property = this.nodes.property.evaluate(identifiers);

        if (false === Object.hasOwnProperty.call(object, property)) {
            throw new LocutionError(`Unable to get property \`${(<any>this.nodes)['property'].attributes.value}\``);
        }

        return object[property];
    }
}