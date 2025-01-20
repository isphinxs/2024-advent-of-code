import { readIntoTextRows } from './utils.js';

export class Day07 {
    #sum = 0;

    constructor() {}

    /**
     * Find the sum of the test values for valid operations (+, *)
     */
    async A() {
        // const rows = await readIntoTextRows('./src/data/test.txt');
        const rows = await readIntoTextRows('./src/data/07.txt');

        rows.forEach(row => {
            const { value, operators } = this.#processRow(row);

            const result = this.#checkOperation(value, operators);
            this.#sum += result;
        });

        const sum = this.#sum;
        console.log({ sum }); // 3598800864292
        return sum;
    }

    /**
     * Find the sum of the test values for valid operations (+, *, concatenation)
     */
    async B() {
        // const rows = await readIntoTextRows('./src/data/test.txt');
        const rows = await readIntoTextRows('./src/data/07.txt');

        rows.forEach(row => {
            const { value, operators } = this.#processRow(row);

            const result = this.#checkOperationConcat(value, operators);
            this.#sum += result;
        });

        const sum = this.#sum;
        console.log({ sum }); // 340362529351427
        return sum;
    }

    #checkOperation(value, operators) {
        let stack = new Set();
        stack.add(operators[0]);
        let pos = 1;

        while (pos < operators.length) {
            const nextStack = new Set();

            stack.forEach(entry => {
                const mult = entry * operators[pos];
                const add = entry + operators[pos];

                if (add <= value && !nextStack.has(add)) nextStack.add(add);
                if (mult <= value && !nextStack.has(mult)) nextStack.add(mult);
            });

            stack = nextStack;
            pos++;
        }

        return stack.has(value) ? value : 0;
    }

    #checkOperationConcat(value, operators) {
        let stack = new Set();
        stack.add(operators[0]);
        let pos = 1;

        while (pos < operators.length) {
            const nextStack = new Set();

            stack.forEach(entry => {
                const mult = entry * operators[pos];
                const add = entry + operators[pos];
                const concat = Number(entry.toString() + operators[pos].toString());

                // console.log({ mult, add, concat });

                if (add <= value && !nextStack.has(add)) nextStack.add(add);
                if (mult <= value && !nextStack.has(mult)) nextStack.add(mult);
                if (concat <= value && !nextStack.has(concat)) nextStack.add(concat);
            });

            stack = nextStack;
            pos++;
        }

        return stack.has(value) ? value : 0;
    }

    #processRow(row) {
        const [value, operations] = row.split(': ');
        const operators = operations.split(' ').map(operator => Number(operator));

        return {
            value: Number(value),
            operators,
        }
    }
}