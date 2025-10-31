import { cn } from '@/lib/utils'

export function Label({ className, children, htmlFor, ...props }) {
  return (
    <label
      htmlFor={htmlFor}
      className={cn(
        'text-sm font-medium leading-none text-gray-700 dark:text-gray-300 block mb-2',
        'peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
        className
      )}
      {...props}
    >
      {children}
    </label>
  )
}

export default Label

