import { readIntoColumns } from './utils.js';

/**
 * Day 01 A - sum difference between values in sorted lists
 */
export async function day01A() {
    const { columnA, columnB } = await readIntoColumns('./src/data/01.txt');
    
    columnA.sort((a, b) => a - b);
    columnB.sort((a, b) => a - b);

    let sum = 0;

    columnA.forEach((value, idx) => {
        const difference = Math.abs(value - columnB[idx]);
        console.log({ difference });
        sum += difference;
    })

    console.log({ sum }); // 2769675
    return sum;
}

/**
 * Day 01 B - sum column A multiplied by number of times the given number appears
 * in column B
 */
export async function day01B() {
    const { columnA, columnB } = await readIntoColumns('./src/data/01.txt');

    columnA.sort((a, b) => a - b);
    columnB.sort((a, b) => a - b);

    let sum = 0;
    let idx = 0;

    columnA.forEach(value => {
        let count = 0;

        for (let i = idx; i < columnB.length; i++) {
            const valueB = columnB[i];
            console.log({ valueB });
            if (valueB === value) {
                count++;
            }

            if (valueB > value) {
                idx = i;
                break;
            }
        }

        sum += value * count;
    });

    console.log({ sum }); // 24643097
    return sum;
}