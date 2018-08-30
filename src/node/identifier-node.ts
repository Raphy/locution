import { Identifiers } from '../identifiers';
import { Node } from './node';

export class IdentifierNode extends Node {
    constructor(identifier: string) {
        super({}, {identifier});
    }

    public evaluate(_, identifiers: Identifiers): any {
        return identifiers[this.attributes.identifier];
    }
}