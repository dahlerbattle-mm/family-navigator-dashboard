import {
  IconDashboard,
  IconBook,
  IconClipboardList,
  IconUpload,
} from "@tabler/icons-react"; // Replace with actual icons

import { uniqueId } from "lodash";

const Menuitems = [
  {
    navlabel: true,
    subheader: "Executive Summary",
  },
  {
    id: uniqueId(),
    title: "Participants",
    icon: IconDashboard,
    href: "/executive-summary/participants",
  },
  {
    id: uniqueId(),
    title: "Summary",
    icon: IconDashboard,
    href: "/executive-summary/summary",
  },
  {
    id: uniqueId(),
    title: "Heatmap",
    icon: IconDashboard,
    href: "/executive-summary/heatmap",
  },
  {
    navlabel: true,
    subheader: "Family Dynamics",
  },
  {
    id: uniqueId(),
    title: "Overall Scores",
    icon: IconClipboardList,
    href: "/family-dynamics/overall-scores",
  },
  {
    id: uniqueId(),
    title: "Definitions",
    icon: IconBook,
    href: "/family-dynamics/definitions",
  },
  {
    id: uniqueId(),
    title: "Questions",
    icon: IconClipboardList,
    href: "/family-dynamics/questions",
  },
  {
    navlabel: true,
    subheader: "Preparation and Development",
  },
  {
    id: uniqueId(),
    title: "Overall Scores",
    icon: IconClipboardList,
    href: "/preparation-development/overall-scores",
  },
  {
    id: uniqueId(),
    title: "Definitions",
    icon: IconBook,
    href: "/preparation-development/definitions",
  },
  {
    id: uniqueId(),
    title: "Questions",
    icon: IconClipboardList,
    href: "/preparation-development/questions",
  },
  {
    navlabel: true,
    subheader: "Business Preservation and Growth",
  },
  {
    id: uniqueId(),
    title: "Overall Scores",
    icon: IconClipboardList,
    href: "/business-preservation-growth/overall-scores",
  },
  {
    id: uniqueId(),
    title: "Definitions",
    icon: IconBook,
    href: "/business-preservation-growth/definitions",
  },
  {
    id: uniqueId(),
    title: "Questions",
    icon: IconClipboardList,
    href: "/business-preservation-growth/questions",
  },
  {
    navlabel: true,
    subheader: "Transition Planning",
  },
  {
    id: uniqueId(),
    title: "Overall Scores",
    icon: IconClipboardList,
    href: "/transition-planning/overall-scores",
  },
  {
    id: uniqueId(),
    title: "Definitions",
    icon: IconBook,
    href: "/transition-planning/definitions",
  },
  {
    id: uniqueId(),
    title: "Questions",
    icon: IconClipboardList,
    href: "/transition-planning/questions",
  },
  {
    navlabel: true,
    subheader: "Getting Started",
  },
  {
    id: uniqueId(),
    title: "Getting Started",
    icon: IconUpload,
    href: "/getting-started",
  },
];

export default Menuitems;
