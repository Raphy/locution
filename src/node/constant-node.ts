import { Node } from './node';

export class ConstantNode extends Node {
    constructor(value: any) {
        super({}, {value});
    }

    public evaluate(_: object): any {
        return (<any>this.attributes)['value'];
    }
}