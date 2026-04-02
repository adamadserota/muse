/**
 * Canvas-based album cover compositor.
 * Overlays song title (top) and ADRIFT BEATS branding (bottom) on AI artwork.
 *
 * Bottom branding recreates the logo: dotted lines → waveform bars → "ADRIFT BEATS" text.
 * Fonts: Bitcount Single (title), Science Gothic (brand).
 */

const CANVAS_SIZE = 1400;

async function ensureFont(fontFamily: string, weight: string = "400"): Promise<void> {
    try {
        await document.fonts.load(`${weight} 48px "${fontFamily}"`);
    } catch {
        // Fallback silently
    }
}

// ---------------------------------------------------------------------------
// Waveform data — bar heights as proportions (0-1), sampled from the real logo
// Center is tallest, edges taper, with natural variation
// ---------------------------------------------------------------------------
const WAVEFORM_BARS = [
    // Left dotted section is handled separately
    // Main waveform bars (center section, ~60 bars)
    0.12, 0.18, 0.10, 0.22, 0.15, 0.28, 0.20, 0.35, 0.25, 0.40,
    0.30, 0.45, 0.35, 0.52, 0.42, 0.58, 0.48, 0.65, 0.55, 0.72,
    0.60, 0.78, 0.68, 0.85, 0.75, 0.92, 0.82, 0.95, 0.88, 1.00,
    0.95, 0.98, 0.90, 0.85, 0.92, 0.80, 0.88, 0.75, 0.82, 0.70,
    0.78, 0.62, 0.72, 0.55, 0.65, 0.48, 0.58, 0.42, 0.52, 0.35,
    0.45, 0.30, 0.40, 0.25, 0.35, 0.20, 0.28, 0.15, 0.22, 0.10,
];

/**
 * Draw the ADRIFT BEATS waveform — dotted lines on sides, bar waveform in center.
 */
function drawAdriftWaveform(
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    totalWidth: number,
) {
    const waveformWidth = totalWidth * 0.5; // Central waveform takes ~50% of total
    const barCount = WAVEFORM_BARS.length;
    const barWidth = 2.5;
    const barGap = (waveformWidth - barCount * barWidth) / (barCount - 1);
    const maxBarHeight = 70;

    // Glow effect for the waveform
    ctx.save();
    ctx.shadowColor = "rgba(51, 255, 255, 0.5)";
    ctx.shadowBlur = 12;

    // --- Dotted lines extending left and right ---
    const dotRadius = 1.2;
    const dotSpacing = 6;
    const sideWidth = (totalWidth - waveformWidth) / 2 - 10; // 10px gap
    ctx.fillStyle = "rgba(200, 220, 230, 0.5)";

    // Left dots
    const leftStart = cx - totalWidth / 2;
    for (let x = leftStart; x < leftStart + sideWidth; x += dotSpacing) {
        ctx.beginPath();
        ctx.arc(x, cy, dotRadius, 0, Math.PI * 2);
        ctx.fill();
    }

    // Right dots
    const rightStart = cx + totalWidth / 2 - sideWidth;
    for (let x = rightStart; x < cx + totalWidth / 2; x += dotSpacing) {
        ctx.beginPath();
        ctx.arc(x, cy, dotRadius, 0, Math.PI * 2);
        ctx.fill();
    }

    // --- Central waveform bars ---
    const waveStartX = cx - waveformWidth / 2;

    for (let i = 0; i < barCount; i++) {
        const proportion = WAVEFORM_BARS[i] ?? 0.5;
        const h = maxBarHeight * proportion;
        const x = waveStartX + i * (barWidth + barGap);

        // Color: brighter in center, subtle cyan tint at edges
        const t = Math.abs(i - barCount / 2) / (barCount / 2);
        const r = Math.round(200 + 55 * (1 - t));
        const g = Math.round(230 + 25 * (1 - t));
        const b = 255;
        const a = 0.7 + 0.3 * (1 - t);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;

        // Bars extend up and down from center line
        ctx.fillRect(x, cy - h / 2, barWidth, h);
    }

    ctx.restore();
}

/**
 * Draw "ADRIFT BEATS" brand text matching the logo style.
 */
function drawAdriftText(ctx: CanvasRenderingContext2D, cx: number, cy: number) {
    ctx.save();
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Outer glow
    ctx.shadowColor = "rgba(51, 255, 255, 0.35)";
    ctx.shadowBlur = 15;

    // Main text — wide, bold sci-fi font
    ctx.font = '900 42px "Science Gothic", "Arial Black", sans-serif';
    ctx.letterSpacing = "10px";

    // Subtle gradient: white top → slight cyan bottom
    const textGradient = ctx.createLinearGradient(0, cy - 20, 0, cy + 20);
    textGradient.addColorStop(0, "rgba(220, 240, 248, 0.95)");
    textGradient.addColorStop(0.5, "rgba(200, 235, 250, 0.9)");
    textGradient.addColorStop(1, "rgba(180, 225, 245, 0.85)");
    ctx.fillStyle = textGradient;

    ctx.fillText("ADRIFT BEATS", cx, cy);
    ctx.restore();
}

// ---------------------------------------------------------------------------
// Main compositor
// ---------------------------------------------------------------------------

export interface CompositeOptions {
    artworkBase64: string;
    mimeType: string;
    songTitle: string;
}

export async function compositeAlbumCover(options: CompositeOptions): Promise<string> {
    const { artworkBase64, mimeType, songTitle } = options;

    await Promise.all([
        ensureFont("Bitcount Single", "400"),
        ensureFont("Science Gothic", "900"),
    ]);

    const canvas = document.createElement("canvas");
    canvas.width = CANVAS_SIZE;
    canvas.height = CANVAS_SIZE;
    const ctx = canvas.getContext("2d")!;

    // --- Draw AI artwork as background ---
    const img = new Image();
    await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = reject;
        img.src = `data:${mimeType};base64,${artworkBase64}`;
    });
    ctx.drawImage(img, 0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // =====================================================================
    // TOP: Song Title
    // =====================================================================
    const topGradient = ctx.createLinearGradient(0, 0, 0, CANVAS_SIZE * 0.22);
    topGradient.addColorStop(0, "rgba(0, 0, 0, 0.55)");
    topGradient.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = topGradient;
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE * 0.22);

    const titleText = songTitle.toUpperCase();
    const titleY = CANVAS_SIZE * 0.09;

    ctx.save();
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Auto-size title to fit ~88% width
    let titleFontSize = 96;
    ctx.font = `400 ${titleFontSize}px "Bitcount Single", "Courier New", monospace`;
    while (ctx.measureText(titleText).width > CANVAS_SIZE * 0.88 && titleFontSize > 28) {
        titleFontSize -= 4;
        ctx.font = `400 ${titleFontSize}px "Bitcount Single", "Courier New", monospace`;
    }

    // Metallic silver gradient with slight texture
    const metalGrad = ctx.createLinearGradient(
        0,
        titleY - titleFontSize / 2,
        0,
        titleY + titleFontSize / 2,
    );
    metalGrad.addColorStop(0, "#E0E0E8");
    metalGrad.addColorStop(0.25, "#C4C4CC");
    metalGrad.addColorStop(0.5, "#F0F0F8");
    metalGrad.addColorStop(0.75, "#AAACB4");
    metalGrad.addColorStop(1, "#D0D0D8");

    // Drop shadow
    ctx.shadowColor = "rgba(0, 0, 0, 0.8)";
    ctx.shadowBlur = 6;
    ctx.shadowOffsetY = 3;
    ctx.fillStyle = metalGrad;
    ctx.fillText(titleText, CANVAS_SIZE / 2, titleY);

    // Slight glow pass
    ctx.shadowColor = "rgba(200, 210, 230, 0.25)";
    ctx.shadowBlur = 20;
    ctx.shadowOffsetY = 0;
    ctx.fillText(titleText, CANVAS_SIZE / 2, titleY);
    ctx.restore();

    // =====================================================================
    // BOTTOM: ADRIFT BEATS branding (waveform + text)
    // =====================================================================
    const bottomGradient = ctx.createLinearGradient(0, CANVAS_SIZE * 0.78, 0, CANVAS_SIZE);
    bottomGradient.addColorStop(0, "rgba(0, 0, 0, 0)");
    bottomGradient.addColorStop(0.4, "rgba(0, 0, 0, 0.35)");
    bottomGradient.addColorStop(1, "rgba(0, 0, 0, 0.7)");
    ctx.fillStyle = bottomGradient;
    ctx.fillRect(0, CANVAS_SIZE * 0.78, CANVAS_SIZE, CANVAS_SIZE * 0.22);

    // Waveform with dotted lines
    const waveformY = CANVAS_SIZE * 0.885;
    drawAdriftWaveform(ctx, CANVAS_SIZE / 2, waveformY, CANVAS_SIZE * 0.6);

    // "ADRIFT BEATS" text below waveform
    const brandY = CANVAS_SIZE * 0.955;
    drawAdriftText(ctx, CANVAS_SIZE / 2, brandY);

    return canvas.toDataURL("image/png");
}
