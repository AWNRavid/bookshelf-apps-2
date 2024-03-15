const books = [];
const RENDER_EVENT = "render-books";
const SAVED_EVENT = "get-books-from-local-storage";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("inputBook");
  const searchForm = document.getElementById("searchBook");
  const searchTitle = document.getElementById("searchBookTitle");
  const title = document.getElementById("inputBookTitle");
  const author = document.getElementById("inputBookAuthor");
  const year = document.getElementById("inputBookYear");
  const checkbox = document.getElementById("inputBookIsComplete");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    books.push(newBookDetail());

    document.dispatchEvent(new Event(RENDER_EVENT));
    savedData();
  });

  const newBookDetail = () => {
    return {
      id: +new Date(),
      title: title.value,
      author: author.value,
      year: Number(year.value),
      isComplete: checkbox.checked,
    };
  };

  document.addEventListener(RENDER_EVENT, () => {
    const unreadBookListContainer = document.getElementById("incompleteBookshelfList");
    unreadBookListContainer.innerHTML = "";
    const alreadyReadBookListContainer = document.getElementById("completeBookshelfList");
    alreadyReadBookListContainer.innerHTML = "";

    for (const book of books) {
      const {
        readButton,
        unreadButton,
        deleteButton,
        editButton,
        editForm,
        editTitle,
        editAuthor,
        editYear,
        actionContainer,
        bookContainer,
        title,
        author,
        year,
      } = initializeNewBook(book);

      readButton.addEventListener("click", () => changeToRead(book.id));

      unreadButton.addEventListener("click", () => changeToUnread(book.id));

      deleteButton.addEventListener("click", () => deleteBook(book.id));

      editButton.addEventListener("click", () => {
        editForm.classList.toggle("hide");
      });

      editForm.addEventListener("submit", (e) => {
        e.preventDefault();
        editBook(book.id, editTitle.value, editAuthor.value, editYear.value, editForm);
        editForm.classList.add("hide");
      });

      if (book.isComplete) {
        actionContainer.append(unreadButton, deleteButton, editButton);
      } else {
        actionContainer.append(readButton, deleteButton, editButton);
      }

      bookContainer.append(title, author, year, actionContainer, editForm);

      if (!book.isComplete) {
        unreadBookListContainer.append(bookContainer);
      } else {
        alreadyReadBookListContainer.append(bookContainer);
      }
    }

    function initializeNewBook(book) {
      const bookContainer = document.createElement("article");
      const title = document.createElement("h3");
      const author = document.createElement("p");
      const year = document.createElement("p");
      const readButton = document.createElement("button");
      const unreadButton = document.createElement("button");
      const deleteButton = document.createElement("button");
      const actionContainer = document.createElement("div");
      const editForm = document.createElement("form");
      const editTitle = document.createElement("input");
      const editAuthor = document.createElement("input");
      const editYear = document.createElement("input");
      const finishEditButton = document.createElement("button");
      const editButton = document.createElement("button");

      title.innerText = book.title;
      author.innerText = "Penulis: " + book.author;
      year.innerText = "Tahun: " + book.year;

      readButton.innerText = "Selesai Dibaca";
      readButton.classList.add("btn", "green");
      unreadButton.innerText = "Belum Selesai Dibaca";
      unreadButton.classList.add("btn", "green");
      deleteButton.innerText = "Hapus";
      deleteButton.classList.add("btn", "red");

      editTitle.setAttribute("placeholder", "title");
      editTitle.setAttribute("value", book.title);
      editTitle.setAttribute("id", "edit_title");

      editAuthor.setAttribute("placeholder", "author");
      editAuthor.setAttribute("value", book.author);
      editAuthor.setAttribute("id", "edit_author");

      editYear.setAttribute("placeholder", "year");
      editYear.setAttribute("value", book.year);
      editYear.setAttribute("id", "edit_year");

      finishEditButton.innerText = "Edit";

      editButton.innerText = "Edit";
      editButton.classList.add("btn", "yellow");

      editForm.append(editTitle, editAuthor, editYear, finishEditButton);

      editForm.classList.add("hide", "edit_form");

      bookContainer.classList.add("book_container");
      actionContainer.classList.add("action_container");

      return {
        readButton,
        unreadButton,
        deleteButton,
        editButton,
        editForm,
        editTitle,
        editAuthor,
        editYear,
        actionContainer,
        bookContainer,
        title,
        author,
        year,
      };
    }
  });

  const editBook = (id, title, author, year) => {
    for (const book of books) {
      if (book.id === id) {
        book.title = title;
        book.author = author;
        book.year = year;
      }
    }
    document.dispatchEvent(new Event(RENDER_EVENT));
    savedData();
  };

  const changeToRead = (id) => {
    books.map((book) => {
      if (book.id === id) {
        book.isComplete = true;
      }
    });
    document.dispatchEvent(new Event(RENDER_EVENT));
    savedData();
  };

  const changeToUnread = (id) => {
    books.map((book) => {
      if (book.id === id) {
        book.isComplete = false;
      }
    });
    document.dispatchEvent(new Event(RENDER_EVENT));
    savedData();
  };

  const deleteBook = (id) => {
    let bookIndex;
    for (const index in books) {
      if (books[index].id === id) {
        bookIndex = index;
      }
    }
    books.splice(bookIndex, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    savedData();
  };

  const savedData = () => {
    if (typeof Storage !== "undefined") {
      localStorage.setItem("books", JSON.stringify(books));
    }
  };

  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const searchSection = document.getElementsByClassName("search_section");
    const container = document.getElementById("searchBookContainer");
    container.innerHTML = "";
    const bookNotFound = document.getElementById("not_found");

    if (searchTitle.value.length === 0) {
      return alert("Mohon masukkan judul buku");
    }

    const foundBooks = books.filter((book) => book.title.includes(searchTitle.value));

    if (!foundBooks.length) {
      bookNotFound.style.display = "block";
    } else {
      bookNotFound.style.display = "none";

      for (const book of foundBooks) {
        const title = document.createElement("h3");
        const author = document.createElement("p");
        const year = document.createElement("p");
        const itemContainer = document.createElement("div");

        title.innerText = "Judul buku: " + book.title;
        author.innerText = "Penulis: " + book.author;
        year.innerText = "Tahun: " + book.year;
        itemContainer.append(title, author, year);
        itemContainer.classList.add("search_book_item");
        container.append(itemContainer);
      }

      searchSection[0].append(container);
    }
  });

  const getDataFromLocalStorage = () => {
    const data = JSON.parse(localStorage.getItem("books"));

    if (data !== null) {
      for (const book of data) {
        books.push(book);
      }
    }
    document.dispatchEvent(new Event(RENDER_EVENT));
  };

  if (typeof Storage !== "undefined") {
    getDataFromLocalStorage();
  }
});
