import { readIntoTextRows } from './utils.js';

/**
 * Sum the results of valid multiplications
 */
export async function day03A() {
    // const rows = await readIntoTextRows('./src/data/test.txt');
    const rows = await readIntoTextRows('./src/data/03.txt');

    let sum = 0;
 
    rows.forEach(row => {
        // console.log({ row });

        // ATTEMPT 2: regex
        const mulRegex = /mul\(\d{1,3},\d{1,3}\)/gm;
        const muls = row.match(mulRegex);
        const digitRegex = /\d{1,3}/gm;

        muls.forEach(mul => {
            const [a, b] = mul.match(digitRegex);
            sum += (a * b);
        });

        // ATTEMPT 1: split; overcounts
        // const splitRow = row.split('mul(');
        // // console.log({ splitRow });

        // splitRow.forEach(subRow => {
        //     const parens = subRow.split(')');
        //     if (parens[0]) {
        //         console.log('parens: ', parens[0]);
        //         const [numA, numB] = parens[0].split(',');

        //         if (numA.length > 3 || numB.length > 3) {
        //             console.log('too long!', numA, ' - ', numB);
        //             return;
        //         }
                
        //         const product = Number(numA) * Number(numB);
        //         // console.log({ numA, numB, product });

        //         if (!isNaN(product)) {
        //             sum += product;
        //         } else {
        //             console.log('not a number!');
        //         }
        //     }
        // });
    });

    console.log({ sum }); // 170068701
    return sum;
}

/**
 * Sum the results of enabled, valid multiplications
 */
export async function day03B() {
    // const rows = await readIntoTextRows('./src/data/test.txt');
    const rows = await readIntoTextRows('./src/data/03.txt');

    let sum = 0;
    
    let enabled = true; // state has to persist across rows

    rows.forEach(row => {
        const mulRegex = /mul\(\d{1,3},\d{1,3}\)|do\(\)|don\'t\(\)/gm
        const muls = row.match(mulRegex);
        const digitRegex = /\d{1,3}/gm;

        muls.forEach(mul => {
            console.log({ mul });
            if (mul === 'do()') {
                console.log('enabling');
                enabled = true;
                return;
            }
            
            if (mul === 'don\'t()') {
                console.log('disabling');
                enabled = false;
                return;
            }

            if (enabled) {
                console.log('multiplying');
                const [a, b] = mul.match(digitRegex);
                sum += (a * b);
            }
        });
    });

    console.log({ sum }); // 78683433
    return sum;
}