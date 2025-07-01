import { useState } from 'react';

function useInput(defaultValue: string) {
  const [value, setValue] = useState(defaultValue);

  const onChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValue(event.target.value);
  };

  return {
    value,
    onChange,
    setValue,
  };
}

export default useInput;
