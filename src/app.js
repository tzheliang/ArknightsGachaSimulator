const _ = require('lodash');
const chalk = require('chalk');

// Helper functions to print to console with color
const logUR = chalk.hex('#f9c13e');
const logSSR = chalk.hex('#FFFF99');
const logSR = chalk.magenta;
const logR = chalk.cyanBright;

// Gacha function 
const { rollGacha, getRollSummary } = require('./lib/gacha');

let totalRolls = 0;
let orundumUsed = 0;
let rollResults = [];

const ORUNDUM_PER_ROLL = 600;

// Targeted 6 star/ 10 roll
const TARGET = 3;

// Loop Flag
let done = false;

while (!done) {
    // Get 10 gacha
    const rollAmount = 10;
    let gacha = rollGacha(rollAmount);

    // Add to totals
    totalRolls += rollAmount;
    orundumUsed += ORUNDUM_PER_ROLL * rollAmount;
    rollResults = _.concat(rollResults, gacha);

    // Check if roll has hit the target
    const currentSummary = getRollSummary(gacha);
    const sixStarTotal = _.get(currentSummary, 'rarity.6');

    if (sixStarTotal && sixStarTotal >= TARGET) {
        done = true;
    }
}

const totalRollSummary = getRollSummary(rollResults);

console.log('Total rolls used', totalRolls);
console.log('Total Orundum used', orundumUsed);
console.log('Total 6 stars pulled', totalRollSummary.rarity['6']);
console.log('Total 5 stars pulled', totalRollSummary.rarity['5']);
console.log('Total 4 stars pulled', totalRollSummary.rarity['4']);
console.log('Total 3 stars pulled', totalRollSummary.rarity['3']);

_.forEach(totalRollSummary.operators, (info, name) => {
    if (info.rarity === '6') {
        console.log(logUR(`Unit: ${name} - ${info.rarity} star - Total: ${info.total}`));
    }
    else if (info.rarity === '5') {
        console.log(logSSR(`Unit: ${name} - ${info.rarity} star - Total: ${info.total}`));
    }
    else if (info.rarity === '4') {
        console.log(logSR(`Unit: ${name} - ${info.rarity} star - Total: ${info.total}`));
    }
    else if (info.rarity === '3') {
        console.log(logR(`Unit: ${name} - ${info.rarity} star - Total: ${info.total}`));
    }
});