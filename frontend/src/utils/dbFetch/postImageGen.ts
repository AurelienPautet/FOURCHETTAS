import api_url from "../../api_url";

interface postImageGenProps {
  prompt: string;
  onRequestStart?: () => void;
  onRequestEnd?: () => void;
  onSuccess?: (url: string) => void;
  onError?: () => void;
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
    .then((response) => response.json())
    .then((data) => {
      onRequestEnd();
      if (data.error) {
        throw new Error(data.error);
      }
      onSuccess(data.data.data[0].url);
      return data.data.data[0].url;
    })
    .catch((error) => {
      onRequestEnd();
      onError();
      console.error("Error generating image:", error);
      throw error;
    });
}
