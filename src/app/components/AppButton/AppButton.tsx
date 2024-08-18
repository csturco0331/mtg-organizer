import styles from './AppButton.module.css'

type ButtonAction = () => void

const AppButton = ({text, buttonAction, className}: {text: string, buttonAction?: ButtonAction, className?: string}) => {

    return (<button className={`${styles.button} ${className}`} onClick={buttonAction}>{text}</button>)
}

export default AppButton