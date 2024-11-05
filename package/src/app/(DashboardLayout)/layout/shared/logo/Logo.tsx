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

const Logo = () => {
  return (
    <LinkStyled href="/">
      <Image
        src="/images/logos/family-navigator-logo-black.svg"
        alt="Family Navigant Logo"
        width={200} // Adjust width to control the size
        height={60} // Adjust height to maintain aspect ratio
        style={{ maxWidth: '90%', height: 'auto' }} // Ensure it resizes within the container
        priority
      />
    </LinkStyled>
  );
};

export default Logo;

  