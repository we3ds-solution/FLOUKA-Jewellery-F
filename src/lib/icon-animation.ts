export type AnimationData = Record<string, unknown>

// Strip expressions (the SVG light player intentionally has no expression engine).
export function prepareAnimation(value: unknown): AnimationData {
  const clone = JSON.parse(JSON.stringify(value)) as AnimationData
  function walk(node: unknown) {
    if (!node || typeof node !== 'object') return
    if (Array.isArray(node)) { node.forEach(walk); return }
    const object = node as Record<string, unknown>
    // `x` is also the numeric horizontal easing coordinate. Only strings are
    // expressions; removing easing coordinates corrupts interpolated shapes.
    if (typeof object['x'] === 'string') delete object['x']
    Object.values(object).forEach(walk)
  }
  walk(clone)
  return clone
}

export function hoverSegment(data: AnimationData): [number, number] {
  const markers = data['markers'] as Array<{ cm: string; tm: number; dr: number }> | undefined
  const hover = markers?.find(marker => typeof marker.cm === 'string' && marker.cm.includes('default:hover'))
  return hover ? [hover.tm, hover.tm + hover.dr] : [Number(data['ip'] ?? 0), Number(data['op'] ?? 60) - 1]
}

const cache = new Map<string, Promise<AnimationData>>()
export function loadAnimationData(url: string) {
  const existing = cache.get(url)
  if (existing) return existing
  const request = fetch(url).then(response => {
    if (!response.ok) throw new Error('Animation unavailable')
    return response.json() as Promise<AnimationData>
  }).catch(error => { cache.delete(url); throw error })
  cache.set(url, request)
  return request
}