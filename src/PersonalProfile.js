import React, {Component} from 'react'

class PersonalProfile extends Component {
    render() {
        var profileInfo = this.props.profileInfo;
        return(
            <div class="section personal-profile-div">
                <p class="section-title">Personal Profile</p>
                <div class="section-content">
                    <p id="profile-content">{profileInfo.content}</p>
                </div>
            </div>
        );
    }
}

export default PersonalProfile;