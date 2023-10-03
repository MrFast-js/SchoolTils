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
