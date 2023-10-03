let questions = document.getElementsByClassName('field');

function googleIt(e) {
    window.open(`https://www.google.com/search?q=${e}`);
}
function chatGPT(e) {
    navigator.clipboard.writeText(e)
}

for (q of questions) {
    let question = q.children[1].children[0].children[0].innerHTML;
    let answerChoices = [];
    let choice = 0;
    try {
        let multipleChoice = q.children[1].children[2].children[0].children[choice] != null;
        let option = "";

        if (multipleChoice) {
            let options = q.children[1].children[2].children[0];
            for (i = 0; i < options.children.length; i++) {
                option = q.children[1].children[2].children[0].children[i].children[2].children[0].children[0].innerHTML;
                answerChoices.push(option);
            }
        } else {
            answerChoices.push("True False");
        }

    } catch (e) {
        console.log(e);
    }

    let googleSearch = question + " " + answerChoices.join(" ");
while(q.children.length>3) q.children[3].remove();
    // Create Google button
    let googleButton = document.createElement('button');
    googleButton.style.cssText = 'background:#4285f4;font-size:20px;border:3px solid #2d5ba7;color:white;border-radius:5px;box-shadow:0px 0px 5px 1px #4285f4;';
    googleButton.textContent = 'Google';
    googleButton.onclick = () => googleIt(googleSearch);

    // Create ChatGPT button
    let chatGPTButton = document.createElement('button');
    chatGPTButton.style.cssText = 'margin-left:20px;background:rgb(60,160,100);font-size:20px;border:3px solid darkgreen;color:white;border-radius:5px;box-shadow:0px 0px 5px 1px green;';
    chatGPTButton.textContent = 'Chat GPT';
    chatGPTButton.onclick = () => chatGPT(googleSearch);

    // Append buttons to the existing element
    q.appendChild(googleButton);
    q.appendChild(chatGPTButton);
}
