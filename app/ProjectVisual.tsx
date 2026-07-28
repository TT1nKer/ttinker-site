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

const INK = "#17131d";
const SIGNAL = "#d06435";
const FIELD = "#516394";
const TRACE = "#6d5b7c";
const SIGNAL_MUTED = "#a65f43";

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
      selected ? SIGNAL : INK,
      (selected ? .42 : .13) * communityAlpha,
    );
    context.restore();
    pulseOnLine(
      context,
      from,
      to,
      (time * (.075 + index * .008) + index * .21) % 1,
      selected ? SIGNAL : FIELD,
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
    SIGNAL_MUTED,
    .9 * channelAlpha,
    2,
  );
  line(
    context,
    { x: gate, y: height * .5 + 9 },
    { x: gate + 11, y: height * .5 - 8 },
    SIGNAL_MUTED,
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
      ? (node.clusterIndex % 2 ? FIELD : SIGNAL)
      : (point.x > gate ? FIELD : SIGNAL);

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

function adaptiveNodes(
  width: number,
  height: number,
  time: number,
  pointer: Point,
  engaged: number,
) {
  return Array.from({ length: 28 }, (_, index) => {
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
}

function drawAdaptiveEdges(
  context: CanvasRenderingContext2D,
  nodes: Point[],
  width: number,
  alpha = 1,
) {
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
      if (distance < width * .24) {
        line(
          context,
          node,
          other,
          INK,
          (.1 + (1 - distance / width) * .1) * alpha,
        );
      }
    });
  });
}

function drawTransferFieldMorph(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
  pointer: Point,
  engaged: number,
  morph: number,
) {
  const channelAlpha = 1 - smoothstep(.08, .78, morph);
  const fieldAlpha = smoothstep(.3, .94, morph);
  const gate = mix(
    width * .54,
    width * .59,
    engaged * clamp(pointer.x / width) * channelAlpha,
  );
  const targets = adaptiveNodes(
    width,
    height,
    time,
    pointer,
    engaged * fieldAlpha,
  );
  const nodes = targets.map((target, index) => {
    const lane = index % 5;
    const transferProgress =
      (time * (.068 + lane * .004) + index * .173) % 1;
    return {
      point: {
        x: mix(
          mix(width * .1, width * .9, transferProgress),
          target.x,
          morph,
        ),
        y: mix(height * (.24 + lane * .13), target.y, morph),
      },
      lane,
    };
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
    SIGNAL_MUTED,
    .9 * channelAlpha,
    2,
  );
  line(
    context,
    { x: gate, y: height * .5 + 9 },
    { x: gate + 11, y: height * .5 - 8 },
    SIGNAL_MUTED,
    .9 * channelAlpha,
    2,
  );

  drawAdaptiveEdges(
    context,
    nodes.map(({ point }) => point),
    width,
    fieldAlpha,
  );

  nodes.forEach(({ point }, index) => {
    const transferColor = point.x > gate ? FIELD : SIGNAL;
    const fieldColor = index % 3 === 0 ? TRACE : INK;
    const nearGate = Math.abs(point.x - gate) < 20;

    context.save();
    context.fillStyle = transferColor;
    context.globalAlpha = .76 * channelAlpha * (nearGate ? .16 : 1);
    context.fillRect(point.x - 7, point.y - 2, 14, 4);
    context.restore();
    dot(
      context,
      point,
      mix(2.2, index % 7 === 0 ? 4 : 2.2, fieldAlpha),
      fieldColor,
      .24 * channelAlpha + .78 * fieldAlpha,
    );
  });
  dot(context, pointer, 18 + engaged * 8, SIGNAL, engaged * fieldAlpha * .08);
}

function drawAdaptiveField(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
  pointer: Point,
  engaged: number,
) {
  const nodes = adaptiveNodes(width, height, time, pointer, engaged);
  drawAdaptiveEdges(context, nodes, width);
  nodes.forEach((node, index) => {
    dot(context, node, index % 7 === 0 ? 4 : 2.2, index % 3 === 0 ? TRACE : INK, .78);
  });
  dot(context, pointer, 18 + engaged * 8, SIGNAL, engaged * .08);
}

function eGraphNodes(width: number, height: number) {
  const unit = Math.min(width, height);
  const classes = [
    { x: .22, y: .5, rx: .11, ry: .16 },
    { x: .47, y: .29, rx: .105, ry: .13 },
    { x: .47, y: .71, rx: .105, ry: .13 },
    { x: .72, y: .5, rx: .11, ry: .16 },
  ];
  return classes.flatMap((group, groupIndex) =>
    Array.from({ length: 7 }, (_, index) => {
      const angle = index / 7 * Math.PI * 2 + groupIndex * .22;
      return {
        x: group.x * width + Math.cos(angle) * group.rx * unit,
        y: group.y * height + Math.sin(angle) * group.ry * unit,
      };
    }),
  );
}

function drawEGraphScaffold(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
  pointer: Point,
  engaged: number,
  nodes: Point[],
  alpha = 1,
) {
  const lutMode = engaged > .08 && pointer.y > height * .5;
  const unit = Math.min(width, height);
  const input = { x: width * .055, y: height * .5 };
  const output = { x: width * .925, y: height * .5 };
  const groups = [
    { x: .22, y: .5, rx: .14, ry: .21 },
    { x: .47, y: .29, rx: .135, ry: .17 },
    { x: .47, y: .71, rx: .135, ry: .17 },
    { x: .72, y: .5, rx: .14, ry: .21 },
  ];
  const upperPath = [input, nodes[3], nodes[0], nodes[10], nodes[7], nodes[24], nodes[21], output];
  const lowerPath = [input, nodes[3], nodes[0], nodes[17], nodes[14], nodes[24], nodes[21], output];
  const selectedPath = lutMode ? lowerPath : upperPath;
  const alternatePath = lutMode ? upperPath : lowerPath;
  const selectedColor = lutMode ? FIELD : SIGNAL;

  groups.forEach((group, groupIndex) => {
    context.save();
    context.strokeStyle = INK;
    context.globalAlpha = .18 * alpha;
    context.setLineDash([3, 5]);
    context.beginPath();
    context.ellipse(
      group.x * width,
      group.y * height,
      group.rx * unit,
      group.ry * unit,
      0,
      0,
      Math.PI * 2,
    );
    context.stroke();
    context.setLineDash([]);
    context.fillStyle = INK;
    context.globalAlpha = .42 * alpha;
    context.font = "650 7px monospace";
    context.fillText(`e${groupIndex}`, group.x * width - 6, group.y * height - group.ry * unit - 9);
    context.restore();

    const groupNodes = nodes.slice(groupIndex * 7, groupIndex * 7 + 7);
    groupNodes.forEach((node, index) => {
      line(
        context,
        node,
        groupNodes[(index + 1) % groupNodes.length],
        INK,
        .08 * alpha,
      );
    });
  });

  alternatePath.slice(0, -1).forEach((point, index) => {
    line(context, point, alternatePath[index + 1], INK, .09 * alpha);
  });
  selectedPath.slice(0, -1).forEach((point, index) => {
    const next = selectedPath[index + 1];
    line(context, point, next, selectedColor, .68 * alpha, 1.5);
    pulseOnLine(
      context,
      point,
      next,
      (time * .15 + index * .17) % 1,
      selectedColor,
      2.2 * alpha,
    );
  });

  context.save();
  context.globalAlpha = alpha;
  context.fillStyle = INK;
  context.fillRect(input.x - 8, input.y - 3, 16, 6);
  context.strokeStyle = selectedColor;
  context.globalAlpha = .82 * alpha;
  context.strokeRect(output.x - 23, output.y - 12, 46, 24);
  context.fillStyle = INK;
  context.globalAlpha = .6 * alpha;
  context.font = "650 7px monospace";
  context.fillText("IR", input.x - 6, input.y - 10);
  context.fillText(lutMode ? "LUT" : "DSP", output.x - 10, output.y + 3);
  context.restore();
}

function drawDatapath(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
  pointer: Point,
  engaged: number,
) {
  const nodes = eGraphNodes(width, height);
  drawEGraphScaffold(context, width, height, time, pointer, engaged, nodes);
  const lutMode = engaged > .08 && pointer.y > height * .5;
  const selected = new Set(lutMode ? [3, 0, 17, 14, 24, 21] : [3, 0, 10, 7, 24, 21]);
  nodes.forEach((node, index) => {
    dot(
      context,
      node,
      selected.has(index) ? 3.5 : 2.15,
      selected.has(index) ? (lutMode ? FIELD : SIGNAL) : INK,
      selected.has(index) ? .92 : .5,
    );
  });
}

function drawFieldEGraphMorph(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
  pointer: Point,
  engaged: number,
  morph: number,
) {
  const source = adaptiveNodes(width, height, time, pointer, engaged * (1 - morph));
  const target = eGraphNodes(width, height);
  const nodes = source.map((point, index) => ({
    x: mix(point.x, target[index].x, morph),
    y: mix(point.y, target[index].y, morph),
  }));
  const networkAlpha = 1 - smoothstep(.08, .72, morph);
  const classAlpha = smoothstep(.3, .94, morph);
  drawAdaptiveEdges(context, nodes, width, networkAlpha);
  drawEGraphScaffold(
    context,
    width,
    height,
    time,
    pointer,
    engaged,
    nodes,
    classAlpha,
  );
  const lutMode = engaged > .08 && pointer.y > height * .5;
  const selected = new Set(lutMode ? [3, 0, 17, 14, 24, 21] : [3, 0, 10, 7, 24, 21]);
  nodes.forEach((node, index) => {
    const active = selected.has(index);
    dot(
      context,
      node,
      mix(index % 7 === 0 ? 4 : 2.2, active ? 3.5 : 2.15, morph),
      active && classAlpha > .4 ? (lutMode ? FIELD : SIGNAL) : index % 3 === 0 ? TRACE : INK,
      active ? .9 : mix(.78, .5, morph),
    );
  });
  dot(context, pointer, 18 + engaged * 8, SIGNAL, engaged * networkAlpha * .08);
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
  context.strokeStyle = SIGNAL;
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

  dot(context, focus, 8, SIGNAL_MUTED, .92);
  dot(context, earth, 5, TRACE, .9);
  dot(context, mars, 4.5, SIGNAL, .9);
  dot(context, craft, 3.3, FIELD, 1);
  line(context, focus, craft, INK, .08);

  const tangent = {
    x: -Math.sin(angle) * 16,
    y: Math.cos(angle) * 10,
  };
  line(
    context,
    { x: craft.x - tangent.x, y: craft.y - tangent.y },
    { x: craft.x + tangent.x, y: craft.y + tangent.y },
    FIELD,
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
    { value: 25, color: SIGNAL, label: "FOCUS" },
    { value: 5, color: FIELD, label: "BREAK" },
    { value: 25, color: SIGNAL, label: "FOCUS" },
    { value: 15, color: SIGNAL_MUTED, label: "RESET" },
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
        context.fillStyle = SIGNAL;
        context.globalAlpha = .75;
        context.fillRect(node.x - 9, node.y - 2, 18 - index * 1.5, 4);
        context.restore();
      } else if (stageIndex === stages.length - 1) {
        context.save();
        context.fillStyle = FIELD;
        context.globalAlpha = .82;
        context.fillRect(node.x - 3, node.y - 11, 6, 22);
        context.restore();
      } else {
        dot(context, node, 3.2, stageIndex === 1 ? TRACE : INK, .78);
      }
    });
  });

  const sweepX = mix(width * .08, width * .91, sweep);
  line(context, { x: sweepX, y: height * .18 }, { x: sweepX, y: height * .82 }, SIGNAL_MUTED, .46);
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
  context.strokeStyle = SIGNAL;
  context.globalAlpha = .55;
  context.beginPath();
  context.moveTo(gate + 15, height * .15);
  context.lineTo(gate - 15, height * .85);
  context.stroke();
  context.restore();

  const colors = [FIELD, SIGNAL, TRACE];
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

type CanvasLayer = {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
};

function drawSignalState(
  signal: Signal,
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
  pointer: Point,
  engaged: number,
) {
  if (signal === "field") drawAdaptiveField(context, width, height, time, pointer, engaged);
  if (signal === "datapath") drawDatapath(context, width, height, time, pointer, engaged);
  if (signal === "orbit") drawOrbitTransfer(context, width, height, time, pointer, engaged);
  if (signal === "timer") drawFocusPhases(context, width, height, time, pointer, engaged);
  if (signal === "compiler") drawCompiler(context, width, height, time, pointer, engaged);
  if (signal === "market") drawMarketFilter(context, width, height, time, pointer, engaged);
}

function signalPoints(
  signal: Signal,
  width: number,
  height: number,
  time: number,
  pointer: Point,
  engaged: number,
) {
  if (signal === "field") {
    return adaptiveNodes(width, height, time, pointer, engaged);
  }

  if (signal === "datapath") {
    return eGraphNodes(width, height);
  }

  if (signal === "orbit") {
    const unit = Math.min(width, height);
    const focus = { x: width * .39, y: height * .52 };
    const inner = unit * .18;
    const outer = unit * .34;
    const semiMajor = (inner + outer) / 2;
    const semiMinor = Math.sqrt(inner * outer);
    const centerX = focus.x + (outer - inner) / 2;
    return Array.from({ length: 28 }, (_, index) => {
      if (index < 10) {
        const angle = index / 10 * Math.PI * 2 + time * .025;
        return {
          x: focus.x + Math.cos(angle) * inner,
          y: focus.y + Math.sin(angle) * inner,
        };
      }
      if (index < 20) {
        const angle = (index - 10) / 10 * Math.PI * 2 - time * .018;
        return {
          x: focus.x + Math.cos(angle) * outer,
          y: focus.y + Math.sin(angle) * outer,
        };
      }
      const angle = Math.PI + (index - 20) / 7 * Math.PI;
      return {
        x: centerX + Math.cos(angle) * semiMajor,
        y: focus.y + Math.sin(angle) * semiMinor,
      };
    });
  }

  if (signal === "timer") {
    const center = { x: width * .5, y: height * .45 };
    const radius = Math.min(width, height) * .24;
    return Array.from({ length: 28 }, (_, index) => {
      const angle = index / 28 * Math.PI * 2 - Math.PI / 2;
      return {
        x: center.x + Math.cos(angle) * radius,
        y: center.y + Math.sin(angle) * radius,
      };
    });
  }

  if (signal === "compiler") {
    const stages = [.12, .37, .62, .87];
    return Array.from({ length: 28 }, (_, index) => {
      const stage = Math.floor(index / 7);
      const row = index % 7;
      const span = height * (.52 - stage * .07);
      return {
        x: stages[stage] * width,
        y: height * .5 - span / 2 + row / 6 * span,
      };
    });
  }

  return Array.from({ length: 28 }, (_, index) => {
    const trace = Math.floor(index / 7);
    const sample = index % 7;
    const progress = sample / 6;
    return {
      x: mix(width * .08, width * .62, progress),
      y:
        height * (.25 + trace * .16) +
        Math.sin(progress * 7 + trace * 1.3 + time * .16) * (8 + trace * 2),
    };
  });
}

function drawCalibrationBridge(
  context: CanvasRenderingContext2D,
  sourceLayer: CanvasLayer,
  targetLayer: CanvasLayer,
  source: Signal,
  target: Signal,
  width: number,
  height: number,
  time: number,
  pointer: Point,
  engaged: number,
  progress: number,
) {
  sourceLayer.context.clearRect(0, 0, width, height);
  targetLayer.context.clearRect(0, 0, width, height);
  drawSignalState(source, sourceLayer.context, width, height, time, pointer, engaged);
  drawSignalState(target, targetLayer.context, width, height, time, pointer, engaged * progress);

  const collapse = smoothstep(.06, .48, progress);
  const reveal = smoothstep(.52, .94, progress);
  const sourceHeight = Math.max(.5, height * (1 - collapse));
  const revealHeight = height * reveal;

  if (collapse < 1) {
    context.save();
    context.globalAlpha = 1 - smoothstep(.34, .5, progress);
    context.drawImage(
      sourceLayer.canvas,
      0,
      0,
      sourceLayer.canvas.width,
      sourceLayer.canvas.height,
      0,
      height * .5 - sourceHeight * .5,
      width,
      sourceHeight,
    );
    context.restore();
  }

  if (reveal > 0) {
    context.save();
    context.beginPath();
    context.rect(0, height * .5 - revealHeight * .5, width, revealHeight);
    context.clip();
    context.globalAlpha = smoothstep(.52, .74, progress);
    context.drawImage(
      targetLayer.canvas,
      0,
      0,
      targetLayer.canvas.width,
      targetLayer.canvas.height,
      0,
      0,
      width,
      height,
    );
    context.restore();
  }

  const lineAlpha = Math.pow(Math.sin(progress * Math.PI), .7);
  const angle = mix(0, target === "orbit" ? -.075 : .045, progress);
  context.save();
  context.translate(width * .5, height * .5);
  context.rotate(angle);
  line(
    context,
    { x: -width * .42, y: 0 },
    { x: width * .42, y: 0 },
    INK,
    lineAlpha * .55,
    1,
  );
  line(
    context,
    { x: -width * .16, y: -2 },
    { x: width * .12, y: -2 },
    SIGNAL,
    lineAlpha * .9,
    2,
  );
  line(
    context,
    { x: width * .12, y: 2 },
    { x: width * .31, y: 2 },
    FIELD,
    lineAlpha * .85,
    2,
  );
  for (let tick = -4; tick <= 4; tick += 1) {
    line(
      context,
      { x: tick * width * .08, y: -4 },
      { x: tick * width * .08, y: 4 },
      INK,
      lineAlpha * .25,
    );
  }
  context.restore();
}

function drawOrbitTimerMorph(
  context: CanvasRenderingContext2D,
  sourceLayer: CanvasLayer,
  targetLayer: CanvasLayer,
  width: number,
  height: number,
  time: number,
  pointer: Point,
  engaged: number,
  progress: number,
) {
  sourceLayer.context.clearRect(0, 0, width, height);
  targetLayer.context.clearRect(0, 0, width, height);
  drawSignalState("orbit", sourceLayer.context, width, height, time, pointer, engaged);
  drawSignalState("timer", targetLayer.context, width, height, time, pointer, engaged * progress);

  context.save();
  context.globalAlpha = 1 - smoothstep(.04, .38, progress);
  context.drawImage(
    sourceLayer.canvas,
    0,
    0,
    sourceLayer.canvas.width,
    sourceLayer.canvas.height,
    0,
    0,
    width,
    height,
  );
  context.globalAlpha = smoothstep(.62, .96, progress);
  context.drawImage(
    targetLayer.canvas,
    0,
    0,
    targetLayer.canvas.width,
    targetLayer.canvas.height,
    0,
    0,
    width,
    height,
  );
  context.restore();

  const source = signalPoints("orbit", width, height, time, pointer, engaged);
  const center = { x: width * .5, y: height * .45 };
  const radius = Math.min(width, height) * .24;
  const target = source.map((point, index) => {
    const fallbackAngle = index / source.length * Math.PI * 2 - Math.PI / 2;
    const distance = Math.hypot(point.x - center.x, point.y - center.y);
    const angle = distance > 2
      ? Math.atan2(point.y - center.y, point.x - center.x)
      : fallbackAngle;
    return {
      x: center.x + Math.cos(angle) * radius,
      y: center.y + Math.sin(angle) * radius,
    };
  });
  const nodes = source.map((point, index) => ({
    x: mix(point.x, target[index].x, progress),
    y: mix(point.y, target[index].y, progress),
  }));
  const alpha = Math.pow(Math.sin(progress * Math.PI), .5);
  const groups = [
    { start: 0, end: 10, closed: true },
    { start: 10, end: 20, closed: true },
    { start: 20, end: 28, closed: false },
  ];

  groups.forEach((group, groupIndex) => {
    for (let index = group.start; index < group.end - 1; index += 1) {
      line(context, nodes[index], nodes[index + 1], INK, alpha * .24);
    }
    if (group.closed) {
      line(context, nodes[group.end - 1], nodes[group.start], INK, alpha * .24);
    }
    nodes.slice(group.start, group.end).forEach((node, localIndex) => {
      const color = localIndex === 0
        ? [SIGNAL, FIELD, SIGNAL_MUTED][groupIndex]
        : INK;
      dot(context, node, localIndex === 0 ? 3.6 : 2, color, alpha * .78);
    });
  });
}

function drawCompilerMarketMorph(
  context: CanvasRenderingContext2D,
  sourceLayer: CanvasLayer,
  targetLayer: CanvasLayer,
  width: number,
  height: number,
  time: number,
  pointer: Point,
  engaged: number,
  progress: number,
) {
  sourceLayer.context.clearRect(0, 0, width, height);
  targetLayer.context.clearRect(0, 0, width, height);
  drawSignalState("compiler", sourceLayer.context, width, height, time, pointer, engaged);
  drawSignalState("market", targetLayer.context, width, height, time, pointer, engaged * progress);

  context.save();
  context.globalAlpha = 1 - smoothstep(.04, .38, progress);
  context.drawImage(
    sourceLayer.canvas,
    0,
    0,
    sourceLayer.canvas.width,
    sourceLayer.canvas.height,
    0,
    0,
    width,
    height,
  );
  context.globalAlpha = smoothstep(.62, .96, progress);
  context.drawImage(
    targetLayer.canvas,
    0,
    0,
    targetLayer.canvas.width,
    targetLayer.canvas.height,
    0,
    0,
    width,
    height,
  );
  context.restore();

  const source = signalPoints("compiler", width, height, time, pointer, engaged);
  const target = signalPoints("market", width, height, time, pointer, engaged);
  const nodes = source.map((point, index) => ({
    x: mix(point.x, target[index].x, progress),
    y: mix(point.y, target[index].y, progress),
  }));
  const alpha = Math.pow(Math.sin(progress * Math.PI), .5);
  const colors = [SIGNAL, FIELD, TRACE, INK];

  for (let group = 0; group < 4; group += 1) {
    const start = group * 7;
    for (let index = start; index < start + 6; index += 1) {
      line(context, nodes[index], nodes[index + 1], colors[group], alpha * .5, group === 3 ? 1 : 1.35);
    }
    nodes.slice(start, start + 7).forEach((node, index) => {
      dot(
        context,
        node,
        index === 0 || index === 6 ? 3.2 : 1.9,
        colors[group],
        alpha * .82,
      );
    });
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
    const sourceLayerCanvas = document.createElement("canvas");
    const targetLayerCanvas = document.createElement("canvas");
    const sourceLayerContext = sourceLayerCanvas.getContext("2d");
    const targetLayerContext = targetLayerCanvas.getContext("2d");
    if (!sourceLayerContext || !targetLayerContext) return;
    const sourceLayer = { canvas: sourceLayerCanvas, context: sourceLayerContext };
    const targetLayer = { canvas: targetLayerCanvas, context: targetLayerContext };
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
      [sourceLayer, targetLayer].forEach((layer) => {
        layer.canvas.width = Math.round(width * ratio);
        layer.canvas.height = Math.round(height * ratio);
        layer.context.setTransform(ratio, 0, 0, ratio, 0, 0);
      });
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
        drawTransferFieldMorph(
          context,
          width,
          height,
          time,
          pointer,
          pointer.engaged,
          reduced ? 0 : smoothstep(.48, .98, localProgress),
        );
      }
      const transition = reduced ? 0 : smoothstep(.48, .98, localProgress);
      if (signal === "field") {
        drawFieldEGraphMorph(
          context,
          width,
          height,
          time,
          pointer,
          pointer.engaged,
          transition,
        );
      }
      if (signal === "datapath") {
        drawCalibrationBridge(
          context,
          sourceLayer,
          targetLayer,
          "datapath",
          "orbit",
          width,
          height,
          time,
          pointer,
          pointer.engaged,
          transition,
        );
      }
      if (signal === "orbit") {
        drawOrbitTimerMorph(
          context,
          sourceLayer,
          targetLayer,
          width,
          height,
          time,
          pointer,
          pointer.engaged,
          transition,
        );
      }
      if (signal === "timer") {
        drawCalibrationBridge(
          context,
          sourceLayer,
          targetLayer,
          "timer",
          "compiler",
          width,
          height,
          time,
          pointer,
          pointer.engaged,
          transition,
        );
      }
      if (signal === "compiler") {
        drawCompilerMarketMorph(
          context,
          sourceLayer,
          targetLayer,
          width,
          height,
          time,
          pointer,
          pointer.engaged,
          transition,
        );
      }
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
