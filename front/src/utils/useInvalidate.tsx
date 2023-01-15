import { useState } from "react"

export function useInvalidate() {
  const [count, setCount] = useState(0)

  return {
    id: count,
    invalidate() {
      setCount(count => count + 1)
    }
  }
}
