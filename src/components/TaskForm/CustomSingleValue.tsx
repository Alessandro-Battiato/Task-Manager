import React from "react";
import { components, type SingleValueProps } from "react-select";
import Badge from "../Badge";
import type { Status } from "../Board/types";
import type { Option } from "./types";

const CustomSingleValue: React.FC<SingleValueProps<Option>> = ({
    data,
    ...props
}) => {
    return (
        <components.SingleValue data={data} {...props}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Badge status={data.value as Status} />
                <span>{data.label}</span>
            </div>
        </components.SingleValue>
    );
};

export default CustomSingleValue;
