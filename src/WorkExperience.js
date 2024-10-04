import React, {Component} from 'react';

class WorkExperience extends Component {
    render() {
        var experienceInfo = this.props.experienceInfo;

        var jobTitles = experienceInfo.jobTitles;
        var jobDescs = experienceInfo.jobDescs;

        return(
            <div class="section work-experience-div">
                <p class="section-title">Work Experience</p>
                <div class="section-content">
                    {
                        jobTitles.map(function (item, index) {
                            return (
                                <div class="job-div" id={"job" + index}>
                                    <p class="job-title">{item}</p>
                                    <p class="job-description">{jobDescs[index]}</p>
                                </div>
                            );
                        })
                    }
                </div>
            </div>
        );
    }
}

export default WorkExperience;