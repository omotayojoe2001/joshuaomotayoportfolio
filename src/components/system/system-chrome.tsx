import { useEffect, useState } from "react";
import { Toaster } from "sonner";
import { installPointerTracking } from "@/lib/pointer";
import { AmbientField } from "@/components/system/ambient-field";
import { Cursor } from "@/components/system/cursor";
import { ScrollRail } from "@/components/system/scroll-rail";
import { CommandPalette } from "@/components/system/command-palette";

/**
 * The machine room. Mounted once, under the router: pointer bus, ambient
 * field, cursor, instrument rail, command surface and the toast host.
 */
export function SystemChrome() {
  const [paletteOpen, setPaletteOpen] = useState(false);

  useEffect(() => installPointerTracking(), []);

  return (
    <>
      <AmbientField />
      <ScrollRail />
      <Cursor />
      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
      <Toaster position="bottom-right" theme="dark" closeButton duration={4200} />
    </>
  );
}
