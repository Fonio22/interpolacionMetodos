import React from "react";
import Navbars from "./Navbar";
import { ReactNotifications } from "react-notifications-component";

export default function Layout({ children }) {
  return (
    <div>
      <Navbars />
      <ReactNotifications />
      {children}
    </div>
  );
}
