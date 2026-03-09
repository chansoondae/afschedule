'use client'

interface DestinationBadgeProps {
  name: string
  color: string
  small?: boolean
}

export default function DestinationBadge({ name, color, small = false }: DestinationBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${
        small ? 'px-1.5 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs'
      }`}
      style={{
        backgroundColor: `${color}22`,
        color: color,
        border: `1px solid ${color}44`,
      }}
    >
      {name}
    </span>
  )
}
