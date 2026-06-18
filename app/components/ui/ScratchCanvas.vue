<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref } from "vue"

const FALLBACK_CANVAS_PX = 96
const ALPHA_STRIDE = 4
const FULL_PERCENT = 100

const props = withDefaults(defineProps<{
  color?: string
  brushSize?: number
  threshold?: number
}>(), {
  color: "#181018",
  brushSize: 50,
  threshold: 55,
})

const emit = defineEmits<{ revealed: [] }>()

const containerRef = ref<HTMLDivElement>()
const canvasRef = ref<HTMLCanvasElement>()
let ctx: CanvasRenderingContext2D | null = null
let isDrawing = false
let done = false

function init() {
  const container = containerRef.value
  const canvas = canvasRef.value
  if (!container || !canvas) return

  const { width, height } = container.getBoundingClientRect()
  canvas.width = width || FALLBACK_CANVAS_PX
  canvas.height = height || FALLBACK_CANVAS_PX

  ctx = canvas.getContext("2d", { willReadFrequently: true })
  if (!ctx) return

  ctx.fillStyle = props.color
  ctx.fillRect(0, 0, canvas.width, canvas.height)
}

function toCanvasPos(clientX: number, clientY: number): { x: number; y: number } {
  const rect = canvasRef.value?.getBoundingClientRect()
  if (!rect) return {
    x: 0,
    y: 0, 
  }
  return {
    x: clientX - rect.left,
    y: clientY - rect.top, 
  }
}

function draw(x: number, y: number) {
  if (!ctx || !canvasRef.value || done) return
  ctx.globalCompositeOperation = "destination-out"
  ctx.lineWidth = props.brushSize
  ctx.lineCap = "round"
  ctx.lineJoin = "round"
  ctx.lineTo(x, y)
  ctx.stroke()
  checkReveal()
}

function checkReveal() {
  if (done || !ctx || !canvasRef.value) return
  const { width, height } = canvasRef.value
  const data = ctx.getImageData(0, 0, width, height).data
  let transparent = 0
  for (let i = ALPHA_STRIDE - 1; i < data.length; i += ALPHA_STRIDE) {
    if (data[i] === 0) transparent++
  }
  if ((transparent / (data.length / ALPHA_STRIDE)) * FULL_PERCENT >= props.threshold) {
    done = true
    emit("revealed")
  }
}

function onMouseDown(e: MouseEvent) {
  isDrawing = true
  if (!ctx) return
  const { x, y } = toCanvasPos(e.clientX, e.clientY)
  ctx.beginPath()
  ctx.moveTo(x, y)
  draw(x, y)
}

function onMouseMove(e: MouseEvent) {
  if (!isDrawing) return
  const { x, y } = toCanvasPos(e.clientX, e.clientY)
  draw(x, y)
}

function onMouseUp() {
  isDrawing = false
}

function onTouchStart(e: TouchEvent) {
  isDrawing = true
  const touch = e.targetTouches[0]
  if (!ctx || !touch) return
  const { x, y } = toCanvasPos(touch.clientX, touch.clientY)
  ctx.beginPath()
  ctx.moveTo(x, y)
  draw(x, y)
}

function onTouchMove(e: TouchEvent) {
  if (!isDrawing) return
  const touch = e.targetTouches[0]
  if (!touch) return
  const { x, y } = toCanvasPos(touch.clientX, touch.clientY)
  draw(x, y)
}

function revealAll() {
  if (!ctx || !canvasRef.value) return
  ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height)
  done = true
}

onMounted(() => {
  nextTick(init)
  window.addEventListener("mouseup", onMouseUp)
})

onUnmounted(() => {
  window.removeEventListener("mouseup", onMouseUp)
})

defineExpose({ revealAll })
</script>

<template>
  <div
    ref="containerRef"
    class="relative inline-block"
  >
    <slot />
    <canvas
      ref="canvasRef"
      class="absolute inset-0 cursor-pointer touch-none"
      @mousedown="onMouseDown"
      @mousemove="onMouseMove"
      @touchstart.passive="onTouchStart"
      @touchmove.passive="onTouchMove"
    />
  </div>
</template>
