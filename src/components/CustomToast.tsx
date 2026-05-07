import React, { useEffect, useState } from "react";
import { IonIcon } from "@ionic/react";
import {
  checkmarkCircleOutline,
  warningOutline,
  closeCircleOutline,
  closeOutline,
} from "ionicons/icons";
import "./CustomToast.css";

export type ToastColor = "success" | "warning" | "danger";

interface CustomToastProps {
  show: boolean;
  message: string;
  color?: ToastColor;
  duration?: number;
  onDidDismiss: () => void;
}

const CustomToast: React.FC<CustomToastProps> = ({
  show,
  message,
  color = "success",
  duration = 2500,
  onDidDismiss,
}) => {
  const [visible, setVisible] = useState(false);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (show) {
      setVisible(true);
      setAnimating(true);
      const hideTimer = setTimeout(() => {
        setAnimating(false);
      }, duration);
      const removeTimer = setTimeout(() => {
        setVisible(false);
        onDidDismiss();
      }, duration + 350);
      return () => {
        clearTimeout(hideTimer);
        clearTimeout(removeTimer);
      };
    }
  }, [show]);

  if (!visible) return null;

  const iconMap = {
    success: checkmarkCircleOutline,
    warning: warningOutline,
    danger: closeCircleOutline,
  };

  const labelMap = {
    success: "Berhasil",
    warning: "Perhatian",
    danger: "Gagal",
  };

  return (
    <div className={`ctoast-wrapper ${animating ? "show" : "hide"}`}>
      <div className={`ctoast ctoast--${color}`}>
        <div className={`ctoast-icon-wrap ctoast-icon-wrap--${color}`}>
          <IonIcon icon={iconMap[color]} />
        </div>
        <div className="ctoast-body">
          <span className="ctoast-label">{labelMap[color]}</span>
          <span className="ctoast-message">{message}</span>
        </div>
        <button
          className="ctoast-close"
          onClick={() => {
            setAnimating(false);
            setTimeout(() => {
              setVisible(false);
              onDidDismiss();
            }, 350);
          }}
        >
          <IonIcon icon={closeOutline} />
        </button>
        <div
          className={`ctoast-progress ctoast-progress--${color}`}
          style={{ animationDuration: `${duration}ms` }}
        />
      </div>
    </div>
  );
};

export default CustomToast;
