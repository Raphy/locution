import { ArgumentsNode } from './arguments-node';
import { Node } from './node';

export class FunctionNode extends Node {
    constructor(name: string, args: ArgumentsNode) {
        super({args}, {name});
    }

    public evaluate(identifiers: object): any {
        // todo: enable a function registry instead of using identifiers

        // todo: check if is a function
        /*
        function isFunction(functionToCheck) {
            return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
        }
         */

        return (<any>identifiers)[(<any>this.attributes)['name']].apply(null, (<any>this.nodes)['args'].evaluate(identifiers));
    }
}