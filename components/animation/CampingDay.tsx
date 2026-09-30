"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { Pause, Play, RotateCcw, VolumeX } from "lucide-react";
const clamp = (v: number) => Math.max(0, Math.min(1, v));
const phase = (t: number, start: number, end: number) =>
  clamp((t - start) / (end - start));
const mix = (a: number, b: number, p: number) => a + (b - a) * p;
const smooth = (p: number) => p * p * (3 - 2 * p);
function color(a: string, b: string, p: number) {
  const n = (s: string, i: number) => parseInt(s.slice(i, i + 2), 16);
  return (
    "#" +
    [1, 3, 5]
      .map((i) =>
        Math.round(mix(n(a, i), n(b, i), p))
          .toString(16)
          .padStart(2, "0"),
      )
      .join("")
  );
}
const chapters = [
  { from: 0, label: "Ankommen. Der Alltag bleibt zurück." },
  { from: 4, label: "Zu zweit lässt es sich leichter tragen." },
  { from: 7, label: "Ein Stück Stoff wird ein Zuhause." },
  { from: 12, label: "Zwei Stühle. Und alle Zeit der Welt." },
  { from: 15, label: "Ein kleines Licht für den Abend." },
  { from: 18, label: "Der Tag geht. Die Ruhe bleibt." },
  { from: 22, label: "Deine Auszeit wartet." },
];
type Point = { x: number; y: number };
function along(a: Point, b: Point, p: number): Point {
  return { x: mix(a.x, b.x, smooth(p)), y: mix(a.y, b.y, smooth(p)) };
}
function Character({
  x,
  y,
  female,
  walk,
  kneel,
  raise,
  sit,
  carry,
  night,
  scale = 1,
}: {
  x: number;
  y: number;
  female: boolean;
  walk: number;
  kneel: number;
  raise: number;
  sit: number;
  carry: number;
  night: number;
  scale?: number;
}) {
  const skin = color("#d8a579", "#a57e6a", night * 0.5),
    shirt = female ? "#c78053" : "#e4d3a9";
  const bob = walk ? Math.sin(walk * 2) * 1.6 : 0;
  const lean = kneel * 26;
  const torsoY = -58 + kneel * 23 + sit * 8;
  const headY = torsoY - 15;
  const handY = torsoY + 15 - raise * 31 - carry * 6;
  const legSwing = Math.sin(walk) * 12 * (1 - sit) * (1 - kneel);
  return (
    <g
      transform={`translate(${x} ${y + bob}) scale(${scale})`}
      className={female ? "camper woman" : "camper man"}
    >
      <ellipse cx="0" cy="1" rx="22" ry="5" fill="#192f29" opacity=".14" />
      <path
        d={`M -7 ${torsoY + 26} L ${-9 + legSwing + sit * 15} ${-15 + sit * 1} L ${-11 + legSwing + sit * 23} -1 M 7 ${torsoY + 26} L ${9 - legSwing + sit * 15} ${-15 + sit * 2} L ${10 - legSwing + sit * 25} -1`}
        fill="none"
        stroke={female ? "#3d554c" : "#4e6054"}
        strokeWidth="10"
        strokeLinecap="round"
      />
      <path
        d={`M ${-11 + legSwing + sit * 23} -1 l 9 0 M ${10 - legSwing + sit * 25} -1 l 8 0`}
        stroke="#293c36"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <g transform={`rotate(${lean} 0 ${torsoY + 20})`}>
        <path
          d={`M -10 ${torsoY} Q 0 ${torsoY - 5} 10 ${torsoY} L 13 ${torsoY + 27} Q 0 ${torsoY + 33} -13 ${torsoY + 27} Z`}
          fill={color(shirt, "#546668", night * 0.35)}
        />
        <path
          d={`M -9 ${torsoY + 3} L -19 ${torsoY + 14 - raise * 9} L ${-20 - carry * 9} ${handY} M 9 ${torsoY + 3} L 20 ${torsoY + 15 - raise * 9} L ${24 + carry * 6} ${handY}`}
          fill="none"
          stroke={skin}
          strokeWidth="6"
          strokeLinecap="round"
        />
        <rect x="-3" y={torsoY - 7} width="6" height="9" rx="2" fill={skin} />
        {female && (
          <path
            d={`M -11 ${headY - 5} Q -15 ${headY + 8} -9 ${headY + 17} L 12 ${headY + 15} Q 16 ${headY + 4} 9 ${headY - 6}`}
            fill="#18231f"
          />
        )}
        <ellipse cy={headY} rx="10" ry="12" fill={skin} />
        <path
          d={
            female
              ? `M -11 ${headY} Q -15 ${headY - 15} 0 ${headY - 15} Q 14 ${headY - 15} 11 ${headY + 2} L 5 ${headY - 7} Q -3 ${headY - 2} -11 ${headY}`
              : `M -10 ${headY - 2} L -10 ${headY - 9} Q 0 ${headY - 19} 11 ${headY - 8} L 10 ${headY - 2} Q 3 ${headY - 9} -4 ${headY - 5} Z`
          }
          fill="#141c19"
        />
        <circle cx="4" cy={headY} r="1" fill="#263329" opacity={1 - sit} />
        <ellipse cy={headY - 2} rx="10" ry="10" fill="#141c19" opacity={sit} />
      </g>
    </g>
  );
}
function Chair({
  x,
  y,
  unfold = 1,
  opacity = 1,
  scale = 1,
}: {
  x: number;
  y: number;
  unfold?: number;
  opacity?: number;
  scale?: number;
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} opacity={opacity}>
      <ellipse cy="3" rx="28" ry="6" fill="#253d31" opacity=".12" />
      <g transform={`scale(${mix(0.22, 1, unfold)} 1)`}>
        <path
          d="M-22-55 16 0 M19-51-16 0 M-20-25 25-25"
          stroke="#b49265"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
        />
        <path d="m-24-55 34-4 8 30-33 5Z" fill="#e4d9ba" />
        <path d="m-15-24 32-5 9 9-31 5Z" fill="#c9bf9d" />
        <path
          d="M-26-33 1-37 M9-37 28-35"
          stroke="#bd9d72"
          strokeWidth="5"
          strokeLinecap="round"
        />
      </g>
    </g>
  );
}
function Scene({
  t,
  mobile,
  fireMode,
}: {
  t: number;
  mobile: boolean;
  fireMode: boolean;
}) {
  const W = mobile ? 640 : 1000,
    H = mobile ? 800 : 560;
  const horizon = mobile ? 360 : 260;
  const night = smooth(phase(t, 17, 22));
  const dusk = Math.sin(phase(t, 13, 22) * Math.PI);
  const sky = color(color("#e9ddbc", "#e6ae82", dusk * 0.6), "#172d42", night);
  const grass = color("#7c9165", "#324b48", night);
  const lake = color("#9baea0", "#354e62", night);
  const van = { x: mobile ? 40 : 95, y: mobile ? 510 : 424 };
  const vanScale = mobile ? 0.78 : 1;
  const door = { x: van.x + 130 * vanScale, y: van.y };
  const tent = { x: mobile ? 345 : 513, y: mobile ? 585 : 440 };
  const chairA = { x: mobile ? 270 : 698, y: mobile ? 712 : 475 },
    chairB = { x: mobile ? 454 : 863, y: mobile ? 703 : 466 };
  const fire = { x: mobile ? 365 : 784, y: mobile ? 724 : 478 };
  const tentA = { x: tent.x - 72, y: tent.y + 5 },
    tentB = { x: tent.x + 105, y: tent.y + 7 };
  function person(female: boolean) {
    const exit = phase(t, female ? 4.65 : 4.15, female ? 5.35 : 4.85);
    const toTent = phase(t, female ? 5.6 : 5.1, female ? 7.2 : 6.8);
    let p = along(door, female ? tentB : tentA, toTent);
    let walking = toTent > 0 && toTent < 1 ? t * 12 : 0;
    let carry = phase(t, 4.8, 5.3) * (1 - phase(t, 7, 7.6));
    let kneel = phase(t, 7.1, 7.6) * (1 - phase(t, 8.3, 8.7));
    let raise = phase(t, 8.6, 9.8) * (1 - phase(t, 11.1, 11.8));
    const home = female ? chairB : chairA;
    if (t >= 12 && t < 15) {
      const v = phase(t, female ? 12.3 : 12, female ? 14.2 : 13.9);
      p = along(female ? tentB : tentA, home, v);
      walking = v > 0 && v < 1 ? t * 12 : 0;
      carry = 1 - phase(t, female ? 14.1 : 13.8, female ? 14.9 : 14.6);
    }
    if (t >= 15) {
      p = { ...home };
      carry = 0;
      if (!female) {
        const go = phase(t, 15, 15.6);
        const back = phase(t, 17.1, 18.3);
        p = along(home, { x: fire.x - 30, y: fire.y - 4 }, go);
        if (back > 0) p = along({ x: fire.x - 30, y: fire.y - 4 }, home, back);
        walking = (go > 0 && go < 1) || (back > 0 && back < 1) ? t * 12 : 0;
        kneel = phase(t, 15.5, 15.9) * (1 - phase(t, 16.9, 17.3));
        raise = 0;
      }
    }
    const sit = phase(t, female ? 18.2 : 19, female ? 19.1 : 19.8);
    return { p, walking, carry, kneel, raise, sit, exit };
  }
  const a = person(false),
    b = person(true);
  const built = smooth(phase(t, 8.8, 11.9));
  const tarp = phase(t, 7.2, 8.2);
  const poles = phase(t, 8.2, 10.3);
  const drive = smooth(phase(t, 0, 3.6));
  const vanX = mix(-400, van.x, drive);
  const bounce =
    t > 3.6 && t < 4
      ? Math.sin((t - 3.6) * 20) * (1 - phase(t, 3.6, 4)) * 3
      : 0;
  const tree = (x: number, y: number, s: number, key: string) => (
    <g key={key} transform={`translate(${x} ${y}) scale(${s})`}>
      <path
        d="M0 0 4-128 M2-55-30-83 M3-70 32-100"
        stroke={color("#65714e", "#263c3c", night)}
        strokeWidth="7"
        fill="none"
      />
      <g fill={color("#657d56", "#263f3e", night)}>
        <ellipse cx="-22" cy="-95" rx="33" ry="41" />
        <ellipse cx="17" cy="-126" rx="35" ry="42" />
        <ellipse cx="37" cy="-80" rx="34" ry="42" />
      </g>
    </g>
  );
  return (
    <svg
      className="camping-scene"
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-label={`Eine illustrierte Campinggeschichte: Ein cremefarbenes Wohnmobil, ein schwarzhaariges Paar, ein gemeinsam aufgebautes Zelt und zwei Stühle am See. Am Abend wird ${fireMode ? "ein Feuer" : "eine Laterne"} entzündet und der Mond steigt auf.`}
      data-time={t.toFixed(2)}
      data-layout={mobile ? "mobile" : "desktop"}
    >
      <defs>
        <linearGradient id="scene-sky" x2="0" y2="1">
          <stop stopColor={sky} />
          <stop offset="1" stopColor={color("#f4e7c6", "#536778", night)} />
        </linearGradient>
        <linearGradient id="scene-water" x2="0" y2="1">
          <stop stopColor={lake} />
          <stop offset="1" stopColor={color("#768f83", "#263f50", night)} />
        </linearGradient>
        <radialGradient id="fire-glow">
          <stop stopColor="#efbc6b" stopOpacity=".46" />
          <stop offset="1" stopColor="#efbc6b" stopOpacity="0" />
        </radialGradient>
        <filter id="scene-grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency=".65"
            numOctaves="2"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
          <feComponentTransfer>
            <feFuncA type="linear" slope=".035" />
          </feComponentTransfer>
          <feBlend in="SourceGraphic" mode="soft-light" />
        </filter>
      </defs>
      <rect width={W} height={H} fill="url(#scene-sky)" />
      <g className="sun" opacity={1 - phase(t, 18, 21)}>
        <circle
          cx={mix(W * 0.64, W * 1.02, phase(t, 0, 21))}
          cy={mix(100, horizon + 40, Math.pow(phase(t, 0, 21), 2))}
          r="35"
          fill="#fbdb98"
        />
        <circle
          cx={mix(W * 0.64, W * 1.02, phase(t, 0, 21))}
          cy={mix(100, horizon + 40, Math.pow(phase(t, 0, 21), 2))}
          r="46"
          fill="#fbdb98"
          opacity=".1"
        />
      </g>
      <g className="stars" opacity={phase(t, 20, 23)} fill="#f5eed5">
        {Array.from({ length: 24 }, (_, i) => (
          <circle
            key={i}
            cx={(i * 137 + 53) % W}
            cy={25 + ((i * 47) % (horizon - 80))}
            r={i % 3 === 0 ? 1.8 : 1}
            opacity={0.4 + (i % 4) * 0.15}
          />
        ))}
      </g>
      <g
        className="moon"
        transform={`translate(${mix(W * 0.95, W * 0.71, phase(t, 18, 24))} ${mix(horizon + 25, 80, Math.sin((phase(t, 18, 24) * Math.PI) / 2))})`}
        opacity={phase(t, 18.5, 20.2)}
      >
        <path d="M12-23A26 26 0 1 0 19 21A29 29 0 0 1 12-23Z" fill="#f5ebce" />
      </g>
      <path
        d={`M0 ${horizon - 35} Q ${W * 0.13} ${horizon - 110} ${W * 0.29} ${horizon - 40} T ${W * 0.62} ${horizon - 62} T ${W} ${horizon - 42} V${horizon + 50}H0Z`}
        fill={color("#839174", "#334d50", night)}
      />
      <path
        d={`M0 ${horizon - 9} Q ${W * 0.18} ${horizon - 57} ${W * 0.35} ${horizon - 13} T ${W * 0.76} ${horizon - 23} T${W} ${horizon - 18} V${horizon + 70}H0Z`}
        fill={color("#596f58", "#294246", night)}
      />
      <rect
        y={horizon}
        width={W}
        height={H - horizon}
        fill="url(#scene-water)"
      />
      {Array.from({ length: 15 }, (_, i) => (
        <path
          key={i}
          d={`M${((i * 173) % W) + Math.sin(t * 0.5 + i) * 7} ${horizon + 15 + i * 8} h${30 + (i % 4) * 32}`}
          stroke={color("#d1d3b4", "#72918f", night)}
          strokeWidth={i % 3 === 0 ? 2 : 1}
          opacity=".35"
        />
      ))}
      <path
        d={`M0 ${horizon + 115}Q${W * 0.2} ${horizon + 64} ${W * 0.53} ${horizon + 123}T${W} ${horizon + 97}V${H}H0Z`}
        fill={grass}
      />
      <path
        d={`M0 ${horizon + 170} Q${W * 0.3} ${horizon + 125} ${W * 0.68} ${horizon + 191} T${W} ${horizon + 163}V${H}H0Z`}
        fill={color("#8a9a6d", "#3a524a", night)}
      />
      {tree(20, horizon + 148, 1.5, "left")}
      {tree(W - 18, horizon + 128, 1.4, "right")}
      {tree(W - 60, horizon + 115, 0.7, "right-small")}
      <g
        className="van"
        transform={`translate(${vanX} ${van.y + bounce}) scale(${vanScale})`}
      >
        <ellipse
          cx="128"
          cy="3"
          rx="151"
          ry="16"
          fill="#273d30"
          opacity=".18"
        />
        <path
          d="M-12-117Q-12-134 7-135H170L207-100H234Q249-100 256-73L272-26V-6H-12Z"
          fill={color("#f0e3c2", "#9eaba3", night * 0.6)}
          stroke="#788174"
          strokeWidth="1.5"
        />
        <path
          d="M-12-117 8-139H180L209-109 207-100 170-130H6Z"
          fill="#faf0d7"
        />
        <path
          d="M177-106H204L230-69H178Z"
          fill={color("#799e9f", "#334f61", night)}
        />
        <path d="M233-86 243-74 253-40H238Z" fill="#65888b" />
        <rect
          x="9"
          y="-116"
          width="75"
          height="45"
          rx="6"
          fill={color("#7e9d97", "#2a4753", night)}
        />
        <path d="M47-113V-74" stroke="#ced4b7" strokeWidth="3" />
        <path d="M-12-48H264V-35H-12Z" fill="#a39c73" />
        <path d="M-12-33H267V-27H-12Z" fill="#506858" />
        <rect
          x="112"
          y="-113"
          width="39"
          height="103"
          rx="5"
          fill="#ded4b6"
          stroke="#909c87"
        />
        <rect x="118" y="-103" width="27" height="27" rx="3" fill="#7b9891" />
        <path d="M117-59h6" stroke="#6f7863" strokeWidth="3" />
        <g
          transform={`translate(151 -113) scale(${1 - phase(t, 4, 4.6) * (1 - phase(t, 6.5, 7)) * 0.85} 1)`}
        >
          <rect
            x="-39"
            width="39"
            height="103"
            rx="5"
            fill="#e8debf"
            stroke="#909c87"
          />
          <rect x="-33" y="10" width="27" height="27" rx="3" fill="#7b9891" />
          <path d="M-34 54h6" stroke="#6f7863" strokeWidth="3" />
        </g>
        {[40, 214].map((x) => (
          <g
            key={x}
            transform={`translate(${x} -5) rotate(${((vanX + 400) / (25 * vanScale)) * (180 / Math.PI)})`}
          >
            <circle r="25" fill="#283c36" />
            <circle r="14" fill="#b2b7a5" />
            <circle r="7" fill="#6b7d70" />
            <path d="M0-11V11M-11 0H11" stroke="#dee0c8" strokeWidth="2" />
          </g>
        ))}
        <rect x="256" y="-33" width="14" height="9" rx="2" fill="#f0d79d" />
        <path
          d="M-15-7H272"
          stroke="#657866"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <path
          d="M15-139H142"
          stroke="#78897b"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </g>
      <g className="tent" transform={`translate(${tent.x} ${tent.y})`}>
        <ellipse cy="7" rx="130" ry="18" fill="#23392d" opacity={tarp * 0.2} />
        <path
          d={`M${-100 * tarp} 0 ${-63 * tarp} -15 ${108 * tarp} -9 ${127 * tarp} 13Z`}
          fill="#9ba580"
          opacity={tarp}
        />
        <path
          d={`M-82 1 L${-28} ${-126 * poles} L90 1 M-28 ${-126 * poles} L36 ${-130 * poles} L126 7`}
          fill="none"
          stroke="#c6b999"
          strokeWidth="4"
          opacity={poles}
        />
        <path
          d={`M-98 4 -29 ${-133 * built} 39 ${-137 * built} 130 10 49 17Z`}
          fill={color("#8d9b67", "#5f7260", night)}
          opacity={phase(t, 8.8, 9.3)}
        />
        <path
          d={`M-98 4 -29 ${-133 * built} 50 17Z`}
          fill={color("#657b50", "#415c4e", night)}
          opacity={built}
        />
        <path
          d={`M-62 3 -27 ${-103 * built} 20 12Z`}
          fill={color("#384f3d", "#233e36", night)}
          opacity={built}
        />
        <path
          d={`M-62 3 -27 ${-103 * built} -11 9Z`}
          fill="#b5b490"
          opacity={built * 0.9}
        />
        <path
          d={`M-29 ${-133 * built} -147 20 M39 ${-137 * built} 166 24`}
          stroke="#c2bb93"
          strokeWidth="1.5"
          opacity={built}
        />
        <path
          d="M-151 16-146 25M162 20l5 9"
          stroke="#4c6149"
          strokeWidth="3"
          opacity={built}
        />
        <path
          d={`M-29 ${-132 * built} 50 17 130 10`}
          fill="none"
          stroke="#a5b085"
          strokeWidth="2"
          opacity={built}
        />
      </g>
      {[a, b].map((p, i) => {
        const start = i ? 12.3 : 12;
        const stop = i ? 14.2 : 13.9;
        const end = i ? chairB : chairA;
        return (
          t >= start && (
            <Chair
              key={i}
              x={t < stop ? p.p.x + 29 : end.x}
              y={t < stop ? p.p.y - 18 : end.y}
              unfold={phase(t, stop, stop + 0.6)}
              opacity={phase(t, start, start + 0.2)}
            />
          )
        );
      })}
      <g className="fireplace" transform={`translate(${fire.x} ${fire.y})`}>
        <ellipse rx="28" ry="10" fill="#6a7259" />
        {[-25, -12, 0, 13, 25].map((x, i) => (
          <ellipse
            key={x}
            cx={x}
            cy={Math.abs(x) * 0.18}
            rx="8"
            ry="5"
            fill={i % 2 ? "#adb096" : "#8c9980"}
          />
        ))}
        <path
          d="M-16 4 16-7M-15-6 17 5"
          stroke="#63523d"
          strokeWidth="7"
          strokeLinecap="round"
        />
        <g opacity={phase(t, 16.2, 16.6)}>
          <ellipse
            cy="-2"
            rx="105"
            ry="70"
            fill="url(#fire-glow)"
            opacity={0.4 + night * 0.6}
          />
          {fireMode ? (
            <g
              transform={`scale(${1 + Math.sin(t * 11) * 0.045} ${1 + Math.sin(t * 15) * 0.06})`}
            >
              <path
                d="M-17-4Q-28-24-8-34Q-11-48 3-62Q0-40 14-33Q32-15 16-3Z"
                fill="#d98c41"
              />
              <path
                d="M-10-4Q-18-18-2-32Q-3-42 3-43Q9-26 11-17Q14-7 9-4Z"
                fill="#f0c16b"
              />
              <path d="M-5-3Q-8-15 3-23Q10-11 4-3Z" fill="#ffe4a1" />
            </g>
          ) : (
            <g>
              <path d="M-13-7V-41H13V-7Z" fill="#e5c986" />
              <rect
                x="-17"
                y="-10"
                width="34"
                height="8"
                rx="2"
                fill="#29483a"
              />
              <path
                d="M-16-42H16M-9-43v-9q9-10 18 0v9"
                stroke="#29483a"
                fill="none"
                strokeWidth="5"
              />
            </g>
          )}
        </g>
      </g>
      <g opacity={a.exit}>
        <Character
          x={a.p.x}
          y={a.p.y}
          female={false}
          walk={a.walking}
          kneel={a.kneel}
          raise={a.raise}
          sit={a.sit}
          carry={a.carry}
          night={night}
          scale={mobile ? 1.2 : 1}
        />
      </g>
      <g opacity={b.exit}>
        <Character
          x={b.p.x}
          y={b.p.y}
          female
          walk={b.walking}
          kneel={b.kneel}
          raise={b.raise}
          sit={b.sit}
          carry={b.carry}
          night={night}
          scale={mobile ? 1.2 : 1}
        />
      </g>
      {t >= 4.8 && t < 7.7 && (
        <g opacity={1 - phase(t, 7.1, 7.7)}>
          <g transform={`translate(${a.p.x + 25} ${a.p.y - 40})`}>
            <rect x="-7" y="-7" width="45" height="14" rx="7" fill="#7c895e" />
            <path d="M3-7V7M25-7V7" stroke="#d0c49b" strokeWidth="3" />
          </g>
          <path
            d={`M${b.p.x - 28} ${b.p.y - 34} l48-16 m-46 12 46-10`}
            stroke="#b7b597"
            strokeWidth="3"
          />
        </g>
      )}
      {t > 15.5 && t < 16.6 && (
        <path
          d={`M${a.p.x + 18} ${a.p.y - 19}L${fire.x - 4} ${fire.y - 18}`}
          stroke="#e4c396"
          strokeWidth="2"
        />
      )}
      <g fill={color("#5f794f", "#233e37", night)} opacity=".7">
        {Array.from({ length: 19 }, (_, i) => {
          const x = (i * 163 + 18) % W;
          const y = H - 15 - (i % 4) * 13;
          return (
            <path
              key={i}
              d={`M${x} ${y}q-9-18-10-21q12 8 12 19q2-19 11-26q-3 21-11 28Z`}
            />
          );
        })}
      </g>
      <rect
        width={W}
        height={H}
        fill="transparent"
        filter="url(#scene-grain)"
        pointerEvents="none"
      />
    </svg>
  );
}
export default function CampingDay() {
  const root = useRef<HTMLDivElement>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);
  const timeRef = useRef({ t: 0 });
  const userPaused = useRef(false);
  const inView = useRef(false);
  const [time, setTime] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [fireMode, setFireMode] = useState(true);
  useEffect(() => {
    const media = window.matchMedia("(max-width: 760px)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const responsive = () => setMobile(media.matches);
    responsive();
    media.addEventListener("change", responsive);
    const configure = () => {
      timeline.current?.kill();
      setReduced(reduce.matches);
      if (reduce.matches) {
        setTime(24);
        timeRef.current.t = 24;
        setPlaying(false);
        return;
      }
      timeRef.current.t = 0;
      setTime(0);
      timeline.current = gsap
        .timeline({
          paused: true,
          onUpdate: () => setTime(Math.round(timeRef.current.t * 30) / 30),
          onComplete: () => setPlaying(false),
        })
        .to(timeRef.current, { t: 24, duration: 24, ease: "none" });
      if (inView.current && !userPaused.current) {
        timeline.current.play();
        setPlaying(true);
      }
    };
    configure();
    reduce.addEventListener("change", configure);
    const observer = new IntersectionObserver(
      ([entry]) => {
        inView.current = entry.isIntersecting;
        if (reduce.matches) return;
        if (
          entry.isIntersecting &&
          !userPaused.current &&
          timeRef.current.t < 24
        ) {
          timeline.current?.play();
          setPlaying(true);
        } else {
          timeline.current?.pause();
          setPlaying(false);
        }
      },
      { threshold: 0.25 },
    );
    if (root.current) observer.observe(root.current);
    const visibility = () => {
      if (document.hidden) {
        timeline.current?.pause();
        setPlaying(false);
      } else if (
        inView.current &&
        !userPaused.current &&
        !reduce.matches &&
        timeRef.current.t < 24
      ) {
        timeline.current?.play();
        setPlaying(true);
      }
    };
    document.addEventListener("visibilitychange", visibility);
    return () => {
      observer.disconnect();
      timeline.current?.kill();
      media.removeEventListener("change", responsive);
      reduce.removeEventListener("change", configure);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, []);
  const chapter =
    [...chapters].reverse().find((c) => time >= c.from) ?? chapters[0];
  function toggle() {
    if (playing) {
      timeline.current?.pause();
      userPaused.current = true;
      setPlaying(false);
    } else {
      if (time >= 24) timeline.current?.restart();
      else timeline.current?.play();
      userPaused.current = false;
      setPlaying(true);
    }
  }
  function restart() {
    userPaused.current = false;
    timeline.current?.restart();
    setPlaying(true);
  }
  return (
    <div className="camping-film" ref={root}>
      <div className="scene-wrap">
        <Scene t={time} mobile={mobile} fireMode={fireMode} />
        <div
          className="scene-tag"
          style={{ color: time > 20 ? "#f5f1e8" : "#213f34" }}
        >
          <span>Ein Tag am See</span>
          <span>ILLUSTRIERTE CAMPINGGESCHICHTE</span>
        </div>
        <span className="scene-clock">
          {time < 18 ? "Nachmittag" : time < 22 ? "Abendlicht" : "Blaue Stunde"}
        </span>
      </div>
      <div className="film-controls">
        <div className="film-caption" aria-live="polite">
          {chapter.label}
        </div>
        <div className="playback">
          {!reduced && (
            <>
              <button
                type="button"
                onClick={toggle}
                aria-label={
                  playing
                    ? "Animation pausieren"
                    : time >= 24
                      ? "Animation erneut abspielen"
                      : "Animation abspielen"
                }
              >
                {playing ? <Pause size={17} /> : <Play size={17} />}
              </button>
              <button
                type="button"
                onClick={restart}
                aria-label="Noch einmal ansehen"
              >
                <RotateCcw size={17} />
              </button>
              <span>{String(Math.floor(time)).padStart(2, "0")} / 24 s</span>
            </>
          )}
          <VolumeX size={16} aria-label="Ohne Ton" />
          {reduced && <span>Statisches Abendmotiv · reduzierte Bewegung</span>}
        </div>
      </div>
      <div
        className="film-progress"
        role="progressbar"
        aria-label="Fortschritt der Campinganimation"
        aria-valuemin={0}
        aria-valuemax={24}
        aria-valuenow={Math.floor(time)}
      >
        <span style={{ width: `${(time / 24) * 100}%` }} />
      </div>
      <div className="film-note">
        <p>
          Kreative Szene, keine Platzdarstellung. Die Feuerregel ist noch
          ungeklärt.
        </p>
        <button type="button" onClick={() => setFireMode(!fireMode)}>
          {fireMode
            ? "Alternative mit Laterne ansehen"
            : "Feuer-Konzept ansehen"}
        </button>
      </div>
    </div>
  );
}
