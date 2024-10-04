import React, {Component} from 'react'

class Header extends Component {
    render() {
        var headerInfo = this.props.headerInfo
        return(
            <div class="page-header">
                <div class="header-left">
                    <p id="name"><b>{headerInfo.name}</b></p>
                    <p id="job">{headerInfo.job}</p>
                </div>
                <div class="header-right">
                    <p class="contacts">Email: <a href={"mailto:" + headerInfo.email}>{headerInfo.email}</a></p>
                    <p class="contacts">Web: {headerInfo.website}</p>
                    <p class="contacts">Mobile:{headerInfo.phone}</p>
                </div>
            </div>
        );
    }
}

export default Header