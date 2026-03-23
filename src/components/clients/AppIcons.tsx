import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { APP_LIST } from "@/types/application";
import logoAketoan from "@/assets/logo-aketoan.png";
import logoAmall from "@/assets/logo-amall.png";
import logoAread from "@/assets/logo-aread.png";

const APP_LOGOS: Record<string, string> = {
  aketoan: logoAketoan,
  amall: logoAmall,
  aread: logoAread,
};

interface Props {
  clientId: number;
  apps: string[];
  otherSoftware?: string;
}

export function AppIcons({ clientId, apps, otherSoftware }: Props) {

  if ((!apps || apps.length === 0) && !otherSoftware) {
    return <span className="text-muted-foreground">—</span>;
  }

  if (otherSoftware) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-muted text-muted-foreground text-[10px] font-bold cursor-default">
            ?
          </span>
        </TooltipTrigger>
        <TooltipContent>{otherSoftware}</TooltipContent>
      </Tooltip>
    );
  }

  return (
    <div className="flex items-center gap-1 justify-center">
      {apps.map((code) => {
        const app = APP_LIST.find((a) => a.code === code);
        if (!app) return null;
        return (
          <Tooltip key={code}>
            <TooltipTrigger asChild>
              <a
                href={`${app.url}?client=${clientId}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center justify-center w-7 h-7 rounded-full overflow-hidden bg-white border border-border/50 transition-transform hover:scale-110 hover:shadow-md"
              >
                <img src={APP_LOGOS[code]} alt={app.name} className="w-6 h-6 object-contain" />
              </a>
            </TooltipTrigger>
            <TooltipContent>Mở {app.name}</TooltipContent>
          </Tooltip>
        );
      })}
    </div>
  );
}
