import { useReveal } from '../../viewmodel/useReveal.js'
import { useTryOn } from '../../viewmodel/useTryOn.js'
import SectionHeading from '../../components/SectionHeading/SectionHeading.jsx'
import { TRYON_STYLES, TRYON_LENGTHS, TRYON_COLORS } from '../../model/tryOn.js'
import { formatPrice } from '../../shared/formatPrice.js'
import styles from './Provador.module.css'

const COLOR_SWATCHES = {
  preto: '#241017',
  castanho: '#5b3a29',
  mel: '#b07d3f',
  platinum: '#ddd6cc',
}

const FIELD_LABELS = {
  style: 'estilo',
  length: 'comprimento',
  color: 'cor',
}

function capitalize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

function missingFields(selections) {
  return Object.entries(FIELD_LABELS)
    .filter(([field]) => !selections[field])
    .map(([, label]) => label)
}

function describeMissing(labels) {
  if (labels.length === 1) return labels[0]
  return `${labels.slice(0, -1).join(', ')} e ${labels[labels.length - 1]}`
}

function describeDifferences(differences) {
  return differences
    .map((diff) => `${diff.label}: ${capitalize(diff.actual)}`)
    .join(' · ')
}

function Provador({ categories, onAddToCart, onViewDetails }) {
  const { ref, visible } = useReveal()
  const {
    selections,
    complete,
    selectOption,
    clearSelections,
    reference,
    alternatives,
    suggestions,
  } = useTryOn(categories)

  const hasSelection = Boolean(
    selections.style || selections.length || selections.color
  )
  const missing = missingFields(selections)

  return (
    <section
      id="provador"
      ref={ref}
      data-reveal
      className={`${styles.section} ${visible ? styles.revealed : styles.hidden}`}
    >
      <div className={styles.inner}>
        <SectionHeading
          eyebrow="Provador Virtual"
          title="Encontre o cabelo ideal para você"
          subtitle="Personalize estilo, comprimento e cor e veja uma referência do visual antes de escolher o seu produto favorito."
          visible={visible}
        />

        <div className={styles.panel}>
          <div className={styles.options}>
            <fieldset className={styles.group}>
              <legend className={styles.legend}>Estilo</legend>
              <div className={styles.chips}>
                {TRYON_STYLES.map((style) => (
                  <button
                    key={style}
                    type="button"
                    className={`${styles.chip} ${selections.style === style ? styles.chipActive : ''}`}
                    aria-pressed={selections.style === style}
                    onClick={() => selectOption('style', style)}
                  >
                    {capitalize(style)}
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset className={styles.group}>
              <legend className={styles.legend}>Comprimento</legend>
              <div className={styles.chips}>
                {TRYON_LENGTHS.map((length) => (
                  <button
                    key={length}
                    type="button"
                    className={`${styles.chip} ${selections.length === length ? styles.chipActive : ''}`}
                    aria-pressed={selections.length === length}
                    onClick={() => selectOption('length', length)}
                  >
                    {capitalize(length)}
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset className={styles.group}>
              <legend className={styles.legend}>Cor</legend>
              <div className={styles.swatches}>
                {TRYON_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={`${styles.swatch} ${selections.color === color ? styles.swatchActive : ''}`}
                    aria-pressed={selections.color === color}
                    onClick={() => selectOption('color', color)}
                  >
                    <span
                      className={styles.swatchDot}
                      style={{ background: COLOR_SWATCHES[color] }}
                      aria-hidden="true"
                    />
                    {capitalize(color)}
                  </button>
                ))}
              </div>
            </fieldset>

            {hasSelection && (
              <p className={styles.selectionSummary}>
                <span className={styles.selectionSummaryLabel}>
                  Selecionado:
                </span>
                {[
                  selections.style && capitalize(selections.style),
                  selections.length && capitalize(selections.length),
                  selections.color && capitalize(selections.color),
                ]
                  .filter(Boolean)
                  .join(' · ')}
              </p>
            )}

            <div className={styles.optionsFooter}>
              <p className={styles.hint}>
                Você pode alterar as escolhas a qualquer momento.
              </p>
              <button
                type="button"
                className={styles.clearBtn}
                onClick={clearSelections}
                disabled={!hasSelection}
              >
                Limpar escolhas
              </button>
            </div>
          </div>

          <div className={styles.preview} aria-live="polite">
            {!hasSelection && (
              <div className={styles.emptyState}>
                <span className={styles.emptyRule} aria-hidden="true" />
                <h3 className={styles.emptyTitle}>Seu visual começa aqui</h3>
                <p className={styles.emptyText}>
                  Escolha o estilo, o comprimento e a cor ao lado para ver uma
                  referência do resultado.
                </p>
                <ol className={styles.steps}>
                  <li>Estilo</li>
                  <li>Comprimento</li>
                  <li>Cor</li>
                </ol>
              </div>
            )}

            {hasSelection && !complete && (
              <div className={styles.emptyState}>
                <h3 className={styles.emptyTitle}>Falta pouco</h3>
                <p className={styles.emptyText}>
                  Escolha {describeMissing(missing)} para ver a referência do
                  visual.
                </p>
              </div>
            )}

            {complete && !reference && (
              <div className={styles.emptyState}>
                <h3 className={styles.emptyTitle}>
                  Ainda não temos uma referência exata
                </h3>
                <p className={styles.emptyText}>
                  {suggestions.length > 0
                    ? 'Nenhum produto do catálogo reúne exatamente essas três características. Veja abaixo sugestões próximas — em cada uma, indicamos o que difere das suas escolhas.'
                    : 'Nenhum produto do catálogo corresponde a esse combinação por enquanto. Tente outras escolhas ou fale com a MABELLE para conhecer as novidades.'}
                </p>
              </div>
            )}

            {reference && (
              <figure className={styles.reference}>
                <div className={styles.referenceMedia}>
                  <img
                    src={reference.image}
                    alt={`Referência exata: ${reference.name}, ${reference.texture}, ${reference.length}, ${reference.color}`}
                    className={styles.referenceImage}
                    loading="lazy"
                  />
                </div>
                <figcaption className={styles.referenceInfo}>
                  <p className={styles.referenceBadge}>Correspondência exata</p>
                  <p className={styles.referenceCategory}>
                    {reference.categoryTitle}
                  </p>
                  <h3 className={styles.referenceName}>{reference.name}</h3>
                  <p className={styles.referencePrice}>
                    {formatPrice(reference.price)}
                  </p>
                  <div className={styles.referenceActions}>
                    <button
                      type="button"
                      className={styles.detailsBtn}
                      onClick={() =>
                        onViewDetails(reference, reference.categoryTitle)
                      }
                    >
                      Ver detalhes
                    </button>
                    <button
                      type="button"
                      className={styles.addBtn}
                      onClick={() =>
                        onAddToCart(reference, reference.categoryTitle)
                      }
                    >
                      Adicionar à sacola
                    </button>
                  </div>
                </figcaption>
              </figure>
            )}
          </div>
        </div>

        {complete && reference && alternatives.length > 0 && (
          <div className={styles.related}>
            <p className={styles.relatedTitle}>Outras correspondências exatas</p>
            <div className={styles.relatedGrid}>
              {alternatives.map((product) => (
                <button
                  key={product.id}
                  type="button"
                  className={styles.relatedCard}
                  onClick={() => onViewDetails(product, product.categoryTitle)}
                >
                  <span className={styles.relatedMedia}>
                    <img
                      src={product.image}
                      alt={`Correspondência exata: ${product.name}, ${product.texture}, ${product.length}, ${product.color}`}
                      className={styles.relatedImage}
                      loading="lazy"
                    />
                  </span>
                  <span className={styles.relatedInfo}>
                    <span className={styles.relatedCategory}>
                      {product.categoryTitle}
                    </span>
                    <span className={styles.relatedName}>{product.name}</span>
                    <span className={styles.relatedPrice}>
                      {formatPrice(product.price)}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {complete && suggestions.length > 0 && (
          <div className={styles.related}>
            <p className={styles.relatedTitle}>Sugestões de produtos</p>
            <p className={styles.relatedNote}>
              Sem correspondência exata às suas escolhas — veja como sugestões,
              com as características diferentes indicadas em cada produto.
            </p>
            <div className={styles.relatedGrid}>
              {suggestions.map((product) => (
                <button
                  key={product.id}
                  type="button"
                  className={styles.relatedCard}
                  onClick={() => onViewDetails(product, product.categoryTitle)}
                >
                  <span className={styles.relatedMedia}>
                    <img
                      src={product.image}
                      alt={`Sugestão: ${product.name}, ${product.texture}, ${product.length}, ${product.color}`}
                      className={styles.relatedImage}
                      loading="lazy"
                    />
                  </span>
                  <span className={styles.relatedInfo}>
                    <span className={styles.relatedCategory}>
                      {product.categoryTitle}
                    </span>
                    <span className={styles.relatedName}>{product.name}</span>
                    <span className={styles.relatedPrice}>
                      {formatPrice(product.price)}
                    </span>
                    <span className={styles.relatedDiff}>
                      Difere em: {describeDifferences(product.differences)}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default Provador
