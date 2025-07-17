import { useState, useEffect } from "react";
import postImageGen from "../utils/dbFetch/postImageGen";
import { removeBackground } from "@imgly/background-removal";

type CardImageGenProps = {
  ImgUrl: string;
  setImgUrl: (url: string) => void;
  children?: React.ReactNode;
  rmBg: boolean;
  onBgRemovalStart: () => void;
  onBgRemovalEnd: () => void;
};

function CardImageGen({
  ImgUrl,
  setImgUrl,
  children = <></>,
  rmBg,
  onBgRemovalStart,
  onBgRemovalEnd,
}: CardImageGenProps) {
  const [prompt, setPrompt] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRemovingBg, setIsRemovingBg] = useState<boolean>(false);

  function handleImageGen() {
    postImageGen({
      prompt,
      onRequestStart: () => {
        console.log("Request started");
        setIsLoading(true);
      },
      onRequestEnd: () => {
        console.log("Request ended");
        setIsLoading(false);
      },
      onSuccess: (Dataurl: string) => {
        setImgUrl(Dataurl);
      },
      onError: () => {
        console.error("Error generating image");
      },
    });
  }

  useEffect(() => {
    console.log("Background removal triggered:", rmBg);
    onBgRemovalStart();
    if (!rmBg || !ImgUrl) {
      setTimeout(() => {
        onBgRemovalEnd();
      }, 1000);
      return;
    }
    if (ImgUrl.startsWith("data:image/png;base64,")) {
      setTimeout(() => {
        onBgRemovalEnd();
      }, 1000);
      return;
    }
    setIsRemovingBg(true);

    removeBackground(ImgUrl)
      .then((blob: Blob) => {
        return blob.arrayBuffer();
      })
      .then((arrayBuffer) => {
        const base64 = btoa(
          new Uint8Array(arrayBuffer).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            ""
          )
        );
        const dataUrl = `data:image/png;base64,${base64}`;
        console.log("Background removed, new URL:");
        setImgUrl(dataUrl);
      })
      .catch((error) => {
        console.error("Error removing background:", error);
      })
      .finally(() => {
        console.log("Background removal finished");
        onBgRemovalEnd();
        setIsRemovingBg(false);
      });
  }, [rmBg]);

  return (
    <>
      <div className="card bg-base-200 shadow-sm flex flex-col w-full md:w-3/4  md:flex-row items-center p-4">
        <div className="flex flex-col shrink-0  w-44 items-center justify-center ">
          <figure className="relative">
            {isLoading ? (
              <div
                className={` w-40 h-40 ${
                  isLoading && "skeleton"
                } flex items-center justify-center`}
              >
                <div className="loading loading-spinner loading-lg"></div>
              </div>
            ) : ImgUrl && ImgUrl.length > 0 ? (
              <>
                {isRemovingBg && (
                  <div className="absolute rounded-xl inset-0 w-full h-full flex items-center justify-center backdrop-blur-sm">
                    <div className="loading loading-spinner loading-lg"></div>
                  </div>
                )}
                <img
                  src={ImgUrl}
                  alt="ItemImage"
                  className="rounded-xl h-40 w-40"
                />
              </>
            ) : (
              <div className="w-40 h-40 bg-base-300 rounded-box flex items-center justify-center">
                <h1 className="text-center  text-base-content/60">
                  Pas d'image
                </h1>
              </div>
            )}
          </figure>
          <p
            className={`w-2/3 text-center text-base-content/60 ${
              ImgUrl.startsWith("data:image/png;base64,") ? "invisible" : ""
            }`}
          >
            Le fond sera retiré
          </p>
        </div>
        <div className="card-body w-44 md:w-full gap-1 text-center p-2 grow flex flex-col justify-center items-center">
          <h2 className="card-title">Coller l'URL</h2>
          <input
            type="url"
            className="input validator"
            required
            placeholder="https://"
            value={ImgUrl}
            onChange={(e) => setImgUrl(e.target.value)}
            pattern="^(https?://)?([a-zA-Z0-9]([a-zA-Z0-9-].*[a-zA-Z0-9])?.)+[a-zA-Z].*$"
            title="Must be valid URL"
          />
          <p className="validator-hint">Must be valid URL</p>
          <div className="divider my-1">OU</div>
          <h2 className="card-title">Générer par IA</h2>
          <input
            type="text"
            className="input"
            placeholder="ex: un burger avec tomate et oignons"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <div className="card-actions">
            <button
              className={`btn btn-primary ${isLoading ? "btn-disabled" : ""}`}
              onClick={handleImageGen}
            >
              Générer
            </button>
          </div>
        </div>
        {children}
      </div>
    </>
  );
}

export default CardImageGen;
