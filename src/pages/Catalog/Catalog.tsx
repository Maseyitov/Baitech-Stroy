import { useCallback, useState } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { AnimatePresence, motion } from 'motion/react'
import { COMPANY } from '@/constants'
import { cn } from '@/lib/cn'
import { EASE_OUT } from '@/lib/motion'
import { useCatalog } from '@/features/catalog/useCatalog'
import { useFavorites } from '@/features/catalog/useFavorites'
import { plural } from '@/features/catalog/format'
import FilterPanel from '@/features/catalog/components/FilterPanel'
import Toolbar from '@/features/catalog/components/Toolbar'
import PropertyCard from '@/features/catalog/components/PropertyCard'
import MobileFilters from '@/features/catalog/components/MobileFilters'

/** Подбор недвижимости: фильтры слева, карточки справа. Футера на этой странице нет (см. routes). */
export default function Catalog() {
  const catalog = useCatalog()
  const favorites = useFavorites()
  const [filtersOpen, setFiltersOpen] = useState(false)
  const closeFilters = useCallback(() => setFiltersOpen(false), [])

  const { results, visible, view, currency } = catalog
  const total = results.length

  return (
    <div className="min-h-[calc(100vh-60px)] bg-surface px-4 pb-16 pt-6 md:px-[3vw]">
      <Helmet>
        <title>Выбор недвижимости — {COMPANY.name}</title>
      </Helmet>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[26px] font-normal md:text-[32px]">Выбор недвижимости</h1>
          <p className="mt-1 font-display text-[20px] font-light text-muted md:text-[24px]">
            {total} {plural(total, ['объект', 'объекта', 'объектов'])}
          </p>
        </div>
        <nav aria-label="Хлебные крошки" className="pt-2 text-[11px] text-muted">
          <Link to="/" className="hover:text-blue">
            Главная
          </Link>
          <span className="mx-1.5">·</span>
          <span className="text-navy">Выбор недвижимости</span>
        </nav>
      </div>

      <div className="mt-5 grid items-start gap-4 lg:grid-cols-[260px_1fr] xl:gap-5">
        {/* Боковая панель фильтров: прилипает и прокручивается отдельно от списка */}
        <aside
          aria-label="Фильтры"
          className="sticky top-[76px] hidden max-h-[calc(100vh-92px)] overflow-y-auto rounded-xl bg-white p-4 [scrollbar-width:thin] lg:block"
        >
          <FilterPanel catalog={catalog} />
        </aside>

        <div className="min-w-0">
          <Toolbar catalog={catalog} onOpenFilters={() => setFiltersOpen(true)} />

          <div
            className={cn(
              'mt-4 grid gap-4 transition-opacity duration-200 xl:gap-5',
              view === 'grid' ? 'sm:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1',
              catalog.isStale && 'opacity-60',
            )}
          >
            <AnimatePresence mode="popLayout" initial={false}>
              {visible.map((item) => (
                <motion.div
                  key={item.id}
                  layout="position"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.35, ease: EASE_OUT }}
                  className="flex"
                >
                  <PropertyCard
                    item={item}
                    view={view}
                    currency={currency}
                    favorite={favorites.has(item.id)}
                    onFavorite={favorites.toggle}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {total === 0 && (
            <div className="mt-4 rounded-xl bg-white px-6 py-16 text-center">
              <p className="text-[15px]">Под эти параметры ничего не нашлось</p>
              <p className="mt-1 text-[12px] text-muted">Попробуйте расширить диапазоны или убрать часть фильтров</p>
              <button
                type="button"
                onClick={catalog.reset}
                className="mt-5 rounded-lg bg-navy px-5 py-2.5 text-[12px] text-white transition-colors hover:bg-green"
              >
                Сбросить фильтры
              </button>
            </div>
          )}

          {catalog.hasMore && (
            <div className="mt-6 flex justify-center">
              <button
                type="button"
                onClick={catalog.showMore}
                className="rounded-lg border border-navy px-8 py-3 text-[12px] transition-colors hover:bg-navy hover:text-white"
              >
                Показать ещё · {visible.length} из {total}
              </button>
            </div>
          )}
        </div>
      </div>

      <MobileFilters catalog={catalog} open={filtersOpen} onClose={closeFilters} />
    </div>
  )
}
