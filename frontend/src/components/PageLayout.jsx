import Sidebar from "./Sidebar";
import "./Styles/PageLayout.css";

export default function PageLayout({ username, menuItems, children }) {
  return (
    <div className="layout-container">
      <Sidebar username={username} menuItems={menuItems} />

      <div className="layout-content">
        <div className="content-wrapper">
          {children}
        </div>
      </div>
    </div>
  );
}
