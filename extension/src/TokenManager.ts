import * as vscode from "vscode";

class TokenManager {
  static globalState: vscode.Memento;

  static async setToken(token: string) {
    await this.globalState.update("vstodo-token", token);
  }

  static getToken(): string | undefined {
    return this.globalState.get("vstodo-token");
  }

  static async clearToken() {
    await this.globalState.update("vstodo-token", undefined);
  }
}

export default TokenManager;
