import { cn } from '../../lib/utils/cn';
export interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
}
export function Switch({
  checked,
  onChange,
  label,
  disabled
}: SwitchProps) {
  return <label className="flex items-center gap-3 cursor-pointer">
      <div className={cn('relative inline-flex h-6 w-11 items-center rounded-full transition-colors', checked ? 'bg-black' : 'bg-gray-200', disabled && 'opacity-50 cursor-not-allowed')} onClick={() => !disabled && onChange(!checked)}>
        <span className={cn('inline-block h-4 w-4 transform rounded-full bg-white transition-transform', checked ? 'translate-x-6' : 'translate-x-1')} />
      </div>
      {label && <span className="text-sm font-medium text-gray-700">{label}</span>}
    </label>;
}
