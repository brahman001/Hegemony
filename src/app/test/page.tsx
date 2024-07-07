"use client"
import { useRef, useState, useEffect } from 'react';

const predefinedRegions = [
  { x: 90, y: 10, width: 100, height: 50 },
  { x: 200, y: 70, width: 150, height: 100 },
  // 添加更多的预定义区域
];

const CanvasPage = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const image = new Image();
    image.src = '/board.jpg'; // 替换为你的主板图片路径
    image.onload = () => {
      if (canvas && ctx) {
        // 设置 canvas 尺寸以匹配图片的尺寸
        canvas.width = image.width;
        canvas.height = image.height;
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        drawPredefinedRegions(ctx);
        setImageLoaded(true);
      }
    };
  }, []);

  const drawPredefinedRegions = (ctx: CanvasRenderingContext2D) => {
    predefinedRegions.forEach(region => {
      ctx.beginPath();
      ctx.rect(region.x, region.y, region.width, region.height);
      ctx.strokeStyle = 'red';
      ctx.stroke();
    });
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (!imageLoaded) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx) {
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      predefinedRegions.forEach(region => {
        if (
          clickX >= region.x &&
          clickX <= region.x + region.width &&
          clickY >= region.y &&
          clickY <= region.y + region.height
        ) {
          fillRegion(ctx, region);
        }
      });
    }
  };

  const fillRegion = (
    ctx: CanvasRenderingContext2D,
    region: { x: number; y: number; width: number; height: number }
  ) => {
    const fillImage = new Image();
    fillImage.src = '/fill-image.jpg'; // 替换为你想填充的图片路径
    fillImage.onload = () => {
      ctx.drawImage(fillImage, region.x, region.y, region.width, region.height);
      drawPredefinedRegions(ctx); // 重绘预定义区域的边框
    };
  };

  return (
    <div>
      <h1>Canvas Drawing</h1>
      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        style={{ border: '1px solid black', maxWidth: '100%', height: 'auto' }}
      ></canvas>
    </div>
  );
};

export default CanvasPage;
