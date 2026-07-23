"use client";

import { useEffect, useRef } from "react";

type Signal = "mesh" | "transfer" | "field" | "ablation" | "compiler" | "market";

type Point = { x: number; y: number };

const INK = "#101014";
const CORAL = "#ff533d";
const CYAN = "#21c4cf";
const BLUE = "#5265d8";
const LIME = "#a8c51f";

const clamp = (value: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, value));

const mix = (a: number, b: number, amount: number) => a + (b - a) * amount;

const line = (
  context: CanvasRenderingContext2D,
  from: Point,
  to: Point,
  color: string,
  alpha = 1,
  width = 1,
) => {
  context.save();
  context.globalAlpha = alpha;
  context.strokeStyle = color;
  context.lineWidth = width;
  context.beginPath();
  context.moveTo(from.x, from.y);
  context.lineTo(to.x, to.y);
  context.stroke();
  context.restore();
};

const dot = (
  context: CanvasRenderingContext2D,
  point: Point,
  radius: number,
  color: string,
  alpha = 1,
) => {
  context.save();
  context.globalAlpha = alpha;
  context.fillStyle = color;
  context.beginPath();
  context.arc(point.x, point.y, radius, 0, Math.PI * 2);
  context.fill();
  context.restore();
};

const pulseOnLine = (
  context: CanvasRenderingContext2D,
  from: Point,
  to: Point,
  progress: number,
  color: string,
  radius = 3,
) => {
  dot(
    context,
    {
      x: mix(from.x, to.x, progress),
      y: mix(from.y, to.y, progress),
    },
    radius,
    color,
    .92,
  );
};

function drawCommunities(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
  pointer: Point,
  engaged: number,
) {
  const clusters = [
    { x: .24, y: .29, count: 7, radius: .105 },
    { x: .69, y: .27, count: 8, radius: .12 },
    { x: .34, y: .72, count: 6, radius: .095 },
    { x: .75, y: .69, count: 7, radius: .105 },
  ];
  const centers = clusters.map((cluster) => ({
    x: cluster.x * width,
    y: cluster.y * height,
  }));
  const nearest = centers.reduce(
    (best, center, index) => {
      const distance = Math.hypot(center.x - pointer.x, center.y - pointer.y);
      return distance < best.distance ? { index, distance } : best;
    },
    { index: 0, distance: Infinity },
  ).index;

  clusters.forEach((cluster, clusterIndex) => {
    const center = centers[clusterIndex];
    const orbit = cluster.radius * Math.min(width, height);
    const active = clusterIndex === nearest ? engaged : 0;

    context.save();
    context.strokeStyle = INK;
    context.globalAlpha = .11 + active * .13;
    context.lineWidth = 1;
    context.beginPath();
    context.arc(center.x, center.y, orbit * (1.42 + active * .08), 0, Math.PI * 2);
    context.stroke();
    context.restore();

    const nodes = Array.from({ length: cluster.count }, (_, index) => {
      const angle =
        (index / cluster.count) * Math.PI * 2 +
        clusterIndex * .47 +
        Math.sin(time * .45 + index * 1.7) * .035;
      return {
        x: center.x + Math.cos(angle) * orbit,
        y: center.y + Math.sin(angle) * orbit,
      };
    });

    nodes.forEach((node, index) => {
      line(context, node, nodes[(index + 1) % nodes.length], INK, .18 + active * .12);
      line(context, node, center, INK, .1 + active * .08);
      dot(context, node, 2.4 + active * .7, clusterIndex % 2 ? CYAN : CORAL, .82);
    });
    dot(context, center, 3.7, INK, .9);
  });

  const bridges = [
    [0, 1],
    [0, 2],
    [1, 3],
    [2, 3],
  ];
  bridges.forEach(([fromIndex, toIndex], index) => {
    const from = centers[fromIndex];
    const to = centers[toIndex];
    const selected = fromIndex === nearest || toIndex === nearest;
    context.save();
    context.setLineDash([3, 7]);
    line(context, from, to, selected ? CORAL : INK, selected ? .42 : .13);
    context.restore();
    pulseOnLine(
      context,
      from,
      to,
      (time * (.075 + index * .008) + index * .21) % 1,
      selected ? CORAL : CYAN,
      selected ? 3.2 : 2.1,
    );
  });
}

function drawTransfer(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
  pointer: Point,
  engaged: number,
) {
  const gate = mix(width * .46, width * .59, engaged * clamp(pointer.x / width));
  const lanes = 5;

  for (let lane = 0; lane < lanes; lane += 1) {
    const y = height * (.24 + lane * .13);
    line(context, { x: width * .09, y }, { x: gate - 16, y }, INK, .16);
    line(context, { x: gate + 18, y }, { x: width * .91, y }, INK, .16);

    for (let packet = 0; packet < 4; packet += 1) {
      const progress = (time * (.075 + lane * .006) + packet * .28 + lane * .07) % 1;
      const x = mix(width * .1, width * .9, progress);
      if (Math.abs(x - gate) < 20) continue;
      context.save();
      context.fillStyle = x > gate ? CYAN : CORAL;
      context.globalAlpha = x > gate ? .88 : .6;
      context.fillRect(x - 7, y - 2, 14, 4);
      context.restore();
    }
  }

  context.save();
  context.strokeStyle = INK;
  context.globalAlpha = .32;
  context.beginPath();
  context.arc(gate, height * .5, 22 + engaged * 8, -.7, Math.PI * 1.25);
  context.stroke();
  context.restore();
  line(
    context,
    { x: gate - 6, y: height * .5 + 3 },
    { x: gate, y: height * .5 + 9 },
    LIME,
    .9,
    2,
  );
  line(
    context,
    { x: gate, y: height * .5 + 9 },
    { x: gate + 11, y: height * .5 - 8 },
    LIME,
    .9,
    2,
  );
}

function drawAdaptiveField(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
  pointer: Point,
  engaged: number,
) {
  const nodes = Array.from({ length: 27 }, (_, index) => {
    const column = index % 6;
    const row = Math.floor(index / 6);
    const baseX = width * (.12 + column * .15 + (row % 2) * .035);
    const baseY = height * (.18 + row * .155);
    const distance = Math.max(30, Math.hypot(baseX - pointer.x, baseY - pointer.y));
    const push = engaged * clamp(105 / distance) * 18;
    return {
      x: baseX + Math.sin(time * .55 + index * 1.37) * 8 + ((baseX - pointer.x) / distance) * push,
      y: baseY + Math.cos(time * .43 + index * .91) * 7 + ((baseY - pointer.y) / distance) * push,
    };
  });

  nodes.forEach((node, index) => {
    const candidates = nodes
      .map((other, otherIndex) => ({
        other,
        otherIndex,
        distance: Math.hypot(node.x - other.x, node.y - other.y),
      }))
      .filter(({ otherIndex }) => otherIndex > index)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 2);

    candidates.forEach(({ other, distance }) => {
      if (distance < width * .24) line(context, node, other, INK, .1 + (1 - distance / width) * .1);
    });
    dot(context, node, index % 7 === 0 ? 4 : 2.2, index % 3 === 0 ? BLUE : INK, .78);
  });
  dot(context, pointer, 18 + engaged * 8, CORAL, engaged * .08);
}

function drawAblation(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
  pointer: Point,
  engaged: number,
) {
  const layers = [4, 6, 7, 5, 3];
  const cutX = mix(width * .58, clamp(pointer.x, width * .32, width * .74), engaged);
  const cutY = mix(height * .48, clamp(pointer.y, height * .24, height * .76), engaged);
  const layerNodes = layers.map((count, layer) =>
    Array.from({ length: count }, (_, index) => ({
      x: width * (.12 + layer * .19),
      y: height * (.18 + (index / Math.max(1, count - 1)) * .64),
    })),
  );

  layerNodes.slice(0, -1).forEach((nodes, layer) => {
    nodes.forEach((from, index) => {
      const next = layerNodes[layer + 1];
      [index % next.length, (index + 2) % next.length].forEach((nextIndex) => {
        const to = next[nextIndex];
        const midpoint = { x: (from.x + to.x) / 2, y: (from.y + to.y) / 2 };
        const removed = Math.hypot(midpoint.x - cutX, midpoint.y - cutY) < 46;
        line(context, from, to, removed ? CORAL : INK, removed ? .06 : .13);
      });
    });
  });

  layerNodes.flat().forEach((node, index) => {
    const removed = Math.hypot(node.x - cutX, node.y - cutY) < 38;
    if (!removed) dot(context, node, index % 6 === 0 ? 3.5 : 2.1, index % 5 === 0 ? BLUE : INK, .78);
  });

  context.save();
  context.strokeStyle = CORAL;
  context.globalAlpha = .7;
  context.setLineDash([4, 5]);
  context.beginPath();
  context.arc(cutX, cutY, 38, 0, Math.PI * 2);
  context.stroke();
  context.restore();

  const recovery = (Math.sin(time * 2.1) + 1) / 2;
  line(
    context,
    { x: cutX - 70, y: cutY + 60 },
    { x: cutX + 75, y: cutY + 60 - recovery * 18 },
    CYAN,
    .55,
    2,
  );
}

function drawCompiler(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
  pointer: Point,
  engaged: number,
) {
  const stages = [
    { x: .12, label: "C", count: 6 },
    { x: .37, label: "AST", count: 5 },
    { x: .62, label: "IR", count: 4 },
    { x: .87, label: "RV64", count: 3 },
  ];
  const sweep = (time * .09 + engaged * clamp(pointer.x / width) * .25) % 1;

  stages.forEach((stage, stageIndex) => {
    const x = stage.x * width;
    context.save();
    context.fillStyle = INK;
    context.globalAlpha = .48;
    context.font = "600 9px monospace";
    context.fillText(stage.label, x - 12, height * .15);
    context.restore();

    const span = height * (.52 - stageIndex * .07);
    const nodes = Array.from({ length: stage.count }, (_, index) => ({
      x,
      y: height * .5 - span / 2 + (index / Math.max(1, stage.count - 1)) * span,
    }));
    nodes.forEach((node, index) => {
      if (stageIndex < stages.length - 1) {
        const nextStage = stages[stageIndex + 1];
        const nextY =
          height * .5 -
          (height * (.52 - (stageIndex + 1) * .07)) / 2 +
          ((index % nextStage.count) / Math.max(1, nextStage.count - 1)) *
            height *
            (.52 - (stageIndex + 1) * .07);
        line(
          context,
          node,
          { x: nextStage.x * width, y: nextY },
          INK,
          .13,
        );
      }
      if (stageIndex === 0) {
        context.save();
        context.fillStyle = CORAL;
        context.globalAlpha = .75;
        context.fillRect(node.x - 9, node.y - 2, 18 - index * 1.5, 4);
        context.restore();
      } else if (stageIndex === stages.length - 1) {
        context.save();
        context.fillStyle = CYAN;
        context.globalAlpha = .82;
        context.fillRect(node.x - 3, node.y - 11, 6, 22);
        context.restore();
      } else {
        dot(context, node, 3.2, stageIndex === 1 ? BLUE : INK, .78);
      }
    });
  });

  const sweepX = mix(width * .08, width * .91, sweep);
  line(context, { x: sweepX, y: height * .18 }, { x: sweepX, y: height * .82 }, LIME, .46);
}

function drawMarketFilter(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
  pointer: Point,
  engaged: number,
) {
  const gate = mix(width * .62, clamp(pointer.x, width * .48, width * .75), engaged);
  const samples = 46;

  for (let trace = 0; trace < 13; trace += 1) {
    context.save();
    context.strokeStyle = INK;
    context.globalAlpha = .055 + (trace % 3) * .018;
    context.beginPath();
    for (let sample = 0; sample < samples; sample += 1) {
      const x = mix(width * .08, gate - 12, sample / (samples - 1));
      const noise =
        Math.sin(sample * (.57 + trace * .013) + trace * 1.7 + time * .16) * 18 +
        Math.sin(sample * .19 + trace * .73) * 12;
      const y = height * (.22 + trace * .047) + noise;
      if (sample === 0) context.moveTo(x, y);
      else context.lineTo(x, y);
    }
    context.stroke();
    context.restore();
  }

  context.save();
  context.strokeStyle = CORAL;
  context.globalAlpha = .55;
  context.beginPath();
  context.moveTo(gate + 15, height * .15);
  context.lineTo(gate - 15, height * .85);
  context.stroke();
  context.restore();

  const colors = [CYAN, CORAL, BLUE];
  for (let signal = 0; signal < 3; signal += 1) {
    const startY = height * (.34 + signal * .16);
    context.save();
    context.strokeStyle = colors[signal];
    context.globalAlpha = .74;
    context.lineWidth = signal === 1 ? 2 : 1.2;
    context.beginPath();
    for (let sample = 0; sample < 26; sample += 1) {
      const progress = sample / 25;
      const x = mix(gate + 18, width * .92, progress);
      const y =
        startY +
        Math.sin(progress * 5 + signal + time * .22) * (4 + signal * 2) +
        (signal - 1) * progress * 16;
      if (sample === 0) context.moveTo(x, y);
      else context.lineTo(x, y);
    }
    context.stroke();
    context.restore();
    const marker = (time * (.07 + signal * .01) + signal * .26) % 1;
    dot(
      context,
      {
        x: mix(gate + 18, width * .92, marker),
        y:
          startY +
          Math.sin(marker * 5 + signal + time * .22) * (4 + signal * 2) +
          (signal - 1) * marker * 16,
      },
      2.8,
      colors[signal],
      .9,
    );
  }
}

export default function ProjectVisual({ signal }: { signal: Signal }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0, engaged: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pointer = pointerRef.current;
    let width = 1;
    let height = 1;
    let frame = 0;
    let visible = true;
    let stopped = false;

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      const ratio = Math.min(1.5, window.devicePixelRatio || 1);
      width = Math.max(1, bounds.width);
      height = Math.max(1, bounds.height);
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const draw = (timeMs: number) => {
      frame = 0;
      if (stopped || !visible || document.hidden) return;
      pointer.x += (pointer.targetX - pointer.x) * .08;
      pointer.y += (pointer.targetY - pointer.y) * .08;
      pointer.engaged *= .975;
      context.clearRect(0, 0, width, height);

      const time = reduced ? 2.8 : timeMs / 1000;
      if (signal === "mesh") drawCommunities(context, width, height, time, pointer, pointer.engaged);
      if (signal === "transfer") drawTransfer(context, width, height, time, pointer, pointer.engaged);
      if (signal === "field") drawAdaptiveField(context, width, height, time, pointer, pointer.engaged);
      if (signal === "ablation") drawAblation(context, width, height, time, pointer, pointer.engaged);
      if (signal === "compiler") drawCompiler(context, width, height, time, pointer, pointer.engaged);
      if (signal === "market") drawMarketFilter(context, width, height, time, pointer, pointer.engaged);

      if (!reduced) frame = requestAnimationFrame(draw);
    };

    const onPointerMove = (event: PointerEvent) => {
      const bounds = canvas.getBoundingClientRect();
      pointer.targetX = clamp(event.clientX - bounds.left, 0, bounds.width);
      pointer.targetY = clamp(event.clientY - bounds.top, 0, bounds.height);
      pointer.engaged = 1;
    };
    const onPointerLeave = () => {
      pointer.targetX = width / 2;
      pointer.targetY = height / 2;
    };
    const onVisibility = () => {
      if (!document.hidden && visible && !reduced && !frame) frame = requestAnimationFrame(draw);
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !frame) frame = requestAnimationFrame(draw);
      if (!visible && frame) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    });
    const resizeObserver = new ResizeObserver(() => {
      resize();
      if (!frame) frame = requestAnimationFrame(draw);
    });

    resize();
    pointer.x = pointer.targetX = width / 2;
    pointer.y = pointer.targetY = height / 2;
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerdown", onPointerMove);
    canvas.addEventListener("pointerleave", onPointerLeave);
    document.addEventListener("visibilitychange", onVisibility);
    observer.observe(canvas);
    resizeObserver.observe(canvas);
    frame = requestAnimationFrame(draw);

    return () => {
      stopped = true;
      if (frame) cancelAnimationFrame(frame);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerdown", onPointerMove);
      canvas.removeEventListener("pointerleave", onPointerLeave);
      document.removeEventListener("visibilitychange", onVisibility);
      observer.disconnect();
      resizeObserver.disconnect();
    };
  }, [signal]);

  return <canvas ref={canvasRef} className="project-canvas" aria-hidden="true" />;
}
