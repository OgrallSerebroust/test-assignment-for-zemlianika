import type { RegisteredRouter, ValidateLinkOptions } from "@tanstack/react-router";

import { Link } from "@tanstack/react-router";
import styles from "./NavItem.module.css";

interface NavItemProps<
  TRouter extends RegisteredRouter = RegisteredRouter,
  TOptions = unknown,
> {
  label: string;
  linkOptions?: ValidateLinkOptions<TRouter, TOptions>;
}

export default function NavItem<
  TRouter extends RegisteredRouter,
  TOptions,
>(props: NavItemProps<TRouter, TOptions>): React.ReactNode;

export default function NavItem({
  label,
  linkOptions,
}: NavItemProps) {
  const linkContent = (
    <span>
      {label}
    </span>
  );
  if (!linkOptions) {
    return (
      <div>
        {linkContent}
      </div>
    );
  }
  return (
    <Link
      {...linkOptions}
      activeProps={{
        className: styles.active,
      }}
      className={styles.navItem}
    >
      {linkContent}
    </Link>
  );
}