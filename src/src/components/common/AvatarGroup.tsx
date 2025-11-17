import { cn } from '../../lib/utils/cn';
interface Avatar {
  id: string;
  name: string;
  avatar: string;
  count: number;
  color: string;
}
export interface AvatarGroupProps {
  avatars: Avatar[];
  className?: string;
}
export function AvatarGroup({
  avatars,
  className
}: AvatarGroupProps) {
  return <div className={cn('flex items-center gap-4 overflow-x-auto pb-2', className)}>
      {avatars.map(avatar => <div key={avatar.id} className="relative flex-shrink-0">
          <img src={avatar.avatar} alt={avatar.name} className="w-12 h-12 rounded-full border-2 border-white shadow-md" />
          {avatar.count > 0 && <div className={cn('absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white', avatar.color)}>
              {avatar.count}
            </div>}
        </div>)}
    </div>;
}
