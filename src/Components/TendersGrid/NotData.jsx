import { IconNotData, IconNotDataDark } from '../../assets/Icons'
import TranslationText from '../TranslationText'

export default function NotData({ theme }) {
    return (
        <div className="not_Data">
            <div className="icon">
                {theme == "dark" ?
                    <IconNotDataDark />
                    :
                    <IconNotData />
                }
            </div>
            <h5 className="title">
                <TranslationText page="Grid" title="noData" />
            </h5>
        </div>
    )
}
