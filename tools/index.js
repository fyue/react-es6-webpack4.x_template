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

function setStyle(target, name, value) {
    target.style[name] = value;
}

/**
 * @param target:
 * @returns {*}
 */
function getElement(target) {
    if (!target) throw "target is undefined, can't tween!!!";

    if (typeof target === 'string') {
        return (typeof(document) === 'undefined') ? target : (document.querySelectorAll ? document.querySelectorAll(target) : document.getElementById((target.charAt(0) === '#') ? target.substr(1) : target));
    } else {
        return target;
    }
}

/**
 * 60fps定时器
 * @type {((callback: FrameRequestCallback) => number) | * | Function}
 */
const requestFrame = window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function(callback) {
        window.setTimeout(callback, 1000 / 60);
    };

export default class Utils {

  static isLocal() {
    return process.env.NODE_ENV !== 'production';
  }

  static getQueryString(name) {
    const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`);
    const r = window.location.search.substr(1).match(reg);
    if (r !== null) return r[2];
    return null;
  }

  static guid(prefix = '', char = '1234567890abcdef', length = 16) {
    let id = generate(char, length);
    return prefix ? `${prefix}_${id}` : id;
  }

  static autoIncrementId() {
    autoIncrementId ++;
    return String(autoIncrementId);
  }

  static getNowIncrementId() {
    return autoIncrementId;
  }

  static initIncrementId(incrementId) {
    autoIncrementId = incrementId;
  }

  static addEvent(el, event, handler) {
    if (!el) return;
    if (el.attachEvent) {
      el.attachEvent('on' + event, handler);
    } else if (el.addEventListener) {
      el.addEventListener(event, handler, false);
    } else {
      el['on' + event] = handler;
    }
  }

  static removeEvent(el, event, handler) {
    if (!el) return;
    if (el.detachEvent) {
      el.detachEvent('on' + event, handler);
    } else if (el.removeEventListener) {
      el.removeEventListener(event, handler, false);
    } else {
      el['on' + event] = null;
    }
  }

  static triggerEvent(el, eventName, options) {
    let event;
    if (window.CustomEvent) {
      event = new CustomEvent(eventName, options);
    } else {
      event = document.createEvent('CustomEvent');
      event.initCustomEvent(eventName, true, true, options);
    }
    el.dispatchEvent(event);
  }

  static isEquals(arg1, arg2) {
    let aProps = Object.getOwnPropertyNames(arg1);
    let bProps = Object.getOwnPropertyNames(arg2);
    if (aProps.length !== bProps.length) {
      return false;
    }
    for (let i = 0; i < aProps.length; i++) {
      let propName = aProps[i];
      if (arg1[propName] !== arg2[propName]) {
        return false;
      }
    }
    return true;
  }

  static getDisplayName(component) {
    return component.displayName || component.name || 'Component';
  }

  // 获取图片尺寸 todo 未完成
  static getImgSize(url) {
    let img = new Image();
    img.src = url;
    const ready = ({width, height}) => {
      return {
        width,
        height,
      };
    };
    if (img.complete) {
      return ready(img);
    }
    img.onerror = () => {
      img = img.onload = img.onerror = null;
    };
    img.onload = () => {
      ready(img);
      img = img.onload = img.onerror = null;
    };
  }

  static firstUpperCase = (string, force = false) => {
    string = force ? string.toLowerCase() : string;
    return string.replace(/( |^)[a-z]/g, (L) => L.toUpperCase());
  };

  static preciseNum(number, preciseNum = 2) {
    return Number(number.toFixed(preciseNum));
  }

  static angleToRadian(deg) {
    return deg * Math.PI / 180;
  }

  static picUrlFormattedWithSize(url, size, reg = /alicdn.com/) {
    const canFormatted = reg.test(url);
    const isFormatted = /_\d*x\d*.[jpg|gif|png]/.test(url);
    if (canFormatted && !isFormatted) {
      const originExt = url.split('.').pop();
      const ext = ['jpeg', 'png'].some((E) => E === originExt) ? 'jpg' : url.split('.').pop();
      // 裁剪后的图片后缀都是.jpg
      return `${url}_${size + ''}x${size + ''}.jpg`;
      // return `${url}_${size + ''}x${size + ''}.${ext}`;
    }
    return url;
  }

  /**
   * Map 转 Obj
   * @param map
   * @returns {Object}
   * 例如：
   * const myMap = new Map().set('a', true).set('b', false);
   * mapToObj(myMap) => { a: true, b: false }
   */
  static mapToObj(map) {
    let obj = Object.create(null);
    for (let [k, v] of map) {
      obj[k] = v;
    }
    return obj;
  }
  /**
   * Map 转 Obj
   * @param obj
   * @returns {Map}
   * 例如：
   * objToMap({ a: true, b: false }) => Map {'a' => true, 'b' => false}
   */
  static objToMap(obj) {
    let map = new Map();
    for (let k of Object.keys(obj)) {
      map.set(k, obj[k]);
    }
    return map;
  }

  /**
   * 按键名转换对象为数据，键名作为type。
   * 用于modules、scene等对象列表转换。
   * @param obj {Object}
   * @param type {String}
   * @returns {Array}
   */
  static keyObjToTypeArray(obj, type = 'type') {
    const objTypes = Object.keys(obj);
    let outList = [];
    let list = Object.values(obj);
    list.forEach((item, index) => {
      outList.push({
        ...item,
        [type]: objTypes[index],
      });
    });
    return outList;
  }

  /**
   * 按键名获取对应的val
   * 用于 configProps 转换为 observableProps 可用对象结构
   * @param obj {Object}
   * @returns {Object}
   */
  static keyObjToProps(obj) {
    let _props = {};
    Object.keys(obj).forEach(key => {
      if (obj[key] && obj[key].val !== undefined) {
        _props[key] = obj[key].val;
      }
    });
    return _props;
  }

  /**
   * 冒泡排序
   * @param list
   * @param type
   * @returns {array}
   */
  static sortBubble(list, type) {
    let arr = Object.assign(list, []);
    for (let i = 0; i < arr.length - 1; i++) {
      for (let j = 0; j < arr.length - 1 - i; j++) {
        if (!type) {
          if (arr[j] > arr[j + 1]) {
            let temp = arr[j];
            arr[j] = arr[j + 1];
            arr[j + 1] = temp;
          }
        } else {
          if (arr[j][type] > arr[j + 1][type]) {
            let temp = arr[j];
            arr[j] = arr[j + 1];
            arr[j + 1] = temp;
          }
        }
      }
    }
    return arr;
  };

  /**
   * 截流函数
   * @param cb
   * @param delay
   * @returns {Function}
   */
  static debounce(cb = () => {}, delay = 100) {
    let timer = null;
    return (...arg) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        cb(...arg);
        timer = null;
      }, delay);
    };
  }

  /**
   * Url 协议头整理
   * 不管输入的url是否带有协议头，都过滤一次且只加上 '//' 双斜线。
   * @param url
   */
  static urlSlashFormat(url) {
    if (url && !/data:image/.test(url)) {
      url = `//${url.replace(/(.*|^)(:|^)(\/\/)(.*)/ig, '$4')}`;
    }
    return url;
  }

  static requestAnimationProxy(func) {
    let execing;
    return function(...args) {
      if (!execing) {
        execing = true;
        window.requestAnimationFrame(function() {
          func(...args);
          execing = false;
        });
      }
    };
  }

  /**
   * 通过两个时间相差的秒数，来求相差的天时分秒
   * @param diffSeconds
   * @param format
   * @returns {null}
   *
   */
  static getDateDiffBySecondDiff(diffSeconds, format) {

    // formats = [
    //   {
    //     value: 0,
    //     label: '天时分秒',
    //   },
    //   {
    //     value: 1,
    //     label: '时分秒',
    //   },
    //   {
    //     value: 2,
    //     label: '分秒',
    //   },
    //   {
    //     value: 3,
    //     label: '秒',
    //   },
    // ];

    const getIntegerAddOver = (num, step) => ({
      integer: parseInt(num / step),
      over: num % step,
    });

    let result = {
      day: 0,
      hour: 0,
      minute: 0,
      second: 0,
    };

    const getMin = getIntegerAddOver(diffSeconds, 60);
    const getHour = getIntegerAddOver(getMin.integer, 60);
    const getDay = getIntegerAddOver(getHour.integer, 24);

    switch (format) {
      case 0: {
        result = {
          day: getDay.integer,
          hour: getDay.over,
          minute: getHour.over,
          second: getMin.over,
        };
        break;
      }
      case 1: {
        result = {
          ...result,
          hour: getHour.integer,
          minute: getHour.over,
          second: getMin.over,
        };
        break;
      }
      case 2: {
        result = {
          ...result,
          minute: getMin.integer,
          second: getMin.over,
        };
        break;
      }
      case 3: {
        result = {
          ...result,
          second: diffSeconds,
        };
        break;
      }
    }

    return result;
  }

  /**
   * 分割数组
   * @param array
   * @param size
   * @returns {*}
   *
   * let arr = [1,2,3,4,5,6];
   * let chunks = arrayChunk(arr, 3); // chunks = [[1,2,3],[4,5,6]]
   *
   */
  static arrayChunk(array, size = 1) {
    let len = array.length;
    let newArr = [];
    for (let i = 0; i < len; i += size) {
      newArr.push(array.slice(i, i + size));
    }
    return newArr;
  }

  static getDataFromFile(file) {
    return new Promise(resolve => {

        //创建读取文件的对象
        var reader = new FileReader();
    
        //为文件读取成功设置事件
        reader.onload=function(e) {
            const rlt = e.target.result;
            resolve(rlt);
        };
    
        //正式读取文件
        reader.readAsDataURL(file);
    })
}
}