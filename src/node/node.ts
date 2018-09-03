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

    public async evaluate(functions: Functions, identifiers: Identifiers): Promise<any> {
        const results: {[name: string]: any} = {};

        await Object.getOwnPropertyNames(this._nodes).map(async (name: string) => {
            results[name] = await this._nodes[name].evaluate(functions, identifiers);
        });

        return new Promise<any>((resolve) => resolve(results));
    }
}