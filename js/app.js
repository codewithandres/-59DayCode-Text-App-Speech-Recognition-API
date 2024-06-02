import { languages } from "./lenguages.js";
const record = document.querySelector('.record'),
  result = document.querySelector('.result'),
  donwloadBtn = document.querySelector('.download'),
  lenguagesSelected = document.querySelector('#language'),
  clearBtn = document.querySelector('.clear');

const populateLenguage = () => {

  languages.forEach(lang => {
    const option = document.createElement('option');

    option.value = lang.code;
    option.innerHTML = lang.name;
    lenguagesSelected.appendChild(option);
  });
};

populateLenguage();