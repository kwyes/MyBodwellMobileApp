export function numFormat(num, digit) {
    var newNum = "";
    if (num == ".0") {
        newNum = "0.0"
    } else if (num == ".5") {
        newNum = "0.5"
    } else {
        newNum = num
    }

    return parseFloat(newNum).toFixed(digit).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
}