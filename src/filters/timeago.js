import { throwWithLabel } from "@/utils/error";
import { formatDistanceToNow, format, formatRelative } from "date-fns";
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

function formatHHMMSS(unit, count) {
    switch (true) {
        case unit === 'xSeconds':
            return `${count}s`;
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
            return formatDistanceToNow(date, { addSuffix: true, locale: customLocale });    // Now, 15s, 5m, 3h
        }
        return format(new Date(date), "d MMM", { locale: enGB });  // Jan 31
    } catch (err) {
        throwWithLabel(err, '$filters.timeago')
    }
}
