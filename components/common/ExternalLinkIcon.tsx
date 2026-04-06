import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";

type ExternalLinkIconProps = {
  size?: "inherit" | "small" | "medium";
};

/**
 * Visual indicator for links that open a new tab. Pair with screen-reader text in the link label.
 */
export default function ExternalLinkIcon({ size = "small" }: ExternalLinkIconProps) {
  return (
    <OpenInNewRoundedIcon
      fontSize={size}
      sx={{ verticalAlign: "text-bottom", ml: 0.35 }}
      aria-hidden
    />
  );
}
