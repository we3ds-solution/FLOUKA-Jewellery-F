import * as React from "react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

type Side = "top" | "bottom" | "left" | "right";

export interface IconButtonProps extends Omit<ButtonProps, "size"> {
  /** Accessible name, also shown as the tooltip text. */
  label: string;
  tooltipSide?: Side;
  /** Set false to keep only the accessible label. */
  showTooltip?: boolean;
}

/** Icon-only button with a built-in accessible label and themed tooltip. */
export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ label, tooltipSide = "bottom", showTooltip = true, ...props }, ref) => {
    const button = <Button ref={ref} type="button" size="icon" {...props} aria-label={label} />;
    if (!showTooltip) return button;
    return (
      <Tooltip>
        <TooltipTrigger asChild>{button}</TooltipTrigger>
        <TooltipContent side={tooltipSide}>{label}</TooltipContent>
      </Tooltip>
    );
  },
);
IconButton.displayName = "IconButton";
