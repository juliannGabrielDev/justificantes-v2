export interface AlertComponentProps {
    visible: boolean;
    title: string;
    message?: string;
    confirmText: string;
    cancelText?: string;
    destructive?: boolean;
    onConfirm: () => void;
    onDismiss: () => void;
}
