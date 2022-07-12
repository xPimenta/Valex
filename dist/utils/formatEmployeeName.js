export function formatEmployeeName(fullName) {
    var namesInArray = fullName.split(" ");
    var nameLengthLimit = 3;
    var formattedName = namesInArray.reduce(function (acc, currentName, currentIndex) {
        if (currentName.length >= nameLengthLimit &&
            currentIndex !== 0 &&
            currentIndex !== namesInArray.length - 1)
            return "".concat(acc, " ").concat(currentName[0]);
        else
            return "".concat(acc, " ").concat(currentName);
    }, "");
    console.log(formattedName);
    return formattedName.trim().toUpperCase();
}
