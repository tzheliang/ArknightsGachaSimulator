const _ = require('lodash');
const { getRoll } = require('../lib/random');

// Get operators
const operators = _.groupBy(require('../../data/operators.json'), operator => operator.rarity);

// Gacha Rates
const GACHA_RATES = {
    '6': 0.02, // 6* = 2%
    '5': 0.08, // 5* = 8%
    '4': 0.5,  // 4* = 50%
    '3': 0.4   // 3* = 40%
};

const rollUnit = rarity => {
    const operatorList = operators[rarity];
    const operatorIndex = getRoll(0, operatorList.length - 1, 0);
    return operatorList[operatorIndex];
};

const determineRarity = roll => {
    let checkValue = 0, result;

    _.forEach(GACHA_RATES, (rate, rarity) => {
        checkValue += rate;

        if (roll <= checkValue && !result) {
            result = rarity;
        }
    });

    return result;
};

const determineUnit = rarity => rollUnit(rarity);

const rollGacha = times => {
    const rollResult = [];

    for (let i = 0; i < times; i++) {
        const roll = getRoll(0, 1, 2);
        const unitRarity = determineRarity(roll);
        const unit = determineUnit(unitRarity);
        rollResult.push(unit);
    }

    return rollResult;
};

const getRollSummary = rollResult => {
    let result = {
        rarity: { '6': 0, '5': 0, '4': 0, '3': 0 },
        operators: {}
    };

    result = _.reduce(rollResult, (res, value) => {
        let rarity = value.rarity;
        let name = value.name;

        res.rarity[rarity]++;

        if (res.operators[name]) {
            res.operators[name].total++;
        }
        else {
            res.operators[name] = {
                rarity,
                total: 1
            };
        }

        return res;
    }, result);

    return result;
};

module.exports = { rollGacha, getRollSummary };