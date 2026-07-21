"use client";

import { useTheme } from "next-themes";
import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  DEFAULT_SETTINGS,
  FONT_OPTIONS,
  FONT_SIZE_MAX,
  FONT_SIZE_MIN,
  FONT_VAR_MAP,
  type NavLayout,
  NEUTRAL_OPTIONS,
  PRESET_OPTIONS,
  RADIUS_OPTIONS,
} from "@/lib/settings/config";
import { useSettingsStore } from "@/lib/stores/settings-store";
import { useUiStore } from "@/lib/stores/ui-store";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/*                                Small parts                                 */
/* -------------------------------------------------------------------------- */

function ToggleCard({
  icon,
  label,
  checked,
  onCheckedChange,
}: {
  /** Iconify Tailwind class, e.g. "icon-[solar--sun-2-bold-duotone]" */
  icon: string;
  label: string;
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
}) {
  // The switch is the sole accessible control; the absolute overlay button
  // only widens the pointer target to the whole card. Keeping it a *sibling*
  // of the switch avoids nesting button-in-button (invalid HTML, hydration
  // error). The switch is position:relative, so being later in the DOM it
  // stacks above the overlay and direct clicks on it don't double-toggle.
  return (
    <div
      className={cn(
        "relative flex flex-col gap-4 rounded-xl border p-4 text-left transition-colors",
        checked ? "border-primary bg-primary/5" : "hover:bg-accent",
      )}
    >
      <button
        type="button"
        aria-hidden
        tabIndex={-1}
        onClick={() => onCheckedChange(!checked)}
        className="absolute inset-0 cursor-pointer rounded-xl"
      />
      <div className="flex items-center justify-between">
        {/* Muted when off, primary when on — full foreground reads too heavy */}
        <span
          className={cn(
            icon,
            "size-5",
            checked ? "text-primary" : "text-muted-foreground",
          )}
          aria-hidden
        />
        <Switch checked={checked} onCheckedChange={onCheckedChange} />
      </div>
      <span className="text-sm font-semibold">{label}</span>
    </div>
  );
}

/** Tri-state theme mode picker (light / system / dark), next-themes backed. */
function ModeCard() {
  const { theme, setTheme } = useTheme();
  const value = theme ?? "system";
  const options = [
    {
      value: "light",
      icon: "icon-[solar--sun-2-line-duotone]",
      label: "Light",
    },
    {
      value: "system",
      icon: "icon-[solar--monitor-line-duotone]",
      label: "System",
    },
    { value: "dark", icon: "icon-[solar--moon-line-duotone]", label: "Dark" },
  ];
  return (
    <div className="flex flex-col justify-between gap-4 rounded-xl border p-4">
      <div className="grid grid-cols-3 gap-1 rounded-lg bg-muted p-1">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            aria-label={`${option.label} mode`}
            aria-pressed={value === option.value}
            onClick={() => setTheme(option.value)}
            className={cn(
              "flex h-7 items-center justify-center rounded-md transition-colors",
              value === option.value
                ? "bg-card text-primary shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <span className={cn(option.icon, "size-4.5")} aria-hidden />
          </button>
        ))}
      </div>
      <span className="text-sm font-semibold">Mode</span>
    </div>
  );
}

/** Dark pill that floats on the section's top border, Minimals-style. */
function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <Badge className="absolute -top-3 left-5 rounded-full border-0 bg-foreground px-3 py-1 text-xs font-semibold text-background">
      {children}
    </Badge>
  );
}

/** Mini sidebar schematic tinted with the preset color. */
function PresetGlyph({ color }: { color: string }) {
  return (
    <span
      className="flex h-8 w-9 gap-1 rounded-lg p-1.5"
      style={{
        backgroundColor: `color-mix(in oklab, ${color} 24%, transparent)`,
      }}
    >
      <span
        className="h-full w-1.5 rounded-[3px]"
        style={{ backgroundColor: color }}
      />
      <span className="flex flex-1 flex-col justify-center gap-1">
        <span
          className="h-0.5 w-full rounded-full"
          style={{ backgroundColor: color }}
        />
        <span
          className="h-0.5 w-2/3 rounded-full opacity-60"
          style={{ backgroundColor: color }}
        />
      </span>
    </span>
  );
}

/** Tiny schematic of each shell layout, drawn with theme tokens. */
function LayoutGlyph({ variant }: { variant: NavLayout }) {
  if (variant === "horizontal") {
    return (
      <div className="flex h-full w-full flex-col gap-1 p-1.5">
        <div className="flex items-center gap-1 rounded bg-primary/70 px-1 py-1">
          <span className="size-1.5 rounded-full bg-primary-foreground" />
          <span className="h-1 w-3 rounded-full bg-primary-foreground/70" />
        </div>
        <div className="flex-1 rounded bg-muted" />
      </div>
    );
  }
  return (
    <div className="flex h-full w-full gap-1 p-1.5">
      <div
        className={cn(
          "flex flex-col gap-1 rounded bg-primary/70 p-1",
          variant === "mini" ? "w-2.5" : "w-5",
        )}
      >
        <span className="h-1 w-full rounded-full bg-primary-foreground/80" />
        {variant === "vertical" && (
          <span className="h-1 w-3/4 rounded-full bg-primary-foreground/50" />
        )}
      </div>
      <div className="flex-1 rounded bg-muted" />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                  Drawer                                    */
/* -------------------------------------------------------------------------- */

const NAV_LAYOUTS: NavLayout[] = ["vertical", "horizontal", "mini"];

/** Gear button that lives in the header; only toggles the store flag. */
export function SettingsTrigger() {
  const toggleSettings = useUiStore((s) => s.toggleSettings);
  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Open settings"
      onClick={toggleSettings}
      className="rounded-full"
    >
      <span
        className="icon-[solar--settings-line-duotone] size-5"
        aria-hidden
      />
    </Button>
  );
}

export function SettingsDrawer() {
  const settingsOpen = useUiStore((s) => s.settingsOpen);
  const setSettingsOpen = useUiStore((s) => s.setSettingsOpen);

  const {
    contrast,
    compact,
    maxWidth,
    navLayout,
    navColor,
    preset,
    neutral,
    radius,
    customHex,
    setContrast,
    setCompact,
    setMaxWidth,
    setNavLayout,
    setNavColor,
    setPreset,
    setNeutral,
    setRadius,
    setCustomPrimary,
    fontFamily,
    fontSize,
    setFontFamily,
    setFontSize,
    reset,
  } = useSettingsStore();

  // Drives the dot on the reset button (theme mode is left out: a dark OS
  // preference would otherwise read as "modified" on a fresh visit).
  const isDirty =
    contrast !== DEFAULT_SETTINGS.contrast ||
    compact !== DEFAULT_SETTINGS.compact ||
    maxWidth !== DEFAULT_SETTINGS.maxWidth ||
    navLayout !== DEFAULT_SETTINGS.navLayout ||
    navColor !== DEFAULT_SETTINGS.navColor ||
    preset !== DEFAULT_SETTINGS.preset ||
    neutral !== DEFAULT_SETTINGS.neutral ||
    radius !== DEFAULT_SETTINGS.radius ||
    fontFamily !== DEFAULT_SETTINGS.fontFamily ||
    fontSize !== DEFAULT_SETTINGS.fontSize;

  return (
    <Sheet open={settingsOpen} onOpenChange={setSettingsOpen} modal={false}>
      <SheetContent
        overlay={false}
        // Built-in close overlaps our header tool row; we render our own.
        showCloseButton={false}
        // Non-modal: keep the drawer open while the user interacts with the
        // page (live-previewing settings). Close only via the X or Escape.
        onInteractOutside={(e) => e.preventDefault()}
        className="w-full gap-0 p-0 sm:max-w-sm"
      >
        <SheetHeader className="flex-row items-center justify-between border-b">
          <SheetTitle>Settings</SheetTitle>
          <SheetDescription className="sr-only">
            Customize theme, layout, presets and fonts.
          </SheetDescription>
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Reset settings"
              onClick={reset}
              className="relative rounded-full"
            >
              <span
                className="icon-[solar--restart-linear] size-4.5"
                aria-hidden
              />
              {/* Dirty indicator, Minimals-style */}
              {isDirty && (
                <span className="absolute top-1 right-1 size-2 rounded-full bg-destructive" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Close settings"
              onClick={() => setSettingsOpen(false)}
              className="rounded-full"
            >
              <span
                className="icon-[solar--close-circle-linear] size-5"
                aria-hidden
              />
            </Button>
          </div>
        </SheetHeader>

        <div className="flex flex-col gap-8 overflow-y-auto p-6">
          {/* Mode / Contrast / Compact */}
          <div className="grid grid-cols-2 gap-4">
            <ModeCard />
            <ToggleCard
              icon="icon-[solar--filters-line-duotone]"
              label="Contrast"
              checked={contrast}
              onCheckedChange={setContrast}
            />
            <ToggleCard
              icon="icon-[solar--align-vertical-spacing-line-duotone]"
              label="Compact"
              checked={compact}
              onCheckedChange={setCompact}
            />
            <ToggleCard
              icon="icon-[solar--align-horizonta-spacing-line-duotone]"
              label="Max Width"
              checked={maxWidth}
              onCheckedChange={setMaxWidth}
            />
          </div>

          {/* Nav */}
          <section className="relative flex flex-col gap-4 rounded-2xl border p-4 pt-7">
            <SectionTitle>Nav</SectionTitle>
            <div className="flex flex-col gap-2">
              <span className="text-sm text-muted-foreground">Layout</span>
              <div className="grid grid-cols-3 gap-2">
                {NAV_LAYOUTS.map((variant) => (
                  <button
                    key={variant}
                    type="button"
                    aria-label={`${variant} layout`}
                    aria-pressed={navLayout === variant}
                    onClick={() => setNavLayout(variant)}
                    className={cn(
                      "aspect-[4/3] rounded-lg border bg-card transition-colors",
                      navLayout === variant
                        ? "border-primary ring-2 ring-primary/30"
                        : "hover:bg-accent",
                    )}
                  >
                    <LayoutGlyph variant={variant} />
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-sm text-muted-foreground">Color</span>
              <div className="grid grid-cols-2 gap-2">
                {/* Glyphs mirror the effect: outline = blended into the page,
                    filled = distinct dark surface */}
                {(
                  [
                    {
                      value: "integrate",
                      icon: "icon-[solar--sidebar-minimalistic-linear]",
                    },
                    {
                      value: "apparent",
                      icon: "icon-[solar--sidebar-minimalistic-bold-duotone]",
                    },
                  ] as const
                ).map(({ value, icon }) => (
                  <Button
                    key={value}
                    type="button"
                    variant={navColor === value ? "default" : "outline"}
                    onClick={() => setNavColor(value)}
                    className="justify-start gap-2 capitalize"
                  >
                    <span className={cn(icon, "size-4")} aria-hidden />
                    {value}
                  </Button>
                ))}
              </div>
            </div>
          </section>

          {/* Presets */}
          <section className="relative flex flex-col gap-4 rounded-2xl border p-4 pt-7">
            <SectionTitle>Presets</SectionTitle>
            <div className="flex flex-col gap-2">
              <span className="text-sm text-muted-foreground">Theme color</span>
              <div className="grid grid-cols-3 gap-2">
                {PRESET_OPTIONS.map(({ value, swatch }) => (
                  <button
                    key={value}
                    type="button"
                    aria-label={`${value} preset`}
                    aria-pressed={preset === value}
                    onClick={() => setPreset(value)}
                    className={cn(
                      "flex h-16 items-center justify-center rounded-xl transition-colors",
                      preset !== value && "hover:bg-accent",
                    )}
                    // Selected card is washed with its own preset color
                    style={
                      preset === value
                        ? {
                            backgroundColor: `color-mix(in oklab, ${swatch} 10%, transparent)`,
                          }
                        : undefined
                    }
                  >
                    <PresetGlyph color={swatch} />
                  </button>
                ))}
              </div>
              {/* Custom brand color — native picker; the chart ladder is
                  derived from the pick in @/lib/settings/color */}
              <label
                className={cn(
                  "relative flex h-12 cursor-pointer items-center gap-3 rounded-xl border px-4 transition-colors",
                  preset === "custom"
                    ? "border-primary bg-primary/5"
                    : "hover:bg-accent",
                )}
              >
                <input
                  type="color"
                  value={customHex ?? "#2b7eff"}
                  onChange={(e) => setCustomPrimary(e.target.value)}
                  aria-label="Pick a custom theme color"
                  className="absolute inset-0 size-full cursor-pointer opacity-0"
                />
                <span
                  className="size-6 shrink-0 rounded-full border"
                  style={{
                    background:
                      customHex ??
                      "conic-gradient(in oklch longer hue, oklch(0.7 0.18 0), oklch(0.7 0.18 360))",
                  }}
                  aria-hidden
                />
                <span className="text-sm font-medium">
                  {customHex ? `Custom ${customHex}` : "Custom color"}
                </span>
              </label>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-sm text-muted-foreground">Base color</span>
              <div className="grid grid-cols-5 gap-1">
                {NEUTRAL_OPTIONS.map(({ value, label, swatch }) => (
                  <button
                    key={value}
                    type="button"
                    aria-label={`${label} base color`}
                    aria-pressed={neutral === value}
                    onClick={() => setNeutral(value)}
                    className={cn(
                      "flex flex-col items-center gap-1.5 rounded-lg py-2 transition",
                      neutral === value
                        ? "bg-card shadow-md"
                        : "hover:bg-accent",
                    )}
                  >
                    <span
                      className="size-5 rounded-full"
                      style={{ backgroundColor: swatch }}
                      aria-hidden
                    />
                    <span
                      className={cn(
                        "text-[11px] leading-none",
                        neutral === value
                          ? "font-medium"
                          : "text-muted-foreground",
                      )}
                    >
                      {label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-sm text-muted-foreground">Radius</span>
              <div className="grid grid-cols-4 gap-2">
                {RADIUS_OPTIONS.map(({ value, label }) => (
                  <button
                    key={value}
                    type="button"
                    aria-label={`${label} radius`}
                    aria-pressed={radius === value}
                    onClick={() => setRadius(value)}
                    className={cn(
                      "flex h-12 items-center justify-center rounded-lg border bg-card transition-colors",
                      radius === value
                        ? "border-primary text-primary ring-2 ring-primary/30"
                        : "text-muted-foreground hover:bg-accent",
                    )}
                  >
                    {/* Corner preview: top-left edge drawn at this step's radius */}
                    <span
                      className="size-5 border-current border-t-2 border-l-2"
                      style={{ borderTopLeftRadius: `${value * 16}px` }}
                      aria-hidden
                    />
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Font */}
          <section className="relative flex flex-col gap-4 rounded-2xl border p-4 pt-7">
            <SectionTitle>Font</SectionTitle>
            <div className="flex flex-col gap-2">
              <span className="text-sm text-muted-foreground">Family</span>
              <div className="grid grid-cols-2 gap-2">
                {FONT_OPTIONS.map(({ value, label }) => {
                  const active = fontFamily === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      aria-pressed={active}
                      onClick={() => setFontFamily(value)}
                      // Each card previews its own typeface
                      style={{ fontFamily: FONT_VAR_MAP[value] }}
                      className={cn(
                        "flex flex-col items-center gap-1.5 rounded-xl py-5 transition",
                        active
                          ? "bg-card shadow-md"
                          : "text-muted-foreground hover:bg-accent",
                      )}
                    >
                      <span className="text-2xl font-bold leading-none">
                        <span
                          className={
                            active ? "text-primary" : "text-foreground/60"
                          }
                        >
                          A
                        </span>
                        <span
                          className={
                            active ? "text-primary/40" : "text-foreground/30"
                          }
                        >
                          a
                        </span>
                      </span>
                      <span
                        className={cn(
                          "text-sm",
                          active && "font-medium text-foreground",
                        )}
                      >
                        {label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-sm text-muted-foreground">Size</span>
              {(() => {
                const pct =
                  ((fontSize - FONT_SIZE_MIN) /
                    (FONT_SIZE_MAX - FONT_SIZE_MIN)) *
                  100;
                return (
                  <div className="relative pt-9">
                    {/* Value bubble riding the thumb (offset corrects for the
                        thumb's own radius at the track ends) */}
                    <div
                      className="absolute top-0 -translate-x-1/2 rounded-lg bg-foreground px-2 py-1 text-xs font-semibold text-background after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-4 after:border-transparent after:border-t-foreground"
                      style={{
                        left: `calc(${pct}% + ${(50 - pct) * 0.18}px)`,
                      }}
                    >
                      {fontSize}px
                    </div>
                    <div className="relative">
                      {/* Step ticks over the track */}
                      <div className="pointer-events-none absolute inset-x-1 top-1/2 z-10 flex -translate-y-1/2 justify-between">
                        {Array.from(
                          { length: FONT_SIZE_MAX - FONT_SIZE_MIN + 1 },
                          (_, i) => FONT_SIZE_MIN + i,
                        ).map((size) => (
                          <span
                            key={size}
                            className="h-1.5 w-px rounded-full bg-muted-foreground/30"
                          />
                        ))}
                      </div>
                      <Slider
                        value={[fontSize]}
                        min={FONT_SIZE_MIN}
                        max={FONT_SIZE_MAX}
                        step={1}
                        onValueChange={([v]) => setFontSize(v)}
                        className="[&_[data-slot=slider-range]]:bg-linear-to-r [&_[data-slot=slider-range]]:from-primary/35 [&_[data-slot=slider-range]]:to-primary [&_[data-slot=slider-thumb]]:size-5 [&_[data-slot=slider-thumb]]:border-0 [&_[data-slot=slider-thumb]]:bg-background [&_[data-slot=slider-thumb]]:shadow-md [&_[data-slot=slider-track]]:h-2"
                      />
                    </div>
                  </div>
                );
              })()}
            </div>
          </section>
        </div>
      </SheetContent>
    </Sheet>
  );
}
