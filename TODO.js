/*
TODO Future/Lower Priority:
- Fix errors in Learning Objective print and Collection page print. 
    - Apply cleaning functions to checklist object properties so that output is formatted.

- Handle Edge cases in build slides - **** NO SOLUTION YET **** 
    - Update cleaning functions to cover the following:  
    - case where <<Level 2>> is NOT bolded
    - case where <<insert slide has a bullet symbol next to it

- Quiet Failing test for prodticket.getContributors() 
    - Mainly look at the Curbside Consult. 
*/ 

/* 
TODO NOW: Add Default Grant Attribution badge for Clinical Briefs - DONE 
- Create Prof Article insert function 
    - Function should be similar to insertContributor where 
      the element being inserted is just one of many pushed onto an array. 
      
TODO NOW: Activity XML generation  
- Set up test suites - DONE 
    - prodticket.test.js --> test building array of objects - DONE 
    - contrbtr_group.test.js --> test chronicleid addition - DONE 
- Create necessary prodticket functions - DONE
    - findCMEReviewers - DONE
- Put together small db of CME reviewer info and cme author info  - DONE 
    - Set up chronicle ID's for this - DONE 
        - Do we need them? What purpose do they serve? 
        - Maybe we can have built in chronicle IDs if they are static
- buildContributors function 
*/