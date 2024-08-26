import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../tooltip";
export default function Testing() {
  return (
    <Tooltip>
      <TooltipTrigger className="absolute top-0 right-0 -mt-1 -mr-1">
        <div>hello</div>
      </TooltipTrigger>
      <TooltipContent side="top" align="center">
        <p className="text-sm">
          When on, a percentage of every income you add will automatically go to
          this saving goal.
        </p>
      </TooltipContent>
    </Tooltip>
  );
}
