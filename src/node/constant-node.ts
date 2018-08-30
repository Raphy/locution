import { Node } from './node';

export class ConstantNode extends Node {
    constructor(value: any) {
        super({}, {value});
    }

    public evaluate(): any {
        return this.attributes.value;
    }
}