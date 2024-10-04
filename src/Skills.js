import React, {Component} from 'react';

class Skills extends Component {
    render() {
        var skillsInfo = this.props.skillsInfo;

        return(
            <div class="section key-skills-div">
                <p class="section-title">Key Skills</p>
                <div class="section-content" id="key-skills">
                    {
                        skillsInfo.keySkills.map( (item, colInd) => { //keySkills is a 2d list in column major order
                            return (
                                <div class="skill-col" id={"skill-col" + colInd}>
                                    {
                                        item.map( (item, skillInd) => {
                                            return(
                                                <p class="a-key-skill" id={"skill" + skillInd}>{item}</p>
                                            );
                                        })
                                    }
                                </div>
                            );
                        })
                    }
                </div>
            </div>
        );
    }
}

export default Skills;