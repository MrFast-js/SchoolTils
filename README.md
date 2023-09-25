# SchoolTils
Utils that are useful for school, hence the name duh

To Do List Bookmarklet
```js
javascript:if(location.href=="https://ccccblackboard.blackboard.com/ultra/course") {const scriptURL="https://raw.githubusercontent.com/MrFast-js/SchoolTils/main/blackboard-todo-list.js";fetch(scriptURL).then(t=>t.text()).then(scriptCode=>{eval(scriptCode)}).catch(t=>{console.error("Error fetching or executing the script:",t)})} else {location.href="https://ccccblackboard.blackboard.com/ultra/course"};
```

Easy Quiz Bookmarklet
```js
javascript:const scriptURL="https://raw.githubusercontent.com/MrFast-js/SchoolTils/main/easy-quiz.js";fetch(scriptURL).then(t=>t.text()).then(scriptCode=>{eval(scriptCode)}).catch(t=>{console.error("Error fetching or executing the script:",t)});
```
