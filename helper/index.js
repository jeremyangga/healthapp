let calcBmi = require('bmi-calc')

function calculateBMI(weight, height){
    height = height / 100;
    return calcBmi(weight, height).value;
}

function categoryBMI(weight, height){
    height = height / 100;
    return calcBmi(weight, height).name;
}

// console.log(calculateBMI(69, 162));
// console.log(categoryBMI(69, 162));
module.exports = {calculateBMI, categoryBMI};