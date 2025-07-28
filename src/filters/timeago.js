import { formatDistanceToNow, format } from "date-fns";

// TODO: implement relative time with date-fns
// moment.updateLocale('en', {
//     monthsShort: [
//         "Jan", "Feb", "Mar", "Apr", "May", "Jun",
//         "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
//     ],
//     relativeTime: {
//         past: '%ss',
//         s: 'Now',
//         ss: '%ss',
//         m: '%dm',
//         mm: '%dm',
//         h: '%dh',
//         hh: '%dh',
//     }
// });


function dateDiffInDays(incoming) {
    // Timezone aware date distance calculation, will return 0 for 'today' and negative num days for past dates
    const now = new Date(Date.now());
    const d = new Date(incoming)
    const _MS_PER_DAY = 1000 * 60 * 60 * 24;
    const utc1 = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
    const utc2 = Date.UTC(d.getFullYear(), d.getMonth(), d.getDate());

    return Math.floor((utc2 - utc1) / _MS_PER_DAY);
}

export default function timeago(date) {
    const distance = dateDiffInDays(date);
    if (distance === 0) {
        return formatDistanceToNow(date, { addSuffix: true });    // Now, 15s, 5m, 3h
    } else {
        return format(new Date(date), "MMM d");  // Jan 31
    }
}
