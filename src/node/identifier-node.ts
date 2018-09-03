import { Identifiers } from '../identifiers';
import { Node } from './node';

export class IdentifierNode extends Node {
    constructor(identifier: string) {
        super({}, {identifier});
    }

    public async evaluate(_, identifiers: Identifiers): Promise<any> {
        if (identifiers[this.attributes.identifier] instanceof Promise) {
            return await identifiers[this.attributes.identifier];
        }

        return identifiers[this.attributes.identifier];
    }
}