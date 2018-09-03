import { Functions } from '../functions';
import { Identifiers } from '../identifiers';
import { Node } from './node';

export class ArrayCallNode extends Node {
    constructor(array: Node, index: Node) {
        super({array, index}, {});
    }

    public async evaluate(functions: Functions, identifiers: Identifiers): Promise<any> {
        const array = await this.nodes.array.evaluate(functions, identifiers);
        const index = await this.nodes.index.evaluate(functions, identifiers);

        return new Promise<any>((resolve) => resolve(array[index]));
    }
}