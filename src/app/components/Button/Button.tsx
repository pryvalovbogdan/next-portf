import { ButtonHTMLAttributes, DetailedHTMLProps, forwardRef } from 'react';

interface ButtonOptions {
  colorBg?: 'blue' | 'red';
}

type Ref = HTMLButtonElement;

export type ButtonProps = DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> & ButtonOptions;

const Button = forwardRef<Ref, ButtonProps>((props, ref) => {
  const { type = 'button', children, colorBg = 'blue', ...rest } = props;

  const colorVariants = {
    blue: 'bg-blue-500 shadow-blue-500/20 hover:shadow-blue-500/40 dark:bg-orange-500',
    red: 'bg-red-500 shadow-red-500/20 hover:shadow-red-500/40 dark:bg-cyan-500',
  };

  return (
    <button
      ref={ref}
      className={`${colorVariants[colorBg]} middle none center mr-4 rounded-lg py-3 px-6 font-sans text-xs font-bold uppercase text-white shadow-md transition-all hover:shadow-lg focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none`}
      {...rest}
    >
      {children}
    </button>
  );
});

Button.displayName = 'Button';
export default Button;
// Client identifier 5b5ed3a1261f28794bbb42b33b2b143b9adbec24
// Client secrets Xn8KB6mNt4NI9fl+3lia5LO/V4YAgTzBDFM7D9RltmAHcle/gJ+A7MA4khux/zrrAMowzpiuzOX5d4p1xinaceEKxl+7xICCyyWix9x6/x54YutgT6DL/dQTp0RsJkGw