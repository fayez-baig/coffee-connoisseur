import { fetchCoffeeStores } from "../../queries";

const getCoffeeStoreByLocation = async (request, response) => {
  const { latLong, limit } = request.query;
  try {
    const res = await fetchCoffeeStores(latLong, limit);
    response.status(200).json(res);
  } catch (error) {
    response.status(500).json(error);
  }
};

export default getCoffeeStoreByLocation;
