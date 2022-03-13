import { useContext, useEffect, useState } from "react";
import Image from "next/image";
import Head from "next/head";
import { useRouter } from "next/router";
import Link from "next/link";
import cls from "classnames";

import { fetchCoffeeStores } from "../index";
import { StoreContext } from "../../store/store-context";
import styles from "../../styles/coffee-store.module.css";

const CoffeeStore = ({ data }) => {
  const [coffeeStore, setCoffeeStore] = useState(data);

  const {
    name,
    location: { address, neighborhood },
    imgUrl,
  } = coffeeStore;

  const {
    query: { id },
  } = useRouter();

  const {
    state: { coffeeStores },
  } = useContext(StoreContext);

  useEffect(() => {
    if (!data.name.length) {
      const coffeeStoreById = coffeeStores.find(
        (coffeeStore) => coffeeStore.fsq_id.toString() === id
      );
      setCoffeeStore(coffeeStoreById);
    }
  }, [id]);

  const handleUpvoteButton = () => console.log("handleUpvoteButton");

  return (
    <>
      <div className={styles.layout}>
        <Head>
          <title>{name}</title>
          <meta name="description" content={`${name} coffee store`}></meta>
        </Head>
        <div className={styles.container}>
          <div className={styles.col1}>
            <div className={styles.backToHomeLink}>
              <Link href="/">
                <a>← Back to home</a>
              </Link>
            </div>
            <div className={styles.nameWrapper}>
              <h1 className={styles.name}>{name}</h1>
            </div>
            <Image
              src={
                imgUrl ||
                "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
              }
              width={600}
              height={360}
              className={styles.storeImg}
              alt={name}
            ></Image>
          </div>

          <div className={cls("glass", styles.col2)}>
            <div className={styles.iconWrapper}>
              <Image
                src="/static/icons/places.svg"
                width="24"
                height="24"
                alt="places icon"
              />
              <p className={styles.text}>{address}</p>
            </div>
            {neighborhood && (
              <div className={styles.iconWrapper}>
                <Image
                  src="/static/icons/nearMe.svg"
                  width="24"
                  height="24"
                  alt="near me icon"
                />
                <p className={styles.text}>{neighborhood}</p>
              </div>
            )}
            <div className={styles.iconWrapper}>
              <Image
                src="/static/icons/star.svg"
                width="24"
                height="24"
                alt="star icon"
              />
              <p className={styles.text}>{"votingCount"}</p>
            </div>

            <button
              className={styles.upvoteButton}
              onClick={handleUpvoteButton}
            >
              Up vote!
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CoffeeStore;

export const getStaticProps = async ({ params: { id } }) => {
  const data = await fetchCoffeeStores();
  const coffeeStoreById = data.find(
    (coffeeStore) => coffeeStore.fsq_id.toString() === id
  );
  return {
    props: {
      data: coffeeStoreById
        ? coffeeStoreById
        : {
            name: "",
            location: { address: "", neighborhood: "" },
            imgUrl: "",
          },
    },
  };
};

export const getStaticPaths = async () => {
  const data = await fetchCoffeeStores();
  const pathsArr = data.map(({ fsq_id }) => ({
    params: { id: fsq_id.toString() },
  }));
  return {
    paths: pathsArr,
    fallback: true,
  };
};
