import React from 'react';
import { Select } from 'antd';
import uniData, { uniByUUID, hasNickname } from 'universities-info-germany';

interface Props {
  onChange?: (value: string) => void;
  defaultValue?: string;
  value?: string; // it needs to have a value field to work with controlled form items in antd (but I don't know exactly why)
}

const UniSelect: React.FC<Props & React.HTMLAttributes<HTMLDivElement>> = (
  props
) => {
  return (
    <Select
      className={props.className}
      showSearch
      virtual={false}
      filterOption={(input, option) => {
        const u = uniByUUID(option.key.toString());
        return (
          u.officialName.toLowerCase().includes(input.toLowerCase()) ||
          hasNickname(u, input)
        );
      }}
      placeholder="Duale Hochschule Musterhausen"
      onChange={(v) => {
        props.onChange?.(v);
      }}
      defaultValue={props.defaultValue}
      value={props.value}
    >
      {uniData.map((u) => (
        <Select.Option value={u.officialName} key={u.uuid}>
          {u.officialName}
        </Select.Option>
      ))}
    </Select>
  );
};

export default UniSelect;
