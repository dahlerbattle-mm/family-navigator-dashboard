import Link from "next/link";
import { styled } from "@mui/material";
import Image from "next/image";

const LinkStyled = styled(Link)(() => ({
  height: "26px",
  width: "174px",
  overflow: "hidden",
  display: "block",
}));

const Logo = () => {
  return (
    <LinkStyled href="/">
      <Image src="/images/logos/family-navigator-logo-black.svg" alt="logo" height={26} width={174} priority />
    </LinkStyled>
  );
};

export default Logo;
  