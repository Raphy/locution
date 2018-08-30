export class Node {
    get nodes(): {[name: string]: Node} {
        return this._nodes;
    }

    get attributes(): object {
        return this._attributes;
    }

    constructor(protected _nodes: {[name: string]: Node} = {}, protected _attributes: {[name: string]: any} = {}) {

    }

    public evaluate(functions: {[name: string]: Function}, identifiers: object): any {
        const results: {[name: string]: any} = {};

        Object.getOwnPropertyNames(this._nodes).map((name: string) => {
            results[name] = this._nodes[name].evaluate(functions, identifiers);
        });

        return results;
    }
}