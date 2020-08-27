import { colors } from "@/shared/common/styles/style-color";
import { useGetHealth } from "@/shared/home/hooks/use-health";
import CheckCircleTwoTone from "@ant-design/icons/CheckCircleTwoTone";
import CloseCircleTwoTone from "@ant-design/icons/CloseCircleTwoTone";
import LoadingOutlined from "@ant-design/icons/LoadingOutlined";
import React from "react";

export const HealthController: React.FC = () => {
  const { loading, data, error } = useGetHealth();

  if (loading) {
    return (
      <div>
        <LoadingOutlined /> Checking Status
      </div>
    );
  }
  if (error) {
    return (
      <div>
        <CloseCircleTwoTone twoToneColor={colors.error} /> Not OK
      </div>
    );
  }

  return (
    <div>
      <CheckCircleTwoTone twoToneColor={colors.success} /> {data && data.health}
    </div>
  );
};
