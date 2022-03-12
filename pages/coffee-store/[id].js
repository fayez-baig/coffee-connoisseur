import { useRouter } from "next/router";

const CoffeeStore = () => {
  const {
    query: { id },
    back,
  } = useRouter();
  return <div onClick={() => back()}>{id}</div>;
};

export default CoffeeStore;
