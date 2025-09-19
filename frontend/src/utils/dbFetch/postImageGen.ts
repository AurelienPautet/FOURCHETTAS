import api_url from "../../api_url";
import type resType from "../../types/ResType";

interface postImageGenProps extends resType{
  prompt: string;
}

export default async function postImageGen({
  prompt,
  onRequestStart = () => {},
  onRequestEnd = () => {},
  onSuccess = () => {},
  onError = () => {},
}: postImageGenProps) {
  onRequestStart();
  fetch(`${api_url}/api/image-gen`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch image");
      }
      //return response.arrayBuffer();
      return response.json();
    })
    .then((json) => {
      onRequestEnd();
      onSuccess(json.imageUrl);
    })
    .catch((error) => {
      onRequestEnd();
      onError();
      console.error("Error generating image:", error);
      throw error;
    });
}
