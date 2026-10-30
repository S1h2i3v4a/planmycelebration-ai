import React from 'react';

export function InputField({
  id,
  label,
  hint,
  error,
  type = 'text',
  value,
  onChange,
  placeholder,
  disabled = false,
  required = false,
  min,
  max,
  step
}) {
  return (
    <div className="form-field">
      {label && (
        <label htmlFor={id} className="form-label">
          {label} {required && <span className="required-star" aria-hidden="true">*</span>}
        </label>
      )}
      <input
        id={id}
        type={type}
        className={`form-input ${error ? 'has-error' : ''}`.trim()}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        min={min}
        max={max}
        step={step}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
      />
      {error && (
        <span id={`${id}-error`} className="form-error" role="alert">
          {error}
        </span>
      )}
      {!error && hint && (
        <span id={`${id}-hint`} className="form-hint">
          {hint}
        </span>
      )}
    </div>
  );
}

export function SelectField({
  id,
  label,
  hint,
  error,
  value,
  onChange,
  options = [],
  disabled = false,
  required = false
}) {
  return (
    <div className="form-field">
      {label && (
        <label htmlFor={id} className="form-label">
          {label} {required && <span className="required-star" aria-hidden="true">*</span>}
        </label>
      )}
      <select
        id={id}
        className={`form-select ${error ? 'has-error' : ''}`.trim()}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
      >
        {options.map((opt) => {
          const val = typeof opt === 'string' ? opt : opt.value;
          const text = typeof opt === 'string' ? opt : opt.label;
          return (
            <option key={val} value={val}>
              {text}
            </option>
          );
        })}
      </select>
      {error && (
        <span id={`${id}-error`} className="form-error" role="alert">
          {error}
        </span>
      )}
      {!error && hint && (
        <span id={`${id}-hint`} className="form-hint">
          {hint}
        </span>
      )}
    </div>
  );
}

export function TextareaField({
  id,
  label,
  hint,
  error,
  value,
  onChange,
  placeholder,
  rows = 3,
  disabled = false,
  required = false
}) {
  return (
    <div className="form-field">
      {label && (
        <label htmlFor={id} className="form-label">
          {label} {required && <span className="required-star" aria-hidden="true">*</span>}
        </label>
      )}
      <textarea
        id={id}
        rows={rows}
        className={`form-textarea ${error ? 'has-error' : ''}`.trim()}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
      />
      {error && (
        <span id={`${id}-error`} className="form-error" role="alert">
          {error}
        </span>
      )}
      {!error && hint && (
        <span id={`${id}-hint`} className="form-hint">
          {hint}
        </span>
      )}
    </div>
  );
}
