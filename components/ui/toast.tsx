import { toast } from "sonner";

// 型定義のみを提供して後方互換性を維持
export type ToastProps = {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  variant?: "default" | "destructive";
};

export type ToastActionElement = React.ReactElement;

// 既存のコードとの互換性のために空のコンポーネントをエクスポート
export const Toast = () => null;
export const ToastProvider = ({ children }: { children: React.ReactNode }) => (
  <>{children}</>
);
export const ToastViewport = () => null;
export const ToastTitle = () => null;
export const ToastDescription = () => null;
export const ToastClose = () => null;
export const ToastAction = () => null;

// 実際のtoast関数をエクスポート
export { toast };
