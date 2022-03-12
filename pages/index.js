import Head from "next/head";
import styles from "../styles/Home.module.css";
import Banner from "../components/Banner";
import Image from "next/image";
import Card from "../components/Card";
import coffeeStores from "../data/coffee-stores.json";

const Home = ({ data }) => {
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
        {data && (
          <>
            <h2 className={styles.heading2}>Tornoto coffee stores</h2>
            <div className={styles.cardLayout}>
              {data.map(({ name, imgUrl, id }) => (
                <Card
                  key={id}
                  name={name}
                  imgUrl={imgUrl}
                  href={`/coffee-store/${id}`}
                />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Home;

export const getStaticProps = () => {
  return {
    props: {
      data: coffeeStores,
    },
  };
};
