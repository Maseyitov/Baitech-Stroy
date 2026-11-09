import { useCallback, useEffect, useState } from 'react'

const KEY = 'baitech:favorites'

const read = (): string[] => {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '[]')
  } catch {
    return []
  }
}

/** Избранное хранится в браузере посетителя */
export function useFavorites() {
  const [ids, setIds] = useState<string[]>(read)

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(ids))
    } catch {
      /* приватный режим — просто не сохраняем */
    }
  }, [ids])

  const toggle = useCallback(
    (id: string) => setIds((list) => (list.includes(id) ? list.filter((x) => x !== id) : [...list, id])),
    [],
  )

  return { ids, toggle, has: (id: string) => ids.includes(id) }
}
