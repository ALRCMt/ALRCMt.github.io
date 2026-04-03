// 图片预览脚本
(function() {
  const IMAGE_FILE_REGEX = /\.(jpg|jpeg|png|gif|webp|bmp|svg)(\?.*)?$/i;

  // 1. 清理旧onclick绑定
  function cleanupOldOnClickBindings() {
    document.querySelectorAll('a').forEach(link => {
      const isImageLink = IMAGE_FILE_REGEX.test(link.href) || 
                         link.closest('figure.image-preview') !== null;
      if (isImageLink && link.onclick) {
        link.onclick = null;
      }
    });
  }
  
  // 2. 从点击位置提取可预览图片 URL
  function getPreviewTarget(element) {
    const link = element.closest('a.preview-link');
    if (link /* && IMAGE_FILE_REGEX.test(link.href) */) {
      return link.href;
    }
    return null;
  }
  
  // 3. 点击事件处理
  function handleImageClick(event) {
    if (event.target.closest('.image-preview-overlay')) {
      return;
    }

    const link = event.target.closest('a');
    const previewUrl = getPreviewTarget(event.target);
    if (!previewUrl) return;
    if (link && link.onclick) link.onclick = null;
    
    event.preventDefault();
    event.stopImmediatePropagation();
    
    // 创建预览层 - 初始状态透明
    const overlay = document.createElement('div');
    overlay.className = 'image-preview-overlay';
    Object.assign(overlay.style, {
      position: 'fixed',
      top: '0',
      left: '0',
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: '10000',
      cursor: 'zoom-out',
      opacity: '0', // 初始透明
      transition: 'opacity 0.3s ease-out' // 添加过渡效果
    });
    
    const img = document.createElement('img');
    img.src = previewUrl;
    img.alt = '预览大图';
    Object.assign(img.style, {
      maxWidth: '95vw',
      maxHeight: '95vh',
      objectFit: 'contain',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
      opacity: '0', // 图片也初始透明
      transform: 'scale(0.98)', // 初始稍微缩小
      transition: 'opacity 0.3s ease-out, transform 0.3s ease-out' // 图片动画
    });
    
    // 关闭功能
    const closePreview = () => {
      if (overlay && document.body.contains(overlay)) {
        // 先执行淡出动画
        overlay.style.opacity = '0';
        img.style.opacity = '0';
        img.style.transform = 'scale(0.98)';
        
        // 动画结束后移除元素
        setTimeout(() => {
          if (document.body.contains(overlay)) {
            document.body.removeChild(overlay);
            document.removeEventListener('keydown', handleEsc);
          }
        }, 300); // 与过渡时间匹配
      }
    };
    
    overlay.addEventListener('click', closePreview);
    
    const handleEsc = (e) => e.key === 'Escape' && closePreview();
    
    overlay.appendChild(img);
    document.body.appendChild(overlay);
    document.addEventListener('keydown', handleEsc);
    
    // 触发淡入动画 - 下一帧开始
    requestAnimationFrame(() => {
      overlay.style.opacity = '1';
      img.style.opacity = '1';
      img.style.transform = 'scale(1)';
    });
  }
  
  // 执行流程
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', cleanupOldOnClickBindings);
  } else {
    cleanupOldOnClickBindings();
  }
  
  // 绑定全局点击委托
  document.addEventListener('click', handleImageClick, true);
})();