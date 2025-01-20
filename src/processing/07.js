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

        // rows.forEach(row => {
        //     const { value, operators } = this.#processRow(row);

        //     this.#checkOperation(value, operators);
        // });

        this.#permute('abcd'); // 24?

        const sum = this.#sum;
        console.log({ sum });
        // 2628155 - too low
        // 2631038090373 - too low
        // 159450344926 - too low
        // 856423678063 - too low
        return sum;
    }

    // permute('abc')
    // ['abc', 'acb', 'bac', 'bca', 'cab', 'cba']

    #permute(string) {
        const results = []; // number of results should equal n!
        const chars = string.split('');

        // Heap's Algorithm
        // from https://www.baeldung.com/cs/array-generate-all-permutations
        // c <- initialize array of size n to 0

        // i <- 0
        // while i < n:
        //     if c[i] < i:
        //         if i is even:
        //             Swap ElementsToPermute[0] and ElementsToPermute[i]
        //         else:
        //             Swap ElementsToPermute[c[i]] and ElementsToPermute[i]
        //         add ElementsToPermute to Permutations
        //         c[i] <- c[i] + 1
        //         i <- 0
        //     else:
        //         c[i] <- 0
        //         i <- i + 1

        const queue = [];
        let i = 0;
        while (i < string.length) {
            console.log({ i, queue });
            if (queue[i] < i) {
                console.log('here');
                if (i % 2 === 0) {
                    console.log('even');
                    const currentChar = chars[0];
                    const nextChar = chars[i];
                    chars[0] = nextChar;
                    chars[i] = currentChar;
                } else {
                    console.log('odd');
                    const currentChar = chars[queue[i]];
                    const nextChar = chars[i];
                    chars[queue[i]] = nextChar;
                    chars[i] = currentChar;
                }
                results.push(chars.join(''));
                queue[i] = queue[i] + 1;
                i = 0;
            } else {
                console.log('there');
                queue[i] = 0;
                i++;
            }
        }

        // for (let i = 0; i < string.length; i++) {
        //     // set first letter
        //     const char = chars[i];
        //     const newWord = [...chars];
        //     const zeroChar = newWord[0];
        //     newWord[0] = char;
        //     newWord[i] = zeroChar;
        //     results.push(newWord.join(''));

        //     let currentIdx = 1; 
        //     // loop through each letter after the first
        //     while (currentIdx < string.length) {
        //         // find the permutations for each subsequent letter
        //         // a, b ... c, d
        //         for (let j = currentIdx; j < string.length - 1; j++) {
        //             let nextIdx = j + 1;
        //             const word = [...chars];

        //             while (nextIdx < string.length) {
        //                 const currentChar = word[nextIdx];
        //                 const nextChar = word[nextIdx + 1];
        //                 word[nextIdx] = nextChar;
        //                 word[nextIdx + 1] = currentChar;
        //                 results.push(word.join(''));

        //                 nextIdx++;
        //             }

        //         }

        //         currentIdx++;
        //     }
            
        // }

        console.log({ results });
        console.log(results.length);
    }

    #checkOperation(value, operators) {
        console.log({ value, operators });

        // COMBINATIONS AND PERMUTATIONS

        // 1 2 3
        // 
        // 1 + 2
        // 1 + 2 + 3
        // 
        // 1 + 2 * 3
        // 
        // 1 * 2
        // 1 * 2 + 3

        function compute(value, arr) {
            let sum = 0;

            if (arr.length === 0) return 0;
            if (arr.length === 1) return arr[0];

            // 1 2 3
            // 2 3
            // 3
            // => 3
            // => 5 or 6
            // => 5 or 6 or 5 or 6
            for (let i = 0; i < arr.length; i++) {
                const num = arr[i];
                const newArr = arr.slice(i + 1);
                const computeNewArr = compute(value, newArr);

                for (let j = 0; j < newArr.length; j++) {
                    // sum += 
                }
            }

            return sum;
        }

        // // check a simple sum
        // const sum = operators.reduce((a, b) => a + b, 0);

        // if (sum === value) {
        //     console.log('MATCH WITH ADDITION');
        //     return;
        // }

        // // check if any of the operators are factors of the value
        // for (let i = 0; i < operators.length; i++) {
        //     const operator = operators[i];

        //     if ( value % operator === 0) {
        //         console.log(`${operator} is a factor of ${value}`);
        //     }
        // }

        // // can we write this recursively?
        // compute(operators, value);
        // console.log('');

        // // return sum recursively
        // function compute(arr, value) {
        //     console.log({ arr });
        //     if (arr.length === 0) {
        //         console.log('zero case');
        //         return 0; // 0 for addition, 1 for multiplication
        //     }

        //     // THIS LINE WORKS
        //     // const sum = arr[arr.length - 1] * compute(arr.slice(0, arr.length - 1));

        //     // const sum = arr[arr.length - 1] + compute(arr.slice(0, arr.length - 1));

        //     // . . . 0
        //     for (let i = 0; i < operators.length; i++) {

        //         const sum = arr[arr.length - 1] * compute(arr.slice(0, arr.length - 1));
        //         // const sum = operators.reduce((a, b, idx) => {
        //         //     if (idx === 0 || idx !== i) {
        //         //         console.log(`${a} + ${b}`);
        //         //         return a + b;
        //         //     } else {
        //         //         console.log(`${a} * ${b}`);
        //         //         return a * b;
        //         //     }
        //         // }, 0);
    
        //         console.log({ sum });
    
        //         if (sum === value) {
        //             console.log('MATCH!!!');
        //             this.#sum += value;
        //             return;
        //         }

        //         return sum;
        //     }

        //     // console.log({ sum });

        //     // if (sum === value) {
        //     //     console.log('MATCH!');
        //     //     return;
        //     // }

        //     // return sum;
        // }



        // function add(a, b) { a + b }
        // function multiply(a, b) { a * b }
    }

    // ATTEMPT 1
    // #checkOperation(value, operators) {
    //     console.log({ value, operators });
    //     // const addSum = operators.reduce((a, b) => a + b, 0);
    //     // console.log({ value, operators, addSum });

    //     // const multSum = operators.reduce((a, b) => a * b, 1);
    //     // console.log({ value, operators, multSum });

    //     // for each position, 
    //     // + + +
    //     // * * * 
    //     // + * * 
    //     // + + *
    //     // + * +
    //     // too many permutations
    //     // assume addition, then play around with the place of multiplication?

    //     // + + +
    //     // 
    //     // * + + add one...
    //     // + * + and move it right
    //     // + + *
    
    //     for (let i = 0; i < operators.length; i++) {
    //         const sum = operators.reduce((a, b, idx) => {
    //             if (idx === 0 || idx !== i) {
    //                 console.log(`${a} + ${b}`);
    //                 return a + b;
    //             } else {
    //                 console.log(`${a} * ${b}`);
    //                 return a * b;
    //             }
    //         }, 0);

    //         console.log({ sum });

    //         if (sum === value) {
    //             console.log('MATCH!!!');
    //             this.#sum += value;
    //             return;
    //         }
            
    //         // if we don't find a match with a single *, add a second
    //         //
    //         // + + + +
    //         // 
    //         // * + + +
    //         // * * + +
    //         // * + * +
    //         // * + + *
    //         //
    //         // + * + +
    //         // + * * +
    //         // + * + *
    //         // 
    //         // + + * +
    //         // + + * *

    //         for (let j = i + 1; j < operators.length; j++) {
    //             const sum = operators.reduce((a, b, idx) => {
    //                 if (idx === 0) {
    //                     console.log(`first operation: ${a} + ${b}`);
    //                     return a + b;
    //                 } else if (idx === i || idx === j) {
    //                     console.log(`${a} * ${b}`);
    //                     return a * b;
    //                 } else {
    //                     console.log(`${a} + ${b}`);
    //                     return a + b;
    //                 }
    //             }, 0);
    
    //             console.log({ sum });

    //             if (sum === value) {
    //                 console.log('MATCH!!!');
    //                 this.#sum += value;
    //                 return;
    //             }

    //             // if we don't find a match with two *, add a third
    //             // 
    //             // + + + +
    //             // 
    //             // * + + +
    //             // * * * +
    //             // * * + *

    //             for (let k = j + 1; k < operators.length; k++) {
    //                 const sum = operators.reduce((a, b, idx) => {
    //                     if (idx === 0) {
    //                         console.log(`first operation: ${a} + ${b}`);
    //                         return a + b;
    //                     } else if (idx === i || idx === j || idx === k) {
    //                         console.log(`${a} * ${b}`);
    //                         return a * b;
    //                     } else {
    //                         console.log(`${a} + ${b}`);
    //                         return a + b;
    //                     }
    //                 }, 0);
        
    //                 console.log({ sum });
    
    //                 if (sum === value) {
    //                     console.log('MATCH!!!');
    //                     this.#sum += value;
    //                     return;
    //                 }

    //                 // add a fourth
    //                 for (let l = k + 1; l < operators.length; l++) {
    //                     const sum = operators.reduce((a, b, idx) => {
    //                         if (idx === 0) {
    //                             console.log(`first operation: ${a} + ${b}`);
    //                             return a + b;
    //                         } else if (idx === i || idx === j || idx === k || idx === l) {
    //                             console.log(`${a} * ${b}`);
    //                             return a * b;
    //                         } else {
    //                             console.log(`${a} + ${b}`);
    //                             return a + b;
    //                         }
    //                     }, 0);
            
    //                     console.log({ sum });
        
    //                     if (sum === value) {
    //                         console.log('MATCH!!!');
    //                         this.#sum += value;
    //                         return;
    //                     }

    //                     // add a fifth
    //                     for (let m = l + 1; m < operators.length; m++) {
    //                         const sum = operators.reduce((a, b, idx) => {
    //                             if (idx === 0) {
    //                                 console.log(`first operation: ${a} + ${b}`);
    //                                 return a + b;
    //                             } else if (idx === i || idx === j || idx === k || idx === l || idx === m) {
    //                                 console.log(`${a} * ${b}`);
    //                                 return a * b;
    //                             } else {
    //                                 console.log(`${a} + ${b}`);
    //                                 return a + b;
    //                             }
    //                         }, 0);
                
    //                         console.log({ sum });
            
    //                         if (sum === value) {
    //                             console.log('MATCH!!!');
    //                             this.#sum += value;
    //                             return;
    //                         }
    //                     }
    //                 }
    //             }

    //         }
    //     }

    //     console.log('');
    // }

    #processRow(row) {
        const [value, operations] = row.split(': ');
        const operators = operations.split(' ').map(operator => Number(operator));

        return {
            value: Number(value),
            operators,
        }
    }
}