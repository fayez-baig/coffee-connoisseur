import { findRecordByFilter } from "../../lib/airtable";

const getCoffeeStoreById = async (req, res) => {
  const { id } = req.query;
  try {
    if (id) {
      const records = await findRecordByFilter(id);
      if (records.length !== 0) {
        return res.status(200).json(records);
      } else {
        return res.status(400).json({ message: `record could not be found` });
      }
    } else {
      return res.status(400).json({ message: "Id is missing" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong", error });
  }
};

export default getCoffeeStoreById;
