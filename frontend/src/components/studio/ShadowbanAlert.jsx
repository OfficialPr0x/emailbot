import { AlertTriangle, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export default function ShadowbanAlert({ risk, onDismiss, onViewDiagnostics }) {
  if (risk < 0.5) return null

  const getSeverity = () => {
    if (risk < 0.7) return {
      color: 'yellow',
      title: 'Shadowban Warning',
      message: 'Your account is showing some suspicious activity patterns.',
    }
    return {
      color: 'red',
      title: 'High Shadowban Risk',
      message: 'Immediate action required! Your account may be shadowbanned.',
    }
  }

  const severity = getSeverity()

  return (
    <div className={`fixed bottom-4 right-4 max-w-md bg-${severity.color}-50 dark:bg-${severity.color}-900/20 border border-${severity.color}-200 dark:border-${severity.color}-800 rounded-lg shadow-lg p-4 animate-slide-up z-50`}>
      <div className="flex items-start gap-3">
        <AlertTriangle className={`w-6 h-6 text-${severity.color}-500 flex-shrink-0`} />
        <div className="flex-1">
          <h4 className={`font-semibold text-${severity.color}-900 dark:text-${severity.color}-100 mb-1`}>
            {severity.title}
          </h4>
          <p className={`text-sm text-${severity.color}-700 dark:text-${severity.color}-300 mb-3`}>
            {severity.message}
          </p>
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={onViewDiagnostics}
              className={`bg-${severity.color}-500 text-white hover:bg-${severity.color}-600`}
            >
              View Diagnostics
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={onDismiss}
              className={`text-${severity.color}-600`}
            >
              Dismiss
            </Button>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onDismiss}
          className="text-gray-500 hover:text-gray-700"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}

