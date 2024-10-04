import React, {Component} from 'react';

class Education extends Component {
    render() {
        var educationInfo = this.props.educationInfo;
        return (
            <div class="section education-div">
                <p class="section-title">Education</p>
                <div class="section-content">
                    {
                        educationInfo.map( (item) => { // educationInfo is a list of dicts
                            return(
                            <div class="education-item">
                                <p class="education-title">{item.school}</p>
                                <p class="education-item-info">{item.degree}</p>
                                <p class="education-item-info">{item.years}</p>
                                <p class="education-item-info">GPA: {item.gpa}</p>
                            </div>
                            );
                        })
                    }
                </div>
            </div>
        );
    }
}

export default Education