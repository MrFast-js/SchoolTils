function createMenu() {
    const toDoList = document.getElementById('toDoList');
    if (!toDoList) {
        const courseColumnsCurrent = document.getElementById('course-columns-current');
        courseColumnsCurrent.style.width = '75%';
        courseColumnsCurrent.innerHTML = `<div id='toDoList'></div>` + courseColumnsCurrent.innerHTML;
    }
    
    const tdl = document.getElementById('toDoList');
    tdl.style.cssText = 'position:absolute;left:79%;top:20%;background:white;border-radius:4px;border:1px solid gray;width:4%;height:70%;padding: 5px;';
}

async function fetchAssignments() {
    const startSearchDate = new Date().toISOString();
    const endSearchDate = new Date();
    endSearchDate.setDate(endSearchDate.getDate() + 7);
    const endSearchDateISO = endSearchDate.toISOString();
    
    const response = await fetch(`https://ccccblackboard.blackboard.com/learn/api/v1/calendars/calendarItems?since=${startSearchDate}&until=${endSearchDateISO}`);
    const json = await response.json();
    
    return json.results.map(e => ({
        class: {
            id: e.calendarId,
            name: e.calendarNameLocalizable.rawValue,
            link: `https://ccccblackboard.blackboard.com/ultra/courses/${e.calendarId}/cl/outline`
        },
        assignmentName: e.title,
        assignmentId: e.itemSourceId,
        dueDate: new Date(e.endDate),
        assignedDate: new Date(e.startDate)
    }));
}

function renderToDoList(assignments) {
    const tdl = document.getElementById('toDoList');
    tdl.innerHTML = `<h1 style='font-family: Open Sans,sans-serif;text-align:center;font-weight:600;'>To Do List</h1>
    <h4 style='text-align:center;>Upcoming Assignments<h4>`;
    
    assignments.forEach(assignment => {
        const className = assignment.class.name.split(" - ")[1];
        const assName = assignment.assignmentName;
        const linkToClass = assignment.class.link;

        tdl.innerHTML += `
            <input type='checkbox' id='${assName}' value='test'>
            <label for='${assName}' style='max-width:90%;'><a href='${linkToClass}'>${assName}</a></label><br><br>
            
        `;
        
        console.log(`You need to complete ${assignment.assignmentName} for ${className}`);
    });
}

async function main() {
    createMenu();
    const assignments = await fetchAssignments();
    
    // Filter assignments (less than 20 hours from due date)
    const filteredAssignments = assignments.filter(assignment => {
        const hours = (assignment.dueDate - new Date()) / 1000 / 60 / 60;
        return hours < 20 && hours>0;
    });
    
    renderToDoList(filteredAssignments);
}

main();
