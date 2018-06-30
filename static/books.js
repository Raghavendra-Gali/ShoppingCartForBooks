var request = new XMLHttpRequest();
request.open("GET","http://localhost:8081/request_info",true);
request.send();

var bookJSON;

request.onreadystatechange = function(){
  if ( request.readyState === 4 && request.status === 200 ) {
    bookJSON = JSON.parse(request.responseText);
    console.log(bookJSON)
    displayBook(0);
  }
 }  
function displayBook(bookId){
	var book = bookJSON.items[bookId];
	console.log(book);
	console.log(book.volumeInfo.title);
	document.getElementById("booktitle").innerHTML= book.volumeInfo.title;
	document.getElementById("author").innerHTML = book.volumeInfo.authors[0];
	if(book.saleInfo.listPrice == null )
		document.getElementById("price").innerHTML = "Not Available";
	else
		document.getElementById("price").innerHTML = book.saleInfo.listPrice.amount;
	document.getElementById("publisher").innerHTML = book.volumeInfo.publisher;
	console.log(book.volumeInfo.publisher);
	document.getElementById("year").innerHTML = book.volumeInfo.publishedDate;
	console.log(book.volumeInfo.publishedDate);
	document.getElementById("Description").innerHTML = book.volumeInfo.description;
	console.log(book.volumeInfo.description);
	document.getElementById("img").src = book.volumeInfo.imageLinks.thumbnail;
	document.getElementById("bookpreview").href = book.volumeInfo.previewLink;

}

var currentBook = 0
function setButtons() {
  bookCnt = bookJSON.items.length;
  console.log(bookCnt);
  
  if (currentBook == 0)
    document.getElementById("previous").disabled = true;

  if (currentBook == bookCnt - 1)
    document.getElementById("Next").disabled = true;

  
  if (currentBook > 0)
    document.getElementById("previous").disabled = false;

  
  if (currentBook < bookCnt - 1)
    document.getElementById("Next").disabled = false;
}

setButtons();


function prev() {
  displayBook(--currentBook);
  setButtons();
}
setButtons();

function next() {
  displayBook(++currentBook);
  setButtons();
}