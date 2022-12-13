let api = "http://localhost:8000/contacts";

// ! CREATE

let inp1 = document.querySelector(".inp-1");
let inp2 = document.querySelector(".inp-2");
let inp3 = document.querySelector(".inp-3");
let addBtn = document.querySelector(".btn-add");

addBtn.addEventListener("click", () => {
  const newContact = {
    firstName: inp1.value,
    lastName: inp2.value,
    phone: inp3.value,
  };

  let checkResult = checkInputs(newContact);
  if (checkResult) {
    // ! Чтобы было уведомление
    showAlert("Заполните поля!", "red", "white");
    return;
  }

  fetch(api, {
    method: "POST", // тип запроса
    // Конкретно указываем в каком формате отправляем данные (json-string)
    headers: {
      "Content-Type": "application/json",
    },
    // в body лежат данные которые нужно сохранить на сервере
    body: JSON.stringify(newContact),
  }).then(() => {
    // Чтобы после отправки данных на сервер, инпуты очистились
    inp1.value = "";
    inp2.value = "";
    inp3.value = "";
    // ! Чтобы было уведомление
    showAlert("Успешно добавлено!", "green", "white");
    getContacts();
  });
});

// ! Проверка на пустоту

function checkInputs(obj) {
  for (let i in obj) {
    if (!obj[i]) {
      return true;
    }
  }
  return false;
}

// ! READ

let ul = document.querySelector(".list-group");
let searchWord = "";
let currentPage = 1;
let pagesCount = 1;
let countPerPage = 4;

const getContacts = () => {
  fetch(`${api}?q=${searchWord}`)
    .then((res) => {
      return res.json();
    })
    .then((contacts) => {
      // ! Чтобы информация не дублировалась
      ul.innerHTML = "";
      pagesCount = Math.ceil(contacts.length / countPerPage);
      pagination();
      let newContacts = contacts.splice(
        currentPage * countPerPage - countPerPage,
        countPerPage
      );

      newContacts.forEach((item) => {
        const li = document.createElement("li");
        const img = document.createElement("img");
        img.setAttribute("src", "./images/delete.png");
        li.classList.add("list-group-item");
        li.innerHTML = `
          <span>
            ${item.firstName}
            ${item.lastName}
            <a href="tel:${item.phone}">${item.phone}</a>
          </span>
        `;
        li.append(img);
        ul.append(li);

        // ! DELETE
        img.addEventListener("click", () => {
          fetch(`${api}/${item.id}`, {
            method: "DELETE",
          }).then(() => {
            getContacts();
            // ! Чтобы было уведомление
            showAlert("Успешно удалено!", "green", "white");
          });
        });
      });
    });
};
getContacts();

function showAlert(text, bgColor, color) {
  Toastify({
    text: text,
    duration: 3000,
    close: true,
    gravity: "top", // `top` or `bottom`
    position: "left", // `left`, `center` or `right`
    stopOnFocus: true, // Prevents dismissing of toast on hover
    style: {
      background: bgColor,
      color: color,
    },
  }).showToast();
}

// ! LIVE SEARCH
let liveSearchInp = document.querySelector(".live-search-inp");

liveSearchInp.addEventListener("input", (event) => {
  currentPage = 1;
  searchWord = event.target.value;
  getContacts();
});

// ! Pagination
let ulPagination = document.querySelector(".pagination");
const pagination = () => {
  ulPagination.innerHTML = "";
  for (let i = 1; i <= pagesCount; i++) {
    let li = document.createElement("li");
    li.classList.add("page-link");
    li.innerText = i;
    ulPagination.append(li);
    li.addEventListener("click", () => {
      currentPage = i;
      getContacts();
    });
  }
};
