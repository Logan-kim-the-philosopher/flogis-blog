export type NavItem = {
  label: string;
  href: string;
};

export type Person = {
  name: string;
  slug: string;
  role: string;
  bio?: string;
  avatar?: string;
  links?: { label: string; href: string }[];
};

export type Category = {
  title: string;
  slug: string;
  description?: string;
};
