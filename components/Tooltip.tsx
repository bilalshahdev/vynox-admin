// tooltip reuseable component
import {
  Tooltip as TooltipComponent,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TooltipProps {
  children: React.ReactNode;
  content: string;
  asChild?: boolean;
}

const Tooltip = ({ children, content, asChild }: TooltipProps) => {
  return (
    <TooltipProvider>
      <TooltipComponent>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent>{content}</TooltipContent>
      </TooltipComponent>
    </TooltipProvider>
  );
};

export default Tooltip;
