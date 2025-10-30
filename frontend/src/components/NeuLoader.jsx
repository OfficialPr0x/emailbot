import React from 'react'

export default function NeuLoader({ size = 'md' }) {
  const sizeClasses = {
    sm: 'w-20 h-20',
    md: 'w-32 h-32',
    lg: 'w-48 h-48'
  }

  return (
    <div className={`neu-loader ${sizeClasses[size]}`}>
      <div className="neu-loader-circle" />
    </div>
  )
}

