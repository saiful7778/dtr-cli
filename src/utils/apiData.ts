import axios from "axios";

export async function getApiData(url: string): Promise<string | undefined> {
  const { data, statusText } = await axios.get(url);
  if (statusText !== "OK") {
    throw new Error("Not data found from this url");
  }
  return data;
}
