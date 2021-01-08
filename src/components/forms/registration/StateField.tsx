import { Form, Select } from 'antd';
import React from 'react';

const { Option } = Select;

interface Props {
  disabled?: boolean;
  className: string;
  defaultState?: string;
}

export const StateField: React.FC<Props> = (props) => {
  return (
    <Form.Item
      className={props.className}
      label="Bundesland"
      name="state"
      rules={[{ required: true, message: 'Bitte trage dein Bundesland ein' }]}
      initialValue={props.defaultState}
    >
      <Select disabled={props.disabled} placeholder="Baden-Württemberg">
        <Option value="BW"> Baden-Württemberg</Option>
        <Option value="BY"> Bayern</Option>
        <Option value="BE"> Berlin</Option>
        <Option value="BB"> Brandenburg</Option>
        <Option value="HB"> Bremen</Option>
        <Option value="HH"> Hamburg</Option>
        <Option value="HE"> Hessen</Option>
        <Option value="MV"> Mecklenburg-Vorpommern</Option>
        <Option value="NI"> Niedersachsen</Option>
        <Option value="NW"> Nordrhein-Westfalen</Option>
        <Option value="RP"> Rheinland-Pfalz</Option>
        <Option value="SL"> Saarland</Option>
        <Option value="SN"> Sachsen</Option>
        <Option value="ST"> Sachsen-Anhalt</Option>
        <Option value="SH"> Schleswig-Holstein</Option>
        <Option value="TH"> Thüringen</Option>
        <Option value="other">anderer Wohnort</Option>
      </Select>
    </Form.Item>
  );
};
