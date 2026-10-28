import { useReveal } from '../../viewmodel/useReveal.js'
import { useTryOnVisual } from '../../viewmodel/useTryOnVisual.js'
import SectionHeading from '../../components/SectionHeading/SectionHeading.jsx'
import {
  COLOR_TARGETS,
  TRYON_VISUAL_COLORS,
  TRYON_VISUAL_LENGTHS,
  TRYON_VISUAL_TEXTURES,
} from '../../model/tryOnVisual.js'
import styles from './ProvadorVisual.module.css'

const FIELD_LABELS = {
  color: 'cor',
  length: 'comprimento',
  texture: 'textura',
}

function capitalize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

function swatchStyle(color) {
  const [r, g, b] = COLOR_TARGETS[color]
  return { background: `rgb(${r}, ${g}, ${b})` }
}

/*
 * Protótipo de provador virtual com Canvas.
 *
 * Somente a cor é recolorida de verdade (máscara derivada dos pixels da
 * foto-base). Comprimento e textura ficam visíveis, porém desabilitados,
 * com aviso explícito: os assets existentes não permitem alterá-los no
 * mesmo modelo (Opção A autorizada).
 */
function ProvadorVisual({ initialColor = 'platinado', renderMode = 'photo' }) {
  const { ref, visible } = useReveal()
  const { canvasRef, color, selectColor, status, error } = useTryOnVisual({
    initialColor,
    renderMode,
  })

  const ready = status === 'ready'

  return (
    <section
      id="provador-prototipo"
      ref={ref}
      data-reveal
      className={`${styles.section} ${visible ? styles.revealed : styles.hidden}`}
    >
      <div className={styles.inner}>
        <SectionHeading
          eyebrow="Protótipo de Provador"
          title="Veja a cor escolhida em tempo real"
          subtitle="Selecione uma cor e o canvas recolora apenas a região do cabelo da foto-base — rosto e fundo permanecem intactos."
          visible={visible}
        />

        <div className={styles.panel}>
          <div className={styles.options}>
            <fieldset className={styles.group}>
              <legend className={styles.legend}>Cor</legend>
              <div className={styles.swatches}>
                {TRYON_VISUAL_COLORS.map((option) => (
                  <button
                    key={option}
                    type="button"
                    className={`${styles.swatch} ${color === option ? styles.swatchActive : ''}`}
                    aria-pressed={color === option}
                    disabled={!ready}
                    onClick={() => selectColor(option)}
                  >
                    <span
                      className={styles.swatchDot}
                      style={swatchStyle(option)}
                      aria-hidden="true"
                    />
                    {capitalize(option)}
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset className={styles.group}>
              <legend className={styles.legend}>Comprimento</legend>
              <div className={styles.chips}>
                {TRYON_VISUAL_LENGTHS.map((length) => (
                  <button
                    key={length}
                    type="button"
                    className={`${styles.chip} ${styles.chipDisabled}`}
                    disabled
                    aria-disabled="true"
                  >
                    {capitalize(length)}
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset className={styles.group}>
              <legend className={styles.legend}>Textura</legend>
              <div className={styles.chips}>
                {TRYON_VISUAL_TEXTURES.map((texture) => (
                  <button
                    key={texture}
                    type="button"
                    className={`${styles.chip} ${styles.chipDisabled}`}
                    disabled
                    aria-disabled="true"
                  >
                    {capitalize(texture)}
                  </button>
                ))}
              </div>
            </fieldset>

            <p className={styles.notice}>
              Nesta demonstração apenas a{' '}
              <strong>{FIELD_LABELS.color}</strong> muda de verdade.
              Comprimento e textura estão desabilitados porque as imagens
              existentes no projeto não permitem alterá-los no mesmo modelo —
              trocá-las seria exibir a foto de outra pessoa, não uma
              transformação.
            </p>

            <p className={styles.selectionSummary} aria-live="polite">
              <span className={styles.selectionSummaryLabel}>Cor ativa:</span>
              {capitalize(color)}
            </p>
          </div>

          <div className={styles.preview}>
            {status === 'loading' && (
              <p className={styles.previewStatus}>Carregando a foto-base…</p>
            )}

            {status === 'error' && (
              <p className={styles.previewStatus} role="alert">
                {error}
              </p>
            )}

            <canvas
              ref={canvasRef}
              className={styles.canvas}
              role="img"
              aria-label={`Foto-base com o cabelo recolorido na cor ${color}`}
            />

            {ready && (
              <p className={styles.previewCaption}>
                Recoloração aplicada somente na região segmentada do cabelo.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProvadorVisual
