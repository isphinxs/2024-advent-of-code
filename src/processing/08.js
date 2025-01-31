import { readIntoTextRows } from './utils.js';

export class Day08 {
    #antinodes;
    #coordinates;
    #count;
    #xMax;
    #yMax;

    constructor() {
        this.#coordinates = new Map();
        // this.#antinodes = [];
        this.#antinodes = new Map();
        this.#count = 0;
    }

    async A() {
        // const rows = await readIntoTextRows('./src/data/test.txt');
        const rows = await readIntoTextRows('./src/data/08.txt');

        // antinode occurs at any point in line with two antennas of the same frequency,
        // when one antenna is twice as far away as the other
        // 3: 0 1 2 3
        // 2: 0 1 2 3
        // 1: 0 1 2 3
        // 0: 0 1 2 3

        // calculate the coordinates of all antennas of each type
        this.#findCoordinates(rows);

        // calculate where antinodes will be
        this.#calculateAntinodes();

        // const coordinates = this.#coordinates;
        // console.log({ coordinates });

        // const numAntinodes = this.#antinodes.length;
        // console.log({ numAntinodes });

        // this.#antinodes.forEach(antinode => {
        //     console.log(antinode);
        // });

        const count = this.#count;
        console.log({ count }); // 351
        return count;
    }

    #calculateAntinodes() {
        for (const coordinates of this.#coordinates.values()) {
            // check for horizontal
            // check for vertical
            // check each column to left/right/top/bottom
            // 1 x 1 diagonal
            // 1 x 2, 1 x 3, etc., diagonal
            // 2 x 1, 3 x 1, etc., diagonal
            // ^^ top-right, bottom-right, top-left, bottom-left quadrants

            // const { x, y } = coordinates;

            // // 1 x 1 diagonal
            // for (let i = 0; i < x.length; i++) {
            //     const row = x[i];
            //     const column = y[i];

            //     // top-right
                

            //     console.log({ row, column });
            // }

            // TAKE TWO:
            // just check each node against each other node, I think that might be simpler
            // calculate the nodes for each pairing
            // ... the antinode is equally far away from the middle point as the middle point
            // is from the first point
            // for each pairing:
            // 1) we take the top point, subtract the xDiff, add the yDiff (or vice versa)
            //  - subtract if the top point is to the left of the bottom point
            //  - add if the top point is to the right of the bottom point
            // 2) we take the bottom point, add the xDiff, subtract the yDiff (or vide versa)
            // - add if the bottom point is to the right of the top point
            // - subtract if the bottom point is to the left of the top point

            // console.log({ coordinates });
            for (let i = 0; i < coordinates.length - 1; i++) {
                const top = coordinates[i];

                for (let j = i + 1; j < coordinates.length; j++) {
                    const bottom = coordinates[j];

                    const [xT, yT] = top;
                    const [xB, yB] = bottom;
                    const xDiff = xT - xB;
                    const yDiff = yT - yB; // should always be positive, unless they're in the same column

                    let antinodeTop;
                    let antinodeBottom;

                    // if (xDiff > 0) {
                        // if top is to the right of bottom (top[0] > bottom[0], xDiff > 0), add x
                        const xAT = xT + xDiff;
                        const yAT = yT + yDiff; 
                        antinodeTop = [xAT, yAT];

                        const xAB = xB - xDiff;
                        const yAB = yB - yDiff;
                        antinodeBottom = [xAB, yAB];
                    // } else {
                    //     // top is to the left of bottom (top[0] < bottom[0], xDiff < 0), subtract x
                    //     const xAT = xT + xDiff; // xDiff is negative
                    //     const yAT = yT + yDiff; 
                    //     antinodeTop = [xAT, yAT];

                    //     const xAB = xB - xDiff; // xDiff is negative
                    //     const yAB = yB - yDiff;
                    //     antinodeBottom = [xAB, yAB];
                    //     // TODO these patterns in both blocks are exactly the same
                    // }
                
                    // TODO clean up
                    // if (antinodeTop[0] > this.#xMax 
                    //     || antinodeTop[0] < 0
                    //     || antinodeTop[1] > this.#yMax
                    //     || antinodeTop[1] < 0 
                    // ) {
                    //     // do nothing
                    // } else {
                    //     this.#antinodes.push(antinodeTop);
                    // }
                   
                    // if (antinodeBottom[0] > this.#xMax 
                    //     || antinodeBottom[0] < 0
                    //     || antinodeBottom[1] > this.#yMax
                    //     || antinodeBottom[1] < 0 
                    // ) {
                    //     // do nothing
                    // } else {
                    //     this.#antinodes.push(antinodeBottom);
                    // }

                    if (!this.#isOutsideBounds(antinodeTop[0], antinodeTop[1])) {
                        // this.#antinodes.push(antinodeTop);
                        this.#addAntinode(antinodeTop[0], antinodeTop[1]);
                    }

                    if (!this.#isOutsideBounds(antinodeBottom[0], antinodeBottom[1])) {
                        // this.#antinodes.push(antinodeBottom);
                        this.#addAntinode(antinodeBottom[0], antinodeBottom[1]);
                    }
                }
            }
        };
    }

    /**
     * Add antinode if it hasn't been added already
     */
    #addAntinode(x, y) {
        // Map<x, Set<y>>
        if (!this.#antinodes.has(x)) {
            const ys = new Set();
            ys.add(y);
            this.#antinodes.set(x, ys);
            this.#count++;
        } else {
            const ys = this.#antinodes.get(x);
            
            if (!ys.has(y)) {
                ys.add(y);
                this.#antinodes.set(x, ys);
                this.#count++;
            }
        }
    }

    /**
     * Check if the antinode is outside the map
     */
    #isOutsideBounds(x, y) {
        return (x > this.#xMax || x < 0 || y > this.#yMax || y < 0);
    }

    /**
     * Identify the coordinates of the nodes, grouped by character
     */
    #findCoordinates(rows) {
        const lastRow = rows.length - 1;
        this.#xMax = rows[0].length - 1;
        this.#yMax = lastRow;
        for (let x = 0; x < rows.length; x++) {
            const row = rows[lastRow - x];

            for (let y = 0; y < row.length; y++) {
                const char = row.charAt(y);
                
                if (char !== '.') {
                    // TAKE ONE: map of characters, xs, and ys
                    // Map<char, { x: Number[], y: Number[] }>
                    // console.log({ char });
                    // if (!this.#coordinates.has(char)) {
                    //     this.#coordinates.set(char, { x: [x], y: [y] });
                    // } else {
                    //     const coordinates = this.#coordinates.get(char);
                    //     coordinates.x.push(x);
                    //     coordinates.y.push(y);
                    //     this.#coordinates.set(char, coordinates);
                    // }

                    // TAKE TWO: save the coordinates by character
                    if (!this.#coordinates.has(char)) {
                        this.#coordinates.set(char, [[x, y]]);
                    } else {
                        const coordinates = this.#coordinates.get(char);
                        coordinates.push([x, y]);
                        this.#coordinates.set(char, coordinates);
                    }
                }
            };
        }
    }
}