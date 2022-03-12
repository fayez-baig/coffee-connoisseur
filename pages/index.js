import Head from "next/head";
import styles from "../styles/Home.module.css";
import Banner from "../components/Banner";
import Image from "next/image";
import Card from "../components/Card";
import { createApi } from "unsplash-js";

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
              {data.map(({ name, imgUrl, fsq_id }) => (
                <Card
                  key={fsq_id}
                  name={name}
                  imgUrl={
                    imgUrl ||
                    "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
                  }
                  href={`/coffee-store/${fsq_id}`}
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

// on your node server
const unsplashApi = createApi({
  accessKey: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY,
});

// in the browser

const getUrlForCoffeeStores = (latLong, query, limit) => {
  return `https://api.foursquare.com/v3/places/search?query=${query}&ll=${latLong}&limit=${limit}`;
};

export const getListOfCoffeeStoresPhoto = async () => {
  const photos = await unsplashApi.search.getPhotos({
    query: "coffee stores",
    perPage: 12,
  });
  const unsplashResults = photos.response.results;
  const photoResponse = unsplashResults.map((result) => result.urls["small"]);
  return photoResponse;
};

export const fetchCoffeeStores = async () => {
  const photos = await getListOfCoffeeStoresPhoto();

  const response = await fetch(
    getUrlForCoffeeStores("18.99,72.83", "coffee", 12),
    {
      headers: {
        Authorization: process.env.NEXT_PUBLIC_FOURSQUARE_API_KEY,
      },
    }
  );
  const data = await response.json();

  return data.results.map((item, i) => ({
    ...item,
    imgUrl: photos[i],
  }));
};

export const getStaticProps = async () => {
  const data = await fetchCoffeeStores();

  return {
    props: {
      data,
    },
  };
};
