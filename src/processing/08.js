import { readIntoTextRows } from './utils.js';

class AntiNode {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

export class Day08 {
    #antinodes;
    #coordinates;
    #count;
    #xMax;
    #yMax;

    constructor() {
        this.#coordinates = new Map();
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

        const count = this.#count;
        console.log({ count }); // 351
        return count;
    }

    async B() {
        // const rows = await readIntoTextRows('./src/data/test.txt');
        const rows = await readIntoTextRows('./src/data/08.txt');

        // calculate the coordinates of all antennas of each type
        this.#findCoordinates(rows);

        this.#calculateAllAntinodes();

        const count = this.#count;
        console.log({ count }); // 1259
        return count;
    }

    /**
     * Find all antinodes for each pair of nodes
     */
    #calculateAllAntinodes() {
        for (const coordinates of this.#coordinates.values()) {
            for (let i = 0; i < coordinates.length - 1; i++) {
                const top = coordinates[i];

                for (let j = i + 1; j < coordinates.length; j++) {
                    const bottom = coordinates[j];

                    const [xT, yT] = top;
                    const [xB, yB] = bottom;
                    const xDiff = xT - xB; // negative if top is left of right, and vice versa
                    const yDiff = yT - yB; // should always be positive, unless they're in the same column

                    // the original nodes are antinodes, also
                    this.#addAntinode(new AntiNode(xT, yT));
                    this.#addAntinode(new AntiNode(xB, yB));

                    // determine the next set of antinodes
                    const xAT = xT + xDiff;
                    const yAT = yT + yDiff; 
                    const antinodeTop = new AntiNode(xAT, yAT);

                    const xAB = xB - xDiff;
                    const yAB = yB - yDiff;
                    const antinodeBottom = new AntiNode(xAB, yAB);

                    console.log({ antinodeTop, antinodeBottom });

                    if (!this.#isOutsideBounds(antinodeTop)) {
                        this.#addAntinode(antinodeTop);
                    }

                    if (!this.#isOutsideBounds(antinodeBottom)) {
                        this.#addAntinode(antinodeBottom);
                    }

                    // continue left and right
                    // xDiff and yDiff don't change
                    let baseTop = antinodeTop;
                    let baseBottom = antinodeBottom;
                    console.log({ baseBottom });

                    while (!this.#isOutsideBounds(baseTop)) {
                        const xAT = baseTop.x + xDiff;
                        const yAT = baseTop.y + yDiff; 
                        console.log({ xAT, yAT });
                        baseTop = new AntiNode(xAT, yAT);

                        if (!this.#isOutsideBounds(baseTop)) {
                            this.#addAntinode(baseTop);
                        }
                    }

                    while (!this.#isOutsideBounds(baseBottom)) {
                        const xAB = baseBottom.x - xDiff;
                        const yAB = baseBottom.y - yDiff;
                        console.log({ xAB, yAB });
                        baseBottom = new AntiNode(xAB, yAB);

                        if (!this.#isOutsideBounds(baseBottom)) {
                            this.#addAntinode(baseBottom);
                        }
                    }
                }
            }
        }
    }

    /**
     * Find the antinode for each pair of nodes
     */
    #calculateAntinodes() {
        for (const coordinates of this.#coordinates.values()) {
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

            for (let i = 0; i < coordinates.length - 1; i++) {
                const top = coordinates[i];

                for (let j = i + 1; j < coordinates.length; j++) {
                    const bottom = coordinates[j];

                    const [xT, yT] = top;
                    const [xB, yB] = bottom;
                    const xDiff = xT - xB; // negative if top is left of right, and vice versa
                    const yDiff = yT - yB; // should always be positive, unless they're in the same column

                    const xAT = xT + xDiff;
                    const yAT = yT + yDiff; 
                    const antinodeTop = new AntiNode(xAT, yAT);

                    const xAB = xB - xDiff;
                    const yAB = yB - yDiff;
                    const antinodeBottom = new AntiNode(xAB, yAB);

                    if (!this.#isOutsideBounds(antinodeTop)) {
                        this.#addAntinode(antinodeTop);
                    }

                    if (!this.#isOutsideBounds(antinodeBottom)) {
                        this.#addAntinode(antinodeBottom);
                    }
                }
            }
        };
    }

    /**
     * Add antinode if it hasn't been added already
     */
    #addAntinode(antinode) {
        const x = antinode.x;
        const y = antinode.y;

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
    #isOutsideBounds(antinode) {
        const x = antinode.x;
        const y = antinode.y;

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
                    // Map<x, Set<y>>
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