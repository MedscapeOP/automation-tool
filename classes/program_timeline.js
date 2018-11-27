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
}

module.exports = ProgramTimeline;