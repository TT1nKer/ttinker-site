"use client";

import { useEffect, useRef } from "react";

type Signal =
  | "mesh"
  | "transfer"
  | "field"
  | "datapath"
  | "orbit"
  | "timer"
  | "compiler"
  | "market";

type Point = { x: number; y: number };

const INK = "#101014";
const CORAL = "#ff533d";
const CYAN = "#21c4cf";
const BLUE = "#5265d8";
const LIME = "#a8c51f";

const clamp = (value: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, value));

const mix = (a: number, b: number, amount: number) => a + (b - a) * amount;

const smoothstep = (from: number, to: number, value: number) => {
  const amount = clamp((value - from) / Math.max(.0001, to - from));
  return amount * amount * (3 - 2 * amount);
};

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

function drawProtocolMorph(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
  pointer: Point,
  engaged: number,
  morph: number,
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
  const communityAlpha = 1 - smoothstep(.08, .72, morph);
  const channelAlpha = smoothstep(.28, .92, morph);
  const packetMotion = smoothstep(.78, 1, morph);
  const gate = mix(
    width * .54,
    width * .59,
    engaged * clamp(pointer.x / width) * channelAlpha,
  );
  const nodes: Array<{
    start: Point;
    end: Point;
    clusterIndex: number;
    globalIndex: number;
    lane: number;
  }> = [];

  clusters.forEach((cluster, clusterIndex) => {
    const center = centers[clusterIndex];
    const orbit = cluster.radius * Math.min(width, height);
    const active = clusterIndex === nearest ? engaged : 0;

    context.save();
    context.strokeStyle = INK;
    context.globalAlpha = (.11 + active * .13) * communityAlpha;
    context.lineWidth = 1;
    context.beginPath();
    context.arc(center.x, center.y, orbit * (1.42 + active * .08), 0, Math.PI * 2);
    context.stroke();
    context.restore();

    const clusterNodes = Array.from({ length: cluster.count }, (_, index) => {
      const angle =
        (index / cluster.count) * Math.PI * 2 +
        clusterIndex * .47 +
        Math.sin(time * .45 + index * 1.7) * .035 * communityAlpha;
      const globalIndex = nodes.length + index;
      const lane = globalIndex % 5;
      const slot = Math.floor(globalIndex / 5);
      const staticProgress = clamp((slot + (lane % 2) * .32) / 5.35);
      const movingProgress =
        (time * (.068 + lane * .004) + globalIndex * .173) % 1;
      const transferProgress = mix(staticProgress, movingProgress, packetMotion);

      return {
        start: {
          x: center.x + Math.cos(angle) * orbit,
          y: center.y + Math.sin(angle) * orbit,
        },
        end: {
          x: mix(width * .1, width * .9, transferProgress),
          y: height * (.24 + lane * .13),
        },
        clusterIndex,
        globalIndex,
        lane,
      };
    });

    clusterNodes.forEach((node, index) => {
      line(
        context,
        node.start,
        clusterNodes[(index + 1) % clusterNodes.length].start,
        INK,
        (.18 + active * .12) * communityAlpha,
      );
      line(
        context,
        node.start,
        center,
        INK,
        (.1 + active * .08) * communityAlpha,
      );
    });
    dot(context, center, 3.7, INK, .9 * communityAlpha);
    nodes.push(...clusterNodes);
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
    line(
      context,
      from,
      to,
      selected ? CORAL : INK,
      (selected ? .42 : .13) * communityAlpha,
    );
    context.restore();
    pulseOnLine(
      context,
      from,
      to,
      (time * (.075 + index * .008) + index * .21) % 1,
      selected ? CORAL : CYAN,
      (selected ? 3.2 : 2.1) * communityAlpha,
    );
  });

  for (let lane = 0; lane < 5; lane += 1) {
    const y = height * (.24 + lane * .13);
    line(context, { x: width * .09, y }, { x: gate - 16, y }, INK, .16 * channelAlpha);
    line(context, { x: gate + 18, y }, { x: width * .91, y }, INK, .16 * channelAlpha);
  }

  context.save();
  context.strokeStyle = INK;
  context.globalAlpha = .32 * channelAlpha;
  context.beginPath();
  context.arc(gate, height * .5, 22 + engaged * 8, -.7, Math.PI * 1.25);
  context.stroke();
  context.restore();
  line(
    context,
    { x: gate - 6, y: height * .5 + 3 },
    { x: gate, y: height * .5 + 9 },
    LIME,
    .9 * channelAlpha,
    2,
  );
  line(
    context,
    { x: gate, y: height * .5 + 9 },
    { x: gate + 11, y: height * .5 - 8 },
    LIME,
    .9 * channelAlpha,
    2,
  );

  nodes.forEach((node) => {
    const point = {
      x: mix(node.start.x, node.end.x, morph),
      y: mix(node.start.y, node.end.y, morph),
    };
    const nearGate = Math.abs(point.x - gate) < 20;
    const color = morph < .5
      ? (node.clusterIndex % 2 ? CYAN : CORAL)
      : (point.x > gate ? CYAN : CORAL);

    dot(
      context,
      point,
      2.4 + (node.clusterIndex === nearest ? engaged * .7 : 0),
      color,
      (.82 - channelAlpha * .3) * (nearGate ? .18 : 1),
    );
    if (channelAlpha > .04) {
      context.save();
      context.fillStyle = color;
      context.globalAlpha = channelAlpha * (nearGate ? .12 : .74);
      const packetWidth = mix(3, 14, channelAlpha);
      const packetHeight = mix(3, 4, channelAlpha);
      context.fillRect(
        point.x - packetWidth / 2,
        point.y - packetHeight / 2,
        packetWidth,
        packetHeight,
      );
      context.restore();
    }
  });
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

function drawDatapath(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
  pointer: Point,
  engaged: number,
) {
  const inputs = [.27, .5, .73].map((y) => ({ x: width * .09, y: height * y }));
  const graph = [
    { x: .34, y: .29, label: "+" },
    { x: .34, y: .67, label: "×" },
    { x: .49, y: .2, label: "≡" },
    { x: .49, y: .48, label: "+" },
    { x: .49, y: .77, label: "≡" },
    { x: .64, y: .34, label: "×" },
    { x: .64, y: .66, label: "+" },
  ].map((node) => ({ ...node, x: node.x * width, y: node.y * height }));
  const outputs = [
    { x: width * .89, y: height * .36, label: "DSP" },
    { x: width * .89, y: height * .65, label: "LUT" },
  ];
  const lutMode = engaged > .08 && pointer.y > height * .5;
  const selected = lutMode ? [1, 4, 6] : [0, 2, 5];
  const edges = [
    [inputs[0], graph[0]], [inputs[1], graph[0]], [inputs[1], graph[1]],
    [inputs[2], graph[1]], [graph[0], graph[2]], [graph[0], graph[3]],
    [graph[1], graph[3]], [graph[1], graph[4]], [graph[2], graph[5]],
    [graph[3], graph[5]], [graph[3], graph[6]], [graph[4], graph[6]],
    [graph[5], outputs[0]], [graph[6], outputs[1]],
  ] as const;

  edges.forEach(([from, to], index) => {
    const highlighted = lutMode
      ? [2, 3, 7, 11, 13].includes(index)
      : [0, 1, 4, 8, 12].includes(index);
    line(
      context,
      from,
      to,
      highlighted ? (lutMode ? CYAN : CORAL) : INK,
      highlighted ? .62 : .12,
      highlighted ? 1.5 : 1,
    );
    if (highlighted) {
      pulseOnLine(
        context,
        from,
        to,
        (time * .18 + index * .13) % 1,
        lutMode ? CYAN : CORAL,
        2.3,
      );
    }
  });

  inputs.forEach((point, index) => {
    context.save();
    context.fillStyle = INK;
    context.globalAlpha = .72;
    context.fillRect(point.x - 10, point.y - 4, 20, 8);
    context.font = "600 7px monospace";
    context.fillText(String.fromCharCode(97 + index), point.x - 2, point.y - 10);
    context.restore();
  });

  graph.forEach((node, index) => {
    const active = selected.includes(index);
    dot(context, node, active ? 10 : 7, active ? (lutMode ? CYAN : CORAL) : INK, active ? .13 : .05);
    dot(context, node, 3, active ? (lutMode ? CYAN : CORAL) : INK, .9);
    context.save();
    context.fillStyle = INK;
    context.globalAlpha = .6;
    context.font = "600 8px monospace";
    context.fillText(node.label, node.x + 9, node.y + 3);
    context.restore();
  });

  outputs.forEach((node, index) => {
    const active = index === (lutMode ? 1 : 0);
    context.save();
    context.strokeStyle = active ? (lutMode ? CYAN : CORAL) : INK;
    context.globalAlpha = active ? .82 : .2;
    context.strokeRect(node.x - 23, node.y - 12, 46, 24);
    context.fillStyle = INK;
    context.font = "650 8px monospace";
    context.fillText(node.label, node.x - 10, node.y + 3);
    context.restore();
  });
}

function drawOrbitTransfer(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
  pointer: Point,
  engaged: number,
) {
  const unit = Math.min(width, height);
  const focus = { x: width * .39, y: height * .52 };
  const inner = unit * .18;
  const outer = unit * .34;
  const semiMajor = (inner + outer) / 2;
  const semiMinor = Math.sqrt(inner * outer);
  const centerX = focus.x + (outer - inner) / 2;
  const transferProgress = engaged > .08
    ? clamp(pointer.x / width, 0, 1)
    : (time * .035) % 1;

  [inner, outer].forEach((radius, index) => {
    context.save();
    context.strokeStyle = INK;
    context.globalAlpha = index ? .13 : .2;
    context.setLineDash(index ? [3, 6] : []);
    context.beginPath();
    context.arc(focus.x, focus.y, radius, 0, Math.PI * 2);
    context.stroke();
    context.restore();
  });

  context.save();
  context.strokeStyle = CORAL;
  context.globalAlpha = .66;
  context.lineWidth = 1.5;
  context.beginPath();
  context.ellipse(centerX, focus.y, semiMajor, semiMinor, 0, Math.PI, Math.PI * 2);
  context.stroke();
  context.restore();

  const earth = { x: focus.x - inner, y: focus.y };
  const mars = { x: focus.x + outer, y: focus.y };
  const angle = Math.PI + transferProgress * Math.PI;
  const craft = {
    x: centerX + Math.cos(angle) * semiMajor,
    y: focus.y + Math.sin(angle) * semiMinor,
  };

  dot(context, focus, 8, LIME, .92);
  dot(context, earth, 5, BLUE, .9);
  dot(context, mars, 4.5, CORAL, .9);
  dot(context, craft, 3.3, CYAN, 1);
  line(context, focus, craft, INK, .08);

  const tangent = {
    x: -Math.sin(angle) * 16,
    y: Math.cos(angle) * 10,
  };
  line(
    context,
    { x: craft.x - tangent.x, y: craft.y - tangent.y },
    { x: craft.x + tangent.x, y: craft.y + tangent.y },
    CYAN,
    .8,
    1.5,
  );

  context.save();
  context.fillStyle = INK;
  context.globalAlpha = .5;
  context.font = "600 7px monospace";
  context.fillText("1.00 AU", earth.x - 18, earth.y + 18);
  context.fillText("1.52 AU", mars.x - 18, mars.y + 18);
  context.fillText(`T+${String(Math.round(transferProgress * 259)).padStart(3, "0")}D`, craft.x + 9, craft.y - 7);
  context.restore();
}

function drawFocusPhases(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
  pointer: Point,
  engaged: number,
) {
  const center = { x: width * .5, y: height * .45 };
  const radius = Math.min(width, height) * .24;
  const pointerAngle =
    Math.atan2(pointer.y - center.y, pointer.x - center.x) / (Math.PI * 2);
  const progress = engaged > .08
    ? (pointerAngle + 1.25) % 1
    : (time * .018) % 1;
  const phases = [
    { value: 25, color: CORAL, label: "FOCUS" },
    { value: 5, color: CYAN, label: "BREAK" },
    { value: 25, color: CORAL, label: "FOCUS" },
    { value: 15, color: LIME, label: "RESET" },
  ];
  const total = phases.reduce((sum, phase) => sum + phase.value, 0);
  const activePhase = Math.floor(progress * phases.length) % phases.length;
  let cursor = -Math.PI / 2;

  phases.forEach((phase, index) => {
    const span = (phase.value / total) * Math.PI * 2;
    context.save();
    context.strokeStyle = phase.color;
    context.globalAlpha = index === activePhase ? .9 : .22;
    context.lineWidth = index === activePhase ? 8 : 4;
    context.beginPath();
    context.arc(center.x, center.y, radius, cursor + .035, cursor + span - .035);
    context.stroke();
    context.restore();
    cursor += span;
  });

  for (let tick = 0; tick < 60; tick += 1) {
    const angle = (tick / 60) * Math.PI * 2 - Math.PI / 2;
    const length = tick % 5 === 0 ? 8 : 4;
    const from = {
      x: center.x + Math.cos(angle) * (radius - 18),
      y: center.y + Math.sin(angle) * (radius - 18),
    };
    const to = {
      x: center.x + Math.cos(angle) * (radius - 18 - length),
      y: center.y + Math.sin(angle) * (radius - 18 - length),
    };
    line(context, from, to, INK, tick / 60 <= progress ? .4 : .1);
  }

  const remaining = Math.max(0, Math.ceil(25 * 60 * (1 - progress)));
  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  context.save();
  context.fillStyle = INK;
  context.textAlign = "center";
  context.globalAlpha = .9;
  context.font = `750 ${Math.max(28, radius * .35)}px monospace`;
  context.fillText(`${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`, center.x, center.y + 8);
  context.globalAlpha = .45;
  context.font = "650 7px monospace";
  context.fillText("CUSTOM SEQUENCE / OFFLINE", center.x, center.y + 28);
  context.restore();

  let stripX = width * .12;
  phases.forEach((phase, index) => {
    const segmentWidth = width * .76 * (phase.value / total);
    context.save();
    context.fillStyle = phase.color;
    context.globalAlpha = index === activePhase ? .8 : .22;
    context.fillRect(stripX, height * .82, Math.max(2, segmentWidth - 3), 4);
    context.fillStyle = INK;
    context.globalAlpha = .4;
    context.font = "600 6px monospace";
    context.fillText(phase.label, stripX, height * .82 + 14);
    context.restore();
    stripX += segmentWidth;
  });
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
    const sequence = canvas.closest<HTMLElement>(".project-sequence");
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
      const localProgress = Number.parseFloat(
        sequence?.style.getPropertyValue("--project-local") || "0",
      );
      if (signal === "mesh") {
        drawProtocolMorph(
          context,
          width,
          height,
          time,
          pointer,
          pointer.engaged,
          reduced ? 0 : smoothstep(.48, .98, localProgress),
        );
      }
      if (signal === "transfer") {
        drawProtocolMorph(context, width, height, time, pointer, pointer.engaged, 1);
      }
      if (signal === "field") drawAdaptiveField(context, width, height, time, pointer, pointer.engaged);
      if (signal === "datapath") drawDatapath(context, width, height, time, pointer, pointer.engaged);
      if (signal === "orbit") drawOrbitTransfer(context, width, height, time, pointer, pointer.engaged);
      if (signal === "timer") drawFocusPhases(context, width, height, time, pointer, pointer.engaged);
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
