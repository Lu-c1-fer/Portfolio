import { useEffect } from "react";
import { useHashRoute } from "./hooks/useHashRoute";
import { useAuth } from "./hooks/useAuth";
import { Layout } from "./components/Layout";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { ProjectsList } from "./pages/projects/ProjectsList";
import { ProjectForm } from "./pages/projects/ProjectForm";
import { CaseStudyEditor } from "./pages/projects/CaseStudyEditor";
import { ProfilePage } from "./pages/Profile";
import { NowStatusPage } from "./pages/NowStatus";
import { ResumeEditor } from "./pages/resume/ResumeEditor";
import { NotFound } from "./pages/NotFound";

function App() {
  const [route, navigate] = useHashRoute();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && route === "/login") navigate("/");
  }, [isAuthenticated, route, navigate]);

  if (!isAuthenticated) return <Login />;

  let page;
  if (route === "/" || route === "" || route === "/login") {
    page = <Dashboard navigate={navigate} />;
  } else if (route === "/projects") {
    page = <ProjectsList navigate={navigate} />;
  } else if (route === "/projects/new") {
    page = <ProjectForm slug={null} navigate={navigate} />;
  } else if (route.startsWith("/projects/") && route.endsWith("/case-study")) {
    const slug = route.replace("/projects/", "").replace(/\/case-study$/, "");
    page = <CaseStudyEditor slug={slug} navigate={navigate} />;
  } else if (route.startsWith("/projects/")) {
    const slug = route.replace("/projects/", "");
    page = <ProjectForm slug={slug} navigate={navigate} />;
  } else if (route === "/profile") {
    page = <ProfilePage />;
  } else if (route === "/now") {
    page = <NowStatusPage />;
  } else if (route === "/resume") {
    page = <ResumeEditor />;
  } else {
    page = <NotFound navigate={navigate} />;
  }

  return (
    <Layout route={route} navigate={navigate}>
      {page}
    </Layout>
  );
}

export default App;
