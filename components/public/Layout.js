import Head from "next/head";
import Header from "~/components/public/Header";
import Footer from "~/components/public/Footer";
import RecipeView from "./recipe/RecipeView";

const Layout = ({ logs = [], title = "Home", children }) => {
  return (
    <div className="d-flex flex-column main-container">
      <Head>
        <title>Culinaid | {title}</title>
      </Head>
      <Header logs={logs} />
      {children}
      <RecipeView />
      <Footer />
    </div>
  );
};

export default Layout;
