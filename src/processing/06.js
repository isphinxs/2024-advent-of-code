import { readIntoTextRows } from './utils.js';

export class Day06 {
    #dir; // 0 up; 1 right; 2 down; 3 left
    #pos;
    #initialDir;
    #initialPos;
    #inRoom;
    
    #rows;
    #numRows;
    #numColumns;
    #map;

    #numLoops;
    #loopTracker;

    constructor() {
        this.#map = [];
        this.#inRoom = true;
        this.#numLoops = 0;
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
                this.#moveUp(this.#map, row, column);
            } else if (dir === 1) {
                this.#moveRight(this.#map, row, column);
            } else if (dir === 2) {
                this.#moveDown(this.#map, row, column);
            } else if (dir === 3) {
                this.#moveLeft(this.#map, row, column);
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

    /**
     * Find the number of loops that can be cause by a single obstruction
     */
    async B() {
        // this.#rows = await readIntoTextRows('./src/data/test.txt');
        this.#rows = await readIntoTextRows('./src/data/06.txt');

        this.#processMap();
        this.#numRows = this.#rows.length;
        this.#numColumns = this.#rows[0].length;

        this.#map.forEach((row, rowIdx) => {
            row.forEach((char, charIdx) => {
                console.log('');
                if (char !== '#' && char !== '^') {
                    // reset trackers
                    this.#inRoom = true;
                    this.#loopTracker = new Map();
                    this.#dir = this.#initialDir;
                    this.#pos = this.#initialPos;

                    // generate and test a new map
                    const map = JSON.parse(JSON.stringify(this.#map));
                    map[rowIdx][charIdx] = '#';
                    this.#checkForLoop(map);
                }
            });
        });

        const count = this.#numLoops;
        console.log({ count }); // 1304
        return count;
    }

    #checkForLoop(map) {
        let isLoop = false;
       
        while (this.#inRoom) {
            let dir = this.#dir;
            let [row, column] = this.#pos;

            const isPathRepeated = this.#checkPosDir(row, column, dir);

            if (isPathRepeated) {
                isLoop = true;
                this.#inRoom = false;
                break;
            }

            if (dir === 0) {
                this.#moveUp(map, row, column);
            } else if (dir === 1) {
                this.#moveRight(map, row, column);
            } else if (dir === 2) {
                this.#moveDown(map, row, column);
            } else if (dir === 3) {
                this.#moveLeft(map, row, column);
            }
        }

        if (isLoop) {
            this.#numLoops++;
        }
    }

    #checkPosDir(row, column, dir) {
        // Map<row, Map<column, Set<dir>>>
        if (this.#loopTracker.has(row)) {
            const columns = this.#loopTracker.get(row);

            if (columns.has(column)) {
                const dirs = columns.get(column);

                if (dirs.has(dir)) {
                    return true;
                } else {
                    dirs.add(dir);
                    columns.set(column, dirs);
                    this.#loopTracker.set(row, columns);
                }
            } else {
                const dirs = new Set();
                dirs.add(dir);
                columns.set(column, dirs);
                this.#loopTracker.set(row, columns);
            }
        } else {
            const columns = new Map();
            const dirs = new Set();
            dirs.add(dir);
            columns.set(column, dirs);
            this.#loopTracker.set(row, columns);
        }

        return false;
    }

    #moveUp(map, initialRow, column) {
        let rowPos = initialRow;

        for (let i = 0; i <= initialRow; i++) {
            const row = initialRow - i;
            const char = map[row][column];
    
            if (char !== '#') {
                map[row][column] = 'x';
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

    #moveDown(map, initialRow, column) {
        let rowPos = initialRow;

        for (let i = 0; i < this.#numRows - initialRow; i++) {
            const row = initialRow + i;
            const char = map[row][column];
    
            if (char !== '#') {
                map[row][column] = 'x';
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

    #moveRight(map, row, initialColumn) {
        let columnPos = initialColumn;

        for (let i = 0; i < this.#numColumns - initialColumn; i++) {
            const column = initialColumn + i;
            const char = map[row][column];

            if (char !== '#') {
                map[row][column] = 'x';
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
    
    #moveLeft(map, row, initialColumn) {
        let columnPos = initialColumn;

        for (let i = 0; i <= initialColumn; i++) {
            const column = initialColumn - i;
            const char = map[row][column];

            if (char !== '#') {
                map[row][column] = 'x';
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
                    this.#initialDir = 0;
                    this.#dir = 0;
                    this.#initialPos = [rowIdx, charIdx];
                    this.#pos = [rowIdx, charIdx];
                }

                processedRow.push(char);
            };

            this.#map.push(processedRow);
        });
    }
}