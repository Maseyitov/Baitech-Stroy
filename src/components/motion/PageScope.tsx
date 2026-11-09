import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

/** Страницы, которые уже показывались. Живёт, пока вкладка не обновлена (F5) или не закрыта. */
const visited = new Set<string>()

const PlayedContext = createContext(false)

/** true — эту страницу уже открывали: анимации появления не нужны, всё показывается сразу */
export const useAlreadyPlayed = () => useContext(PlayedContext)

/**
 * Оборачивает страницу. Запоминает, что она уже была показана, чтобы при возвращении
 * на неё (без обновления сайта) анимации появления не проигрывались заново.
 */
export default function PageScope({ path, children }: { path: string; children: ReactNode }) {
  // Снимок берём один раз при открытии страницы, чтобы он не менялся, пока страница на экране
  const [played] = useState(() => visited.has(path))

  useEffect(
    () => () => {
      visited.add(path)
    },
    [path],
  )

  return <PlayedContext.Provider value={played}>{children}</PlayedContext.Provider>
}