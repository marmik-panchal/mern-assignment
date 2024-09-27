const sumTwoNumbers = (nums, target) => {
    let data = {};
    for (let i = 0; i < nums.length; i++) {
        let complement = target - nums[i];
        if (data.hasOwnProperty(complement)) {
            return [data[complement], i];
        }
        data[nums[i]] = i;
    }
    return [];
};


const value = [2, 7, 11, 15];
const target = 9;

console.log(sumTwoNumbers(value, target));
