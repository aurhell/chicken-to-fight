export function useSound(src: string) {
  function play() {
    const audio = new Audio(src)
    audio.play().catch(() => {})
  }
  return { play }
}
