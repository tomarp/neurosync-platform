const textElement = document.getElementById("typing-effect");
const texts = [
    ". . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .",
    "Please set your phone to silent mode and avoid using it.",
    "Adjust your chair to a comfortable position.",
    "Keep an eye on the timer in the top-right corner of the screen.",
    "Submit your task before the timer runs out.",
    ". . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .",
    "Now, please pick up the headphone from the table and put them on.",
    "and please wait...",
];

let textIndex = 0;
let charIndex = 0;
let currentLine = document.createElement("p"); // Create a new paragraph for each text

function type() {
    if (!textElement) {
        return;
    }
    if (charIndex === 0) {
        currentLine = document.createElement("p"); // Create a new line for the next text
        textElement.appendChild(currentLine); // Append to the container
    }

    currentLine.textContent = texts[textIndex].slice(0, charIndex++);

    if (charIndex <= texts[textIndex].length) {
        setTimeout(type, 200); // Continue typing
    } else {
        charIndex = 0; // Reset character index for the next line
        textIndex++;
        if (textIndex < texts.length) {
            setTimeout(type, 1000); // Pause before starting a new line
        }
    }
}

if (textElement) {
    type();
}
