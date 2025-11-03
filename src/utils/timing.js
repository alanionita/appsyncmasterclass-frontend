export const debounce = (callback, wait = 250) => {
    let timeoutId = null;
    return (...args) => {
        window.clearTimeout(timeoutId);
        timeoutId = window.setTimeout(() => {
            try {
                callback.apply(null, args);
            } catch (err) {
                console.error('Err [util/debounce] :', err.message)
                console.info(JSON.stringify(err))
            }
        }, wait);
    };
}