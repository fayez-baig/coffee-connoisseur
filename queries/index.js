import { createApi } from "unsplash-js";

// on your node server
const unsplashApi = createApi({
  accessKey: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY,
});

// in the browser

const getUrlForCoffeeStores = (latLong, query, limit) => {
  return `https://api.foursquare.com/v3/places/search?query=${query}&ll=${latLong}&limit=${limit}`;
};

export const getListOfCoffeeStoresPhoto = async (limit) => {
  const photos = await unsplashApi.search.getPhotos({
    query: "coffee stores",
    perPage: limit,
  });
  const unsplashResults = photos.response.results;
  const photoResponse = unsplashResults.map((result) => result.urls["small"]);
  return photoResponse;
};

export const fetchCoffeeStores = async (
  latLong = "18.99,72.83",
  limit = 12
) => {
  const photos = await getListOfCoffeeStoresPhoto(limit);

  const response = await fetch(
    getUrlForCoffeeStores(latLong, "coffee", limit),
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
