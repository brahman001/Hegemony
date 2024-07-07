"use client"
// import '@/app/ui/styles.css';
// import Image from "next/image";
// import React, { useState } from 'react';

// function TIMELINE() {
//   const [turn, setturn] = useState(0);
//   const [step, setstep] = useState(1);

// }

import { useRef, useState, useEffect, MouseEvent } from 'react';
export default function GameRun() {
    const [step, setStep] = useState(0);
    const [turn, setTurn] = useState(1);
    CanvasPage;
    if (step === 0 && turn === 1) {
              initialization(2);
            }
    
    return (
        <div>
            <p>Game Step: {step}</p>
            <p>Turn: {turn}</p>
        </div>
    );
}
function initialization(player:number){

}
interface Region {
  x: number;
  y: number;
  width: number;
  height: number;
}

const predefinedRegions: Region[] = [
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
    image.src = '/board.jpg'; 
    image.onload = () => {
      if (canvas && ctx) {
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

  const handleCanvasClick = (e: MouseEvent<HTMLCanvasElement>) => {
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
    region: Region
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