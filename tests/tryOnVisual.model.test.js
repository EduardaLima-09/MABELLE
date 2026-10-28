import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import {
  buildHairMask,
  buildHairLayer,
  featherMask,
  maskStats,
  isProtected,
  TRYON_VISUAL_COLORS,
  TRYON_VISUAL_LENGTHS,
  TRYON_VISUAL_TEXTURES,
  COLOR_TARGETS,
  BASE_IMAGE_RELATIVE_PATH,
} from '../src/model/tryOnVisual.js'

const fixture = JSON.parse(
  readFileSync(
    fileURLToPath(new URL('./fixtures/livia-quarter.json', import.meta.url)),
    'utf8'
  )
)
const { width, height, pixels } = fixture

const mask = buildHairMask(pixels, width, height, 3)
const stats = maskStats(mask, width, height)

/* Médias das cobertas apenas (para asserções de qualidade da segmentação). */
function coveredAverages(data, stride = 3) {
  let r = 0
  let g = 0
  let b = 0
  let count = 0
  for (let i = 0; i < mask.length; i++) {
    if (mask[i] <= 0.5) continue
    const p = i * stride
    r += data[p]
    g += data[p + 1]
    b += data[p + 2]
    count++
  }
  return { r: r / count, g: g / count, b: b / count, count }
}

const meanLuma = (avg) => 0.299 * avg.r + 0.587 * avg.g + 0.114 * avg.b

test('a máscara cobre uma área plausível de cabelo (8% a 35% da foto)', () => {
  assert.ok(
    stats.coverage >= 0.08 && stats.coverage <= 0.35,
    `coverage=${stats.coverage.toFixed(3)}`
  )
})

test('a máscara não cobre o fundo (cantos limpos)', () => {
  assert.equal(stats.cornerCoverage, 0)
})

test('a máscara não cobre o rosto (elipse contraída limpa)', () => {
  assert.equal(stats.faceCoverage, 0)
})

test('os pontos protegidos (rosto/peito) são excluídos pela geometria', () => {
  assert.equal(isProtected(0.5, 0.27), true) // centro do rosto
  assert.equal(isProtected(0.5, 0.6), true) // peito central
  assert.equal(isProtected(0.05, 0.05), false) // canto de fundo
})

test('os pixels cobertos são cabelo dourado (quente e claro), não pele/fundo', () => {
  const avg = coveredAverages(pixels)
  assert.ok(avg.count > 0, 'máscara vazia')
  assert.ok(
    avg.g - avg.b >= 32,
    `G-B médio=${(avg.g - avg.b).toFixed(1)} (esperado >= 32)`
  )
  assert.ok(
    meanLuma(avg) >= 100,
    // A média inclui raízes/sombras escuras do próprio cabelo.
    `luminância média=${meanLuma(avg).toFixed(1)} (esperado >= 100)`
  )
})

test('a máscara forma grandes massas contínuas (não está salpicada)', () => {
  const labels = new Int32Array(mask.length).fill(-1)
  const sizes = []
  const stack = []
  for (let start = 0; start < mask.length; start++) {
    if (mask[start] <= 0 || labels[start] >= 0) continue
    let size = 0
    stack.length = 0
    stack.push(start)
    labels[start] = 1
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
          labels[nb] = 1
          stack.push(nb)
        }
      }
    }
    sizes.push(size)
  }
  sizes.sort((a, b) => b - a)
  const total = sizes.reduce((sum, size) => sum + size, 0)
  const top2 = sizes.slice(0, 2).reduce((sum, size) => sum + size, 0)
  assert.ok(sizes.length <= 30, `componentes=${sizes.length}`)
  assert.ok(
    top2 / total >= 0.95,
    `top2=${((100 * top2) / total).toFixed(1)}% do coberto (esperado >= 95%)`
  )
})

test('a máscara suavizada (feather) preserva faixas intermediárias nas bordas', () => {
  const radius = Math.max(2, Math.round(width * 0.006))
  const soft = featherMask(mask, width, height, radius)
  let softCount = 0
  for (let i = 0; i < soft.length; i++) {
    assert.ok(soft[i] >= 0 && soft[i] <= 1)
    if (soft[i] > 0.02 && soft[i] < 0.98) softCount++
  }
  assert.ok(softCount > 100, `bordas suaves=${softCount}`)
})

test('as quatro cores do provador têm alvos definidos', () => {
  assert.deepEqual(TRYON_VISUAL_COLORS, [
    'preto',
    'castanho',
    'mel',
    'platinado',
  ])
  for (const color of TRYON_VISUAL_COLORS) {
    const target = COLOR_TARGETS[color]
    assert.ok(target && target.length === 3, `alvo ausente: ${color}`)
    for (const channel of target) {
      assert.ok(channel >= 0 && channel <= 255)
    }
  }
})

test('comprimento e textura continuam declarados (interface desabilitada)', () => {
  assert.deepEqual(TRYON_VISUAL_LENGTHS, ['curto', 'médio', 'longo'])
  assert.deepEqual(TRYON_VISUAL_TEXTURES, [
    'liso',
    'ondulado',
    'cacheado',
    'crespo',
  ])
})

test('a foto-base continua no projeto (arquivo real, não substituído)', () => {
  const path = fileURLToPath(
    new URL(`../${BASE_IMAGE_RELATIVE_PATH}`, import.meta.url)
  )
  const bytes = readFileSync(path)
  assert.ok(bytes.length > 100_000, 'foto-base ausente ou corrompida')
  // JPEG mágico
  assert.equal(bytes[0], 0xff)
  assert.equal(bytes[1], 0xd8)
})

test('buildHairLayer preserva alpha e pixels fora da máscara', () => {
  const rgba = new Uint8ClampedArray(width * height * 4)
  for (let i = 0; i < width * height; i++) {
    rgba[i * 4] = pixels[i * 3]
    rgba[i * 4 + 1] = pixels[i * 3 + 1]
    rgba[i * 4 + 2] = pixels[i * 3 + 2]
    rgba[i * 4 + 3] = 255
  }

  const layer = buildHairLayer(rgba, mask, 'mel', width, height)

  for (let i = 0; i < mask.length; i++) {
    const p = i * 4
    const expectedAlpha = Math.round(mask[i] * 255)
    assert.equal(layer.data[p + 3], expectedAlpha)
    if (mask[i] <= 0) {
      // Fora da máscara: RGB e alpha intactos (foto-base aparece por baixo).
      assert.equal(layer.data[p], rgba[p])
      assert.equal(layer.data[p + 1], rgba[p + 1])
      assert.equal(layer.data[p + 2], rgba[p + 2])
    }
  }
})

test('as quatro cores recoloridas mantêm a ordem de luminância', () => {
  const rgba = new Uint8ClampedArray(width * height * 4)
  for (let i = 0; i < width * height; i++) {
    rgba[i * 4] = pixels[i * 3]
    rgba[i * 4 + 1] = pixels[i * 3 + 1]
    rgba[i * 4 + 2] = pixels[i * 3 + 2]
    rgba[i * 4 + 3] = 255
  }

  const averages = {}
  for (const color of TRYON_VISUAL_COLORS) {
    const layer = buildHairLayer(rgba, mask, color, width, height)
    averages[color] = coveredAverages(layer.data, 4)
  }

  const lumas = Object.fromEntries(
    TRYON_VISUAL_COLORS.map((c) => [c, meanLuma(averages[c])])
  )
  assert.ok(
    lumas.preto < lumas.castanho,
    `preto=${lumas.preto.toFixed(1)} castanho=${lumas.castanho.toFixed(1)}`
  )
  assert.ok(lumas.castanho < lumas.mel)
  assert.ok(lumas.mel < lumas.platinado)
  assert.ok(lumas.preto < 90, `preto médio=${lumas.preto.toFixed(1)}`)
  assert.ok(
    lumas.platinado > 150,
    // Média puxada para baixo pelas raízes escuras incluídas na máscara.
    `platinado médio=${lumas.platinado.toFixed(1)}`
  )
})

test('platinado neutraliza o dourado (G-B cai em relação ao original)', () => {
  const rgba = new Uint8ClampedArray(width * height * 4)
  for (let i = 0; i < width * height; i++) {
    rgba[i * 4] = pixels[i * 3]
    rgba[i * 4 + 1] = pixels[i * 3 + 1]
    rgba[i * 4 + 2] = pixels[i * 3 + 2]
    rgba[i * 4 + 3] = 255
  }

  const original = coveredAverages(pixels)
  const layer = buildHairLayer(rgba, mask, 'platinado', width, height)
  const recolored = coveredAverages(layer.data, 4)

  assert.ok(
    recolored.g - recolored.b < original.g - original.b - 20,
    `original G-B=${(original.g - original.b).toFixed(1)} vs ` +
      `platinado G-B=${(recolored.g - recolored.b).toFixed(1)}`
  )
})

test('cor desconhecida lança erro (evita falha silenciosa)', () => {
  const rgba = new Uint8ClampedArray(4)
  assert.throws(() => buildHairLayer(rgba, new Float32Array([1]), 'rosa'))
})
