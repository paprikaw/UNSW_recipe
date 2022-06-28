import {React} from 'react'
import {  Button } from 'antd'

const SelectButton = (props) => {
    const {selectState, setSelectState, buttonText} = props;
    const handleClick = () => {
        if (selectState[buttonText]) {
            setSelectState({...selectState, [buttonText]: false})
        } else {
            setSelectState({...selectState, [buttonText]: true})
        }
    }
    return (
        <Button type={selectState[buttonText] ? 'primary' : 'secondary'} size='small' onClick={handleClick}>
            {buttonText}
        </Button>
    )
}

export default SelectButton;