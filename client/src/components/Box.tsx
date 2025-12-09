export interface IBox {
  children: React.ReactNode;
  className?: string;
}

export const Box = ({ children, className }: IBox) => (
  <div
    className={`w-full max-w-md bg-white dark:bg-black border border-black dark:border-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] p-8 text-black dark:text-white ${className}`}
  >
    {children}
  </div>
);
