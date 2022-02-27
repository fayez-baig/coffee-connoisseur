import { useRouter } from "next/router";

const CoffeeStore = () => {
  const {
    query: { id },
  } = useRouter();
  return <div>{id}</div>;
};

export default CoffeeStore;
