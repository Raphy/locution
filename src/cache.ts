import { Node } from './node';

export interface Cache {
    set(key: string, node: Node);

    get(key: string): Node | null;
}