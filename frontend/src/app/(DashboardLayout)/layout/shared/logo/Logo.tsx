import Link from "next/link";
import { styled } from "@mui/material";
import Image from "next/image";

const LinkStyled = styled(Link)`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 20px 0;
`;

interface LogoProps {
  noLink?: boolean;
}

const Logo = ({ noLink }: LogoProps) => {
  const logoContent = (
    <Image
      src="/images/logos/family-navigator-logo-black.svg"
      alt="Family Navigant Logo"
      width={200}
      height={60}
      style={{ maxWidth: "90%", height: "auto" }}
      priority
    />
  );

  return noLink ? logoContent : <LinkStyled href="/">{logoContent}</LinkStyled>;
};

export default Logo;
