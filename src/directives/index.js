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
                case 'top':
                    const isTop = el.scrollTop==0;
                    if (!isTop) return;
                    binding.value(event, el);
                default:
                    binding.value(event, el);
            }
        }
        el.addEventListener('scroll', el.__callback__);
    },
    unmounted: function (el) {
        el.removeEventListener('scroll', el.__callback__);
        el.__callback__ = null;
    }
}