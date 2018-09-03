import { Node } from './node';

export class ConstantNode extends Node {
    constructor(value: any) {
        super({}, {value});
    }

    public evaluate(): Promise<any> {
        return new Promise<any>((resolve) => resolve(this.attributes.value));
    }
}