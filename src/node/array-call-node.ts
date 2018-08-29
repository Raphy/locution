import { Node } from './node';

export class ArrayCallNode extends Node {
    constructor(array: Node, index: Node) {
        super({array, index}, {});
    }

    public evaluate(identifiers: object): any {
        const array = this.nodes.array.evaluate(identifiers);
        const index = this.nodes.index.evaluate(identifiers);

        return array[index];
    }
}