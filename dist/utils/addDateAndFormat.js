import dayjs from "dayjs";
export function addAndFormatDate(amount, type, format) {
    return dayjs().add(amount, type).format(format);
}
