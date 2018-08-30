# Locution

A library to evaluate string expressions

_This version is a copy from ExpressionLanguage component of Symfony (PHP) framework. Futures releases will change the library behaviors to make it more customizable_

# Quick Usage

```typescript
import { Locution } from 'locution';

const locution = new Locution(
    {
        foo: (bar: number) => bar * 2
    }
);

locution.evaluate(
    '(foo(10) / my_var) && ("a string" matches "foo" || my_var in my_array)',
    {
        my_var: 42,
        my_array: [21, 42, 45]
    }
); // returns true
```

###### ToDo

- Unit Tests
- Make some checks in nodes
- Setup a CI for the repo
- Generate a website for the documentation
