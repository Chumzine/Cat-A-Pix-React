import { combinedClasses } from "./../../../utils/button-format";

export const CustomButton = (props) => {
    const classNames = {
        primary: 'btn',
        secondary: 'btn-secondary'
    }
    const className = classNames[props.type] || classNames.primary;
    const classes = combinedClasses(className, props.className);
    return (
    <button onClick={props.onClick} className={classes}>
        {props.children}
    </button>
    )
}