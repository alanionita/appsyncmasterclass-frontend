export const vScrollend = {
    mounted: function (el, binding) {
        if (typeof binding.value !== 'function') return;
        el.__callback__ = (event) => {
            if (!el) return;
            switch(binding.arg) {
                case 'bottom':
                    const isBottom = Math.ceil(el.offsetHeight + el.scrollTop) >= el.scrollHeight;
                    if (!isBottom) return;
                    binding.value(event, el);
                    return;
                case 'top':
                    const offset = 256 // Typically when we reached top offset is 1, this adds a buffer
                    const topEdge = (el.scrollHeight - el.clientHeight) + el.scrollTop
                    const isTop = topEdge < offset;
                    if (!isTop) return;
                    binding.value(event, el);
                    return;
                default:
                    binding.value(event, el);
                    return;
            }
        }
        el.addEventListener('scroll', el.__callback__);
    },
    unmounted: function (el) {
        el.removeEventListener('scroll', el.__callback__);
        el.__callback__ = null;
    }
}