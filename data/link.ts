export interface LinkData {
  href: string;
  label: string;
  isBold?: boolean;
}

const links: LinkData[] = [
  { href: "/summoner-list", label: "SummonerList" },
  { href: "/a", label: "TEST1" },
  { href: "/", label: "AraNeko APP", isBold: true },
  { href: "/c", label: "TEST2" },
  { href: "/d", label: "TEST3" },
];

export default links;
