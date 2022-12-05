import React, { useEffect, useState } from 'react';
import { getCountryList, getCountryListAsync } from '../services/country';
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
  const [syncState, setSyncState] = useState([]);
  const [asyncState, setAsyncState] = useState([]);
  const [syncOpen, setSyncOpen] = useState(false);
  const [asyncOpen, setAsyncOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const syncSearch = () => {
    setSyncOpen(true);
    const response = getCountryList();
    setSyncState(response);
  };

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
        {/* <InputField
          name="input-2"
          label="Sync Search"
          description="With default display and search on focus"
          data={syncState}
          disable={false}
          isOpen={syncOpen}
          setIsOpen={setSyncOpen}
          handleSearch={syncSearch}
          handleFocus={syncSearch}
        /> */}
      </div>
    </div>
  );
};

export default Form;
