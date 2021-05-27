export function textFormat(text) {
    if (text) {
        return text.replace("ZZZ ", "").replace("YYY ", "");
    } else {
        return ""
    }

}