import Image from "next/image";
import Head from "next/head";
import Link from "next/link";
import cls from "classnames";

import coffeeStores from "../../data/coffee-stores.json";
import styles from "../../styles/coffee-store.module.css";

const CoffeeStore = ({ data: { name, address, neighbourhood, imgUrl } }) => {
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
              src={imgUrl}
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
            {neighbourhood && (
              <div className={styles.iconWrapper}>
                <Image
                  src="/static/icons/nearMe.svg"
                  width="24"
                  height="24"
                  alt="near me icon"
                />
                <p className={styles.text}>{neighbourhood}</p>
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

export const getStaticProps = ({ params: { id } }) => {
  return {
    props: {
      data: coffeeStores.find(
        (coffeeStore) => coffeeStore.id.toString() === id
      ),
    },
  };
};

export const getStaticPaths = () => {
  const pathsArr = coffeeStores.map(({ id }) => ({
    params: { id: id.toString() },
  }));
  return {
    paths: pathsArr,
    fallback: true,
  };
};
