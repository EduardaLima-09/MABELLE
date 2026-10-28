/*
 * Modelo do protótipo de provador virtual (Canvas).
 *
 * Todas as funções são puras e testadas em tests/tryOnVisual.model.test.js
 * com os pixels reais de LaceFrontLivia.jpg (fixture tests/fixtures/livia-quarter.json).
 *
 * Escopo desta etapa (Opção A autorizada): somente a COR é recolorida de
 * verdade. Comprimento e textura ficam desabilitados na interface porque os
 * assets existentes não permitem alterá-los no mesmo modelo.
 */

/* Cores do provador — mesmos tons usados no Provador atual (Provador.jsx). */
export const TRYON_VISUAL_COLORS = ['preto', 'castanho', 'mel', 'platinado']

export const COLOR_TARGETS = {
  preto: [36, 16, 23], // #241017
  castanho: [91, 58, 41], // #5b3a29
  mel: [176, 125, 63], // #b07d3f
  platinado: [221, 214, 204], // #ddd6cc
}

export const TRYON_VISUAL_LENGTHS = ['curto', 'médio', 'longo']
export const TRYON_VISUAL_TEXTURES = ['liso', 'ondulado', 'cacheado', 'crespo']

/* Foto-base do protótipo (sem transparência; a máscara é derivada em runtime). */
export const BASE_IMAGE_RELATIVE_PATH =
  'src/assets/produtos/lace-front/LaceFrontLivia.jpg'

/*
 * Regras de segmentação do cabelo.
 *
 * Valores calibrados com os pixels reais da foto-base (fixture
 * tests/fixtures/livia-quarter.json) e verificados por métricas nos testes:
 * - fundo bege: saturação 0.21–0.27 e valor 0.75–0.85 (mais claro que o cabelo);
 * - cabelo dourado: saturação 0.48–0.71, valor ≤ 0.74, matiz 18°–46°;
 * - pele do rosto/peito: excluída pelas formas abaixo (matiz≈ 20°).
 */
export const FACE_ELLIPSE = { cx: 0.5, cy: 0.27, rx: 0.12, ry: 0.15 }
export const CENTER_BODY = { x0: 0.365, y0: 0.32, x1: 0.635, y1: 1 }

export const HAIR_GATE = {
  minSat: 0.42, // saturação mínima (descarta fundo bege)
  maxVal: 0.74, // valor máximo (fundo é mais claro que o cabelo)
  minHue: 18, // matiz quente (descarta roupa vinho)
  maxHue: 46,
  minGB: 28, // G - B mínimo (descarta pele do ombro)
  minComponentFraction: 0.001, // descarta speckles < 0.1% dos pixels
}

export function luminance(r, g, b) {
  return 0.299 * r + 0.587 * g + 0.114 * b
}

function toHsv(r, g, b) {
  const rn = r / 255
  const gn = g / 255
  const bn = b / 255
  const max = Math.max(rn, gn, bn)
  const min = Math.min(rn, gn, bn)
  const d = max - min
  let hue = 0
  if (d > 0) {
    if (max === rn) hue = ((gn - bn) / d) % 6
    else if (max === gn) hue = (bn - rn) / d + 2
    else hue = (rn - gn) / d + 4
    hue *= 60
    if (hue < 0) hue += 360
  }
  return { hue, sat: max === 0 ? 0 : d / max, val: max }
}

function inFaceEllipse(nx, ny) {
  const dx = (nx - FACE_ELLIPSE.cx) / FACE_ELLIPSE.rx
  const dy = (ny - FACE_ELLIPSE.cy) / FACE_ELLIPSE.ry
  return dx * dx + dy * dy <= 1
}

function inCenterBody(nx, ny) {
  return (
    nx >= CENTER_BODY.x0 &&
    nx <= CENTER_BODY.x1 &&
    ny >= CENTER_BODY.y0 &&
    ny <= CENTER_BODY.y1
  )
}

/* true quando o ponto normalizado está em região protegida (rosto/peito). */
export function isProtected(nx, ny) {
  return inFaceEllipse(nx, ny) || inCenterBody(nx, ny)
}

/*
 * Constrói a máscara do cabelo (Float32 0..1, um valor por pixel) a partir
 * dos pixels RGB(A) da foto. Passo único por pixel, sem dependências.
 */
export function buildHairMask(pixels, width, height, stride = 3) {
  const mask = new Float32Array(width * height)

  for (let y = 0; y < height; y++) {
    const ny = y / (height - 1)
    for (let x = 0; x < width; x++) {
      const i = y * width + x
      const p = i * stride
      const r = pixels[p]
      const g = pixels[p + 1]
      const b = pixels[p + 2]

      if (!(r > g && g > b)) continue // tons quentes apenas
      const { hue, sat, val } = toHsv(r, g, b)
      if (sat < HAIR_GATE.minSat) continue // fundo bege tem saturação baixa
      if (val > HAIR_GATE.maxVal) continue // fundo é mais claro que o cabelo
      if (hue < HAIR_GATE.minHue || hue > HAIR_GATE.maxHue) continue
      if (g - b < HAIR_GATE.minGB) continue // pele do ombro tem G-B menor
      if (isProtected(x / (width - 1), ny)) continue // rosto e peito

      mask[i] = 1
    }
  }
  return dropSmallComponents(mask, width, height)
}

/*
 * Remove componentes conexos pequenos (speckles de ruído). Mantém apenas
 * blobs ≥ minComponentFraction dos pixels — no caso da foto-base, as duas
 * cortinas laterais do cabelo concentram >97% da cobertura.
 */
export function dropSmallComponents(mask, width, height, minFraction) {
  const minSize = Math.max(
    8,
    Math.round(width * height * (minFraction ?? HAIR_GATE.minComponentFraction))
  )
  const labels = new Int32Array(mask.length).fill(-1)
  const stack = []
  let label = 0

  for (let start = 0; start < mask.length; start++) {
    if (mask[start] <= 0 || labels[start] >= 0) continue
    label++
    let size = 0
    stack.length = 0
    stack.push(start)
    labels[start] = label
    while (stack.length > 0) {
      const cur = stack.pop()
      size++
      const x = cur % width
      const y = (cur / width) | 0
      const neighbors = []
      if (x > 0) neighbors.push(cur - 1)
      if (x < width - 1) neighbors.push(cur + 1)
      if (y > 0) neighbors.push(cur - width)
      if (y < height - 1) neighbors.push(cur + width)
      for (const nb of neighbors) {
        if (mask[nb] > 0 && labels[nb] < 0) {
          labels[nb] = label
          stack.push(nb)
        }
      }
    }
    if (size < minSize) {
      for (let i = 0; i < labels.length; i++) {
        if (labels[i] === label) mask[i] = 0
      }
    }
  }
  return mask
}

/*
 * Suaviza as bordas da máscara (feather) com média móvel horizontal e
 * vertical, em duas passadas. Retorna Float32 0..1.
 */
export function featherMask(mask, width, height, radius) {
  const r = Math.max(1, Math.round(radius))
  const horizontal = new Float32Array(mask.length)
  const output = new Float32Array(mask.length)

  for (let y = 0; y < height; y++) {
    const row = y * width
    for (let x = 0; x < width; x++) {
      let sum = 0
      let count = 0
      for (let k = -r; k <= r; k++) {
        const xx = x + k
        if (xx < 0 || xx >= width) continue
        sum += mask[row + xx]
        count++
      }
      horizontal[row + x] = sum / count
    }
  }

  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      let sum = 0
      let count = 0
      for (let k = -r; k <= r; k++) {
        const yy = y + k
        if (yy < 0 || yy >= height) continue
        sum += horizontal[yy * width + x]
        count++
      }
      output[y * width + x] = sum / count
    }
  }
  return output
}

/*
 * LUT de fatores por luminância: preserva a estrutura de brilhos/sombras do
 * cabelo original aplicando um fator sobre a cor alvo.
 * - tons escuros (preto/castanho): fator vai de 0.45 até até 1.6;
 * - tons claros (platinado): o fator máximo é limitado para não estourar 255.
 */
export function buildColorLut(targetRgb) {
  const maxChannel = Math.max(targetRgb[0], targetRgb[1], targetRgb[2])
  const fMax = Math.min(1.6, 248 / maxChannel)
  const lut = new Float32Array(256)
  for (let luma = 0; luma < 256; luma++) {
    lut[luma] = 0.45 + (fMax - 0.45) * (luma / 255)
  }
  return lut
}

/*
 * Monta a camada RGBA do cabelo: cópia dos pixels originais com alpha igual
 * à máscara (bordas suaves) e RGB recolorido pela cor escolhida.
 * O alpha do rosto/fundo nunca é alterado — eles permanecem na foto-base.
 */
export function buildHairLayer(originalData, mask, color, width, height) {
  const target = COLOR_TARGETS[color]
  if (!target) throw new Error(`Cor desconhecida: ${color}`)
  const lut = buildColorLut(target)
  const out = new Uint8ClampedArray(originalData.length)

  for (let i = 0; i < mask.length; i++) {
    const p = i * 4
    const coverage = mask[i]
    out[p] = originalData[p]
    out[p + 1] = originalData[p + 1]
    out[p + 2] = originalData[p + 2]
    out[p + 3] = Math.round(coverage * 255)
    if (coverage <= 0) continue

    const luma = Math.round(
      luminance(originalData[p], originalData[p + 1], originalData[p + 2])
    )
    const factor = lut[luma]
    out[p] = target[0] * factor
    out[p + 1] = target[1] * factor
    out[p + 2] = target[2] * factor
  }
  return { data: out, width, height }
}

/*
 * Compara a máscara com regiões de referência da foto. Usado nos testes para
 * garantir que o fundo e o rosto permanecem fora da recoloração.
 */
export function maskStats(mask, width, height) {
  let covered = 0
  const corners = [
    [0, 0],
    [width - 20, 0],
    [0, height - 20],
    [width - 20, height - 20],
  ]
  let cornerCovered = 0
  let cornerTotal = 0

  for (let i = 0; i < mask.length; i++) {
    if (mask[i] > 0.5) covered++
  }

  for (const [x0, y0] of corners) {
    for (let y = y0; y < y0 + 20; y++) {
      for (let x = x0; x < x0 + 20; x++) {
        cornerTotal++
        if (mask[y * width + x] > 0.5) cornerCovered++
      }
    }
  }

  // Elipse do rosto, contraída 25% — nenhuma cobertura é esperada ali.
  let faceTotal = 0
  let faceCovered = 0
  for (let y = 0; y < height; y++) {
    const ny = y / (height - 1)
    for (let x = 0; x < width; x++) {
      const nx = x / (width - 1)
      const dx = (nx - FACE_ELLIPSE.cx) / (FACE_ELLIPSE.rx * 0.75)
      const dy = (ny - FACE_ELLIPSE.cy) / (FACE_ELLIPSE.ry * 0.75)
      if (dx * dx + dy * dy > 1) continue
      faceTotal++
      if (mask[y * width + x] > 0.5) faceCovered++
    }
  }

  return {
    coverage: covered / mask.length,
    cornerCoverage: cornerTotal ? cornerCovered / cornerTotal : 0,
    faceCoverage: faceTotal ? faceCovered / faceTotal : 0,
  }
}
