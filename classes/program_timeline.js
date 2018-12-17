var utils = require('../utils');
var stringOps = utils.stringOps;

class ProgramTimeline {
    constructor(schedule, infoTitle, infoSubtitle) {
        this.schedule = schedule;
        this.infoTitle = infoTitle;
        this.infoSubtitle = infoSubtitle;
    }

    //--------------------------------
    // COMPUTED PROPERTIES  
    //-------------------------------- 

    //--------------------------------
    // METHODS 
    //-------------------------------- 
    toObjectLiteral() {
        var schedule = this.schedule;
        var infoTitle = this.infoTitle;
        var infoSubtitle = this.infoSubtitle;
        return {
            schedule,
            infoTitle, 
            infoSubtitle 
        };     
    }

    toHTMLString() {
        // search to see if schedule contains AM or PM 
        // if it does substring it out
        // trim each substring
        var timeRegExp = /am|pm/gi;
        var schedule = `<span>${this.schedule}</span>`;
        var timeIndex = stringOps.regexIndexOf(this.schedule, timeRegExp);
        if (timeIndex != -1) {
            var meridiem = this.schedule.substring(timeIndex, timeIndex + 2).trim();
            var time = this.schedule.substring(0, timeIndex).trim();
            schedule = `
            <span>${time} 
                <span>${meridiem}</span>
            </span>
            `;
        }  
        
        return `
        <ul class="program-timeline">
            <li class="program-schedule">
                ${schedule}
            </li>
            <li class="program-progress">
                <span>
                    <span class="program-timepoint"></span>
                    <span class="program-timebar"></span>
                </span>
            </li>
            <li class="program-info-wrap">
                <div class="program-info-title">${this.infoTitle}</div>
                <div class="program-info-subtitle">${this.infoSubtitle}</div>
            </li>
        </ul>        
        `;
        
    }
}

module.exports = ProgramTimeline;