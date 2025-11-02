/* eslint-disable sonarjs/no-duplicate-string */
import {forwardRef, InputHTMLAttributes, ReactNode, useState} from "react";
import {styled} from "styled-system/jsx";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  helperText?: string;
  startAdornment?: ReactNode;
  endAdornment?: ReactNode;
  error?: boolean;
  className?: string;
};

export const TextField = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      helperText,
      startAdornment,
      endAdornment,
      error,
      className,
      ...props
    },
    ref,
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const hasValue = props.value !== undefined && props.value !== "";
    const isFloating = isFocused || hasValue;

    return (
      <InputWrapper className={className}>
        <InputContainer data-error={error}>
          {label && (
            <FloatingLabel
              data-error={error}
              data-floating={isFloating}
              data-has-adornment={!!startAdornment}>
              {label}
            </FloatingLabel>
          )}
          {startAdornment && <Adornment>{startAdornment}</Adornment>}
          <StyledInput
            ref={ref}
            onFocus={e => {
              setIsFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={e => {
              setIsFocused(false);
              props.onBlur?.(e);
            }}
            {...props}
          />
          {endAdornment && <Adornment>{endAdornment}</Adornment>}
        </InputContainer>
        {helperText && <HelperText data-error={error}>{helperText}</HelperText>}
      </InputWrapper>
    );
  },
);

export const InputAdornment = ({children}: {children: ReactNode}) => (
  <Adornment>{children}</Adornment>
);

export const InputWrapper = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    width: "100%",
  },
});

export const InputContainer = styled("div", {
  base: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    backgroundColor: "paper",
    border: "1px solid token(colors.border)",
    borderRadius: "4px",
    transition: "border-color 0.2s, box-shadow 0.2s",
    "&:focus-within": {
      borderColor: "primary",
      boxShadow: "0 0 0 2px rgba(144, 202, 249, 0.13)",
    },
    "&[data-error='true']": {
      borderColor: "error",
      "&:focus-within": {
        borderColor: "error",
        boxShadow: "0 0 0 2px rgba(244, 67, 54, 0.13)",
      },
    },
  },
});

const FloatingLabel = styled("label", {
  base: {
    position: "absolute",
    left: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    fontSize: "14px",
    color: "text.disabled",
    pointerEvents: "none",
    transition: "all 0.2s ease-out",
    backgroundColor: "paper",
    padding: "0 4px",
    "&[data-floating='true']": {
      top: "0",
      fontSize: "12px",
      color: "text.secondary",
    },
    "&[data-floating='true'][data-error='true']": {
      color: "error",
    },
    "&[data-has-adornment='true']": {
      left: "44px",
    },
    "&[data-has-adornment='true'][data-floating='true']": {
      left: "12px",
    },
  },
});

const StyledInput = styled("input", {
  base: {
    flex: 1,
    padding: "20px 12px 8px 12px",
    fontSize: "14px",
    backgroundColor: "transparent",
    color: "text.primary",
    border: "none",
    outline: "none",
    "&::placeholder": {
      color: "transparent",
    },
  },
});

const HelperText = styled("span", {
  base: {
    fontSize: "12px",
    color: "text.secondary",
    "&[data-error='true']": {
      color: "error",
    },
  },
});

const Adornment = styled("div", {
  base: {
    display: "flex",
    alignItems: "center",
    padding: "0 8px",
    color: "text.secondary",
  },
});
