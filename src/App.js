import React, {Component} from 'react'
import './App.css'

import Header from './Header.js'
import PersonalProfile from './PersonalProfile.js';
import WorkExperience from './WorkExperience.js';
import Skills from './Skills.js';
import Education from './Education.js';

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            headerInfo: {
                name: "Zh Rimel",
                job: "Data Scientist",
                email: "abc@gmail.com",
                website: "abc.github.io/abc",
                phone: "01234567890"
            },
            profileInfo: {
                content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do " +
                    "eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut " +
                    "enim ad minim veniam, quis nostrud exercitation ullamco laboris " +
                    "nisi ut aliquip ex ea commodo consequat."
            },
            experienceInfo: {
                jobTitles: ["Job Title at Company (August 2022 – December 2023)", "Job Title 2 at Company 2 (August 2020 – December 2021)"],
                jobDescs: 
                    [
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do " +
                        "eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut " +
                        "enim ad minim veniam, quis nostrud exercitation ullamco laboris " +
                        "nisi ut aliquip ex ea commodo consequat.",

                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do " +
                        "eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut " +
                        "enim ad minim veniam, quis nostrud exercitation ullamco laboris " +
                        "nisi ut aliquip ex ea commodo consequat."
                ]
            },
            skillsInfo: {
                keySkills: 
                [
                    ["A Key skill", "A Key skill", "A Key skill"], 
                    ["A Key skill", "A Key skill", "A Key skill"], 
                    ["A Key skill", "A Key skill", "A Key skill"]
                ]
            },
            educationInfo: 
            [
                {school: "New Jersey Institute of Technology", degree: "BS in Computer Science", years: "2018 - 2022", gpa: "3.9"},
                {school: "New Jersey Institute of Technology", degree: "MS in Data Science", years: "2022 - 2023", gpa: "4.0"},
            ]
        }
    }


    render() {
        return(
            <div class="resume-container">
                <Header headerInfo={this.state.headerInfo} />
                <div class="page-content">
                    <PersonalProfile profileInfo={this.state.profileInfo} />
                    <hr />
                    <WorkExperience experienceInfo={this.state.experienceInfo} />
                    <hr />
                    <Skills skillsInfo={this.state.skillsInfo} />
                    <hr />
                    <Education educationInfo={this.state.educationInfo} />
                </div>
            </div>
        );
    }
}

export default App;