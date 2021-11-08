//console.log("client-side js loaded");
const form = document.querySelector("button");
const input = document.querySelector("input");

const messageOne = document.querySelector("#message-1");
const messageTwo = document.querySelector("#message-2");

form.addEventListener("click", () => {
  const location = input.value;
  //WHEN IN PRODUCTION DO ONT USE THIS AS IT WILL NOT WORK
  //const url = `http://localhost:3000/weather?address=${location}`;

  const url = `/weather?address=${location}`;
  messageOne.textContent = "loading....";

  fetch(url).then((res) => {
    //got the response object
    res.json().then((res_json) => {
      //checking for error
      if (res_json[0].error_detected) {
        //return console.log(res_json[0].error_message);
        messageOne.textContent = "";
        messageTwo.textContent = res_json[0].error_message;
        return;
      }
      //console.log(res_json[0]);
      messageOne.textContent = `
      Name: ${res_json[0].placename} and temparature ${res_json[0].temparature} degree celcius.
      Its ${res_json[0].weather_description} Today
      `;
    });
  });
});
