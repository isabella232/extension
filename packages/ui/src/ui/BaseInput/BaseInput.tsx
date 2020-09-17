import React, { FC, useState, useCallback, useRef } from 'react';
import { Wrapper, Icon, Unit, Input } from './styles';
import { BaseInputProps } from './BaseInputProps';

export const BaseInput: FC<BaseInputProps> = (props) => {
  const {
    icon,
    unit,
    onFocus,
    onBlur,
    readOnly,
    disabled,
    invalid,
    className,
    inputRef: inputRefFromProps,
    blurOnEnterKeyPress,
    ...restProps
  } = props;

  const inputRefInternal = useRef<HTMLInputElement>(null);
  const inputRef = inputRefFromProps || inputRefInternal;

  const [focused, setFocusedState] = useState(false);
  const handleBlur = useCallback(
    (e) => {
      if (onBlur) onBlur(e);
      setFocusedState(false);
    },
    [onBlur, setFocusedState]
  );

  const handleFocus = useCallback(
    (e) => {
      if (onFocus) onFocus(e);
      setFocusedState(true);
    },
    [onFocus, setFocusedState]
  );

  const handleKeyPress = blurOnEnterKeyPress
    ? (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
          e.preventDefault();

          if (typeof inputRef === 'object' && inputRef && inputRef.current) {
            inputRef.current.blur();
          }
        }
      }
    : undefined;

  return (
    <Wrapper {...{ focused, disabled, invalid, readOnly, className }}>
      {icon && <Icon>{icon}</Icon>}
      <Input
        ref={inputRef}
        onFocus={handleFocus}
        onBlur={handleBlur}
        disabled={disabled}
        readOnly={readOnly}
        onKeyPress={handleKeyPress}
        data-testid="base-input"
        {...restProps}
      />
      {unit && <Unit>{unit}</Unit>}
    </Wrapper>
  );
};
