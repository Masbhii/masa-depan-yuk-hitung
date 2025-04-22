
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface NeumorphicCardProps {
  children: ReactNode;
  className?: string;
  elevated?: boolean;
}

export function NeumorphicCard({ 
  children, 
  className,
  elevated = false,
}: NeumorphicCardProps) {
  return (
    <div
      className={cn(
        "bg-white rounded-xl p-6",
        elevated 
          ? "shadow-[0_10px_20px_rgba(0,0,0,0.08),_0_3px_8px_rgba(0,0,0,0.06),_inset_0_-1px_1px_rgba(0,0,0,0.05)]" 
          : "shadow-[0_4px_12px_rgba(0,0,0,0.05),_0_1px_3px_rgba(0,0,0,0.03),_inset_0_-1px_1px_rgba(0,0,0,0.03)]",
        className
      )}
    >
      {children}
    </div>
  );
}

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  colorClass?: string;
}

export function GlassCard({ 
  children, 
  className,
  colorClass = "from-purple-light/60 to-white/90"
}: GlassCardProps) {
  return (
    <div
      className={cn(
        "bg-gradient-to-br backdrop-blur-sm rounded-xl p-6 border border-white/30",
        colorClass,
        "shadow-[0_10px_20px_rgba(0,0,0,0.06),_0_2px_6px_rgba(0,0,0,0.04)]",
        className
      )}
    >
      {children}
    </div>
  );
}

interface InfoPanelProps {
  title: string;
  value: string | number;
  trend?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export function InfoPanel({
  title,
  value,
  trend,
  prefix,
  suffix,
  className,
}: InfoPanelProps) {
  const trendColor = trend 
    ? trend > 0 
      ? "text-finansial-green" 
      : "text-finansial-red" 
    : "";
  
  const trendSign = trend 
    ? trend > 0 
      ? "+" 
      : "" 
    : "";

  return (
    <div className={cn("flex flex-col", className)}>
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <div className="flex items-baseline mt-1 space-x-1">
        {prefix && <span className="text-gray-600">{prefix}</span>}
        <span className="text-2xl font-bold">{value}</span>
        {suffix && <span className="text-gray-600">{suffix}</span>}
      </div>
      {trend !== undefined && (
        <div className={cn("text-sm font-medium mt-1", trendColor)}>
          {trendSign}{trend.toFixed(2)}%
        </div>
      )}
    </div>
  );
}

interface NeumorphicButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  active?: boolean;
  disabled?: boolean;
}

export function NeumorphicButton({
  children,
  className,
  onClick,
  active = false,
  disabled = false,
}: NeumorphicButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "relative px-6 py-3 rounded-xl font-medium transition-all duration-200",
        "bg-gradient-to-b from-white to-gray-100",
        active 
          ? "shadow-[inset_0_2px_5px_rgba(0,0,0,0.1),_inset_0_1px_2px_rgba(0,0,0,0.08)] transform translate-y-[1px]"
          : "shadow-[0_4px_10px_rgba(0,0,0,0.05),_0_1px_3px_rgba(0,0,0,0.1)]",
        "hover:shadow-[0_6px_15px_rgba(0,0,0,0.08),_0_2px_5px_rgba(0,0,0,0.06)]",
        "active:shadow-[inset_0_2px_5px_rgba(0,0,0,0.1),_inset_0_1px_2px_rgba(0,0,0,0.08)] active:transform active:translate-y-[1px]",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      {children}
    </button>
  );
}

interface GradientBorderProps {
  children: ReactNode;
  className?: string;
  borderWidth?: number;
}

export function GradientBorder({
  children,
  className,
  borderWidth = 1,
}: GradientBorderProps) {
  return (
    <div className={cn("relative rounded-xl p-[2px] bg-gradient-to-br from-purple-400/60 to-purple-100", className)}>
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-purple-400/60 to-purple-100 blur-sm opacity-50" />
      <div className="relative bg-white rounded-[calc(0.75rem-1px)] h-full">
        {children}
      </div>
    </div>
  );
}

interface NeumorphicInputProps {
  label?: string;
  type?: string;
  placeholder?: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  prefix?: string;
  suffix?: string;
  className?: string;
  min?: number;
  max?: number;
  step?: number;
  error?: string;
}

export function NeumorphicInput({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  prefix,
  suffix,
  className,
  min,
  max,
  step,
  error,
}: NeumorphicInputProps) {
  return (
    <div className={cn("w-full", className)}>
      {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
      <div className="relative rounded-lg shadow-[inset_0_2px_4px_rgba(0,0,0,0.05),_inset_0_1px_2px_rgba(0,0,0,0.1)]">
        {prefix && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <span className="text-gray-500">{prefix}</span>
          </div>
        )}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          min={min}
          max={max}
          step={step}
          className={cn(
            "w-full py-3 bg-white/90 rounded-lg text-gray-800 transition-shadow duration-200",
            "focus:outline-none focus:ring-2 focus:ring-purple-300 focus:bg-white",
            prefix ? "pl-10" : "pl-4",
            suffix ? "pr-10" : "pr-4",
            error ? "border border-finansial-red" : "border border-transparent",
          )}
        />
        {suffix && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <span className="text-gray-500">{suffix}</span>
          </div>
        )}
      </div>
      {error && <p className="mt-1 text-sm text-finansial-red">{error}</p>}
    </div>
  );
}

interface TabsProps {
  tabs: {id: string, label: string}[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
}

export function NeumorphicTabs({
  tabs,
  activeTab,
  onChange,
  className,
}: TabsProps) {
  return (
    <div className={cn("flex p-1 bg-gray-100/50 rounded-lg shadow-inner", className)}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={cn(
            "flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all duration-200",
            activeTab === tab.id 
              ? "bg-white shadow-[0_2px_6px_rgba(0,0,0,0.06)] text-gray-800" 
              : "bg-transparent text-gray-500 hover:bg-white/40"
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

interface SectionProps {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

export function Section({
  title,
  description,
  children,
  className,
}: SectionProps) {
  return (
    <section className={cn("my-8", className)}>
      <div className="mb-4">
        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
        {description && <p className="mt-1 text-gray-500">{description}</p>}
      </div>
      {children}
    </section>
  );
}
