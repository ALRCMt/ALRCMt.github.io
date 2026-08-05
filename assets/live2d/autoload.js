/*!
 * Live2D Widget
 * https://github.com/stevenjoezhang/live2d-widget
 */

// Recommended to use absolute path for live2d_path parameter
// live2d_path 参数建议使用绝对路径
const currentScript = document.currentScript;
const live2d_path = currentScript && currentScript.src
  ? new URL('./', currentScript.src).href
  : '/assets/live2d/';

// Method to encapsulate asynchronous resource loading
// 封装异步加载资源的方法
function loadExternalResource(url, type) {
  return new Promise((resolve, reject) => {
    let tag;

    if (type === 'css') {
      tag = document.createElement('link');
      tag.rel = 'stylesheet';
      tag.href = url;
    }
    else if (type === 'js') {
      tag = document.createElement('script');
      tag.type = 'module';
      tag.src = url;
    }
    if (tag) {
      tag.onload = () => resolve(url);
      tag.onerror = () => reject(url);
      document.head.appendChild(tag);
    }
  });
}

(async () => {
  // If you are concerned about display issues on mobile devices, you can use screen.width to determine whether to load
  // 如果担心手机上显示效果不佳，可以根据屏幕宽度来判断是否加载
  if (window.matchMedia('(max-width: 768px)').matches || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    return;
  }

  // 延迟加载：把看板娘的初始化推迟到页面主要资源加载完成、浏览器空闲后再执行，
  // 避免首屏阶段与正文 CSS/图片抢占网络带宽（B: window.load + C: requestIdleCallback）
  // Deferred loading: initialize the widget after window.load and browser idle
  const start = async () => {
    // Avoid cross-origin issues with image resources
    // 避免图片资源跨域问题
    const OriginalImage = window.Image;
    window.Image = function(...args) {
      const img = new OriginalImage(...args);
      img.crossOrigin = "anonymous";
      return img;
    };
    window.Image.prototype = OriginalImage.prototype;
    // Load waifu.css and waifu-tips.js
    // 加载 waifu.css 和 waifu-tips.js
    await Promise.all([
      loadExternalResource(live2d_path + 'waifu.css', 'css'),
      loadExternalResource(live2d_path + 'waifu-tips.js', 'js')
    ]);

    if (!localStorage.getItem('modelId')) {
      localStorage.setItem('modelId', '4');
      localStorage.setItem('modelTexturesId', '4');
    }
    if (!localStorage.getItem('modelTexturesId')) {
      localStorage.setItem('modelTexturesId', '0');
    }

    // For detailed usage of configuration options, see README.en.md
    // 配置选项的具体用法见 README.md
    initWidget({
      waifuPath: live2d_path + 'waifu-tips.json',
      // cdnPath: 'https://fastly.jsdelivr.net/gh/fghrsh/live2d_api/',
      cubism2Path: live2d_path + 'live2d.min.js',
      cubism5Path: 'https://cubism.live2d.com/sdk-web/cubismcore/live2dcubismcore.min.js',
      tools: ['hitokoto', 'asteroids', 'switch-model', 'switch-texture', 'photo', 'info', 'quit'],
      logLevel: 'warn',
      drag: false,
    });

    const bindWheelGuard = () => {
      const canvas = document.getElementById('live2d');
      if (!canvas || canvas.dataset.zoomGuardBound === '1') {
        return;
      }

      const guard = (event) => {
        const delta = event.wheelDelta ? -event.wheelDelta : event.deltaY;
        if (delta < 0) {
          event.preventDefault();
          event.stopImmediatePropagation();
        }
      };

      canvas.addEventListener('wheel', guard, { capture: true, passive: false });
      canvas.addEventListener('mousewheel', guard, { capture: true, passive: false });
      canvas.dataset.zoomGuardBound = '1';
    };

    bindWheelGuard();
    const waifuCanvas = document.getElementById('waifu-canvas');
    if (waifuCanvas) {
      const observer = new MutationObserver(() => bindWheelGuard());
      observer.observe(waifuCanvas, { childList: true });
    }
  };

  // 延迟调度：页面加载完成后再初始化；requestIdleCallback 空闲时执行，
  // 超时 3 秒兜底（不支持时降级为 setTimeout 1 秒）
  const scheduleStart = () => {
    if ('requestIdleCallback' in window) {
      requestIdleCallback(start, { timeout: 3000 });
    } else {
      setTimeout(start, 1000);
    }
  };

  if (document.readyState === 'complete') {
    scheduleStart();
  } else {
    window.addEventListener('load', scheduleStart, { once: true });
  }
})();

console.log(`\n%cLive2D%cWidget%c\n`, 'padding: 8px; background: #cd3e45; font-weight: bold; font-size: large; color: white;', 'padding: 8px; background: #ff5450; font-size: large; color: #eee;', '');

/*
く__,.ヘヽ.        /  ,ー､ 〉
         ＼ ', !-─‐-i  /  /´
         ／｀ｰ'       L/／｀ヽ､
       /   ／,   /|   ,   ,       ',
     ｲ   / /-‐/  ｉ  L_ ﾊ ヽ!   i
      ﾚ ﾍ 7ｲ｀ﾄ   ﾚ'ｧ-ﾄ､!ハ|   |
        !,/7 '0'     ´0iソ|    |
        |.从"    _     ,,,, / |./    |
        ﾚ'| i＞.､,,__  _,.イ /   .i   |
          ﾚ'| | / k_７_/ﾚ'ヽ,  ﾊ.  |
            | |/i 〈|/   i  ,.ﾍ |  i  |
           .|/ /  ｉ：    ﾍ!    ＼  |
            kヽ>､ﾊ    _,.ﾍ､    /､!
            !'〈//｀Ｔ´', ＼ ｀'7'ｰr'
            ﾚ'ヽL__|___i,___,ンﾚ|ノ
                ﾄ-,/  |___./
                'ｰ'    !_,.:
*/
