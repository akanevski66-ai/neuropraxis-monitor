import { chromium } from "playwright";

const URL = "https://app.arzt-direkt.de/neuropraxis-neuwied/booking";
const NO_SLOTS = "Aktuell sind keine freien Termine verfügbar";

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ locale: "de-DE", timezoneId: "Europe/Berlin" });

try {
  await page.goto(URL, { waitUntil: "domcontentloaded", timeout: 60_000 });
  await page.getByText("Gesetzlich", { exact: true }).click({ timeout: 30_000 });

  const category = page.getByText("Erstgespräch", { exact: true });
  await category.waitFor({ state: "visible", timeout: 30_000 });
  await category.click();

  const newPatient = page.getByText("Erstgespräch/Neupatient(in)", { exact: true });
  await newPatient.waitFor({ state: "visible", timeout: 30_000 });
  await newPatient.click();

  await page.getByRole("heading", { name: "Wählen Sie einen Termin", exact: true }).first()
    .waitFor({ state: "visible", timeout: 30_000 });

  await page.waitForTimeout(2_000);
  const bodyText = (await page.locator("body").innerText()).replace(/\s+/g, " ").trim();

  if (bodyText.includes(NO_SLOTS)) {
    console.log(JSON.stringify({ available: false }));
    process.exitCode = 0;
  } else {
    const useful = bodyText
      .replace(/Bitte beantworten Sie zunächst folgende Fragen\.?/g, "")
      .slice(0, 1500);
    console.log(JSON.stringify({ available: true, details: useful, url: URL }));
    process.exitCode = 10;
  }
} catch (error) {
  console.error(`Monitor error: ${error.message}`);
  process.exitCode = 2;
} finally {
  await browser.close();
}
