import React, { useState } from 'react';
import { getCountryListAsync } from '../services/country';
import InputField from './InputField';

function debounce(callback, limit) {
  let timeout;
  return () => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      callback();
    }, limit);
  };
}

function filterByValue(array, value) {
  return array.filter(
    (data) => data.name.toLowerCase().indexOf(value.toLowerCase()) !== -1
  );
}

const Form = () => {
  const [asyncState, setAsyncState] = useState([]);
  const [asyncOpen, setAsyncOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const asyncSearch = async (e) => {
    setIsLoading(true);
    const inputValue = e.target.value;
    const response = await getCountryListAsync();

    setTimeout(() => {
      setAsyncState(filterByValue(response, inputValue));
      setAsyncOpen(true);
      setIsLoading(false);
    }, 300);
  };

  const handleOnChange = (e) => {
    e.persist();
    debounce(asyncSearch(e), 400);
  };

  return (
    <div className="w-[400px] p-5 bg-white rounded-lg">
      <div className="space-y-3 ">
        <InputField
          name="input-1"
          label="Async Search"
          description="With description and custom results display"
          type="async"
          data={asyncState}
          disable={false}
          isOpen={asyncOpen}
          isLoading={isLoading}
          setIsOpen={setAsyncOpen}
          handleSearch={(e) => handleOnChange(e)}
        />
      </div>
    </div>
  );
};

export default Form;
