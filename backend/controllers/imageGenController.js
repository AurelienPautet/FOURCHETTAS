const url = "https://api.imagerouter.io/v1/openai/images/generations";
const IMAGEROUTER_API_KEY = process.env.IMAGEROUTER_API_KEY;

const get_free_models_url =
  "https://api.imagerouter.io/v1/models?type=image&free=true&sort=arena_score";

//let models = ["qwen/qwen-image"];
let models = [];
let modelsLoaded = false;

async function loadModels() {
  if (modelsLoaded) return;

  try {
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${IMAGEROUTER_API_KEY}`,
      },
    };

    const response = await fetch(get_free_models_url, options);
    const data = await response.json();
    const fetchedModels = Object.keys(data).filter(
      (model) => model !== "test/test"
    );
    models = ["qwen/qwen-image", ...fetchedModels];
    modelsLoaded = true;
    console.log("Available models loaded:", models);
  } catch (error) {
    console.error("Failed to load models, using default:", error);
  }
}

export default async function postImageGen(req, res) {
  console.log("Received image generation request");
  const body = req.body;
  if (!body || !body.prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  await loadModels();

  const promptText =
    "Genere un dessin dans le style cartoon, avec un fond totalement noir d'un : " +
    body.prompt;

  let lastError = null;
  console.log("Starting image generation with prompt:", promptText);

  for (const model of models) {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${IMAGEROUTER_API_KEY}`,
      },
      body: JSON.stringify({
        prompt: promptText,
        model: model,
      }),
    };

    try {
      console.log(`Trying model: ${model}`);
      const response = await fetch(url, options);
      const data = await response.json();

      if (response.ok) {
        console.log(`Success with model: ${model}`);
        return res.status(200).json({
          imageUrl: data.data[0].url,
          model: model,
        });
      } else {
        console.error(`Model ${model} failed:`, data);
        lastError = data.error || "Unknown error";
      }
    } catch (error) {
      console.error(`Error with model ${model}:`, error);
      lastError = error.message;
    }
  }

  return res.status(500).json({
    error: "All models failed",
    lastError: lastError,
  });
}
