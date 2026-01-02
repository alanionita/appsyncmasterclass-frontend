import { format, isYesterday, isToday } from "date-fns";

export default function time(_date) {
    const today = isToday(_date);
    const yesterday = isYesterday(_date);

    if (today) { 
        // 6:30 PM
        return format(_date, "p");
    } else if (yesterday) { 
        // Yesterday, 6:30 PM
        return `Yesterday, ${format(_date, "p")}`;
    } else { 
        // Jan 31, 6:30 PM
        return format(_date, "MMM d, p");
    }
}
