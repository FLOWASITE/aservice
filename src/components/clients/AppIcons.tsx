import { useNavigate } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { APP_LIST } from "@/types/application";

const ABBR: Record<string, string> = {
  aketoan: "AKT",
  amall: "AM",
  aread: "AR",
};

interface Props {
  clientId: number;
  apps: string[];
  otherSoftware?: string;
}

export function AppIcons({ clientId, apps, otherSoftware }: Props) {
  const navigate = useNavigate();

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
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/khach-hang/${clientId}/${code}`);
                }}
                className="inline-flex items-center justify-center w-7 h-7 rounded-full text-[9px] font-bold transition-transform hover:scale-110 hover:shadow-md"
                style={{ backgroundColor: app.bgColor, color: app.color }}
              >
                {ABBR[code] || code.slice(0, 2).toUpperCase()}
              </button>
            </TooltipTrigger>
            <TooltipContent>Mở {app.name}</TooltipContent>
          </Tooltip>
        );
      })}
    </div>
  );
}
