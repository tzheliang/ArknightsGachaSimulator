const _ = require('lodash');
const chalk = require('chalk');
const random = require('math-random');

const logUR = chalk.hex('#FF8000');
const logSSR = chalk.hex('#FFFF99');
const logSR = chalk.magenta;
const logR = chalk.cyanBright;

const rates = [
    { rarity: 6, rate: 0.02 },
    { rarity: 5, rate: 0.08 },
    { rarity: 4, rate: 0.5 },
    { rarity: 3, rate: 0.4 }
];

const UR = ['SilverAsh', 'Angelina', 'Exusiai', 'Hoshiguma', 'Siege'];
const SSR = ['Ptilopsis', 'Zima', 'Platinum', 'Bluepoison', 'Franka', 'Texas', 'Liskarm', 'Lappland', 'Spectre', 'Skyfire', 'Silence', 'Nearl', 'Projekt Red', 'Pramanix', 'Istina'];
const SR = ['Haze', 'Cuora', 'Gitano', 'Vigna', 'Jessica', 'Earthspirit', 'Meteor', 'Shirayuki', 'Scavenger', 'Dobermann', 'Matoimaru', 'Mousse', 'Gravel', 'Rope', 'Myyrh', 'Perfumer', 'Matterhorn', 'Deepcolor'];
const R = ['Fang', 'Vanilla', 'Plume', 'Melantha', 'Cardigan', 'Beagle', 'Kroos', 'Lava', 'Orchid', 'Hibisucus', 'Ansel', 'Steward'];

let rolls = 0;
let orundumUsed = 0;

let getRoll = function (min, max, decimal) {
    let roll = random() * (max - min) + min;
    return round(roll, decimal);
};

let rollGacha = function (count) {
    let rollResult = [];
    rolls += count;
    orundumUsed += 600 * count;
    for (var i = 0; i < count; i++) {
        let roll = getRoll(0, 1, 2);
        let unitRarity = determineRarity(roll, rates);
        let unitName = determineUnit(unitRarity);
        rollResult.push({ rarity: unitRarity, unit: unitName });
    }

    return rollResult;
}

function round(number, decimalPlace) {
    return Number(Math.round(number + 'e' + decimalPlace) + 'e-' + decimalPlace);
}

function determineRarity(roll, rates) {
    let check = 0;
    let result;
    _.each(rates, (obj) => {
        let { rarity, rate } = obj;
        // console.log('rarity', rarity);
        check += rate;
        // console.log('check', check);
        if (roll <= check && !result) {
            result = rarity;
        }
    });

    return result;
}

function determineUnit(rarity) {
    switch (rarity) {
        case 6:
            return rollUnit(UR);
        case 5:
            return rollUnit(SSR);
        case 4:
            return rollUnit(SR);
        case 3:
            return rollUnit(R);
        default:
            process.exit(0);

    }
}

function rollUnit(list) {
    let roll = getRoll(0, list.length - 1, 0);
    return list[roll];
}

function getRollSummary(rollResult) {
    return _.reduce(rollResult, (acc, val) => {
        let rarity = val.rarity;
        acc[rarity] = acc[rarity] || { total: 0 };
        acc[rarity].total += 1;
        return acc;
    }, {})
}

let done = false;
// let iteration = 0;
let rollResult;
while (!done) {
    // iteration++;
    let roll = rollGacha(10);
    let group = _.groupBy(roll, value => value.rarity);

    if (group['6'] && group['6'].length >= 3) {
        done = !done;
        rollResult = roll;
    }
}

console.log('Rolls used', rolls);
console.log('Orundum used', orundumUsed);
console.log(getRollSummary(rollResult));
_.forEach(rollResult, val => {
    if (val.rarity === 6) {
        console.log(logUR(`Unit: ${val.unit} - ${val.rarity} star`))
    }
    else if (val.rarity === 5) {
        console.log(logSSR(`Unit: ${val.unit} - ${val.rarity} star`))
    }
    else if (val.rarity === 4) {
        console.log(logSR(`Unit: ${val.unit} - ${val.rarity} star`))
    }
    else if (val.rarity === 3) {
        console.log(logR(`Unit: ${val.unit} - ${val.rarity} star`))
    }
})