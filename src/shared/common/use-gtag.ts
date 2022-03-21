import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";

declare global {
  interface Window {
    gtag?: (
      key: string,
      trackingId: string,
      // eslint-disable-next-line camelcase
      config: { page_path: string }
    ) => void;
  }
}

export const useGtag = () => {
  const { listen } = useHistory();
  const gaMeasurementId = useSelector(
    (state: {
      base: {
        analytics: { gaMeasurementId: string };
      };
    }) => state.base.analytics.gaMeasurementId
  );

  useEffect(() => {
    return listen((location: any) => {
      if (!window.gtag) {
        return;
      }
      if (!gaMeasurementId) {
        console.warn("please specify your gaMeasurementId");
        return;
      }

      window.gtag("config", gaMeasurementId, { page_path: location.pathname });
    });
  }, [gaMeasurementId, listen]);
};
