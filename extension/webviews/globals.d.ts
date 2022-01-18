import * as _vscode from "vscode";

interface MessageData {
  type: string;
  value?: any;
}

declare global {
  const tsvscode: {
    postMessage: (messageData: MessageData) => void;
  };
  const apiBaseUrl: string;
}
