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

    public evaluate(identifiers: object): object {
        let nodeNamesPairs: string[][] = [];
        const properties = Object.getOwnPropertyNames(this.nodes);
        for (let i = 0; i < properties.length; i += 2) {
            nodeNamesPairs.push(properties.slice(i, i + 2));
        }

        let object: object = {};
        nodeNamesPairs.map((nodeNamesPair: string[]) => {
            const key = this.nodes[nodeNamesPair[0]].evaluate(identifiers);
            object[key] = this.nodes[nodeNamesPair[1]].evaluate(identifiers);
        });

        return object;
    }
}