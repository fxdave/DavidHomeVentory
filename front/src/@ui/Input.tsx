import {styled} from "@macaron-css/react";
import {forwardRef, InputHTMLAttributes, ReactNode} from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  helperText?: string;
  startAdornment?: ReactNode;
  endAdornment?: ReactNode;
};

export const TextField = forwardRef<HTMLInputElement, InputProps>(
  ({label, helperText, startAdornment, endAdornment, ...props}, ref) => (
    <Wrapper>
      {label && <Label>{label}</Label>}
      <InputContainer>
        {startAdornment && <Adornment>{startAdornment}</Adornment>}
        <StyledInput ref={ref} {...props} />
        {endAdornment && <Adornment>{endAdornment}</Adornment>}
      </InputContainer>
      {helperText && <HelperText>{helperText}</HelperText>}
    </Wrapper>
  ),
);

export const InputAdornment = ({children}: {children: ReactNode}) => (
  <Adornment>{children}</Adornment>
);

const Wrapper = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    width: "100%",
  },
});

const InputContainer = styled("div", {
  base: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#1e1e1e",
    border: "1px solid #333",
    borderRadius: "4px",
    transition: "border-color 0.2s",
    ":focus-within": {
      borderColor: "#90caf9",
    },
  },
});

const Label = styled("label", {
  base: {
    fontSize: "12px",
    color: "#b0b0b0",
  },
});

const StyledInput = styled("input", {
  base: {
    flex: 1,
    padding: "12px",
    fontSize: "14px",
    backgroundColor: "transparent",
    color: "#fff",
    border: "none",
    outline: "none",
  },
});

const HelperText = styled("span", {
  base: {
    fontSize: "12px",
    color: "#b0b0b0",
  },
});

const Adornment = styled("div", {
  base: {
    display: "flex",
    alignItems: "center",
    padding: "0 8px",
    color: "#b0b0b0",
  },
});
