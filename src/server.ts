import app from "./app";

const port = Number(process.env.PORT) || 5000;

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
