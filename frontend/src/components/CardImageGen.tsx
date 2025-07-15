import { useState } from "react";
import postImageGen from "../utils/dbFetch/postImageGen";

type CardImageGenProps = {
  ImgUrl: string;
  setImgUrl: (url: string) => void;
};

function CardImageGen({ ImgUrl, setImgUrl }: CardImageGenProps) {
  const [prompt, setPrompt] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
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
      onSuccess: (url) => {
        setImgUrl(url);
      },
      onError: () => {
        console.error("Error generating image");
      },
    });
  }

  return (
    <>
      <div className="card bg-base-100 w-64 shadow-sm flex flex-col  md:flex-row md:w-2/3 items-center p-2">
        <div className="flex flex-col  w-50 items-center justify-center ">
          <figure className="">
            {isLoading ? (
              <div className=" w-40 h-40 skeleton flex items-center justify-center">
                <div className="loading loading-spinner loading-lg"></div>
              </div>
            ) : (
              <img src={ImgUrl} alt="Shoes" className="rounded-xl h-40 w-40" />
            )}
          </figure>
          <p className="w-2/3 text-center text-base-content/60">
            Le fond noir sera retiré
          </p>
        </div>
        <div className="card-body gap-1 text-center p-2 grow flex flex-col justify-center items-center">
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
            <button className="btn btn-primary" onClick={handleImageGen}>
              Générer
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default CardImageGen;
