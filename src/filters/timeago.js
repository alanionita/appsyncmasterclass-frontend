import { throwWithLabel } from "@/utils/error";
import { format, formatDistanceToNowStrict } from "date-fns";
import { enGB } from 'date-fns/locale';

function dateDiffInDays(incoming) {
    // Timezone aware date distance calculation, will return 0 for 'today' and negative num days for past dates
    const now = new Date(Date.now());
    const d = new Date(incoming)
    const _MS_PER_DAY = 1000 * 60 * 60 * 24;
    const utc1 = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
    const utc2 = Date.UTC(d.getFullYear(), d.getMonth(), d.getDate());

    return Math.floor((utc2 - utc1) / _MS_PER_DAY);
}

// Internally edits the formatDistance() templating to return: Now, 15s, 5m, 3h, 8 Jan
function formatHHMMSS(unit, count) {
    switch (true) {
        case unit === 'xSeconds':
            return count === 0 ? 'Now' : `${count}s`;
        case unit === 'lessThanXMinutes':
            return 'Now'
        case unit === 'xMinutes':
            return `${count}m`;
        case unit === 'xHours':
            return `${count}h`;
        default:
            return;
    }
}

const customLocale = {
    ...enGB,
    formatDistance: formatHHMMSS,
};

export default function timeago(date) {
    try {
        const distance = dateDiffInDays(date);
        if (distance === 0) {
            const options = { addSuffix: true, locale: customLocale }
            const toNow = formatDistanceToNowStrict(new Date(date), options);    
            return toNow
        }
        return format(new Date(date), "d MMM", { locale: enGB });  // Jan 31
    } catch (err) {
        throwWithLabel(err, '$filters.timeago')
    }
}
