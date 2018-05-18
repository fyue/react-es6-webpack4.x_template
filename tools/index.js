/**
 * 可根据外域链接生成可以Canvas绘制的图片图像，对外域图片服务器必须接受跨域请求
 * @param url
 * @returns {HTMLImageElement}
 */
export const imgFactory = url => {
    const img = new Image();
    img.setAttribute('crossOrigin', 'anonymous');
    img.src = url;
    return img;
};


/**
 * 友盟 czc埋点装饰器
 * @param triggerDetail: Object:{action: xxx, str: xxx}
 * @returns {function(*, *, *): *}
 */

export function czccRecord(triggerDetail) {
    return function decorator(target, name, descriptor) {
        const original = descriptor.value;
        if (typeof original === 'function') {
            descriptor.value = function(...args) {
                const result = original.apply(this, args);
                if (triggerDetail) {
                    _czc.push(['_trackEvent', triggerDetail.action, triggerDetail.str, '', '', '']);
                    console.log(`动作:${triggerDetail.action},描述:${triggerDetail.str}`);
                }
                return result;
            };
        }
        return descriptor;
    };
}

/**
 * 根据itemId生成淘宝天猫商品详情链接
 * @param itemId, 必传
 * @param skuId, 可选
 * @returns {string}
 */
export function toTmUrl(itemId, skuId) {
    const base = 'https://detail.tmall.com/item.htm';
    if (skuId) {
        return `${base}?id=${itemId}&skuId=${skuId}`;
    }
    return `${base}?id=${itemId}`;
}

/**
 * 组合React高阶组件，并返回一个组合基础组件的函数
 *
 * 用法：
 * var enhance = compose(f, g, h);
 * enhance(BaseComponent)
 *
 * @param func
 * @returns {_func}
 */
export function compose(...func) {
    return function _func(Com, ...args) {
        if (!func.length) {
            return Com;
        }
        return _func(func.pop()(Com, ...args), ...args);
    };
}

/**
 * 生成全局标识id
 * @param prefix
 * @returns {*}
 */
export function guid(prefix = '') {
    let id = Date.now().toString().split('').reverse().join('') + seed++;
    return prefix ? `${prefix}_${id}` : Number(id);
}

/**
 * 为Dom元素订阅事件，兼容早期IE
 * @param el
 * @param event
 * @param handler
 */
export function addEvent(el, event, handler) {
    if (!el) return;
    if (el.attachEvent) {
        el.attachEvent('on' + event, handler);
    } else if (el.addEventListener) {
        el.addEventListener(event, handler, false);
    } else {
        el['on' + event] = handler;
    }
}

/**
 * 为Dom元素取消事件监听，兼容早期IE
 * @param el
 * @param event
 * @param handler
 */
export function removeEvent(el, event, handler) {
    if (!el) return;
    if (el.detachEvent) {
        el.detachEvent('on' + event, handler);
    } else if (el.removeEventListener) {
        el.removeEventListener(event, handler, false);
    } else {
        el['on' + event] = null;
    }
}