import NavItem from "../ui/NavItem";
import styles from "./Menu.module.css";

export default function Menu() {
  return (
    <div className={ styles.menu }>
      {[{
        label: "Список обращений",
        linkOptions: {
          to: "/",
        }
      }, {
        label: "Создать обращение",
        linkOptions: {
          to: "/appeals/new",
        },
      },].map(({ label, linkOptions, }) => (
        <NavItem key={label} label={label} linkOptions={linkOptions} />
      ))}
    </div>
  );
}
