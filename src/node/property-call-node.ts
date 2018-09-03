import { LocutionError } from '../error';
import { Functions } from '../functions';
import { Identifiers } from '../identifiers';
import { Node } from './node';

export class PropertyCallNode extends Node {
    constructor(object: Node, property: Node) {
        super({object, property}, {});
    }

    public async evaluate(functions: Functions, identifiers: Identifiers): Promise<any> {
        const object = await this.nodes.object.evaluate(functions, identifiers);

        // todo: check if object is an object

        const property = await this.nodes.property.evaluate(functions, identifiers);

        if (false === Object.hasOwnProperty.call(object, property)) {
            throw new LocutionError(`Unable to get property \`${this.nodes.property.attributes.value}\``);
        }

        return new Promise<any>((resolve) => resolve(object[property]));
    }
}