import { Functions } from '../functions';
import { Identifiers } from '../identifiers';
import { Node } from './node';

export class ObjectNode extends Node {
    private _currentIndex: number = 0;

    constructor() {
        super({}, {});
    }

    public addItem(key: Node, node: Node) {
        this._nodes['key_' + this._currentIndex] = key;
        this._nodes['value_' + this._currentIndex] = node;
        this._currentIndex++;
    }

    public async evaluate(functions: Functions, identifiers: Identifiers): Promise<object> {
        const nodeNamesPairs: string[][] = [];
        const properties = Object.getOwnPropertyNames(this.nodes);
        for (let i = 0; i < properties.length; i += 2) {
            nodeNamesPairs.push(properties.slice(i, i + 2));
        }

        const object: object = {};
        for (const nodeNamesPair of nodeNamesPairs) {
            const key = await this.nodes[nodeNamesPair[0]].evaluate(functions, identifiers);
            object[key] = await this.nodes[nodeNamesPair[1]].evaluate(functions, identifiers);
        }

        return new Promise<object>((resolve) => resolve(object));
    }
}