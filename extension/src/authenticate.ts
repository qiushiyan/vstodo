import * as vscode from "vscode";
import { apiBaseUrl } from "./constants";
import polka from "polka";
import TokenManager from "./TokenManager";

const authenticate = (fn: () => void = () => {}) => {
  if (TokenManager.getToken()) {
    return;
  }

  const app = polka();

  app.get("/auth/:token", async (req, res) => {
    const { token } = req.params;
    if (!token) {
      res.end("<h1>something went wrong</h1>");
      return;
    }
    await TokenManager.setToken(token);
    fn();

    res.end("authentication successful, you can close this now");

    app.server?.close();
  });

  app.listen(54321, async (err: any) => {
    if (err) {
      vscode.window.showErrorMessage(err.message);
      return;
    } else {
      await vscode.commands.executeCommand(
        "vscode.open",
        vscode.Uri.parse(`${apiBaseUrl}/auth/github/`)
      );
    }
  });
};

export default authenticate;
