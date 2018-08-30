import { Node } from './node';

export class ArrayCallNode extends Node {
    constructor(array: Node, index: Node) {
        super({array, index}, {});
    }

    public evaluate(functions: {[name: string]: Function}, identifiers: object): any {
        const array = this.nodes.array.evaluate(functions, identifiers);
        const index = this.nodes.index.evaluate(functions, identifiers);

        return array[index];
    }
}