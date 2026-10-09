/* eslint-disable sonarjs/no-duplicate-string */
import {forwardRef, InputHTMLAttributes, ReactNode, useId} from "react";
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
      id,
      ...props
    },
    ref,
  ) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const helperId = `${inputId}-helper`;

    return (
      <InputWrapper className={className}>
        {label && <Label htmlFor={inputId}>{label}</Label>}
        <InputContainer data-error={error}>
          {startAdornment && <Adornment>{startAdornment}</Adornment>}
          <StyledInput
            ref={ref}
            id={inputId}
            aria-invalid={error || undefined}
            aria-describedby={helperText ? helperId : undefined}
            data-has-start={!!startAdornment}
            {...props}
          />
          {endAdornment && <Adornment>{endAdornment}</Adornment>}
        </InputContainer>
        {helperText && (
          <HelperText id={helperId} data-error={error}>
            {helperText}
          </HelperText>
        )}
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
    gap: "6px",
    width: "100%",
    minWidth: 0,
  },
});

export const InputContainer = styled("div", {
  base: {
    display: "flex",
    alignItems: "center",
    minHeight: "44px",
    backgroundColor: "paper",
    border: "1px solid token(colors.border)",
    borderRadius: "8px",
    transition: "border-color 0.15s",
    "&:focus-within": {
      borderColor: "secondary",
    },
    "&[data-error='true']": {
      borderColor: "error",
    },
  },
});

const Label = styled("label", {
  base: {
    fontSize: "13px",
    fontWeight: 600,
    color: "text.secondary",
  },
});

const StyledInput = styled("input", {
  base: {
    flex: 1,
    minWidth: 0,
    height: "42px",
    padding: "0 12px",
    fontFamily: "inherit",
    fontSize: "15px",
    backgroundColor: "transparent",
    color: "text.primary",
    border: "none",
    outline: "none",
    "&[data-has-start='true']": {
      paddingLeft: "0",
    },
    "&::placeholder": {
      color: "text.disabled",
    },
    _disabled: {
      cursor: "not-allowed",
    },
  },
});

const HelperText = styled("span", {
  base: {
    fontSize: "13px",
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
    padding: "0 4px 0 10px",
    color: "text.secondary",
    "&:last-child": {
      padding: "0 2px 0 0",
    },
  },
});
