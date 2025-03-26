
import * as AspectRatioPrimitive from "@radix-ui/react-aspect-ratio"
import { cn } from "@/lib/utils"

const AspectRatio = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof AspectRatioPrimitive.Root>) => (
  <AspectRatioPrimitive.Root
    className={cn(className)}
    {...props}
  />
)

export { AspectRatio }
