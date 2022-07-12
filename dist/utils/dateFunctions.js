import dayjs from "dayjs";
export function getNowAddAndFormatDate(amount, type, format) {
    return dayjs().add(amount, type).format(format);
}
export function addAndFormatDateExistingDate(amount, type, date) {
    return dayjs(date).add(amount, type).format();
}
