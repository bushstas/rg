import * as React from 'react'
import Store from "xstore";
import {IConnectedComponent} from '../../models';

interface IProps extends IConnectedComponent {

}

class MainMenu extends React.Component<IProps, {}> {

    render() {       
        return (
            <div className="self">
                <div>
                    travel
                </div>
                <div>
                    battle
                </div>
            </div>
        )
    }
}

export default Store.connect(MainMenu, 'user');