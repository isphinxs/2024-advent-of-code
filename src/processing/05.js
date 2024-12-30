import { readIntoTextRows } from './utils.js';


export class Day05 {
    constructor() {}

    /**
     * Sum the middle page numbers of valid updates
     */
    async A() {
        // const rows = await readIntoTextRows('./src/data/test.txt');
        const rows = await readIntoTextRows('./src/data/05.txt');

        // process rules and updates
        const { rules, updates, startRules, endRules } = this._processRowsIntoRulesAndUpdates(rows);

        // go through each updates line-by-line
        // for each page, determine that the following pages conform to the rules
        // OPTION: could proces the rules, and for each of those, determine
        // that the updates conform; that's probably more efficient?
        let sum = 0;

        updates.forEach(update => {
            let isValid = true;

            // if a page has a rule, we just have to check that none of the
            // end pages occur before that page
            update.forEach((page, pageIdx) => {
                if (startRules.has(page)) {
                    const rule = rules.get(page);

                    for (let i = 0; i < pageIdx; i++) {
                        const prevPage = update[i];
                        if (rule.has(prevPage)) {
                            isValid = false;
                            return;
                        }
                    }
                }
            });

            if (isValid) {
                const midIdx = Math.floor(update.length / 2);
                sum += update[midIdx];
            }
        });

        // console.log({ rules, updates, startRules, endRules });
        console.log(sum); // 5391
        return sum;
    }

    /**
     * Sum the middle pages of corrected updates
     */
    async B() {
        // const rows = await readIntoTextRows('./src/data/test.txt');
        const rows = await readIntoTextRows('./src/data/05.txt');

        // process rules and updates
        const { rules, updates, startRules } = this._processRowsIntoRulesAndUpdates(rows);

        let sum = 0;

        updates.forEach((update, updateIdx) => {
            let isValid = this._reviewAndCorrectUpdate(update, rules, startRules);
            
            if (!isValid) {
                while (!isValid) {
                    isValid = this._reviewAndCorrectUpdate(update, rules, startRules);
                }

                const midIdx = Math.floor(update.length / 2);
                sum += update[midIdx];
            }
        });

        console.log(sum); // 6142
        return sum;
    }

    _reviewAndCorrectUpdate(update, rules, startRules) {
        let isValid = true;

        // if a page has a rule, we just have to check that none of the
        // end pages occur before that page
        update.forEach((page, pageIdx) => {
            if (startRules.has(page)) {
                const rule = rules.get(page);

                for (let i = 0; i < pageIdx; i++) {
                    const prevPage = update[i];
                    if (rule.has(prevPage)) {
                        isValid = false;

                        // fix order 
                        update.splice(i, 1);
                        update.splice(pageIdx, 0, prevPage);
                    }
                }
            }
        });

        return isValid;
    }

    _processRowsIntoRulesAndUpdates(rows) {
        const rules = new Map();
        const updates = [];
        const startRules = new Set();
        const endRules = new Set();
        let isUpdate = true;

        rows.forEach(row => {
            if (row.length === 0) {
                isUpdate = false;
            } else if (isUpdate) {
                const [a, b] = row.split('|').map(num => Number(num));

                if (rules.has(a)) {
                    const bs = rules.get(a);
                    bs.add(b);
                    rules.set(a, bs);
                } else {
                    const bSet = new Set();
                    bSet.add(b);
                    rules.set(a, bSet);
                    startRules.add(a);
                }

                if (!endRules.has(b)) { endRules.add(b) };
            } else {
                updates.push(row.split(',').map(num => Number(num)));
            }
        });

        return { rules, updates, startRules, endRules };
    }
}