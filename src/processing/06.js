import { readIntoTextRows } from './utils.js';

export class Day06 {
    #dir; // 0 up; 1 right; 2 down; 3 left
    #pos;
    #inRoom;
    
    #rows;
    #numRows;
    #numColumns;
    #map;

    constructor() {
        this.#map = [];
        this.#inRoom = true;
    }

    /**
     * Count the number of positions traversed by the guard
     */
    async A() {
        // this.#rows = await readIntoTextRows('./src/data/test.txt');
        this.#rows = await readIntoTextRows('./src/data/06.txt');

        this.#processMap();
        this.#numRows = this.#rows.length;
        this.#numColumns = this.#rows[0].length;

        while (this.#inRoom) {
            let dir = this.#dir;
            let [row, column] = this.#pos;
            // console.log({ row, column, dir });

            if (dir === 0) {
                this.#moveUp(row, column);
            } else if (dir === 1) {
                this.#moveRight(row, column);
            } else if (dir === 2) {
                this.#moveDown(row, column);
            } else if (dir === 3) {
                this.#moveLeft(row, column);
            }

            // console.log(this.#map);
        }

        let sum = 0;
        this.#map.forEach(row => {
            row.forEach(char => {
                if (char === 'x') {
                    sum++;
                }
            });
        });

        console.log({ sum }); // 4789
        return sum;
    }

    #moveUp(initialRow, column) {
        let rowPos = initialRow;

        // console.log('move up');

        for (let i = 0; i <= initialRow; i++) {
            const row = initialRow - i;
            const char = this.#map[row][column];
    
            // console.log({ row, char });
    
            if (char !== '#') {
                this.#map[row][column] = 'x';
                rowPos = row;
            } else {
                this.#dir = 1;
                break;
            }
        }

        this.#pos = [rowPos, column];

        if (rowPos === 0) {
            this.#inRoom = false;
        }
    }

    #moveDown(initialRow, column) {
        let rowPos = initialRow;

        // console.log('move down');

        for (let i = 0; i < this.#numRows - initialRow; i++) {
            const row = initialRow + i;
            const char = this.#map[row][column];
    
            // console.log({ row, char });
    
            if (char !== '#') {
                this.#map[row][column] = 'x';
                rowPos = row;
            } else {
                this.#dir = 3;
                break;
            }
        }

        this.#pos = [rowPos, column];

        if (rowPos === this.#numRows - 1) {
            this.#inRoom = false;
        }
    }

    #moveRight(row, initialColumn) {
        let columnPos = initialColumn;

        // console.log('move right');

        for (let i = 0; i < this.#numColumns - initialColumn; i++) {
            const column = initialColumn + i;
            const char = this.#map[row][column];

            // console.log({ column, char });

            if (char !== '#') {
                this.#map[row][column] = 'x';
                columnPos = column;
            } else {
                this.#dir = 2;
                break;
            }
        }

        this.#pos = [row, columnPos];

        if (columnPos === this.#numColumns - 1) {
            this.#inRoom = false;
        }
    }
    
    #moveLeft(row, initialColumn) {
        let columnPos = initialColumn;

        // console.log('move left');

        for (let i = 0; i <= initialColumn; i++) {
            const column = initialColumn - i;
            const char = this.#map[row][column];

            // console.log({ column, char });

            if (char !== '#') {
                this.#map[row][column] = 'x';
                columnPos = column;
            } else {
                this.#dir = 0;
                break;
            }
        }

        this.#pos = [row, columnPos];

        if (columnPos === 0) {
            this.#inRoom = false;
        }
    }

    #processMap() {   
        this.#rows.forEach((row, rowIdx) => {
            const processedRow = [];

            for (let charIdx = 0; charIdx < row.length; charIdx++) {
                const char = row.charAt(charIdx);

                if (char === '^') {
                    this.#dir = 0;
                    this.#pos = [rowIdx, charIdx];
                }

                processedRow.push(char);
            };

            this.#map.push(processedRow);
        });
    }
}