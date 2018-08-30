import { LocutionError } from '../error';
import { Functions } from '../functions';
import { Identifiers } from '../identifiers';
import { Node } from './node';

export class PropertyCallNode extends Node {
    constructor(object: Node, property: Node) {
        super({object, property}, {});
    }

    public evaluate(functions: Functions, identifiers: Identifiers): any {
        const object = this.nodes.object.evaluate(functions, identifiers);

        // todo: check if object is an object

        const property = this.nodes.property.evaluate(functions, identifiers);

        if (false === Object.hasOwnProperty.call(object, property)) {
            throw new LocutionError(`Unable to get property \`${this.nodes.property.attributes.value}\``);
        }

        return object[property];
    }
}