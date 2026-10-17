import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { useProjects, useSettings } from "@/lib/content";
import { toast } from "sonner";

/** The nav button and any other surface ask for the palette with this event. */
export const OPEN_PALETTE = "jo:open-palette";

const SURFACES = [
  { to: "/", label: "Home", note: "The front door" },
  { to: "/work", label: "Work", note: "Selected case studies" },
  { to: "/build", label: "Build", note: "Products in development" },
  { to: "/think", label: "Think", note: "Writing and ideas" },
  { to: "/teach", label: "Teach", note: "Technology and AI education" },
  { to: "/about", label: "About", note: "Who is building this" },
  { to: "/lab", label: "The Lab", note: "Live experiments" },
  { to: "/contact", label: "Contact", note: "Start a conversation" },
];

type Props = { open: boolean; onOpenChange: (open: boolean) => void };

/**
 * Command surface. Cmd / Ctrl + K anywhere on the site opens it: pages, every
 * published case study, and the actions a visitor usually has to hunt for.
 */
export function CommandPalette({ open, onOpenChange }: Props) {
  const navigate = useNavigate();
  const { data: projects } = useProjects();
  const { data: settings } = useSettings();

  // Global keyboard wiring lives here so the trigger works from any surface.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        onOpenChange(true);
      }
    };
    const onRequest = () => onOpenChange(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener(OPEN_PALETTE, onRequest);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(OPEN_PALETTE, onRequest);
    };
  }, [onOpenChange]);

  const closeAnd = (action: () => void) => {
    onOpenChange(false);
    action();
  };

  const copyEmail = async () => {
    if (!settings?.email) return;
    try {
      await navigator.clipboard.writeText(settings.email);
      onOpenChange(false);
      toast.success(settings.email, { description: "Copied. Paste it into your mail client." });
    } catch {
      toast.error("Could not reach the clipboard.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl gap-0 overflow-hidden border-border-strong bg-background/95 p-0 backdrop-blur-xl sm:rounded-none">
        <DialogTitle className="sr-only">Command palette</DialogTitle>
        <Command className="bg-transparent" shouldFilter>
          <CommandInput
            placeholder="Jump to a page, a project or an action…"
            className="h-14 text-base placeholder:text-muted-foreground/50"
          />
          <CommandList className="max-h-[62vh]">
            <CommandEmpty>No match. Try work, teach or email.</CommandEmpty>

            <CommandGroup heading="Surfaces" className="p-0">
              {SURFACES.map((item) => (
                <CommandItem
                  key={item.to}
                  value={`${item.label} ${item.note}`}
                  onSelect={() => closeAnd(() => navigate({ to: item.to }))}
                  className="label-tech gap-4 rounded-none px-5 py-3 text-foreground data-[selected=true]:bg-accent/10 data-[selected=true]:text-accent"
                >
                  <span className="w-16 text-accent">{item.label.toUpperCase()}</span>
                  <span className="text-muted-foreground">{item.note}</span>
                </CommandItem>
              ))}
            </CommandGroup>

            {(projects?.length ?? 0) > 0 && (
              <>
                <CommandSeparator className="mx-5 my-2 bg-border" />
                <CommandGroup heading="Case studies" className="p-0">
                  {(projects ?? []).map((project) => (
                    <CommandItem
                      key={project.id}
                      value={`${project.title} ${project.category ?? ""} ${project.year ?? ""}`}
                      onSelect={() =>
                        closeAnd(() =>
                          navigate({ to: "/work/$slug", params: { slug: project.slug } }),
                        )
                      }
                      className="label-tech gap-4 rounded-none px-5 py-3 data-[selected=true]:bg-accent/10 data-[selected=true]:text-accent"
                    >
                      <span className="truncate text-foreground">{project.title}</span>
                      <span className="ml-auto shrink-0 text-muted-foreground">
                        {project.category}
                      </span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}

            <CommandSeparator className="mx-5 my-2 bg-border" />
            <CommandGroup heading="Actions" className="p-0">
              {settings?.email && (
                <CommandItem
                  value="Copy email address"
                  onSelect={copyEmail}
                  className="label-tech gap-4 rounded-none px-5 py-3 data-[selected=true]:bg-accent/10 data-[selected=true]:text-accent"
                >
                  <span className="text-accent">COPY</span>
                  <span className="text-muted-foreground">{settings.email}</span>
                </CommandItem>
              )}
              {settings?.youtube_url && (
                <CommandItem
                  value="YouTube channel"
                  onSelect={() => window.open(settings.youtube_url ?? "", "_blank")}
                  className="label-tech gap-4 rounded-none px-5 py-3 data-[selected=true]:bg-accent/10 data-[selected=true]:text-accent"
                >
                  <span className="text-accent">OPEN</span>
                  <span className="text-muted-foreground">YouTube channel</span>
                </CommandItem>
              )}
              {settings?.linkedin_url && (
                <CommandItem
                  value="LinkedIn profile"
                  onSelect={() => window.open(settings.linkedin_url ?? "", "_blank")}
                  className="label-tech gap-4 rounded-none px-5 py-3 data-[selected=true]:bg-accent/10 data-[selected=true]:text-accent"
                >
                  <span className="text-accent">OPEN</span>
                  <span className="text-muted-foreground">LinkedIn profile</span>
                </CommandItem>
              )}
              <CommandItem
                value="Back to top"
                onSelect={() => closeAnd(() => window.scrollTo({ top: 0, behavior: "smooth" }))}
                className="label-tech gap-4 rounded-none px-5 py-3 data-[selected=true]:bg-accent/10 data-[selected=true]:text-accent"
              >
                <span className="text-accent">SCROLL</span>
                <span className="text-muted-foreground">Back to the top</span>
              </CommandItem>
            </CommandGroup>
          </CommandList>

          <div className="flex items-center justify-between border-t border-border px-5 py-3 label-tech text-muted-foreground/70">
            <span>↑ ↓ MOVE · ↵ OPEN · ESC CLOSE</span>
            <span className="text-accent/70">SYSTEM READY</span>
          </div>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
