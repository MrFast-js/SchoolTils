clear()
function createMenu() {
    const toDoList = document.getElementById('toDoList');
    if (!toDoList) {
        const courseColumnsCurrent = document.getElementById('course-columns-current');
        courseColumnsCurrent.style.width = '75%';
        
        // Create a new 'toDoList' div
        const newToDoList = document.createElement('div');
        newToDoList.id = 'toDoList';
        courseColumnsCurrent.insertBefore(newToDoList, courseColumnsCurrent.firstChild);
    }
    
    const tdl = document.getElementById('toDoList');
    tdl.style.cssText = 'position:absolute;left:79%;top:20%;background:white;border-radius:4px;border:1px solid gray;width:4%;height:70%;padding: 5px;overflow-y:scroll;';
}

// Rest of the code remains the same for fetching and rendering tasks


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
        assignmentLink: `https://ccccblackboard.blackboard.com/ultra/courses/${e.calendarId}/cl/outline?legacyUrl=~2Fwebapps~2Fcalendar~2Flaunch~2Fattempt~2F_blackboard.platform.gradebook2.GradableItem-${e.itemSourceId}`,
        assignmnetCategoryId: e.dynamicCalendarItemProps.categoryId,
        dueDate: new Date(e.endDate),
        assignedDate: new Date(e.startDate)
    }));
}

function renderToDoList(assignments) {
    const tdl = document.getElementById('toDoList');
    tdl.innerHTML = `<h1 style='font-family: Open Sans,sans-serif;text-align:center;font-weight:600;'>To Do List</h1>`;
    if(localStorage.completedAssignments?.length==0) {
        localStorage.completedAssignments=JSON.stringify([]);
        tdl.innerHTML+=`<h4>Complete Now</h4>`
    }
    tdl.innerHTML+=`<h4>Complete Now</h4>`
    
    let addedTomorrowSpacer = false;
    assignments.forEach(assignment => {
        console.log(assignment)
        const className = assignment.class.name.split("_")[0];
        const assName = assignment.assignmentName;
        const linkToClass = assignment.assignmentLink;
        const checked = localStorage.completedAssignments.includes(assName)
        const dueTommorrow = (assignment.dueDate - new Date()) / 1000 / 60 / 60>20;

        if(!addedTomorrowSpacer && dueTommorrow) {
            tdl.innerHTML+=`<h4>Start Today, Complete Tomorrow</h4>`
            addedTomorrowSpacer=true;
        }
        tdl.innerHTML += `
            <div class='assignmentBox' style='outline: 1px solid gray;margin:8px;border-radius:3px;padding:3px;'>
                <input type='checkbox' id='${assName}' value='test'>
                <label for='${assName}' style='max-width:90%;'><a href='${linkToClass}'>${assName}</a></label><br>
                <span style='color:gray;font-size:90%;'>Due ${formatDateTime(assignment.dueDate)} | ${className}</span>
            </div>
        `;
        setTimeout(()=>{
            document.getElementById(assName).checked = checked;
            document.getElementById(assName).oninput = () => {
                let completed = JSON.parse(localStorage.completedAssignments);
                
                if(document.getElementById(assName).checked) {
                    completed.push(assName)
                } else {
                    completed.splice(completed.indexOf(assName),1)
                }
                
                localStorage.completedAssignments=JSON.stringify(completed);
            }
        },100)
        
        
        console.log(`You need to complete ${assignment.assignmentName} for ${className} its due ${assignment.dueDate}`);
    });
}

function formatDateTime(date) {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const hours = date.getHours()%12;
    const minutes = date.getMinutes();

    let formattedDate;

    if (date.toDateString() === now.toDateString()) {
        formattedDate = "today";
    } else if (date.toDateString() === tomorrow.toDateString()) {
        formattedDate = "tomorrow";
    } else {
        const options = { month: "long", day: "numeric" };
        formattedDate = date.toLocaleDateString(undefined, options);
    }
    
    const formattedTime = `${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
    const ampm = date.getHours() >= 12 ? 'PM' : 'AM';

    return `${formattedDate} at <span style='font-weight:600;'>${formattedTime} ${ampm}</span>   ${calculateTimeDifference(now,date)}`;
}

function calculateTimeDifference(startDate, endDate) {
    const timeDifferenceMs = endDate - startDate;
    const hoursDifference = Math.floor(timeDifferenceMs / (1000 * 60 * 60));
    const minutesDifference = Math.floor((timeDifferenceMs % (1000 * 60 * 60)) / (1000 * 60));

    if (hoursDifference >= 8) {
        return "";
    } else if (hoursDifference >= 1) {
        return `(${hoursDifference} hours)`;
    } else if (minutesDifference > 0) {
        return `(${minutesDifference} minutes)`;
    } else {
        return "(less than 1 minute)";
    }
}


async function main() {
    createMenu();
    const assignments = await fetchAssignments();
    
    // Filter assignments (less than 20 hours from due date)
    const filteredAssignments = assignments.filter(assignment => {
        const hours = (assignment.dueDate - new Date()) / 1000 / 60 / 60;
        return hours < 40 && hours > 0;
    });
    
    const sorted = filteredAssignments.sort((a,b) => {
        const hoursA = (a.dueDate - new Date()) / 1000 / 60 / 60;
        const hoursB = (b.dueDate - new Date()) / 1000 / 60 / 60;
        
        return hoursA-hoursB;
    });
    renderToDoList(sorted);
}

main();
