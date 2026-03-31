import app from "./app";

const port = Number(process.env.PORT) || 5000;

if (process.env.VERCEL !== "1") {
  // Start the server only for local/non-serverless environments.
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}

export default app;
