// 等待页面DOM加载完毕
document.addEventListener('DOMContentLoaded', function() {
  // 1. 获取所有带有 .preview-link 类的图片链接
  const previewLinks = document.querySelectorAll('.image-preview .preview-link');

  // 2. 为每个链接添加点击事件监听器
  previewLinks.forEach(function(link) {
    link.addEventListener('click', function(event) {
      // 阻止链接默认的跳转行为，这真的很重要！！！！！！！！！！
      event.preventDefault();
      event.stopPropagation();

      // 3. 获取要预览的大图URL
      const largeImageUrl = this.href || this.getAttribute('href');

      // 4. 创建遮罩层 (Overlay) 元素
      const overlay = document.createElement('div');
      overlay.className = 'preview-overlay';

      // 5. 创建大图图片元素
      const largeImage = new Image();
      largeImage.src = largeImageUrl;
      largeImage.alt = '预览大图';

      // （可选）点击图片本身时，阻止事件冒泡，避免误关闭
      largeImage.addEventListener('click', function(e) {
        e.stopPropagation();
      });

      // 6. 将大图添加到遮罩层
      overlay.appendChild(largeImage);

      // 7. 点击遮罩层任意位置（包括图片外区域）关闭预览
      overlay.addEventListener('click', function() {
        if (document.body.contains(this)) {
          document.body.removeChild(this);
        }
      });

      // 8. 按键盘ESC键也可以关闭预览
      function handleEscapeKey(event) {
        if (event.key === 'Escape') {
          if (document.body.contains(overlay)) {
            document.body.removeChild(overlay);
          }
          document.removeEventListener('keydown', handleEscapeKey);
        }
      }
      document.addEventListener('keydown', handleEscapeKey);

      // 9. 将遮罩层添加到页面body
      document.body.appendChild(overlay);
    });
  });
});