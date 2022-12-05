import React, { useEffect, useState } from 'react';
import { usePopper } from 'react-popper';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';

const useOutsideClick = (ref, callback) => {
  const handleClick = (e) => {
    if (ref && !ref.contains(e.target)) {
      callback();
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  });
};

const InputField = ({
  name,
  label,
  description,
  type,
  data,
  disable,
  isOpen,
  isLoading,
  setIsOpen,
  handleFocus,
  handleSearch,
}) => {
  const [triggerRef, setTriggerRef] = useState();
  const [popupRef, setPopupRef] = useState(undefined);
  const [active, setActive] = useState(0);
  const [input, setInput] = useState('');

  const { styles, attributes } = usePopper(triggerRef, popupRef, {
    placement: 'bottom',
    strategy: 'fixed',
  });

  function setChange() {
    const selected = popupRef?.querySelector('.active');

    if (selected) {
      selected?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }

  const onClick = (e) => {
    setActive(data.findIndex((x) => x.name === e.currentTarget.innerText));
    setInput(e.currentTarget.innerText);
  };

  useOutsideClick(popupRef, () => {
    if (isOpen) setIsOpen(false);
  });

  const onKeyUp = (e) => {
    const keyCode = e.keyCode;
    if (keyCode === 13) {
      // enter key
      setInput(data[active].name);
    } else if (keyCode === 38) {
      // up arrow
      return active === 0 ? null : setActive(active - 1);
    } else if (keyCode === 40) {
      // down arrow
      return active - 1 === data.length - 2 ? null : setActive(active + 1);
    } else if (keyCode === 27) {
      // esc
      e.preventDefault();
      setIsOpen(false);
    } else {
      handleSearch(e);
    }
  };

  const renderAutocomplete = () => {
    if (isOpen) {
      if (data.length) {
        return (
          <ul
            className="z-20 flex w-[360px] flex-col mt-2 overflow-y-auto text-black bg-white border rounded-md shadow max-h-44"
            ref={setPopupRef}
            style={styles.popper}
            {...attributes.popper}
          >
            {data.map((country, index) => {
              let className = 'px-4 py-2 hover:bg-slate-200';
              if (index === active) {
                className = 'px-4 py-2 active bg-slate-200';
              }
              setTimeout(() => {
                setChange();
              }, [100]);
              return (
                <li className={className} key={index} onClick={onClick}>
                  {country.name}
                </li>
              );
            })}
          </ul>
        );
      } else {
        return (
          <ul
            className="z-20 flex w-[360px] flex-col mt-2 overflow-y-auto text-black bg-white border rounded-md shadow max-h-44"
            ref={setPopupRef}
            style={styles.popper}
            {...attributes.popper}
          >
            <li className={'px-4 py-2'}>Not found</li>
          </ul>
        );
      }
    }
    return <></>;
  };

  return (
    <div className="">
      <div className="flex flex-col">
        <label htmlFor={name} className="text-base font-semibold text-gray-400">
          {label}
        </label>
        <div className="relative mt-1 rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <MagnifyingGlassIcon
              className="w-5 h-5 text-gray-400"
              aria-hidden="true"
            />
          </div>
          <input
            ref={setTriggerRef}
            onKeyUp={onKeyUp}
            onChange={(e) => setInput(e.target.value)}
            name={name}
            value={input}
            type="text"
            className="block w-full p-2 pl-10 mt-1 text-gray-500 border rounded-md shadow-sm outline-none focus:ring-2 focus:border-0 ring-indigo-300"
            placeholder="Type to begin search"
            disabled={disable}
          />
          {type === 'async' && isLoading && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg
                aria-hidden="true"
                className="w-5 h-5 text-gray-200 animate-spin fill-gray-400"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
            </div>
          )}
        </div>
        {renderAutocomplete()}
        <small className="mt-1 text-gray-400">{description}</small>
      </div>
    </div>
  );
};

export default InputField;
