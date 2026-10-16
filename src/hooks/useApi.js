import { useCallback, useEffect, useState } from "react"
import api from "../utils/api"

export default function useApi(path, options = {}) {
  const { immediate = true, params } = options
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(immediate)
  const [error, setError] = useState("")

  const execute = useCallback(
    async (override = {}) => {
      setLoading(true)
      setError("")
      try {
        const response = await api.get(path, { params, ...override })
        setData(response.data)
        return response.data
      } catch (requestError) {
        setError(
          requestError.response?.data?.detail || "Unable to load this content.",
        )
        throw requestError
      } finally {
        setLoading(false)
      }
    },
    [path, JSON.stringify(params)],
  )

  useEffect(() => {
    if (immediate) execute().catch(() => {})
  }, [execute, immediate])

  return { data, setData, loading, error, execute }
}
