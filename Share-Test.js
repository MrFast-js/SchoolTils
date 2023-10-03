/*
This will remove all of the extra hiber jiber so you can easily screenshot answers and show to friend
*/

document.querySelectorAll('tbody').forEach((e)=>{
    if(e.parentElement.parentElement.classList.contains('details')) return;
    let i=0;
    e.style = 'background:#44FFFF;border:1px solid black;border-radius:4px;'
    let toRemove = [];
    for(a of e.children) {
        if(i!=0) {
            toRemove.push(a);
        }
        i++;
    }
    for(c of toRemove) {
        e.removeChild(c)
    }
})
let arr = document.getElementsByClassName('item clearfix contentListRightOffset');
let toRemove = [];
for(el of arr) toRemove.push(el);
for(el of toRemove) el.remove();
let arr2 = document.getElementsByClassName('clearfix liItem read');
for(el of arr2) el.style.padding='0'
