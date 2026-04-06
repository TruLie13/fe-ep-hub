import AirOutlined from "@mui/icons-material/AirOutlined";
import ArticleOutlined from "@mui/icons-material/ArticleOutlined";
import BalanceOutlined from "@mui/icons-material/BalanceOutlined";
import BoltOutlined from "@mui/icons-material/BoltOutlined";
import Gavel from "@mui/icons-material/Gavel";
import GppBad from "@mui/icons-material/GppBad";
import MapOutlined from "@mui/icons-material/MapOutlined";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import VolumeUpOutlined from "@mui/icons-material/VolumeUpOutlined";
import WaterDrop from "@mui/icons-material/WaterDrop";
import WhatshotOutlined from "@mui/icons-material/WhatshotOutlined";
import type { SvgIconProps } from "@mui/material/SvgIcon";
import type { ElementType } from "react";

/** Built-in icon keys; any other string still renders using a generic fallback icon. */
const ICONS: Record<string, ElementType<SvgIconProps>> = {
  map: MapOutlined,
  water: WaterDrop,
  bolt: BoltOutlined,
  air: AirOutlined,
  heat: WhatshotOutlined,
  volume: VolumeUpOutlined,
  balance: BalanceOutlined,
  gavel: Gavel,
  /** “Alert” shield: more visible than a thin outline icon in the section header. */
  "shield-alert": GppBad,
  "eye-off": VisibilityOff,
};

const FALLBACK_ICON = ArticleOutlined;

export function DataCenterSectionIcon({
  iconKey,
  ...props
}: { iconKey?: string | null } & SvgIconProps) {
  if (!iconKey?.trim()) return null;
  const Cmp = ICONS[iconKey] ?? FALLBACK_ICON;
  return <Cmp fontSize="medium" color="primary" aria-hidden {...props} />;
}
