/*!
 * 站内图片 CDN 加速
 * 三类图片优先走 jsDelivr CDN，国内访问比直连 GitHub 快：
 *   1. 本站 /images/ 下的图片（含 /images/posts/）
 *   2. 引用 MtAIO-Build 仓库的 raw 图片（github.com/.../raw/ 或 raw.githubusercontent.com/.../，支持 main 或任意 commit）
 * CDN 加载失败自动降级回原始地址。想完全关闭 CDN：把 USE_CDN 改为 false
 */
(function () {
  const USE_CDN = true;
  if (!USE_CDN) return;

  // jsDelivr 镜像根
  const CDN_SITE = 'https://cdn.jsdelivr.net/gh/ALRCMt/ALRCMt.github.io@main';

  // URL 编码：已是编码形式（含 %XX）则不重复编码，避免双重编码
  function safeEncode(s) {
    try {
      return encodeURI(decodeURIComponent(s));
    } catch (e) {
      return encodeURI(s);
    }
  }

  // 匹配规则：返回 null 表示不处理；否则返回 { cdn, local }
  function toCdnPair(url) {
    if (!url) return null;
    // 站内图片：/images/xxx -> CDN_SITE/images/xxx
    if (url.indexOf('/images/') === 0) {
      return { cdn: CDN_SITE + safeEncode(url), local: url };
    }
    // MtAIO-Build raw 链接（两种域名、任意 ref：main 或 commit，统一转 jsDelivr @ref）
    let ref = null, rest = null;
    const g1 = 'https://github.com/ALRCMt/MtAIO-Build/raw/';
    const g2 = 'https://raw.githubusercontent.com/ALRCMt/MtAIO-Build/';
    if (url.indexOf(g1) === 0) {
      const tail = url.slice(g1.length);
      const i = tail.indexOf('/');
      if (i > 0) { ref = tail.slice(0, i); rest = tail.slice(i + 1); }
    } else if (url.indexOf(g2) === 0) {
      const tail = url.slice(g2.length);
      const i = tail.indexOf('/');
      if (i > 0) { ref = tail.slice(0, i); rest = tail.slice(i + 1); }
    }
    if (ref && rest) {
      return { cdn: 'https://cdn.jsdelivr.net/gh/ALRCMt/MtAIO-Build@' + ref + '/' + safeEncode(rest), local: url };
    }
    return null;
  }

  function enhance(scope) {
    // 1. 替换 <img> 的 src，CDN 失败时降级回原始地址
    scope.querySelectorAll('img').forEach(img => {
      if (img.dataset.cdn) return;
      const src = img.getAttribute('src');
      const pair = toCdnPair(src);
      if (!pair) return;
      img.dataset.cdn = 'true';
      img.dataset.localSrc = src;
      img.src = pair.cdn;
      img.addEventListener('error', function fallback() {
        img.removeEventListener('error', fallback);
        img.src = img.dataset.localSrc;
        // 同一 figure 里的预览链接 href 同步降级
        const fig = img.closest('figure');
        if (fig) {
          const link = fig.querySelector('a.preview-link');
          if (link && link.dataset.localHref) link.href = link.dataset.localHref;
        }
      });
    });

    // 2. 替换图片预览链接 <a class="preview-link"> 的 href
    scope.querySelectorAll('a.preview-link').forEach(link => {
      if (link.dataset.cdnLink) return;
      const href = link.getAttribute('href');
      const pair = toCdnPair(href);
      if (!pair) return;
      link.dataset.cdnLink = 'true';
      link.dataset.localHref = href;
      link.href = pair.cdn;
    });
  }

  // defer 脚本执行时 DOM 已解析完成，直接处理；保险起见再兜底一次 DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => enhance(document));
  } else {
    enhance(document);
  }
})();
