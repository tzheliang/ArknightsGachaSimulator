const _ = require('lodash');
const random = require('math-random');

const getRoll = (min, max, decimalPlace) => {
    let roll = random() * (max - min) + min;
    return _.round(roll, decimalPlace);
};

module.exports = { getRoll };