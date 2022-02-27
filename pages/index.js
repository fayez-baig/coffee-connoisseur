import Head from "next/head";
import styles from "../styles/Home.module.css";
import Banner from "../components/Banner";

const Home = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Coffee Connoisseur</title>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="description"
          content="allows you to discover coffee stores"
        />
      </Head>

      <main className={styles.main}>
        <Banner handleClick={() => undefined} buttonText="View stores nearby" />
      </main>
    </div>
  );
};

export default Home;
