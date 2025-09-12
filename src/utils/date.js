import { format } from 'date-fns';

export function formatProfileCreatedAt({ createdAt }) {
    try {
        const date = new Date(createdAt);
        return format(date, 'MMMM yyyy')
    } catch (err) {
        console.error('Err [twitterTheirProfile/formatProfileCreatedAt] :', err.message)
    }
}