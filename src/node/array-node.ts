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

    public addItems(nodes: Node[]) {
        nodes.map((node: Node) => {
            this.addItem(node);
        });
    }

    public evaluate(functions: {[name: string]: Function}, identifiers: object): any[] {
        const results: any[] = [];

        Object.getOwnPropertyNames(this.nodes).sort().map((index: string) => {
            results.push(this.nodes[index].evaluate(functions, identifiers));
        });

        return results;
    }
}