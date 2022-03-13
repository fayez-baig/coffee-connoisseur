import { useEffect, useState, useContext } from "react";
import Head from "next/head";
import Image from "next/image";

import Banner from "../components/Banner";
import Card from "../components/Card";
import UseTrackLocation from "../hooks/use-track-location";
import { ACTION_TYPES, StoreContext } from "../store/store-context";
import { fetchCoffeeStores } from "../queries";
import { fetchData } from "../utils";
import styles from "../styles/Home.module.css";
const Home = ({ data }) => {
  const [coffeeStoresErrorMsg, setCoffeeStoresErrorMsg] = useState("");

  const {
    dispatch,
    state: { latLong, coffeeStores },
  } = useContext(StoreContext);

  const { handleTrackLocation, isLoading, locationErrorMsg } =
    UseTrackLocation();

  useEffect(() => {
    const setCoffeeStoresByLocation = async () => {
      if (latLong) {
        try {
          const coffeeStores = await fetchData(
            `api/getCoffeeStoreByLocation?latLong=${latLong}&limit=30`
          );
          dispatch({
            type: ACTION_TYPES.SET_COFFEE_STORES,
            payload: {
              coffeeStores,
            },
          });
          setCoffeeStoresErrorMsg("");
        } catch (err) {
          setCoffeeStoresErrorMsg(err.message);
        }
      }
    };
    setCoffeeStoresByLocation();
  }, [latLong, dispatch]);

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
        <Banner
          handleClick={handleTrackLocation}
          buttonText={isLoading ? "Locating..." : "View stores nearby"}
        />
        <div className={styles.heroImage}>
          <Image
            src="/static/hero-image.png"
            width={700}
            height={400}
            alt="hero-image"
          />
        </div>
        {locationErrorMsg && (
          <div>Something Went Wrong: {locationErrorMsg}</div>
        )}

        {coffeeStoresErrorMsg && (
          <div>Something Went Wrong: {coffeeStoresErrorMsg}</div>
        )}

        {coffeeStores.length ? (
          <div className={styles.sectionWrapper}>
            <h2 className={styles.heading2}>Coffee stores near me</h2>
            <div className={styles.cardLayout}>
              {coffeeStores.map(({ name, imgUrl, fsq_id }) => (
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
          </div>
        ) : (
          data && (
            <div className={styles.sectionWrapper}>
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
            </div>
          )
        )}
      </main>
    </div>
  );
};

export default Home;

export const getStaticProps = async () => {
  const data = await fetchCoffeeStores();

  return {
    props: {
      data,
    },
  };
};
