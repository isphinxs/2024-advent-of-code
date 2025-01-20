import { readIntoTextRows } from './utils.js';

export class Day07 {
    #sum = 0;

    constructor() {}

    /**
     * Find the sum of the test values for valid operations
     */
    async A() {
        const rows = await readIntoTextRows('./src/data/test.txt');
        // const rows = await readIntoTextRows('./src/data/07.txt');

        rows.forEach(row => {
            const { value, operators } = this.#processRow(row);

            const result = this.#checkOperation(value, operators);
            const numResults = result.length;
            console.log({ result, numResults });
        });

        const sum = this.#sum;
        console.log({ sum });
        // 2628155 - too low
        // 2631038090373 - too low
        // 159450344926 - too low
        // 856423678063 - too low
        return sum;
    }

    #checkOperation(value, operators) {
        // try recursion
        // console.log({ operators });

        if (operators.length === 0) {
            return [[]];
        }

        const permutations = [];

        for (let operator of operators) {
            // console.log({ operator });
            const remainingOperators = operators.filter(element => element !== operator);
            const subPermutations = this.#checkOperation(value, remainingOperators);

            for (let perm of subPermutations) {
                permutations.push([operator, ...perm]);
            }
        }

        return permutations;
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