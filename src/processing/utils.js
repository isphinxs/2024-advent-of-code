import * as fs from 'fs';
import * as readline from 'readline';

export async function readIntoColumns(file) {
    const fileStream = fs.createReadStream(file);
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity,
    });

    const columnA = [];
    const columnB = [];

    for await (const line of rl) {
        const [a, b] = line.split('   ');

        columnA.push(Number(a));
        columnB.push(Number(b));
    }

    // console.log({ columnA });
    // console.log({ columnB });
    return { columnA, columnB };
}