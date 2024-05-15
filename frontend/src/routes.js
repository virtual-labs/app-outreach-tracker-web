import Landing from "./Landing";
import Dashboard from "./nc/pages/Dashboard";

export const ROUTES = [
  {
    path: "",
    children: [
      {
        path: "/",
        element: <Landing />,
        protected: false,
        login_redirect: "/nc/dashboard",
      },
    ],
  },
  {
    path: "/nc",
    children: [
      {
        path: "/dashboard",
        element: <Dashboard />,
        protected: true,
        failure_redirect: "/",
      },
    ],
  },
];
