import { Functions } from '../functions';
import { Identifiers } from '../identifiers';
import { Node } from './node';

export class ConditionalNode extends Node {
    constructor(conditionNode: Node, trueCondition: Node, falseCondition: Node) {
        super({conditionNode, trueCondition, falseCondition}, {});
    }

    public async evaluate(functions: Functions, identifiers: Identifiers): Promise<any> {
        if (await this.nodes.conditionNode.evaluate(functions, identifiers)) {
            return await this.nodes.trueCondition.evaluate(functions, identifiers);
        }

        return this.nodes.falseCondition.evaluate(functions, identifiers);
    }
}