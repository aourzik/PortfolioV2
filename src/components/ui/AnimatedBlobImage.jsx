import * as React from 'react'
import { cn } from '@/lib/utils'

const animationStyles = `
  @keyframes blob-path-animation {
    0%   { d: path("M0.81,0.56 C0.84,0.73 0.69,0.88 0.52,0.92 C0.35,0.96 0.17,0.85 0.09,0.68 C0.01,0.51 0.07,0.3 0.23,0.19 C0.39,0.08 0.61,0.11 0.72,0.26 C0.8,0.37 0.78,0.47 0.81,0.56 Z"); }
    25%  { d: path("M0.88,0.56 C0.93,0.69 0.8,0.86 0.63,0.9 C0.46,0.94 0.25,0.88 0.16,0.74 C0.07,0.6 0.11,0.41 0.25,0.3 C0.39,0.19 0.61,0.21 0.73,0.33 C0.82,0.42 0.85,0.48 0.88,0.56 Z"); }
    50%  { d: path("M0.84,0.62 C0.88,0.73 0.75,0.88 0.58,0.91 C0.41,0.94 0.24,0.86 0.15,0.72 C0.06,0.58 0.12,0.38 0.27,0.27 C0.42,0.16 0.62,0.2 0.73,0.33 C0.81,0.43 0.81,0.53 0.84,0.62 Z"); }
    75%  { d: path("M0.8,0.66 C0.84,0.78 0.7,0.91 0.54,0.92 C0.38,0.93 0.21,0.84 0.13,0.7 C0.05,0.56 0.13,0.37 0.28,0.26 C0.43,0.15 0.62,0.2 0.71,0.33 C0.78,0.43 0.77,0.57 0.8,0.66 Z"); }
    100% { d: path("M0.81,0.56 C0.84,0.73 0.69,0.88 0.52,0.92 C0.35,0.96 0.17,0.85 0.09,0.68 C0.01,0.51 0.07,0.3 0.23,0.19 C0.39,0.08 0.61,0.11 0.72,0.26 C0.8,0.37 0.78,0.47 0.81,0.56 Z"); }
  }

  @keyframes blob-spin-animation {
    0%   { transform: rotate(0deg); }
    50%  { transform: rotate(5deg); }
    100% { transform: rotate(0deg); }
  }

  .animate-blob-path-component {
    animation: blob-path-animation 15s ease-in-out infinite;
  }

  .animate-blob-spin-component {
    animation: blob-spin-animation 20s ease-in-out infinite;
  }
`

const AnimatedBlobImage = React.forwardRef(
  ({ src, alt, className, ...props }, ref) => {
    return (
      <>
        <style>{animationStyles}</style>
        <div
          className={cn(
            'relative w-full max-w-sm aspect-square',
            'animate-blob-spin-component',
            className
          )}
        >
          <img
            ref={ref}
            src={src}
            alt={alt}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ clipPath: 'url(#blob-shape-component)' }}
            {...props}
          />
          <svg className="absolute w-0 h-0">
            <defs>
              <clipPath id="blob-shape-component" clipPathUnits="objectBoundingBox">
                <path
                  d="M0.81,0.56 C0.84,0.73 0.69,0.88 0.52,0.92 C0.35,0.96 0.17,0.85 0.09,0.68 C0.01,0.51 0.07,0.3 0.23,0.19 C0.39,0.08 0.61,0.11 0.72,0.26 C0.8,0.37 0.78,0.47 0.81,0.56 Z"
                  className="animate-blob-path-component"
                />
              </clipPath>
            </defs>
          </svg>
        </div>
      </>
    )
  }
)

AnimatedBlobImage.displayName = 'AnimatedBlobImage'

export { AnimatedBlobImage }
