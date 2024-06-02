// Importamos los lenguajes desde el archivo lenguages.js
import { languages } from "./lenguages.js";

// Seleccionamos los elementos del DOM que vamos a utilizar
const recordBtn = document.querySelector(".record"),
  result = document.querySelector(".result"),
  downloadBtn = document.querySelector(".download"),
  inputLanguage = document.querySelector("#language"),
  clearBtn = document.querySelector(".clear");

// Inicializamos la API de reconocimiento de voz
let SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition,
  recognition,
  recording = false;

// Función para llenar el select con los lenguajes disponibles
const populateLanguages = () => {
  languages.map(lang => {
    const option = document.createElement("option");
    option.value = lang.code;
    option.innerHTML = lang.name;
    inputLanguage.appendChild(option);
  });
}

// Llamamos a la función para llenar el select
populateLanguages();

// Función para convertir el habla a texto
const speechToText = () => {
  try {
    // Inicializamos el reconocimiento de voz
    recognition = new SpeechRecognition();
    recognition.lang = inputLanguage.value;
    recognition.interimResults = true;
    recordBtn.classList.add("recording");
    recordBtn.querySelector("p").textContent = "Listening...";
    recognition.start();

    // Evento que se dispara cuando se obtiene un resultado
    recognition.onresult = event => {
      const speechResult = event.results[0][0].transcript;
      //detectamos cuando los resultados son finales
      if (event.results[0].isFinal) {
        result.innerHTML += ` ${speechResult}`;
        result.querySelector("p").remove();
      } else {
        //creamos un párrafo con la clase interim si no existe
        if (!document.querySelector(".interim")) {
          const interim = document.createElement("p");
          interim.classList.add("interim");
          result.appendChild(interim);
        }
        //actualizamos el párrafo interim con el resultado del habla
        document.querySelector(".interim").innerHTML = ` ${speechResult}`;
      }
      downloadBtn.disabled = false;
    };
    // Evento que se dispara cuando termina el habla
    recognition.onspeechend = () => {
      speechToText();
    };
    // Evento que se dispara cuando ocurre un error
    recognition.onerror = event => {
      stopRecording();
      if (event.error === "no-speech") {
        alert("No speech was detected. Stopping...");
      } else if (event.error === "audio-capture") {
        alert(
          "No microphone was found. Ensure that a microphone is installed."
        );
      } else if (event.error === "not-allowed") {
        alert("Permission to use microphone is blocked.");
      } else if (event.error === "aborted") {
        alert("Listening Stopped.");
      } else {
        alert("Error occurred in recognition: " + event.error);
      }
    };
  } catch (error) {
    recording = false;

    console.log(error);
  }
}

// Evento que se dispara cuando se hace click en el botón de grabar
recordBtn.addEventListener("click", () => {
  if (!recording) {
    speechToText();
    recording = true;
  } else {
    stopRecording();
  }
});

// Función para detener la grabación
function stopRecording() {
  recognition.stop();
  recordBtn.querySelector("p").textContent = "Start Listening";
  recordBtn.classList.remove("recording");
  recording = false;
}

// Función para descargar el texto obtenido
function download() {
  const text = result.innerText;
  const filename = "speech.txt";

  const element = document.createElement("a");
  element.setAttribute(
    "href",
    "data:text/plain;charset=utf-8," + encodeURIComponent(text)
  );
  element.setAttribute("download", filename);
  element.style.display = "none";
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

// Evento que se dispara cuando se hace click en el botón de descargar
downloadBtn.addEventListener("click", download);

// Evento que se dispara cuando se hace click en el botón de limpiar
clearBtn.addEventListener("click", () => {
  result.innerHTML = "";
  downloadBtn.disabled = true;
});
