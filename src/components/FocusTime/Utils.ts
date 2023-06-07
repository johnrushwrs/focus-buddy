function getHourMinuteString(time: Date) {
    let hourString = time.getHours() == 0 ? "00" : time.getHours().toString();
    let minuteString =
        time.getMinutes() == 0 ? "00" : time.getMinutes().toString();
    return `${hourString}:${minuteString}`;
}

function addMinutesToDate(time: Date, minutesToAdd: number) {
    return new Date(time.getTime() + minutesToAdd * 60 * 1000);
}

export { getHourMinuteString, addMinutesToDate }