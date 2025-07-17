const url = "https://api.imagerouter.io/v1/openai/images/generations";
const IMAGEROUTER_API_KEY = process.env.IMAGEROUTER_API_KEY;

export default async function postImageGen(req, res) {
  const body = req.body;
  if (!body || !body.prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${IMAGEROUTER_API_KEY}`,
    },
    body: JSON.stringify({
      prompt:
        "Genere un dessin dans le style cartoon, avec un fond totalement noir d'un : " +
        body.prompt,
      model: "google/gemini-2.0-flash-exp:free",
    }),
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();

    if (response.ok) {
      console.log(data);
      console.log(data.data[0].url);

      /*       const imageResponse = await fetch(data.data[0].url);
      const buffer = await imageResponse.arrayBuffer();
      const contentType =
        imageResponse.headers.get("Content-Type") || "application/octet-stream";
      res.setHeader("Content-Type", contentType);
      return res.send(Buffer.from(buffer)); */
      return res.status(200).json({
        imageUrl: data.data[0].url,
      });
    } else {
      console.error("Error generating image:", data);
      return res.status(500).json({ error: data.error || "Unknown error" });
    }
  } catch (error) {
    console.error("Error proxying image:", error);
    return res.status(500).send("Failed to fetch image");
  }
}
