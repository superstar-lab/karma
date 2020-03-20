import React, { useState, useEffect } from 'react';

import Space from '../common/Space';

import TabsHeader from './TabsHeader';

export interface TabInterface {
  name: string;
  render: React.FC;
}

interface Props {
  title?: string;
  paramTab?: string;
  tabs: TabInterface[];
  size?: 'default' | 'big';
}

const Tabs: React.FC<Props> = ({ title, tabs, paramTab, size = 'default' }) => {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (paramTab) {
      const firstTab = tabs.findIndex(tab => tab.name.toLowerCase() === paramTab);
      setActive(firstTab);
    }
  }, []); // eslint-disable-line

  return (
    <>
      <TabsHeader tabs={tabs} setActive={setActive} active={active} size={size}>
        {title}
      </TabsHeader>
      <Space height={30} />

      {tabs[active].render({})}
    </>
  );
};

export default Tabs;
