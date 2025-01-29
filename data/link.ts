export interface LinkData {
    href: string;
    label: string;
    isBold?: boolean;
  }
  
  const links: LinkData[] = [
    { href: "/opgg-list", label: "OPGGLIST" },
    { href: "/", label: "TEST1" },
    { href: "/", label: "AraNeko APP", isBold: true },
    { href: "/", label: "TEST2" },
    { href: "/", label: "TEST3" },
  ];
  
  export default links;
  