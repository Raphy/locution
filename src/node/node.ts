import { Functions } from '../functions';
import { Identifiers } from '../identifiers';

export class Node {
    get nodes(): {[name: string]: Node} {
        return this._nodes;
    }

    get attributes(): {[name: string]: any} {
        return this._attributes;
    }

    constructor(protected _nodes: {[name: string]: Node} = {}, protected _attributes: {[name: string]: any} = {}) {
    }

    public evaluate(functions: Functions, identifiers: Identifiers): any {
        const results: {[name: string]: any} = {};

        Object.getOwnPropertyNames(this._nodes).map((name: string) => {
            results[name] = this._nodes[name].evaluate(functions, identifiers);
        });

        return results;
    }
}