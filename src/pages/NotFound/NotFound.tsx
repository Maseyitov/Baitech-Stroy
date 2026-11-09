import styles from './NotFound.module.scss'

export default function NotFound() {
  return (
    <section className={styles.wrapper}>
      <h1 className="text-4xl md:text-6xl">Страница не найдена</h1>
    </section>
  )
}
