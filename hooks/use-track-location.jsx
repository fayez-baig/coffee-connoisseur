import { useState, useContext } from "react";
import { ACTION_TYPES, StoreContext } from "../store/store-context";

const UseTrackLocation = () => {
  const [locationErrorMsg, setLocationErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { dispatch } = useContext(StoreContext);

  const handleTrackLocation = () => {
    setIsLoading(true);
    if (!navigator.geolocation) {
      setLocationErrorMsg("Geolocation is not supported by your browser");
      setIsLoading(false);
    } else {
      // status.textContent = "loading...";
      navigator.geolocation.getCurrentPosition(success, error);
    }
  };

  const success = (position) => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    dispatch({
      type: ACTION_TYPES.SET_LAT_LONG,
      payload: { latLong: `${latitude.toFixed(2)},${longitude.toFixed(2)}` },
    });
    setLocationErrorMsg("");
    setIsLoading(false);
  };

  const error = () => {
    setLocationErrorMsg("Unable to retrieve your location");
    setIsLoading(false);
  };

  return { handleTrackLocation, locationErrorMsg, isLoading };
};

export default UseTrackLocation;
