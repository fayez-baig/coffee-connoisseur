import Head from "next/head";
import styles from "../styles/Home.module.css";
import Banner from "../components/Banner";
import Image from "next/image";
import Card from "../components/Card";

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
        <div className={styles.heroImage}>
          <Image
            src="/static/hero-image.png"
            width={700}
            height={400}
            alt="hero-image"
          />
        </div>
        <Card
          name="Dark horse coffee"
          imgUrl="/static/hero-image.png"
          href="/coffee-store/dark-horse-coffee"
        />
      </main>
    </div>
  );
};

export default Home;
