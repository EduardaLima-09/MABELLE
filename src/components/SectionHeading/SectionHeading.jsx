import styles from './SectionHeading.module.css'

function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = 'center',
  tone = 'light',
  visible = false,
}) {
  const classes = [
    styles.header,
    styles[align],
    styles[tone],
    visible ? styles.visible : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <header className={classes} data-reveal>
      {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
      <h2 className={styles.title}>{title}</h2>
      <span className={styles.rule} aria-hidden="true" />
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
    </header>
  )
}

export default SectionHeading
