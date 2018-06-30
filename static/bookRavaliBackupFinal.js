
var fileopen = new XMLHttpRequest();
url ='http://localhost:8082/request_info';
fileopen.open("GET",url, true);
fileopen.responseType='text';
fileopen.send();

var obj;

var bookId = [];
var clear = new XMLHttpRequest();
urlc = 'http://localhost:8082/SessionClear';
clear.open("GET",urlc,true);
clear.send(null);
// var NoOfBooks = [];
// var BookCalls = [];
//var BookName = [];


fileopen.onload=function(){
  obj=JSON.parse(fileopen.response);
  console.log(obj);
  for(var k=0;k<obj.items.length;k++){
    bookId[k] = obj.items[k].volumeInfo.title;
  }
  console.log(bookId.length);
  var xml = new XMLHttpRequest();
  for(var k =0;k<bookId.length;k++){
    var urlIds = 'http://localhost:8082/addBooks/'+bookId[k];
    xml.open("GET",urlIds,false);
    //xml.responseType = 'text';
    xml.send(null);
  }
  //console.log(bookId.length);
  bookdisplay(0);
  updateCart();
};


//bookdisplay(0);

var i=0;

function bookdisplay(j){
  i=j;
  updateCart();
  document.getElementById("booktitle").innerHTML=obj.items[i].volumeInfo.title;

  //BookName.push(obj.items[i].volumeInfo.title);

  document.getElementById("img").src=obj.items[i].volumeInfo.imageLinks.thumbnail;
  var authr="";
  updateCart();
  for(var j1=0;j1<obj.items[i].volumeInfo.authors.length;j1++){
    authr=authr+obj.items[i].volumeInfo.authors[j1]+'<br>'
  }
  document.getElementById("author").innerHTML=authr;
  document.getElementById("publisher").innerHTML=obj.items[i].volumeInfo.publisher;
  document.getElementById("year").innerHTML=obj.items[i].volumeInfo.publishedDate;
  document.getElementById("Description").innerHTML=obj.items[i].volumeInfo.description;
  document.getElementById("bookpreview").href=obj.items[i].volumeInfo.previewLink;
  // var cost=saleInfo.indexOf("listPrice");
    if(!obj.items[i].saleInfo.isEbook){
        var x="not available"
        document.getElementById("price").innerHTML=x;
        document.getElementById("addingToCart").disabled = true;
        return;

    }
    else{
      // console.log("Inside Display Function");
        var count=0;
        var bookCount;
        var key=0;
        var getBook = new XMLHttpRequest();
        var urlbookCount =   'http://localhost:8082/noOfBooks/'+bookId[i];    
        getBook.open("GET",urlbookCount,true);
       // console.log("Getting data for url",urlbookCount);
        getBook.responseType = 'text';
        getBook.send();
        getBook.onreadystatechange = function(){
          //if(this.readystate == 4 && this.status == 200){
            // console.log("Inside steady state");
            bookCount = JSON.parse(getBook.response);
            count = parseInt(bookCount[bookId[i]]);
        // console.log(count);
        document.getElementById("addingToCart").disabled = false;
        if(count < 3){
          document.getElementById("price").innerHTML='&#8377;'+obj.items[i].saleInfo.listPrice.amount;
          //document.getElementById("addingToCart").style.visibility = 'visible';
          document.getElementById("addingToCart").disabled = false;
        }
        else{
              document.getElementById("price").innerHTML='&#8377;'+obj.items[i].saleInfo.listPrice.amount;
             document.getElementById("addingToCart").disabled = true; 
        }
      }
    }
    //updateCart();
    //updateCart();
};

function addToCart(){

  var addTocart = new XMLHttpRequest();
  var urlpost = 'http://localhost:8082/addToCart/'+bookId[i];
  addTocart.open("GET",urlpost,true);
  addTocart.send(null);
  //updateCart();
  //location = location;
  updateCart();
  updateCart();
  bookdisplay(i);
  
};

function updateCart(){
  //var cartBook;
  var cart;
  var c;
  var numBooks = new XMLHttpRequest();

  numBooks.open("GET",'http://localhost:8082/BooksInCart',true);
  numBooks.send();
  numBooks.responseType='text';
  var key=0;
  numBooks.onreadystatechange = function(){
  //if(numBooks.readystate == 4 && numBooks.status == 200){
    //console.log(numBooks.responseText);
    cart = JSON.parse(numBooks.responseText);

    // console.log(cart);

    console.log(cart.CartBooks)
     //console.log(c);
     document.getElementById("no.OfBooks").innerHTML= "   : " + cart.CartBooks;
     //location.reload();
  }
  //}
};
function setButtons() {
      bukCnt = obj.items.length;
      
      // disable prev when it is the first movie
      if (i == 0)
        document.getElementById("previous").disabled = true;

      // disable next when the current movie is the last one in the list 
      if (i == bukCnt - 1)
        document.getElementById("Next").disabled = true;

      // enable the prev button when the current movie is not the first one
      if (i > 0)
        document.getElementById("previous").disabled = false;

      // enable the next button when the current movie is not the last one
      if (i < bukCnt - 1)
        document.getElementById("Next").disabled = false;
    }

function next()
{
  // console.log(i);
  
    bookdisplay(++i);
    setButtons();
    //document.getElementById("Next").disabled = false; 
    // location.reload();
  // }
  // else{
    
  //   bookdisplay(i);
  //   setButtons();
    //if(i===obj.items.length-1)
      //document.getElementById("Next").disabled = true; 
    // location.reload();
  // }
}
function prev(){
  // console.log(i);
  // if(i<=0){
    bookdisplay(--i);
    setButtons();
    //document.getElementById("previous").disabled = true; 
  // }
  // else{
  //   i=i-1;
    // bookdisplay(i);
    //document.getElementById("previous").disabled = false; 
  // }
};