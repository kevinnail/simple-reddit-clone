export function getDateStamp() {
    let months = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
    ];
    let days = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
    ];
    let d = new Date();
    let day = days[d.getDay()];
    let hr = d.getHours();
    let min = d.getMinutes();

    if (hr === 0) {
        hr = 12;
    }

    if (min < 10) {
        min = '0' + min;
    }
    let ampm = 'am';

    if (hr > 12) {
        hr -= 12;
        ampm = 'pm';
    }
    let date = d.getDate();
    let month = months[d.getMonth()];
    let year = d.getFullYear();
    let time = day + ' ' + hr + ':' + min + ampm + ' ' + month + ' ' + date + ' ' + year;
    return time;
}
