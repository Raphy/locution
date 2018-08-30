import { Node } from './node';

export class ConditionalNode extends Node {
    constructor(conditionNode: Node, trueCondition: Node, falseCondition: Node) {
        super({conditionNode, trueCondition, falseCondition}, {});
    }

    public evaluate(functions: {[name: string]: Function}, identifiers: object): any {
        if (this.nodes.conditionNode.evaluate(functions, identifiers)) {
            return this.nodes.trueCondition.evaluate(functions, identifiers);
        }

        return this.nodes.falseCondition.evaluate(functions, identifiers)
    }
}