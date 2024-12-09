import { readIntoTextRows } from './utils.js';

export class Day04 {
    count = 0;

    constructor() {}

    /**
     * Count the number of times 'XMAS' appears
     */
    async A() {
        // const rows = await readIntoTextRows('./src/data/test.txt');
        const rows = await readIntoTextRows('./src/data/04.txt');
        
        // ATTEMPT 1: count XMAS forwards and backwards
        // ATTEMPT 2: count XMAS and SAMX forwards
        this._checkHorizontal(rows); // 5
        this._checkVertical(rows); // 3
        this._checkDiagonal(rows); // 10

        console.log(this.count); // 18 (test), 2406 (puzzle input)
        return this.count;
    }

    _checkHorizontal(rows) {
        rows.forEach(row => {
            let word = 0;
            let backword = 0;

            // check forwards and backwards
            for (let i = 0; i < row.length; i++) {
                const char = row[i];
                // console.log({ char, i });
                word = this._countXmas(char, word); // => 3
                backword = this._countSamx(char, backword); // => 2
            }
        });
    }

    _checkVertical(rows) {
        const rowLength = rows[0].length;

        // check top to bottom and bottom to top
        for (let column = 0; column < rowLength; column++) {
            let word = 0;
            let backword = 0;

            rows.forEach(row => {
                const char = row[column];
                // console.log({ char, column });
                word = this._countXmas(char, word); // => 1
                backword = this._countSamx(char, backword); // => 2
            });            
        }
    }

    _checkDiagonal(rows) {
        const numRows = rows.length;
        const numColumns = rows[0].length;
        const rowBoundary = numRows - 3;
        const columnBoundary = numColumns - 3;

        // rows[row][column]
        // 
        // 0 1 2 3
        // 1
        // 2
        // 3

        // check down right
        // start from top-left corner, head right // => 3
        for (let column = 0; column < columnBoundary; column++) {
            let word = 0;
            let backword = 0;
            
            // always start in row 0
            for (let i = 0; i < rows.length - column; i++) {
                const char = rows[i][column + i];
                // console.log({ char, column, i });
                word = this._countXmas(char, word); // => 1
                backword = this._countSamx(char, backword); // => 2
            }
        }

        // start from one below top-left corner, head down // => 2
        for (let row = 1; row < rowBoundary; row++) {
            let word = 0;
            let backword = 0;

            // always start in column 0
            for (let i = 0; i < rows.length - row; i++) {
                const char = rows[row + i][i];
                // console.log({ char, i });
                // console.log('row: ', row + i);
                word = this._countXmas(char, word); // => 0
                backword = this._countSamx(char, backword); // => 2
            }
        }

        // check up right
        // start from top-left corner, head down => 1
        for (let row = 3; row < numRows; row++) {
            let word = 0;
            let backword = 0;

            // always start in column 0
            for (let i = 0; i <= row; i++) {
                const char = rows[row - i][i];
                // console.log({ char, i });
                // console.log('row: ', row - i);
                word = this._countXmas(char, word); // => 1
                backword = this._countSamx(char, backword); // => 0
            }
        }

        // check up right
        // start from bottom row, column plus one, head right => 4
        for (let column = 1; column < columnBoundary; column++) {
            let word = 0;
            let backword = 0;

            // always start in bottom row
            for (let i = 0; i < numRows - column; i++) {
                const char = rows[numRows - 1 - i][column + i];
                // console.log({ char, i });
                // console.log('row: ', numRows - 1 - i, ', column: ', column + i);
                word = this._countXmas(char, word); // => 3
                backword = this._countSamx(char, backword); // => 1
            }
        }
    }

    /**
     * Evaluate if we're spelling "XMAS" (XMAS forwards)
     */
    _countXmas(char, word) {
        // if (word === 0 && char === 'X') {
        if (char === 'X') {
            console.log('x!');
            word = 1;
        } else if (word === 1) {
            if (char === 'M') {
                console.log('m!');
                word++;
            } else {
                console.log('resetting');
                word = 0;
            }
        } else if (word === 2) {
            if (char === 'A') {
                console.log('a!');
                word++;
            } else {
                console.log('resetting');
                word = 0;
            }
        } else if (word === 3) {
            if (char === 'S') {
                // 'XMAS' found, increment count
                console.log('found one!');
                this.count++;
            }
            console.log('resetting!');
            word = 0;
        }

        return word;
    }

    /**
     * Evaluate if we're spelling "SAMX" (XMAS backwards)
     */
    _countSamx(char, word) {
        if (char === 'S') {
            console.log('s!');
            word = 1;
        } else if (word === 1) {
            if (char === 'A') {
                console.log('a!');
                word++;
            } else {
                console.log('resetting');
                word = 0;
            }
        } else if (word === 2) {
            if (char === 'M') {
                console.log('m!');
                word++;
            } else {
                console.log('resetting');
                word = 0;
            }
        } else if (word === 3) {
            if (char === 'X') {
                // 'XMAS' found, increment count
                console.log('found one!');
                this.count++;
            }
            console.log('resetting!');
            word = 0;
        }

        return word;  
    }
}
