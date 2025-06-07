import React from "react";
import { type OptionProps, components } from "react-select";
import type { Option } from "./types";

const CustomOption: React.FC<OptionProps<Option, true>> = (props) => {
    const { data, innerRef, innerProps } = props;
    return (
        <components.Option {...props}>
            <div ref={innerRef} {...innerProps} data-testid={data.dataTestId}>
                {data.label}
            </div>
        </components.Option>
    );
};

export default CustomOption;
