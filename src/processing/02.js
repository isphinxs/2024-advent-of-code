import { readIntoRows } from './utils.js';

/**
 * Day 02 A - determine if row either increases only or decreases only,
 * with increases/decreases no between 1 and 3
 */
export async function day02A() {
    const rows = await readIntoRows('./src/data/02.txt');

    let count = 0;

    rows.forEach(row => {
        if (isSafe(row)) count++;
    });

    console.log({ count }); // 680
    return count;
}

/**
 * Day 02 B - determine if row either increases only or decreases only,
 * with increases/decreases no between 1 and 3; a row is also "safe" if
 * removing one number renders the rest of the row safe
 */
export async function day02B() {
    const rows = await readIntoRows('./src/data/02.txt');

    let count = 0;

    rows.forEach(row => {
        if (isSafe(row)) {
            count++;
        } else {
            for (let i = 0; i < row.length; i++) {
                const newRow = [...row];
                newRow.splice(i, 1);
                if (isSafe(newRow)) {
                    count++;
                    return
                }
            }
        }
    });

    console.log({ count }); // 710
    return count;
}

function isSafe(row) {
    let increasing;
    let safe = true;

    for (let i = 0; i < row.length - 1; i++) {
        const num = row[i];
        const nextNum = row[i + 1];

        // check if values are consistently increasing/decreasing
        const difference = nextNum - num;

        if (difference === 0) {
            safe = false;
            return;
        } else if (difference > 0) {
            if (increasing === undefined) {
                increasing = true;
            } else if (increasing === false) {
                safe = false;
                return;
            }
        } else if (difference < 0) {
            if (increasing === undefined) {
                increasing = false;
            } else if (increasing === true) {
                safe = false;
                return
            }
        }

        // check if values are within the range of safe increase/decrease
        const absDifference = Math.abs(difference);
        if (absDifference < 1 || absDifference > 3) {
            safe = false;
            return;
        }
    }

    return safe;
}