import { LocutionError } from '../error';
import { Node } from './node';

export class PropertyCallNode extends Node {
    constructor(object: Node, property: Node) {
        super({object, property}, {});
    }

    public evaluate(functions: {[name: string]: Function}, identifiers: object): any {
        const object = this.nodes.object.evaluate(functions, identifiers);

        // todo: check if object is an object

        const property = this.nodes.property.evaluate(functions, identifiers);

        if (false === Object.hasOwnProperty.call(object, property)) {
            throw new LocutionError(`Unable to get property \`${(<any>this.nodes)['property'].attributes.value}\``);
        }

        return object[property];
    }
}