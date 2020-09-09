import { useGetHealth } from "@/shared/home/hooks/use-health";
import React from "react";
import { HealthText } from "./components/health-text";

export const HealthController: React.FC = () => {
  const { loading, data, error } = useGetHealth();
  return <HealthText loading={loading} error={!!error} health={data?.health} />;
};
