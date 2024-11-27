import React, { useState, useEffect } from 'react';

const DropdownMenu = () => {
  // 儲存選擇的選項的實際值
  const [selectedOption, setSelectedOption] = useState('');

  // 顯示在下拉選單中的選項顯示名稱
  const optionDisplayNames = {
    option1: '顯示選項1',
    option2: '顯示選項2',
    option3: '顯示選項3',
  };

  // 模擬下拉選單的實際值
  const options = ['option1', 'option2', 'option3'];
  const options_v = [1, 2, 3];

  // 當選擇的選項改變時觸發的效果
  useEffect(() => {
    if (selectedOption) {
      console.log(`你選擇了: ${optionDisplayNames[selectedOption]}`);
    }
  }, [selectedOption]); // 依賴 selectedOption

  return (
    <div>
      <label htmlFor="dropdown">選擇一個選項:</label>
      <select
        id="dropdown"
        value={selectedOption}
        onChange={(e) => setSelectedOption(e.target.value)}
      >
        <option value="">請選擇</option>
        {options.map((option) => (
          <option key={option} value={options_v}>
            {optionDisplayNames[option]}
          </option>
        ))}
      </select>
    </div>
  );
};

export default DropdownMenu;