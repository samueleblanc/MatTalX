/*
    Front-end stuff
*/

const settingBtn: HTMLInputElement = <HTMLInputElement>document.getElementById("settingBtn");
const settingBox: HTMLElement = <HTMLElement>document.getElementById("settingBox");
const settingText: HTMLElement = <HTMLElement>document.getElementById("settingText");

settingBtn.addEventListener("click", () => {
    settingBox.style.display = "block";
    settingText.focus();
});