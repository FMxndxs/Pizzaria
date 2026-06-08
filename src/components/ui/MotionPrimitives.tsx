'use client'

import { useRef, type ReactNode } from 'react'
import { motion, useInView, useReducedMotion } from 'motion/react'

/* ─────────────────────────────────────────────────────────────────────────────
   CrustReveal
   Entrada suave — como uma pizza saindo do forno (escala + fade).
   Equivalente ao LayerReveal do 3D, com personalidade de padaria artesanal.
   ───────────────────────────────────────────────────────────────────────── */

interface CrustRevealProps {
  children: ReactNode
  delay?: number
  className?: string
}

export function CrustReveal({ children, delay = 0, className }: CrustRevealProps) {
  const shouldReduce = useReducedMotion()

  return (
    <motion.div
      className={className}
      initial={shouldReduce ? false : { opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{
        duration: shouldReduce ? 0 : 0.55,
        delay: shouldReduce ? 0 : delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────────
   StaggerGroup
   Anima filhos em cascata ao entrar no viewport.
   Warm entrance — como ingredientes sendo colocados na pizza um a um.
   ───────────────────────────────────────────────────────────────────────── */

interface StaggerGroupProps {
  children: ReactNode
  className?: string
  staggerDelay?: number
}

export function StaggerGroup({ children, className, staggerDelay = 0.08 }: StaggerGroupProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '0px 0px -60px 0px' })
  const shouldReduce = useReducedMotion()

  const childArray = Array.isArray(children) ? children : [children]

  return (
    <div ref={ref} className={className}>
      {childArray.map((child, i) => (
        <motion.div
          key={i}
          initial={shouldReduce ? false : { opacity: 0, y: 18 }}
          animate={
            isInView || shouldReduce
              ? { opacity: 1, y: 0 }
              : { opacity: 0, y: 18 }
          }
          transition={{
            duration: shouldReduce ? 0 : 0.5,
            delay: shouldReduce ? 0 : i * staggerDelay,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          {child}
        </motion.div>
      ))}
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────────
   OvenLineHover
   Wrapper que adiciona duas linhas douradas finas (topo e base) no hover,
   evocando a grelha quente de um forno a lenha. Puramente CSS, sem JS.

   Uso:
     <OvenLineHover className="rounded-xl">
       <MeuCard />
     </OvenLineHover>

   Requer: grupo Tailwind `group/ovenlh` (incluído abaixo).
   ───────────────────────────────────────────────────────────────────────── */

interface OvenLineHoverProps {
  children: ReactNode
  className?: string
}

export function OvenLineHover({ children, className = '' }: OvenLineHoverProps) {
  return (
    <div className={`relative group/ovenlh ${className}`}>
      {/* Linha superior — grelha do forno */}
      <span
        aria-hidden
        className={[
          'pointer-events-none absolute inset-x-0 top-0 h-[1.5px] rounded-full',
          'scale-x-0 opacity-0 origin-left',
          'group-hover/ovenlh:scale-x-100 group-hover/ovenlh:opacity-100',
          'transition-[transform,opacity] duration-300 ease-out',
        ].join(' ')}
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, #F2A65A 30%, #C1272D 55%, #F2A65A 80%, transparent 100%)',
        }}
      />

      {children}

      {/* Linha inferior — grelha do forno */}
      <span
        aria-hidden
        className={[
          'pointer-events-none absolute inset-x-0 bottom-0 h-[1.5px] rounded-full',
          'scale-x-0 opacity-0 origin-right',
          'group-hover/ovenlh:scale-x-100 group-hover/ovenlh:opacity-100',
          'transition-[transform,opacity] duration-300 ease-out delay-75',
        ].join(' ')}
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, #F2A65A 20%, #C1272D 50%, #F2A65A 75%, transparent 100%)',
        }}
      />
    </div>
  )
}
