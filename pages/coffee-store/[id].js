import { useContext, useEffect, useState } from "react";
import Image from "next/image";
import Head from "next/head";
import { useRouter } from "next/router";
import Link from "next/link";
import cls from "classnames";
import useSWR from "swr";

import { fetchCoffeeStores } from "../../queries";
import { fetcher } from "../../utils";
import { StoreContext } from "../../store/store-context";
import styles from "../../styles/coffee-store.module.css";

const CoffeeStore = ({ data }) => {
  const [coffeeStore, setCoffeeStore] = useState(data);
  const [votingCount, setVotingCount] = useState(0);

  const {
    query: { id },
  } = useRouter();

  const {
    state: { coffeeStores },
  } = useContext(StoreContext);

  const { data: apiData, error } = useSWR(
    `/api/getCoffeeStoreById?id=${id}`,
    fetcher
  );

  useEffect(() => {
    if (apiData && apiData.length) {
      const { name, id, neighborhood, address, imgUrl, voting } = apiData[0];
      const obj = {
        name,
        id,
        location: {
          neighborhood,
          address,
        },
        imgUrl,
        voting,
      };
      setCoffeeStore(obj);
      setVotingCount(voting);
    }
  }, [apiData]);

  const handleCreateCoffeeStore = async (coffeeStoreFromContext) => {
    const {
      name,
      location: { address, neighbourhood: neighborhood },
      imgUrl,
      voting,
    } = coffeeStoreFromContext;
    try {
      const response = await fetch("/api/createCoffeeStore", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          name,
          voting: 0,
          imgUrl,
          neighbourhood: neighborhood || "",
          address: address || "",
        }),
      });

      const dbCoffeeStore = await response.json();
      return dbCoffeeStore;
    } catch (err) {
      console.error("Error creating coffee store", err);
    }
  };

  const handleUpvoteButton = async () => {
    try {
      const response = await fetch("/api/favouriteCoffeeStoreById", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
        }),
      });
      const dbCoffeeStore = await response.json();
      if (dbCoffeeStore && dbCoffeeStore.length > 0) {
        let count = votingCount + 1;
        setVotingCount(count);
      }
    } catch (err) {
      console.error("Error upvoting the coffee store", err);
    }
  };

  useEffect(() => {
    if (!data?.name.length) {
      const coffeeStoreFromContext = coffeeStores.find(
        (coffeeStore) => coffeeStore.fsq_id.toString() === id
      );

      if (coffeeStoreFromContext) {
        setCoffeeStore(coffeeStoreFromContext);
        handleCreateCoffeeStore(coffeeStoreFromContext);
      }
    } else {
      handleCreateCoffeeStore(data);
    }
  }, [id, data]);

  if (error) return <>Something Went Wrong</>;

  return (
    <>
      <div className={styles.layout}>
        <Head>
          <title>{coffeeStore?.name}</title>
          <meta
            name="description"
            content={`${coffeeStore?.name} coffee store`}
          ></meta>
        </Head>
        <div className={styles.container}>
          <div className={styles.col1}>
            <div className={styles.backToHomeLink}>
              <Link href="/">
                <a>← Back to home</a>
              </Link>
            </div>
            <div className={styles.nameWrapper}>
              <h1 className={styles.name}>{coffeeStore?.name}</h1>
            </div>
            <Image
              src={
                coffeeStore?.imgUrl ||
                "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
              }
              width="24"
              height="24"
              className={styles.storeImg}
              alt={coffeeStore?.name}
            ></Image>
          </div>

          <div className={cls("glass", styles.col2)}>
            {coffeeStore?.location?.address && (
              <div className={styles.iconWrapper}>
                <Image
                  src="/static/icons/places.svg"
                  width="24"
                  height="24"
                  alt="places icon"
                />

                <p className={styles.text}>{coffeeStore?.location?.address}</p>
              </div>
            )}
            {coffeeStore?.location?.neighborhood && (
              <div className={styles.iconWrapper}>
                <Image
                  src="/static/icons/nearMe.svg"
                  width="24"
                  height="24"
                  alt="near me icon"
                />
                <p className={styles.text}>
                  {coffeeStore?.location?.neighborhood}
                </p>
              </div>
            )}
            <div className={styles.iconWrapper}>
              <Image
                src="/static/icons/star.svg"
                width="24"
                height="24"
                alt="star icon"
              />
              <p className={styles.text}>{votingCount}</p>
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
