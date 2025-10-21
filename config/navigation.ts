import {
  Activity,
  BarChart3,
  Building2,
  Database,
  FileText,
  Globe,
  HelpCircle,
  MessageSquare,
  Server,
  Settings,
  Zap,
} from "lucide-react";

const navigation = [
  {
    name: "Dashboard",
    href: "/",
    icon: BarChart3,
  },
  {
    name: "Servers",
    href: "/servers",
    icon: Server,
  },
  {
    name: "Ads",
    href: "/ads",
    icon: Zap,
  },
  {
    name: "Feedback",
    href: "/feedback",
    icon: MessageSquare,
  },
  {
    name: "Connectivity",
    href: "/connectivity",
    icon: Activity,
  },
  {
    name: "Pages",
    href: "/pages",
    icon: FileText,
  },
  {
    name: "Faqs",
    href: "/faqs",
    icon: HelpCircle,
  },
  {
    name: "Countries",
    href: "/countries",
    icon: Globe,
  },
  {
    name: "Cities",
    href: "/cities",
    icon: Building2,
  },
  {
    name: "Dropdowns",
    href: "/dropdowns",
    icon: Settings,
  },
  {
    name: "Redis",
    href: "/redis",
    icon: Database,
  },
];

export default navigation;
