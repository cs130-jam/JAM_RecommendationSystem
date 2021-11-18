const ErrorInputField = (props) => {
    const label = props.label;
    const type = props.type;
    const isError = props.isError;
    const message = props.message;
    const value = props.value;
    const onInput = props.onInput;

    return (
        <div>
            <label className="jam-form-label">{label}</label>
            <div className="jam-form-input-error">
                <input type={type} value={value} onInput={e => onInput(e.target.value)}/>
                {isError ? <span>{message}</span> : <div></div>}
            </div>
        </div>
    );
};

export default ErrorInputField;