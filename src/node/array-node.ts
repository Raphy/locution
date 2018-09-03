import { Functions } from '../functions';
import { Identifiers } from '../identifiers';
import { Node } from './node';

export class ArrayNode extends Node {
    private _nextIndex: number = 0;

    constructor() {
        super({}, {});
    }

    public addItem(node: Node) {
        this._nodes[this._nextIndex.toString()] = node;
        this._nextIndex++;
    }

    public async evaluate(functions: Functions, identifiers: Identifiers): Promise<any[]> {
        const results: any[] = [];
        const properties = Object.getOwnPropertyNames(this.nodes).sort();

        for (const property of properties) {
            results.push(await this.nodes[property].evaluate(functions, identifiers));
        }

        return new Promise<any[]>((resolve) => resolve(results));
    }
}