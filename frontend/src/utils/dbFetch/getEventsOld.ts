import api_url from "../../api_url";
import type resType from "../../types/ResType";


export default async function getEventsOld(
  {
  onRequestStart= () => {},
  onRequestEnd = () => {},
  onError = () => {},
  onSuccess = () => {}}
 : resType) {
  onRequestStart();
  try {
    const response = await fetch(`${api_url}/api/events/old`);
    onRequestEnd();
    if (!response.ok) {
      onError();
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    onSuccess(data);

    //console.log(" ca va marcher maintenant a la inshalah", data);
  } catch (error) {
    onRequestEnd();
    onError(error);
    console.error("Error fetching upcoming events:", error);
  }
}
