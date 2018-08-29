import { Node } from './node';

export class ConditionalNode extends Node {
    constructor(conditionNode: Node, trueCondition: Node, falseCondition: Node) {
        super({conditionNode, trueCondition, falseCondition}, {});
    }

    public evaluate(identifiers: object): any {
        if (this.nodes.conditionNode.evaluate(identifiers)) {
            return this.nodes.trueCondition.evaluate(identifiers);
        }

        return this.nodes.falseCondition.evaluate(identifiers)
    }
}