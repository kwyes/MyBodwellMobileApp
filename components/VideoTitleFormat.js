export function VideoTitleFormat(text) {
    if (text) {
        return text.split('_').join(' ').replace(".mp4", "");
    } else {
        return ""
    }

}