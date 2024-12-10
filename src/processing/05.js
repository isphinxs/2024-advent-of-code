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
                // rules.push(row.split('|').map(num => Number(num)));
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