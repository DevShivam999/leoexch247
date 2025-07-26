

import  { forwardRef } from "react";

interface DateInputProps {
  label: string;
  className?: string;
}

const DateInput = forwardRef<HTMLInputElement, DateInputProps>(
  ({ label, className = "col-md-2 mb-3" }, ref) => {
    return (
      <div className={className}>
        <label className="lable-two">{label}</label>
        <input
          type="date"
          className="form-control"
          
          ref={ref}
        />
      </div>
    );
  }
);

export default DateInput;
