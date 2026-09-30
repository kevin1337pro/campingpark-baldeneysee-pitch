import type { Stay } from "./model";
import { validateStay } from "./model";
export type DemoResult = { mode: "demo"; sent: false; reference: string };
export interface RequestAdapter {
  submit(
    stay: Stay,
    options?: { simulateError?: boolean },
  ): Promise<DemoResult>;
}
// Pure in-browser adapter. Deliberately has no fetch, payment SDK or backend endpoint.
export const demoAdapter: RequestAdapter = {
  async submit(stay, options) {
    if (Object.keys(validateStay(stay)).length)
      throw new Error("Bitte prüfe deine Eingaben.");
    await new Promise((resolve) => setTimeout(resolve, 600));
    if (options?.simulateError)
      throw new Error(
        "Simulierter Versandfehler. Deine Eingaben bleiben erhalten. Schalte den Fehlertest aus und versuche es erneut.",
      );
    return {
      mode: "demo",
      sent: false,
      reference: "DEMO-" + crypto.randomUUID().slice(0, 8).toUpperCase(),
    };
  },
};
