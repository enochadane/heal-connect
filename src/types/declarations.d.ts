declare module 'lucide-react' {
  import * as React from 'react';
  export interface LucideProps extends React.SVGProps<SVGSVGElement> {
    size?: string | number;
    color?: string;
    strokeWidth?: string | number;
    className?: string;
    title?: string;
  }
  export type LucideIcon = React.ForwardRefExoticComponent<
    LucideProps & React.RefAttributes<SVGSVGElement>
  >;

  export const HeartHandshake: LucideIcon;
  export const Search: LucideIcon;
  export const ShieldCheck: LucideIcon;
  export const Menu: LucideIcon;
  export const X: LucideIcon;
  export const PhoneCall: LucideIcon;
  export const Phone: LucideIcon;
  export const Mail: LucideIcon;
  export const ShieldAlert: LucideIcon;
  export const Sparkles: LucideIcon;
  export const Copy: LucideIcon;
  export const Check: LucideIcon;
  export const Calendar: LucideIcon;
  export const CalendarCheck: LucideIcon;
  export const Clock: LucideIcon;
  export const CreditCard: LucideIcon;
  export const ExternalLink: LucideIcon;
  export const MessageSquareCheck: LucideIcon;
  export const Star: LucideIcon;
  export const MapPin: LucideIcon;
  export const Video: LucideIcon;
  export const Award: LucideIcon;
  export const ArrowRight: LucideIcon;
  export const ArrowLeft: LucideIcon;
  export const Stethoscope: LucideIcon;
  export const DollarSign: LucideIcon;
  export const SlidersHorizontal: LucideIcon;
  export const RotateCcw: LucideIcon;
  export const LayoutDashboard: LucideIcon;
  export const Users: LucideIcon;
  export const UserPlus: LucideIcon;
  export const Globe: LucideIcon;
  export const LogOut: LucideIcon;
  export const Lock: LucideIcon;
  export const AlertCircle: LucideIcon;
  export const UserCheck: LucideIcon;
  export const TrendingUp: LucideIcon;
  export const ArrowUpRight: LucideIcon;
  export const Eye: LucideIcon;
  export const Edit: LucideIcon;
  export const Trash2: LucideIcon;
  export const Upload: LucideIcon;
  export const ImageIcon: LucideIcon;
  export const Image: LucideIcon;
  export const Save: LucideIcon;
  export const GraduationCap: LucideIcon;
  export const Building2: LucideIcon;
  export const Languages: LucideIcon;
  export const Share2: LucideIcon;
  export const CheckCircle2: LucideIcon;
  export const MessageSquare: LucideIcon;
  export const BadgeCheck: LucideIcon;
  export const ChevronRight: LucideIcon;
  export const Headphones: LucideIcon;
  export const HelpCircle: LucideIcon;
  export const FilterX: LucideIcon;
  export const XCircle: LucideIcon;
  export const Loader2: LucideIcon;
  export const Landmark: LucideIcon;
  export const Smartphone: LucideIcon;
  export const RefreshCw: LucideIcon;
  export const Receipt: LucideIcon;
  export const ClipboardCopy: LucideIcon;
}
