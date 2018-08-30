import { Node } from './node';

export class UnaryNode extends Node {
    constructor(operator: string, node: Node) {
        super({node}, {operator});
    }

    public evaluate(functions: {[name: string]: Function}, identifiers: object): any {
        const value: any = (<any>this.nodes)['node'].evaluate(functions, identifiers);

        switch ((<any>this.attributes)['operator']) {
            case '!':
            case 'not':
                return !value;
            case '-':
                return -value;
        }

        return value;
    }
}