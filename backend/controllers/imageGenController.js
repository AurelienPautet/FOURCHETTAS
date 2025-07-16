const url = "https://api.imagerouter.io/v1/openai/images/generations";
const API_KEY = process.env.IMAGEROUTER_API_KEY;
export default async function postImageGen(req, res) {
  const body = req.body;
  if (!body || !body.prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.IMAGEROUTER_API_KEY}`,
    },
    body: JSON.stringify({
      prompt:
        "Genere un dessin dans le style cartoon, avec un fond totalement noir d'un : " +
        body.prompt,
      model: "google/gemini-2.0-flash-exp:free",
    }),
  };
  const response = await fetch(url, options);
  const data = await response.json();
  if (response.ok) {
    return res.status(200).json({ data });
  }
  console.error("Error generating image:", data);
  return res.status(500).json({ error: data.error || "Unknown error" });
}
