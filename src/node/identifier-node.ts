import { Node } from './node';

export class IdentifierNode extends Node {
    constructor(identifier: string) {
        super({}, {identifier});
    }

    public evaluate(_: {[name: string]: Function}, identifiers: object): any {
        return (<any>identifiers)[(<any>this.attributes)['identifier']];
    }
}