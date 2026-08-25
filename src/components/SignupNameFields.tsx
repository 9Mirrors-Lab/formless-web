type SignupNameFieldsProps = {
  idPrefix: string;
  firstName: string;
  lastName: string;
  onFirstNameChange: (value: string) => void;
  onLastNameChange: (value: string) => void;
  disabled?: boolean;
  inputClassName: string;
  wrapperClassName?: string;
};

export function SignupNameFields({
  idPrefix,
  firstName,
  lastName,
  onFirstNameChange,
  onLastNameChange,
  disabled = false,
  inputClassName,
  wrapperClassName = 'grid grid-cols-2 gap-3',
}: SignupNameFieldsProps) {
  return (
    <div className={wrapperClassName}>
      <div>
        <label htmlFor={`${idPrefix}-first-name`} className="sr-only">
          First name
        </label>
        <input
          id={`${idPrefix}-first-name`}
          type="text"
          name="firstName"
          autoComplete="given-name"
          value={firstName}
          onChange={(event) => onFirstNameChange(event.target.value)}
          placeholder="First name"
          disabled={disabled}
          required
          className={inputClassName}
        />
      </div>
      <div>
        <label htmlFor={`${idPrefix}-last-name`} className="sr-only">
          Last name
        </label>
        <input
          id={`${idPrefix}-last-name`}
          type="text"
          name="lastName"
          autoComplete="family-name"
          value={lastName}
          onChange={(event) => onLastNameChange(event.target.value)}
          placeholder="Last name"
          disabled={disabled}
          required
          className={inputClassName}
        />
      </div>
    </div>
  );
}
