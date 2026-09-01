export async function delay(ms = 300) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}
