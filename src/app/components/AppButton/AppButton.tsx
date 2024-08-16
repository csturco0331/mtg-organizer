import styles from './AppButton.module.css'

type ButtonAction = () => void

const AppButton = ({text, buttonAction}: {text: string, buttonAction: ButtonAction}) => {

    return (<button className={styles.button} onClick={buttonAction}>{text}</button>)
}

export default AppButton