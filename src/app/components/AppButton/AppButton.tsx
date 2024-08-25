import styles from './AppButton.module.css'

type ButtonAction = () => void

const AppButton = ({text, onClick, className}: {text: string, onClick?: ButtonAction, className?: string}) => {

    return (<button className={`${styles.button} ${className}`} onClick={onClick}>{text}</button>)
}

export default AppButton