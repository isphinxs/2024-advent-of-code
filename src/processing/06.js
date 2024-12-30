import { readIntoTextRows } from './utils.js';

export class Day06 {
    #dir; // 0 up; 1 right; 2 down; 3 left
    #pos;
    #guardPath;
    
    #rows;
    #obstacleRows;
    #obstacleColumns;
    #obstaclesByRow;
    #obstaclesByColumn;

    constructor() {
        this.#guardPath = new Map();
    }

    /**
     * Count the number of positions traversed by the guard
     */
    async A() {
        this.#rows = await readIntoTextRows('./src/data/test.txt');
        // this.#rows = await readIntoTextRows('./src/data/06.txt');

        this.#processMap();

        // move guard
        let inRoom = true;
        let dir = this.#dir;
        let [x, y] = this.#pos;
        
        while (inRoom) {
            let hitObstacle = false;

            switch (dir) {
                case 0: // up => increase x
                    // check for an obstacle in the column
                    if (this.#obstacleColumns.has(y)) {
                        // check if the obstacle is above the guard
                        const rows = [...this.#obstaclesByColumn.get(y)];
                        for (let i = 0; i < rows.length; i++) {
                            const row = rows[i];
                            if (x > row) {
                                this.#recordSquares([x, y], [row + 1, y]);

                                x = row + 1; // move to one below obstacle
                                dir = 1;
                                hitObstacle = true;
                                break;
                            }
                        }
                    }

                    if (!hitObstacle) {
                        // exeunt
                        this.#recordSquares([x, y], [0, y]);
                        x = 0;
                        inRoom = false;
                    }
                    break;
                case 1: // right => increase y
                    // check for an obstacle in the row
                    if (this.#obstacleRows.has(x)) {
                        // check if the obstacle is to the right of the guard
                        const columns = [...this.#obstaclesByRow.get(x)];
                        // console.log({ columns });
                        for (let i = 0; i < columns.length; i++) {
                            const column = columns[i];
                            if (y < column) {
                                this.#recordSquares([x, y], [x, column - 1]);
                                y = column - 1; // move to one to the left of the obstacle
                                dir = 2;
                                hitObstacle = true;
                                break;
                            }
                        }
                    } 
                    
                    if (!hitObstacle) {
                        // exeunt
                        this.#recordSquares([x, y], [x, this.#rows[0].length - 1]);
                        y = this.#rows[0].length - 1;
                        inRoom = false;
                    }
                    break;
                case 2: // down => decrease x
                    // check for an obstacle in the column
                    if (this.#obstacleColumns.has(y)) {
                        // check if the obstacle is above the guard
                        const rows = [...this.#obstaclesByColumn.get(y)];
                        for (let i = 0; i < rows.length; i++) {
                            const row = rows[i];
                            if (x < row) {
                                this.#recordSquares([row - 1, y], [x, y]);
                                x = row - 1; // move to one above obstacle
                                dir = 3;
                                hitObstacle = true;
                                break;
                            }
                        }
                    } 
                    
                    if (!hitObstacle) {
                        // exeunt
                        this.#recordSquares([this.#rows.length - 1, y], [x, y]);
                        x = this.#rows.length - 1;
                        inRoom = false;
                    }
                    break;
                case 3: // left => decrease y
                    // check for an obstacle in the row
                    if (this.#obstacleRows.has(x)) {
                        // check if the obstacle is to the right of the guard
                        const columns = [...this.#obstaclesByRow.get(x)];
                        // console.log({ columns });
                        for (let i = 0; i < columns.length; i++) {
                            const column = columns[i];
                            if (y > column) {
                                this.#recordSquares([x, column + 1], [x, y]);
                                y = column + 1; // move to one to the right of the obstacle
                                dir = 0;
                                hitObstacle = true;
                                break;
                            }
                        }
                    } 
                    
                    if (!hitObstacle) {
                        // exeunt
                        this.#recordSquares([0, y], [x, y]);
                        x = 0;
                        inRoom = false;
                    }
            }

            console.log(`new pos: ${x}, ${y}`);
            console.log(`new dir: ${dir}`);
        }

        const sum = this.#guardPath.get('count');
        this.#guardPath.forEach(row => {
            console.log(row);
        });
        console.log(sum);
        return sum;
    }

    /**
     * Start position to end position (row, column), from the lower to higher value
     */
    #recordSquares(start, end) {
        // same row
        if (start[0] === end[0]) {
            const row = start[0];
            for (let i = 0; i < end[0]; i++) {
                const column = start[1] + i;

                if (this.#guardPath.has(row)) {
                    const columns = this.#guardPath.get(row);

                    if (!columns.has(column)) {
                        columns.add(column);
                        this.#guardPath.set(row, columns);
                        const count = this.#guardPath.get('count');
                        this.#guardPath.set('count', count + 1);
                    }
                } else {
                    const columns = new Set();
                    columns.add(column);
                    this.#guardPath.set(row, columns);

                    if (this.#guardPath.has('count')) {
                        const count = this.#guardPath.get('count');
                        this.#guardPath.set('count', count + 1);
                    } else {
                        this.#guardPath.set('count', 1);
                    }
                }
            }
        } else {
            // same column
            const column = start[1];
            for (let i = 0; i < end[1]; i++) {
                const row = start[0] + i;

                if (this.#guardPath.has(row)) {
                    const columns = this.#guardPath.get(row);

                    if (!columns.has(column)) {
                        columns.add(column);
                        this.#guardPath.set(row, columns);
                        const count = this.#guardPath.get('count');
                        console.log({ count });
                        this.#guardPath.set('count', count + 1);
                    }
                } else {
                    const columns = new Set();
                    columns.add(column);
                    this.#guardPath.set(row, columns);

                    if (this.#guardPath.has('count')) {
                        const count = this.#guardPath.get('count');
                        console.log({ count });
                        this.#guardPath.set('count', count + 1);
                    } else {
                        console.log('Setting count to 1x');
                        this.#guardPath.set('count', 1);
                    }
                }
            }
        }
    }

    #processMap() {
        const obstacleRows = new Set();
        const obstacleColumns = new Set();
        const obstaclesByRow = new Map();
        const obstaclesByColumn = new Map();

        this.#rows.forEach((row, rowIdx) => {
            for (let charIdx = 0; charIdx < row.length; charIdx++) {
                const char = row.charAt(charIdx);

                if (char === '#') {
                    if (!obstacleRows.has(rowIdx)) {
                        obstacleRows.add(rowIdx);
                    }

                    if (!obstacleColumns.has(charIdx)) {
                        obstacleColumns.add(charIdx);
                    }

                    if (obstaclesByRow.has(rowIdx)) {
                        const columns = obstacles.get(rowIdx);
                        columns.add(charIdx);
                        obstaclesByRow.set(rowIdx, columns);
                    } else {
                        const columns = new Set();
                        columns.add(charIdx);
                        obstaclesByRow.set(rowIdx, columns);
                    }

                    if (obstaclesByColumn.has(charIdx)) {
                        const rows = obstacles.get(charIdx);
                        rows.add(rowIdx);
                        obstaclesByColumn.set(charIdx, rows);
                    } else {
                        const rows = new Set();
                        rows.add(rowIdx);
                        obstaclesByColumn.set(charIdx, rows);
                    }
                }

                if (char === '^') {
                    this.#dir = 0;
                    this.#pos = [rowIdx, charIdx];
                }
            };
        });

        this.#obstacleRows = obstacleRows;
        this.#obstacleColumns = obstacleColumns;
        this.#obstaclesByRow = obstaclesByRow;
        this.#obstaclesByColumn = obstaclesByColumn;

        console.log({ obstacleRows, obstacleColumns, obstaclesByRow, obstaclesByColumn });
        console.log(this.#pos, this.#dir);
    }
}