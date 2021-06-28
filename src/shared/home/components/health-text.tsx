import { colors } from "@/shared/common/styles/style-color";
import CheckCircleTwoTone from "@ant-design/icons/CheckCircleTwoTone";
import CloseCircleTwoTone from "@ant-design/icons/CloseCircleTwoTone";
import LoadingOutlined from "@ant-design/icons/LoadingOutlined";
import React from "react";

type Props = {
  loading: boolean;
  health?: string | null;
  error: boolean;
};

export const HealthText: React.FC<Props> = ({
  loading,
  health,
  error,
}: Props) => {
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
      <CheckCircleTwoTone twoToneColor={colors.success} /> {health}
    </div>
  );
};
