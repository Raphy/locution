import { Locution } from './src/locution';

const locution = new Locution(
    {
        get42: () => 42,
        add: (a: number, b: number) => a + b,
        foo: () => 42,
    }
);

const tests = [
    {expression: '42', identifiers: {}, result: 42},
    {expression: '"a string"', identifiers: {}, result: 'a string'},
    {expression: 'true', identifiers: {}, result: true},
    {expression: 'false', identifiers: {}, result: false},
    {expression: 'null', identifiers: {}, result: null},
    {expression: 'my_var', identifiers: {my_var: 21}, result: 21},
    {expression: '42 + 32', identifiers: {}, result: 74},
    {expression: '1 - 1', identifiers: {}, result: 0},
    {expression: 'my_var / 2', identifiers: {my_var: 20}, result: 10},
    {expression: 'my_var * another_var', identifiers: {my_var: 20, another_var: 3}, result: 60},
    {expression: 'my_var.prop', identifiers: {my_var: {prop: 'foo'}}, result: 'foo'},
    {expression: 'my_var.foo()', identifiers: {my_var: {foo: () => 21}}, result: 21},
    {expression: 'my_var.foo(10, 20, 30)', identifiers: {my_var: {foo: (a: number, b: number, c: number) => a + b + c}}, result: 60},
    {expression: 'my_var ? 10 : 20', identifiers: {my_var: true}, result: 10},
    {expression: 'my_var ? 10 : 20', identifiers: {my_var: false}, result: 20},
    {expression: 'my_var[0]', identifiers: {my_var: [10, 20, 30]}, result: 10},
    {expression: 'my_var[2]', identifiers: {my_var: [10, 20, 30]}, result: 30},
    {expression: '"hello world" matches "world"', identifiers: {}, result: true},
    {expression: '"hello world" matches "foo"', identifiers: {}, result: false},
    {expression: '"hello world" matches "^hello"', identifiers: {}, result: true},
    {expression: '"hello world" matches "^world"', identifiers: {}, result: false},
    {expression: '"hello world" matches "world$"', identifiers: {}, result: true},
    {expression: '"hello world" matches "bar"', identifiers: {}, result: false},
    {expression: 'true || false ? "yes" : "no"', identifiers: {}, result: 'yes'},
    {expression: 'true && false ? "yes" : "no"', identifiers: {}, result: 'no'},
    {expression: 'foo()', identifiers: {}, result: 42},
    {expression: '"foo" in bar', identifiers: {bar: ['foo', 'bar']}, result: true},
    {expression: '"miss" in bar', identifiers: {bar: ['foo', 'bar']}, result: false},
    {expression: '"foo" not in bar', identifiers: {bar: ['foo', 'bar']}, result: false},
    {expression: '"miss" not in bar', identifiers: {bar: ['foo', 'bar']}, result: true},
    {expression: '["foo", "bar", "titi"]', identifiers: {}, result: ['foo', 'bar', 'titi']},
    {expression: '["foo", "bar", "titi", my_var]', identifiers: {my_var: 'tata'}, result: ['foo', 'bar', 'titi', 'tata']},
    {expression: '{"foo": "bar", titi: 42, tutu: my_var}', identifiers: {my_var: 21}, result: {foo: 'bar', titi: 42, tutu: 21}},
    {expression: 'true && false || false', identifiers: {}, result: false},
    {expression: 'true && (false || true)', identifiers: {}, result: true},
    {expression: 'add(get42(), 21)', identifiers: {}, result: 63},
    {expression: '4 * 2 + 2', identifiers: {}, result: 10},
    {expression: '4 / 2 + 2', identifiers: {}, result: 4},
    {expression: '4 * (2 + 2)', identifiers: {}, result: 16},
    {expression: '4 / (2 + 2)', identifiers: {}, result: 1},
    {expression: 'my_promise + 2', identifiers: {my_promise: new Promise<number>(resolve => resolve(3))}, result: 5},
];


const assert = (actual: any, expected: any) => {
    if (actual === expected) {
        return true;
    }

    if (typeof expected === 'object' && typeof expected === 'object') {
        const expectedProperties = Object.getOwnPropertyNames(expected);
        const actualProperties = Object.getOwnPropertyNames(actual);

        if (expectedProperties.length !== actualProperties.length) {
            return false;
        }

        let isErred: boolean = false;
        expectedProperties.map((property: string) => {
            if (actualProperties.indexOf(property) === -1 && isErred === false) {
                isErred = true;
            }
        });

        return !isErred;
    }

    return false;
};

tests.map(async (test) => {
    try {
        const result = await locution.evaluate(test.expression, test.identifiers);
        console.log(`${assert(result, test.result) ? '[✓]' : '[x]'} \`${test.expression}\``, result, test.result);
    } catch (e) {
        console.log(`[x] \`${test.expression}\` => ${e.message}`);
        console.log(e);
    }

});
