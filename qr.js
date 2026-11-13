// Shared QR renderer for the proposal pages (index.html, fluid/). Needs qrcode-generator loaded first.
window.AssanQR = (() => {
  // AssanPay mark (viewBox 0 0 375 375), same path data as ReceiptRenderer.ReceiptLogoPath.
  const LOGO_PATH = "M 167.390625 134.894531 L 208.511719 206.113281 L 247.480469 138.648438 L 206.355469 67.429688 L 128.421875 67.429688 L 55.011719 194.597656 L 26.027344 244.835938 C 24.148438 248.039062 25.261719 252.179688 28.496094 254.023438 C 31.699219 255.902344 35.839844 254.789062 37.71875 251.550781 L 46.035156 237.148438 C 47.878906 233.945312 52.019531 232.832031 55.253906 234.675781 C 58.453125 236.519531 59.566406 240.695312 57.722656 243.898438 L 41.859375 271.382812 C 40.015625 274.585938 41.09375 278.722656 44.328125 280.601562 C 47.53125 282.445312 51.667969 281.332031 53.546875 278.132812 L 79.746094 232.730469 C 81.589844 229.527344 85.730469 228.414062 88.96875 230.257812 C 92.167969 232.136719 93.28125 236.277344 91.4375 239.480469 L 86.984375 247.203125 L 57.96875 297.40625 C 56.125 300.644531 57.238281 304.785156 60.4375 306.628906 C 63.671875 308.507812 67.8125 307.394531 69.65625 304.15625 L 98.675781 253.953125 Z M 207.609375 240.070312 L 166.484375 168.851562 L 127.550781 236.3125 L 168.675781 307.53125 L 246.578125 307.53125 L 319.988281 180.367188 L 349.003906 130.160156 C 350.847656 126.925781 349.734375 122.785156 346.535156 120.941406 C 343.300781 119.0625 339.160156 120.175781 337.316406 123.410156 L 328.964844 137.816406 C 327.121094 141.050781 322.980469 142.164062 319.78125 140.285156 C 316.542969 138.441406 315.429688 134.300781 317.308594 131.066406 L 333.140625 103.613281 C 335.019531 100.378906 333.90625 96.238281 330.667969 94.394531 C 327.46875 92.515625 323.328125 93.628906 321.484375 96.863281 L 295.285156 142.234375 C 293.40625 145.433594 289.265625 146.546875 286.066406 144.703125 C 282.832031 142.859375 281.714844 138.683594 283.59375 135.484375 L 288.050781 127.761719 L 317.03125 77.554688 C 318.875 74.320312 317.761719 70.179688 314.5625 68.335938 C 311.359375 66.492188 307.183594 67.570312 305.339844 70.804688 L 276.359375 121.011719 Z M 334.324219 88.0625 C 331.296875 86.289062 330.253906 82.390625 331.992188 79.363281 C 333.765625 76.300781 337.664062 75.257812 340.722656 77.03125 C 343.75 78.773438 344.796875 82.667969 343.054688 85.730469 C 341.28125 88.757812 337.382812 89.800781 334.324219 88.0625 Z M 349.179688 116.347656 C 346.117188 114.609375 345.074219 110.710938 346.847656 107.648438 C 348.585938 104.589844 352.484375 103.542969 355.546875 105.320312 C 358.574219 107.09375 359.617188 110.992188 357.878906 114.015625 C 356.101562 117.078125 352.207031 118.121094 349.179688 116.347656 Z M 40.675781 286.902344 C 43.738281 288.675781 44.78125 292.570312 43.007812 295.632812 C 41.230469 298.660156 37.335938 299.703125 34.308594 297.964844 C 31.246094 296.191406 30.203125 292.292969 31.976562 289.230469 C 33.71875 286.203125 37.613281 285.160156 40.675781 286.902344 Z M 25.855469 258.613281 C 28.878906 260.390625 29.925781 264.285156 28.183594 267.3125 C 26.410156 270.375 22.515625 271.417969 19.488281 269.644531 C 16.425781 267.902344 15.382812 264.007812 17.15625 260.945312 C 18.894531 257.882812 22.792969 256.839844 25.855469 258.613281 Z";

  // Theme colours. ink1/ink2 = data modules, eye/eyeCore = finder and alignment patterns, pale = faint texture.
  const THEMES = {
    assanpay:  { name: "AssanPay",              ink1: "#5a3818", ink2: "#b8651e", eye: "#251200", eyeCore: "#b8651e", pale: "#eedbc6", logo: "#e09145" },
    assanInk:  { name: "AssanPay · Ink",        ink1: "#251200", ink2: "#5a3818", eye: "#251200", eyeCore: "#e09145", pale: "#eedbc6", logo: "#e09145" },
    assanWarm: { name: "AssanPay · Warm",       ink1: "#8a4a12", ink2: "#5a3818", eye: "#5a3818", eyeCore: "#b8651e", pale: "#f6d6b4", logo: "#e09145" },
    fluidMono: { name: "Fluid · Black & white", style: "fluid", ink1: "#111418", ink2: "#111418", eye: "#111418", eyeCore: "#111418", pale: "#ffffff", logo: "#e09145" },
    ringsMono: { name: "Rings · Black & white", style: "rings", ink1: "#000000", ink2: "#000000", eye: "#000000", eyeCore: "#000000", pale: "#ffffff", logo: "#e09145" },
    dotsMono:  { name: "Dots · Black & white",  style: "dots",  ink1: "#000000", ink2: "#000000", eye: "#000000", eyeCore: "#000000", pale: "#ffffff", logo: "#e09145" },
    teal:      { name: "Teal (reference)",      ink1: "#1f6b73", ink2: "#4f6670", eye: "#1f6b73", eyeCore: "#1f6b73", pale: "#c8d7dc", logo: "#e09145" },
  };
  // Alignment pattern centres per QR version (1–15).
  const ALIGN = [[],[],[6,18],[6,22],[6,26],[6,30],[6,34],[6,22,38],[6,24,42],[6,26,46],[6,28,50],[6,30,54],[6,32,58],[6,34,62],[6,26,46,66],[6,26,48,70]];


  function mulberry32(a) {
    return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  }
  function hash(s) { let h = 2166136261; for (const ch of s) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; }

  function matrix(text, ecc) {
    const q = qrcode(0, ecc);
    q.addData(text);
    q.make();
    const n = q.getModuleCount();
    const m = [];
    for (let r = 0; r < n; r++) { m.push([]); for (let c = 0; c < n; c++) m[r].push(q.isDark(r, c)); }
    return m;
  }

  function flowerPath(cx, cy, R, petals, depth) {
    let d = "";
    const steps = 96;
    for (let i = 0; i <= steps; i++) {
      const t = (i / steps) * Math.PI * 2;
      const r = R * (1 - depth + depth * Math.cos(petals * t) ** 2);
      d += (i ? "L" : "M") + (cx + r * Math.cos(t)).toFixed(2) + " " + (cy + r * Math.sin(t)).toFixed(2);
    }
    return d + "Z";
  }
  function hexPath(cx, cy, r) {
    let d = "";
    for (let i = 0; i < 6; i++) { const a = Math.PI / 6 + i * Math.PI / 3; d += (i ? "L" : "M") + (cx + r * Math.cos(a)).toFixed(2) + " " + (cy + r * Math.sin(a)).toFixed(2); }
    return d + "Z";
  }

  function render(text, theme, opts = {}) {
    const logo = !!opts.logo;
    // "dots": every dark module is its own round dot, with rounded-square eyes and no texture.
    const dots = opts.style === "dots";
    // "rings": small spaced-out dots with round bullseye eyes, no texture.
    const rings = opts.style === "rings";
    // "fluid": neighbouring modules melt into one shape, with rounded outer corners and filleted inner corners.
    const fluid = opts.style === "fluid";
    const plain = dots || rings || fluid;
    const m = matrix(text, logo ? "H" : "Q");
    const n = m.length, S = 10, QZ = 4, size = (n + QZ * 2) * S;
    const rnd = mulberry32(hash(text) + (opts.salt || 0));
    const off = QZ * S;
    const version = (n - 17) / 4;
    const parts = [];

    const isFinder = (r, c) => (r < 7 && c < 7) || (r < 7 && c >= n - 7) || (r >= n - 7 && c < 7);

    // Centre logo clearing. ECC H tolerates ~30% loss; we clear ~7%.
    // A rounded square whose corner radius matches the eyes' outer corner (2.3 of 7). It stays clear of the
    // format info next to the eyes; a code too small for that gets no logo.
    const mid = (n - 1) / 2;
    const lr = Math.min(Math.round(n * 0.13), mid - 9);
    const hasLogo = logo && lr >= 3;
    const half = lr + 0.5, corner = 2 * half * (2.3 / 7), innerEdge = half - corner;
    // Module cleared when its centre is inside the rounded square. Nothing is drawn behind the logo (no white shape,
    // no clip): the clearing is just the absence of modules, so the logo sits on the QR's own background.
    const inLogo = (r, c) => {
      if (!hasLogo) return false;
      const dr = Math.abs(r - mid), dc = Math.abs(c - mid);
      if (dr > lr || dc > lr) return false;
      const ex = Math.max(0, dr - innerEdge), ey = Math.max(0, dc - innerEdge);
      return ex * ex + ey * ey < corner * corner;
    };
    const inLogoCorner = (r, c) => Math.abs(r - mid) + 0.5 > innerEdge && Math.abs(c - mid) + 0.5 > innerEdge;

    const alignCells = [], align = [];
    const ap = ALIGN[version] || [];
    for (const ar of ap) for (const ac of ap) {
      if ((ar === 6 && ac === 6) || (ar === 6 && ac === ap[ap.length - 1]) || (ar === ap[ap.length - 1] && ac === 6)) continue;
      alignCells.push([ar, ac]);
      if (!inLogo(ar, ac)) align.push([ar, ac]); // an alignment pattern under the logo is left out
    }
    const isAlign = (r, c) => alignCells.some(([ar, ac]) => Math.abs(r - ar) <= 2 && Math.abs(c - ac) <= 2);

    // White backdrop across the whole image, for every theme.
    parts.push(`<rect width="${size}" height="${size}" fill="#ffffff"/>`);

    // Faint light-module texture (AssanPay theme style only)
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) {
      if (plain || m[r][c] || isFinder(r, c) || isAlign(r, c) || inLogo(r, c)) continue;
      if (rnd() < 0.55) {
        const s = S * (0.28 + rnd() * 0.22);
        parts.push(`<rect x="${(off + c * S + (S - s) / 2).toFixed(1)}" y="${(off + r * S + (S - s) / 2).toFixed(1)}" width="${s.toFixed(1)}" height="${s.toFixed(1)}" rx="1" fill="${theme.pale}"/>`);
      }
    }

    // Data modules → bars / dots
    const used = m.map(row => row.map(() => false));
    const free = (r, c) => r >= 0 && c >= 0 && r < n && c < n && m[r][c] && !used[r][c] && !isFinder(r, c) && !isAlign(r, c) && !inLogo(r, c);
    const g = S * 0.15, w = S - 2 * g;
    if (fluid) {
      const D = (r, c) => r >= 0 && c >= 0 && r < n && c < n && m[r][c] && !isFinder(r, c) && !isAlign(r, c) && !inLogo(r, c);
      const R = S * 0.5, F = S * 0.3;
      let d = "";
      for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) {
        const x = off + c * S, y = off + r * S;
        if (D(r, c)) {
          used[r][c] = true;
          // A corner is rounded only when both sides touching it are open. Straight sides of the logo clearing count
          // as closed (modules keep a flat edge there); its rounded corners count as open, so modules there round off
          // and follow the curve.
          const DL = (rr, cc) => D(rr, cc) || (inLogo(rr, cc) && !inLogoCorner(rr, cc));
          const up = DL(r - 1, c), dn = DL(r + 1, c), lf = DL(r, c - 1), rt = DL(r, c + 1);
          const tl = !up && !lf ? R : 0, tr = !up && !rt ? R : 0, br = !dn && !rt ? R : 0, bl = !dn && !lf ? R : 0;
          d += `M${x + tl} ${y}H${x + S - tr}A${tr} ${tr} 0 0 1 ${x + S} ${y + tr}V${y + S - br}A${br} ${br} 0 0 1 ${x + S - br} ${y + S}H${x + bl}A${bl} ${bl} 0 0 1 ${x} ${y + S - bl}V${y + tl}A${tl} ${tl} 0 0 1 ${x + tl} ${y}Z`;
        } else if (!isFinder(r, c) && !isAlign(r, c) && !inLogo(r, c)) {
          // Fillet the inside corner of an L-shape so it curves instead of meeting at a sharp angle.
          for (const [dr, dc] of [[-1, -1], [-1, 1], [1, -1], [1, 1]]) {
            if (!(D(r + dr, c) && D(r, c + dc) && D(r + dr, c + dc))) continue;
            const cx = x + (dc > 0 ? S : 0), cy = y + (dr > 0 ? S : 0), sx = -dc, sy = -dr;
            d += `M${cx} ${cy}L${cx + sx * F} ${cy}A${F} ${F} 0 0 ${sx * sy > 0 ? 0 : 1} ${cx} ${cy + sy * F}Z`;
          }
        }
      }
      parts.push(`<path d="${d}" fill="${theme.ink1}"/>`);
    }
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) {
      if (!free(r, c)) continue;
      if (plain) {
        used[r][c] = true;
        parts.push(`<circle cx="${off + c * S + S / 2}" cy="${off + r * S + S / 2}" r="${S * (rings ? 0.36 : 0.46)}" fill="${theme.ink1}"/>`);
        continue;
      }
      let h = 1; while (free(r, c + h) && h < 5) h++;
      let v = 1; while (free(r + v, c) && v < 5) v++;
      const color = rnd() < 0.62 ? theme.ink1 : theme.ink2;
      const preferH = h > v || (h === v && rnd() < 0.5);
      if (preferH && h > 1) {
        for (let k = 0; k < h; k++) used[r][c + k] = true;
        parts.push(`<rect x="${off + c * S + g}" y="${off + r * S + g}" width="${h * S - 2 * g}" height="${w}" rx="${w / 2}" fill="${color}"/>`);
      } else if (v > 1) {
        for (let k = 0; k < v; k++) used[r + k][c] = true;
        parts.push(`<rect x="${off + c * S + g}" y="${off + r * S + g}" width="${w}" height="${v * S - 2 * g}" rx="${w / 2}" fill="${color}"/>`);
      } else {
        used[r][c] = true;
        const cx = off + c * S + S / 2, cy = off + r * S + S / 2, roll = rnd();
        if (roll < 0.12) parts.push(`<path d="${hexPath(cx, cy, S * 0.52)}" fill="${color}"/>`);
        else if (roll < 0.2) parts.push(`<path d="M${cx - S * .32} ${cy - S * .32}L${cx + S * .32} ${cy + S * .32}M${cx + S * .32} ${cy - S * .32}L${cx - S * .32} ${cy + S * .32}" stroke="${color}" stroke-width="${S * .3}" stroke-linecap="round"/>`);
        else parts.push(`<circle cx="${cx}" cy="${cy}" r="${S * 0.42}" fill="${color}"/>`);
      }
    }

    // Finder eyes
    for (const [fr, fc] of [[0, 0], [0, n - 7], [n - 7, 0]]) {
      const cx = off + (fc + 3.5) * S, cy = off + (fr + 3.5) * S;
      if (dots || fluid) {
        const x = off + fc * S, y = off + fr * S;
        parts.push(`<rect x="${x + S / 2}" y="${y + S / 2}" width="${6 * S}" height="${6 * S}" rx="${S * 1.8}" fill="none" stroke="${theme.eye}" stroke-width="${S}"/>`);
        parts.push(`<rect x="${x + 2 * S}" y="${y + 2 * S}" width="${3 * S}" height="${3 * S}" rx="${S * 0.9}" fill="${theme.eyeCore}"/>`);
        continue;
      }
      if (rings) {
        parts.push(`<circle cx="${cx}" cy="${cy}" r="${3 * S}" fill="none" stroke="${theme.eye}" stroke-width="${S * 1.05}"/>`);
        parts.push(`<circle cx="${cx}" cy="${cy}" r="${S * 1.55}" fill="${theme.eyeCore}"/>`);
        continue;
      }
      parts.push(`<circle cx="${cx}" cy="${cy}" r="${3 * S}" fill="none" stroke="${theme.eye}" stroke-width="${S * 1.05}"/>`);
      parts.push(`<path d="${flowerPath(cx, cy, S * 1.62, 4, 0.12)}" fill="${theme.eyeCore}"/>`);
    }
    // Alignment patterns
    for (const [ar, ac] of align) {
      const cx = off + (ac + 0.5) * S, cy = off + (ar + 0.5) * S;
      if (dots || fluid) {
        parts.push(`<rect x="${cx - 2 * S}" y="${cy - 2 * S}" width="${4 * S}" height="${4 * S}" rx="${S * 1.2}" fill="none" stroke="${theme.eye}" stroke-width="${S}"/>`);
        parts.push(`<circle cx="${cx}" cy="${cy}" r="${S * 0.5}" fill="${theme.eyeCore}"/>`);
        continue;
      }
      if (rings) {
        parts.push(`<circle cx="${cx}" cy="${cy}" r="${2 * S}" fill="none" stroke="${theme.eye}" stroke-width="${S * 0.95}"/>`);
        parts.push(`<circle cx="${cx}" cy="${cy}" r="${S * 0.5}" fill="${theme.eyeCore}"/>`);
        continue;
      }
      parts.push(`<circle cx="${cx}" cy="${cy}" r="${2 * S}" fill="none" stroke="${theme.ink2}" stroke-width="${S * 0.95}"/>`);
      parts.push(`<path d="${hexPath(cx, cy, S * 0.6)}" fill="${theme.ink1}"/>`);
    }
    // Logo: the AssanPay mark at 92% of the clearing, with nothing behind it.
    if (hasLogo) {
      const cx = off + (mid + 0.5) * S, cy = cx, H = half * S;
      const L = 2 * H * 0.92;
      parts.push(`<svg x="${(cx - L / 2).toFixed(2)}" y="${(cy - L / 2).toFixed(2)}" width="${L.toFixed(2)}" height="${L.toFixed(2)}" viewBox="0 0 375 375"><path fill="${theme.logo}" fill-rule="evenodd" d="${LOGO_PATH}"/></svg>`);
    }
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" role="img" aria-label="QR code">${parts.join("")}</svg>`;
  }

  function renderPlain(text) {
    const m = matrix(text, "Q"), n = m.length, QZ = 4, size = n + QZ * 2;
    let d = "";
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (m[r][c]) d += `M${c + QZ} ${r + QZ}h1v1h-1z`;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" shape-rendering="crispEdges"><rect width="${size}" height="${size}" fill="#fff"/><path d="${d}" fill="#000"/></svg>`;
  }

  // Saves an SVG string as .svg, or rasterised to a 1024 px .png.
  function download(svg, name) {
    if (!svg) return;
    if (name.endsWith(".svg")) {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }));
      a.download = name; a.click();
      return;
    }
    const img = new Image();
    img.onload = () => {
      const cv = document.createElement("canvas");
      cv.width = cv.height = 1024;
      cv.getContext("2d").drawImage(img, 0, 0, 1024, 1024);
      const a = document.createElement("a");
      a.href = cv.toDataURL("image/png"); a.download = name; a.click();
    };
    img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
  }

  return { THEMES, render, renderPlain, download };
})();
