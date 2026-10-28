import { useCallback, useEffect, useRef, useState } from 'react'
import {
  buildHairMask,
  buildHairLayer,
  featherMask,
} from '../model/tryOnVisual.js'
import baseImageUrl from '../assets/produtos/lace-front/LaceFrontLivia.jpg'

/*
 * Estado e desenho do provador virtual (protótipo com Canvas).
 *
 * Fluxo: ao montar, carrega a foto-base, deriva a máscara do cabelo uma única
 * vez (buildHairMask + featherMask) e guarda os pixels originais. A cada
 * mudança de cor, monta a camada recolorida (buildHairLayer) e compõe sobre a
 * foto-base no canvas. Nada de rede, nada de dependências externas.
 *
 * `renderMode` existe apenas para a verificação (harness): 'photo' (padrão)
 * desenha a foto recolorida; 'mask' desenha a máscara em escala de cinzas.
 */
export function useTryOnVisual({ initialColor = 'platinado', renderMode = 'photo' } = {}) {
  const canvasRef = useRef(null)
  const sourceRef = useRef(null)
  const layerCanvasRef = useRef(null)
  const [color, setColor] = useState(initialColor)
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState('')

  // Carregamento único da foto-base + segmentação do cabelo.
  useEffect(() => {
    let cancelled = false
    const image = new Image()

    image.onload = () => {
      if (cancelled) return
      try {
        const width = image.naturalWidth
        const height = image.naturalHeight
        const scratch = document.createElement('canvas')
        scratch.width = width
        scratch.height = height
        const scratchCtx = scratch.getContext('2d')
        scratchCtx.drawImage(image, 0, 0)
        const imageData = scratchCtx.getImageData(0, 0, width, height)

        const rawMask = buildHairMask(imageData.data, width, height, 4)
        const radius = Math.max(2, Math.round(width * 0.006))
        const softMask = featherMask(rawMask, width, height, radius)

        sourceRef.current = {
          image,
          width,
          height,
          original: new Uint8ClampedArray(imageData.data),
          mask: softMask,
        }
        setStatus('ready')
      } catch (cause) {
        setError(cause?.message ?? 'Falha ao processar a foto-base.')
        setStatus('error')
      }
    }

    image.onerror = () => {
      if (cancelled) return
      setError('Não foi possível carregar a foto-base do provador.')
      setStatus('error')
    }

    image.src = baseImageUrl
    return () => {
      cancelled = true
    }
  }, [])

  // Desenho por mudança de cor (ou modo de depuração).
  useEffect(() => {
    const source = sourceRef.current
    const canvas = canvasRef.current
    if (!source || !canvas || status !== 'ready') return

    canvas.width = source.width
    canvas.height = source.height
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, source.width, source.height)

    if (renderMode === 'mask') {
      const maskData = new Uint8ClampedArray(source.width * source.height * 4)
      for (let i = 0; i < source.mask.length; i++) {
        const value = Math.round(source.mask[i] * 255)
        maskData[i * 4] = value
        maskData[i * 4 + 1] = value
        maskData[i * 4 + 2] = value
        maskData[i * 4 + 3] = 255
      }
      ctx.putImageData(
        new ImageData(maskData, source.width, source.height),
        0,
        0
      )
      return
    }

    ctx.drawImage(source.image, 0, 0)

    if (!layerCanvasRef.current) {
      layerCanvasRef.current = document.createElement('canvas')
    }
    const layerCanvas = layerCanvasRef.current
    layerCanvas.width = source.width
    layerCanvas.height = source.height

    const layer = buildHairLayer(
      source.original,
      source.mask,
      color,
      source.width,
      source.height
    )
    layerCanvas
      .getContext('2d')
      .putImageData(new ImageData(layer.data, source.width, source.height), 0, 0)
    ctx.drawImage(layerCanvas, 0, 0)
  }, [color, status, renderMode])

  const selectColor = useCallback((next) => {
    setColor(next)
  }, [])

  return {
    canvasRef,
    color,
    selectColor,
    status,
    error,
  }
}
